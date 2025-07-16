package com.demo.damulTalk.file.service;

import com.demo.damulTalk.file.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    FileUploadResponse uploadFile(MultipartFile file, Integer roomId, String clientId);

}
