package com.gmail.ecommerce.repository;

import com.gmail.ecommerce.domain.Perfume;
import com.gmail.ecommerce.repository.projection.PerfumeProjection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerfumeRepository extends JpaRepository<Perfume, Long> {

    List<PerfumeProjection> findAllByOrderByIdAsc();

    @Query("SELECT perfume FROM Perfume perfume ORDER BY perfume.id ASC")
    Page<PerfumeProjection> findAllByOrderByIdAsc(Pageable pageable);

    List<Perfume> findByPerfumerOrderByPriceDesc(String perfumer);

    List<Perfume> findByPerfumeGenderOrderByPriceDesc(String perfumeGender);

    List<Perfume> findByIdIn(List<Long> perfumesIds);

    @Query("SELECT perfume FROM Perfume perfume WHERE perfume.id IN :perfumesIds")
    List<PerfumeProjection> getPerfumesByIds(List<Long> perfumesIds);

    // ✅ FIXED METHOD (removed sortByPrice from query)
    @Query("SELECT perfume FROM Perfume perfume " +
            "WHERE (coalesce(:perfumers, null) IS NULL OR perfume.perfumer IN :perfumers) " +
            "AND (coalesce(:genders, null) IS NULL OR perfume.perfumeGender IN :genders) " +
            "AND (coalesce(:priceStart, null) IS NULL OR perfume.price BETWEEN :priceStart AND :priceEnd)")
    Page<PerfumeProjection> findPerfumesByFilterParams(
            List<String> perfumers,
            List<String> genders,
            Integer priceStart,
            Integer priceEnd,
            Pageable pageable);

    @Query("SELECT perfume FROM Perfume perfume " +
            "WHERE UPPER(perfume.perfumer) LIKE UPPER(CONCAT('%',:text,'%')) " +
            "ORDER BY perfume.price DESC")
    Page<PerfumeProjection> findByPerfumer(String text, Pageable pageable);

    @Query("SELECT perfume FROM Perfume perfume " +
            "WHERE UPPER(perfume.perfumeTitle) LIKE UPPER(CONCAT('%',:text,'%')) " +
            "ORDER BY perfume.price DESC")
    Page<PerfumeProjection> findByPerfumeTitle(String text, Pageable pageable);

    @Query("SELECT perfume FROM Perfume perfume " +
            "WHERE UPPER(perfume.country) LIKE UPPER(CONCAT('%',:text,'%')) " +
            "ORDER BY perfume.price DESC")
    Page<PerfumeProjection> findByManufacturerCountry(String text, Pageable pageable);
}