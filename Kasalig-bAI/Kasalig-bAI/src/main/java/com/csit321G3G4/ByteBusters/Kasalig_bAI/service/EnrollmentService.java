package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<EnrollmentEntity> getCourseEnrollments(int courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " not found");
        }
        return enrollmentRepository.findByCourseCourseId(courseId);
    }

    public List<EnrollmentEntity> getStudentEnrollments(int studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found");
        }
        return enrollmentRepository.findByStudentStudentId(studentId);
    }

    public EnrollmentEntity postEnrollment(EnrollmentEntity body) {
        StudentEntity student = findStudent(body.getStudent());
        CourseEntity course = findCourse(body.getCourse());
        if (enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(student.getStudentId(), course.getCourseId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is already enrolled in this course");
        }
        LocalDate enrolledOn = body.getEnrolledOn() != null ? body.getEnrolledOn() : LocalDate.now();
        return enrollmentRepository.save(new EnrollmentEntity(student, course, enrolledOn));
    }

    public void deleteEnrollment(int enrollmentId) {
        EnrollmentEntity enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment " + enrollmentId + " not found"));
        enrollmentRepository.delete(enrollment);
    }

    private StudentEntity findStudent(StudentEntity ref) {
        Require.present(ref, "student.studentId");
        return studentRepository.findById(ref.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Student " + ref.getStudentId() + " does not exist"));
    }

    private CourseEntity findCourse(CourseEntity ref) {
        Require.present(ref, "course.courseId");
        return courseRepository.findById(ref.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Course " + ref.getCourseId() + " does not exist"));
    }
}
