// ImageService.java
package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.question.entity.Image;
import com.errorlog.backend.domain.question.repository.ImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepo;

    private static final String UPLOAD_DIR = "uploads/";

    @Transactional
    public List<String> uploadImages(
            Image.TargetType targetType, Long targetId,
            List<MultipartFile> files) throws IOException {

        List<String> paths = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path savePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), savePath,
                    StandardCopyOption.REPLACE_EXISTING);

            imageRepo.save(Image.builder()
                    .targetType(targetType)
                    .targetId(targetId)
                    .imagePath(filename)
                    .imageSeq(i + 1)
                    .build());
            paths.add(filename);
        }
        return paths;
    }

    public List<String> getImagePaths(Image.TargetType targetType, Long targetId) {
        return imageRepo
                .findByTargetTypeAndTargetIdOrderByImageSeqAsc(targetType, targetId)
                .stream().map(Image::getImagePath).collect(Collectors.toList());
    }
}