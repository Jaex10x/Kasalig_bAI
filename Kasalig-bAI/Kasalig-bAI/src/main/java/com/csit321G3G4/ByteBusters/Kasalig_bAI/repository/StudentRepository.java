package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {

    List<StudentEntity> findByTeacherTeacherId(Integer teacherId);

    Optional<StudentEntity> findByStudentIdAndTeacherTeacherId(Integer studentId, Integer teacherId);

    boolean existsByEmailIgnoreCase(String email);

    /** The account a login id belongs to. "First" keeps login working even if old data holds duplicates. */
    Optional<StudentEntity> findFirstByEmailIgnoreCaseOrderByStudentIdAsc(String email);

    long countByTeacherTeacherId(Integer teacherId);
}