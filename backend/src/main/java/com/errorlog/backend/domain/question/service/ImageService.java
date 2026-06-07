package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.board.domain.entity.Image;
import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;
import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.domain.board.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final ImageStoragePort imageStoragePort;  // 팀원 인프라 사용

    @Transactional
    public List<String> uploadImages(
            ImageTargetType targetType, Long targetId,
            List<MultipartFile> files) throws IOException {

        List<String> urls = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String ext = getExtension(file.getOriginalFilename());
            String key = targetType.name().toLowerCase()
                    + "/" + targetId
                    + "/" + UUID.randomUUID()
                    + "." + ext;

            imageStoragePort.upload(
                    key,
                    file.getInputStream(),
                    file.getSize(),
                    file.getContentType()
            );

            String publicUrl = imageStoragePort.getPublicUrl(key);

            imageRepository.save(
                    Image.createRequestImage(targetId, publicUrl, i + 1)
            );

            urls.add(publicUrl);
        }

        return urls;
    }

    public List<String> getImagePaths(ImageTargetType targetType, Long targetId) {
        return imageRepository
                .findByTargetTypeAndTargetIdOrderByImageSeqAsc(targetType, targetId)
                .stream()
                .map(Image::getImagePath)
                .collect(Collectors.toList());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}