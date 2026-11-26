package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Integer> {

    List<EnrollmentEntity> findByCourseCourseIdOrderByStudentFullNameAsc(int courseId);

    /** Every enrollment in the courses one teacher handles. */
    List<EnrollmentEntity> findByCourseTeacherTeacherId(int teacherId);

    long countByCourseCourseId(int courseId);

    /** The courses one student is enrolled in. */
    List<EnrollmentEntity> findByStudentStudentId(int studentId);

    boolean existsByStudentStudentIdAndCourseCourseId(int studentId, int courseId);

    /** Whether the student is in any course the teacher handles. */
    boolean existsByStudentStudentIdAndCourseTeacherTeacherId(int studentId, int teacherId);

    Optional<EnrollmentEntity> findByStudentStudentIdAndCourseCourseId(int studentId, int courseId);

    @Modifying
    void deleteByCourseCourseId(int courseId);
}
