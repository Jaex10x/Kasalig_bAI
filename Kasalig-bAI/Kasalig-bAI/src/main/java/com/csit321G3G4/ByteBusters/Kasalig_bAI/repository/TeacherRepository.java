package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;

@Repository
public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer> {
     boolean existsByEmailIgnoreCase(String email);

    /** The account a login email belongs to. "First" keeps login working even if old data holds duplicates. */
    Optional<TeacherEntity> findFirstByEmailIgnoreCaseOrderByTeacherIdAsc(String email);
}