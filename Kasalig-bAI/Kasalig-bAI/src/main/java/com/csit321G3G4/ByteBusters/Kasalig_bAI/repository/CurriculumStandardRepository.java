package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CurriculumStandardEntity;

@Repository
public interface CurriculumStandardRepository extends JpaRepository<CurriculumStandardEntity, Integer> {

    List<CurriculumStandardEntity> findByYearLevel(Integer yearLevel);

    boolean existsByCodeIgnoreCase(String code);
}
