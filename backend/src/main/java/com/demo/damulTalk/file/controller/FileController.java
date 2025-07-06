package com.demo.damulTalk.file.controller;

import com.demo.damulTalk.file.dto.FileUploadRequest;
import com.demo.damulTalk.file.dto.FileUploadResponse;
import com.demo.damulTalk.file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload/{roomId}")
    public ResponseEntity<?> uploadFile(
            @PathVariable("roomId") Integer roomId,
            @RequestBody FileUploadRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        log.info("[FileController] 파일 업로드 시작 - roomId: {}", roomId);

        FileUploadResponse response = fileService.uploadFile(file, roomId, request.getClientId());
        return ResponseEntity.ok(response);
    }

}
