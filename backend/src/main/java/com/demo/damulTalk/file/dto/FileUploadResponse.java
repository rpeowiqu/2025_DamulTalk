package com.demo.damulTalk.file.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {

    private String fileUrl;

    private String fileName;

    private ContentType contentType;

    private String clientId;

}
