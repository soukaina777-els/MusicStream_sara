package com.spotify.backend.service;

import io.minio.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spotify.backend.dto.Dtos;
import com.spotify.backend.model.Artist;
import com.spotify.backend.model.Song;
import com.spotify.backend.repository.ArtistRepository;
import com.spotify.backend.repository.SongRepository;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class MinioService {

    private static final Logger log = Logger.getLogger(MinioService.class.getName());

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.port}")
    private String port;

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
    if (objectName == null || objectName.isEmpty()) return null;
    return "http://10.169.247.237:9000/" + bucket + "/" + objectName;
}

    public InputStream getFile(String objectName) throws Exception {
        return minioClient.getObject(
            GetObjectArgs.builder().bucket(bucket).object(objectName).build());
    }
}