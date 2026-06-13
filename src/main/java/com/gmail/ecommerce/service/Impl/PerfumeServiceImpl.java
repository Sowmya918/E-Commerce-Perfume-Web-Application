package com.gmail.ecommerce.service.Impl;

import com.gmail.ecommerce.domain.Perfume;
import com.gmail.ecommerce.dto.perfume.PerfumeSearchRequest;
import com.gmail.ecommerce.enums.SearchPerfume;
import com.gmail.ecommerce.exception.ApiRequestException;
import com.gmail.ecommerce.repository.PerfumeRepository;
import com.gmail.ecommerce.repository.projection.PerfumeProjection;
import com.gmail.ecommerce.service.PerfumeService;
import graphql.schema.DataFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.gmail.ecommerce.constants.ErrorMessage.PERFUME_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PerfumeServiceImpl implements PerfumeService {

    private final PerfumeRepository perfumeRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @Override
    public Perfume getPerfumeById(Long perfumeId) {
        return perfumeRepository.findById(perfumeId)
                .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    @Override
    public Page<PerfumeProjection> getAllPerfumes(Pageable pageable) {
        return perfumeRepository.findAllByOrderByIdAsc(pageable);
    }

    @Override
    public List<PerfumeProjection> getPerfumesByIds(List<Long> perfumesId) {
        return perfumeRepository.getPerfumesByIds(perfumesId);
    }

    @Override
    public Page<PerfumeProjection> findPerfumesByFilterParams(PerfumeSearchRequest filter, Pageable pageable) {
        return perfumeRepository.findPerfumesByFilterParams(
                filter.getPerfumers(),
                filter.getGenders(),
                filter.getPrices().get(0),
                filter.getPrices().get(1),
                pageable);
    }

    @Override
    public List<Perfume> findByPerfumer(String perfumer) {
        return perfumeRepository.findByPerfumerOrderByPriceDesc(perfumer);
    }

    @Override
    public List<Perfume> findByPerfumeGender(String perfumeGender) {
        return perfumeRepository.findByPerfumeGenderOrderByPriceDesc(perfumeGender);
    }

    @Override
    public Page<PerfumeProjection> findByInputText(SearchPerfume searchType, String text, Pageable pageable) {

        if (searchType.equals(SearchPerfume.BRAND)) {
            return perfumeRepository.findByPerfumer(text, pageable);

        } else if (searchType.equals(SearchPerfume.PERFUME_TITLE)) {
            return perfumeRepository.findByPerfumeTitle(text, pageable);

        } else {
            return perfumeRepository.findByManufacturerCountry(text, pageable);
        }
    }

    @Override
    @Transactional
    public Perfume savePerfume(Perfume perfume, MultipartFile multipartFile) {

        Perfume existingPerfume = null;

        if (perfume.getId() != null) {
            existingPerfume = perfumeRepository.findById(perfume.getId()).orElse(null);
        }

        if (multipartFile == null || multipartFile.isEmpty()) {

            if (existingPerfume != null) {
                perfume.setFilename(existingPerfume.getFilename());
            } else {
                perfume.setFilename("empty.jpg");
            }

        } else {

            try {

                File dir = new File(uploadPath);

                if (!dir.exists()) {
                    dir.mkdirs();
                }

                String fileName =
                        UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();

                File destinationFile = new File(dir, fileName);

                multipartFile.transferTo(destinationFile);

                perfume.setFilename(fileName);

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        }

        return perfumeRepository.save(perfume);
    }

    @Override
    @Transactional
    public String deletePerfume(Long perfumeId) {

        Perfume perfume = perfumeRepository.findById(perfumeId)
                .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));

        // Delete uploaded image file
        if (perfume.getFilename() != null
                && !perfume.getFilename().startsWith("http")
                && !perfume.getFilename().startsWith("/img/")
                && !perfume.getFilename().equals("empty.jpg")) {

            File file = new File(uploadPath + perfume.getFilename());

            if (file.exists()) {
                file.delete();
            }
        }

        perfumeRepository.delete(perfume);

        return "Perfume deleted successfully";
    }

    @Override
    public DataFetcher<Perfume> getPerfumeByQuery() {

        return dataFetchingEnvironment -> {
            Long perfumeId = Long.parseLong(dataFetchingEnvironment.getArgument("id"));
            return perfumeRepository.findById(perfumeId).get();
        };
    }

    @Override
    public DataFetcher<List<PerfumeProjection>> getAllPerfumesByQuery() {

        return dataFetchingEnvironment ->
                perfumeRepository.findAllByOrderByIdAsc();
    }

    @Override
    public DataFetcher<List<Perfume>> getAllPerfumesByIdsQuery() {

        return dataFetchingEnvironment -> {

            List<String> objects =
                    dataFetchingEnvironment.getArgument("ids");

            List<Long> perfumesId = objects.stream()
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            return perfumeRepository.findByIdIn(perfumesId);
        };
    }
}