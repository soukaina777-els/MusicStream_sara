package com.spotify.backend.service;

import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

@Service
public class MinioService {

    private static final Logger log = Logger.getLogger(MinioService.class.getName());

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void ensureBucket() {
        try {
            boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                log.info("Bucket '" + bucket + "' created");
            }
        } catch (Exception e) {
            log.warning("Error checking bucket: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file, String objectName) throws Exception {
        ensureBucket();
        minioClient.putObject(PutObjectArgs.builder()
                .bucket(bucket)
                .object(objectName)
                .stream(file.getInputStream(), file.getSize(), -1)
                .contentType(file.getContentType())
                .build());
        return objectName;
    }

    public String getPresignedUrl(String objectName) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .method(Method.GET)
                    .expiry(1, TimeUnit.HOURS)
                    .build());
        } catch (Exception e) {
            log.warning("Error generating presigned URL: " + e.getMessage());
            return null;
        }
    }

    public InputStream getFile(String objectName) throws Exception {
        return minioClient.getObject(
            GetObjectArgs.builder().bucket(bucket).object(objectName).build());
    }
}
