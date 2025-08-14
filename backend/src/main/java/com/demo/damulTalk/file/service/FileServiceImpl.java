package com.demo.damulTalk.file.service;

import com.demo.damulTalk.chat.MessageType;
import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.dto.ChatMessageResponse;
import com.demo.damulTalk.chat.dto.ChatNotification;
import com.demo.damulTalk.chat.dto.ChatSystemMessage;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.chat.service.ChatMessageFlushService;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.file.dto.ContentType;
import com.demo.damulTalk.file.dto.FileUploadResponse;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService {

    private final S3Client s3Client;
    private final UserUtil userUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final ChatRoomMapper chatRoomMapper;
    private final ChatMessageFlushService chatMessageFlushService;
    private final ChatMessageRepository chatMessageRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, Integer roomId, String clientId) {
        log.info("[FileService] 파일 업로드 시작 - roomId = {}, clientId = {}", roomId, clientId);
        int userId = userUtil.getCurrentUserId();
        User currentUser = userUtil.getCurrentUser();
        String originalFilename = file.getOriginalFilename();
        String key = "chat/" + roomId + "/" + UUID.randomUUID() + "_" + originalFilename;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String fileUrl = "https://" + bucketName + ".s3.amazonaws.com/" + key;
            String contentType = file.getContentType();
            ContentType type = contentType.startsWith("image") ? ContentType.IMAGE : ContentType.VIDEO;

            FileUploadResponse response = FileUploadResponse.builder()
                    .fileUrl(fileUrl)
                    .fileName(originalFilename)
                    .contentType(type)
                    .clientId(clientId)
                    .build();

            String redisKey = "chat:room:" + roomId + ":messages";

            ChatMessage lastMessage = findLastMessage(roomId);
            if(lastMessage != null) {
                LocalDate lastDate = lastMessage.getSendTime().toLocalDate();
                LocalDate nowDate = LocalDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();

                if(!lastDate.equals(nowDate)) {
                    ChatMessage systemMessage = ChatMessage.builder()
                            .messageId(UUID.randomUUID().toString())
                            .roomId(roomId)
                            .senderId(0)
                            .messageType(MessageType.DATE)
                            .content(nowDate.toString())
                            .sendTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                            .build();

                    redisTemplate.opsForList().rightPush(redisKey, objectMapper.writeValueAsString(systemMessage));
                    chatMessageFlushService.tryFlush(redisKey);
                    redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<ChatSystemMessage>builder()
                            .roomId(roomId)
                            .type(NotificationType.CHAT_SYSTEM_MESSAGE)
                            .data(ChatSystemMessage.builder()
                                    .messageId(systemMessage.getMessageId())
                                    .senderId(systemMessage.getSenderId())
                                    .messageType(systemMessage.getMessageType())
                                    .content(systemMessage.getContent())
                                    .sendTime(systemMessage.getSendTime())
                                    .build())
                            .build()));
                }
            }

            ChatMessage message = ChatMessage.builder()
                    .messageId(UUID.randomUUID().toString())
                    .roomId(roomId)
                    .senderId(userId)
                    .nickname(currentUser.getNickname())
                    .profileImageUrl(currentUser.getProfileImageUrl())
                    .messageType(type == ContentType.IMAGE ? MessageType.IMAGE : MessageType.VIDEO)
                    .content(type == ContentType.IMAGE ? "이미지를 보냈습니다." : "동영상을 보냈습니다.")
                    .fileUrl(fileUrl)
                    .sendTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                    .unReadCount(0)
                    .build();

            redisTemplate.opsForList().rightPush(redisKey, objectMapper.writeValueAsString(message));
            chatMessageFlushService.tryFlush(redisKey);

            ChatMessageResponse senderMessage = ChatMessageResponse.builder()
                    .messageId(message.getMessageId())
                    .roomId(roomId)
                    .senderId(message.getSenderId())
                    .profileImageUrl(message.getProfileImageUrl())
                    .nickname(message.getNickname())
                    .messageType(message.getMessageType())
                    .content(type == ContentType.IMAGE ? "이미지를 보냈습니다." : "동영상을 보냈습니다.")
                    .fileUrl(fileUrl)
                    .sendTime(message.getSendTime())
                    .unReadCount(0)
                    .clientId(clientId)
                    .build();

            redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<ChatMessageResponse>builder()
                    .roomId(roomId)
                    .type(NotificationType.CHAT_MESSAGE)
                    .data(senderMessage)
                    .build()));

            List<User> participants = chatRoomMapper.selectParticipants(roomId, userId)
                    .stream()
                    .filter(u -> u.getUserId() != userId)
                    .collect(Collectors.toList());

            for(User participant : participants) {
                String chatPresenceKey = "chat:room:" + roomId + ":user:" + participant.getUserId();
                Boolean isInChatRoom = redisTemplate.hasKey(chatPresenceKey);

                if(Boolean.FALSE.equals(isInChatRoom)) {
                    ChatNotification notification = ChatNotification.builder()
                            .messageId(message.getMessageId())
                            .roomId(roomId)
                            .profileImageUrl(message.getProfileImageUrl())
                            .nickname(message.getNickname())
                            .messageType(message.getMessageType())
                            .content(type == ContentType.IMAGE ? "이미지를 보냈습니다." : "동영상을 보냈습니다.")
                            .sendTime(message.getSendTime())
                            .build();

                    redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(CommonWrapperDto.<ChatNotification>builder()
                            .userId(participant.getUserId())
                            .type(NotificationType.CHAT_NOTI)
                            .data(notification)
                            .build()));
                }
            }

            return response;
        } catch (Exception e) {
            log.error("[FileService] 파일 업로드 실패", e);
            throw new RuntimeException("파일 업로드 실패");
        }
    }

    private ChatMessage findLastMessage(int roomId) {
        String redisKey = "chat:room:" + roomId + ":messages";
        Long size = redisTemplate.opsForList().size(redisKey);

        if (size != null && size > 0) {
            String json = redisTemplate.opsForList().index(redisKey, size - 1);
            if (json != null) {
                try {
                    return objectMapper.readValue(json, ChatMessage.class);
                } catch (Exception e) {
                    log.warn("[ChatMessageService] Redis 메시지 역직렬화 실패", e);
                }
            }
        }

        return chatMessageRepository.findTopByRoomIdOrderBySendTimeDesc(roomId);
    }

}
