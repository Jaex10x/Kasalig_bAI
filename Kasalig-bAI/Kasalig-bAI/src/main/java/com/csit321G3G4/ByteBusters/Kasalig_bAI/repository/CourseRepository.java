package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Integer> {

    List<CourseEntity> findByTeacherTeacherId(Integer teacherId);

    long countByTeacherTeacherId(Integer teacherId);
}
