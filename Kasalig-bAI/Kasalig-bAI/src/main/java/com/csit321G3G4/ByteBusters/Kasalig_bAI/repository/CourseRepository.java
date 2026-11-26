package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Integer> {

    List<CourseEntity> findByTeacherTeacherIdOrderByTitleAscSectionAsc(int teacherId);

    List<CourseEntity> findAllByOrderByTitleAscSectionAsc();

    long countByTeacherTeacherId(int teacherId);

    /** Courses students can enroll in themselves (null counts as open). */
    @Query("select c from CourseEntity c where c.selfEnroll is null or c.selfEnroll = true order by c.yearLevel, c.semester, c.subjectCode, c.section")
    List<CourseEntity> findOpenForSelfEnroll();
}
