package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public List<CourseEntity> getCourses(Integer teacherId) {
        return teacherId == null ? courseRepository.findAll() : courseRepository.findByTeacherTeacherId(teacherId);
    }

    public CourseEntity getCourse(int courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " not found"));
    }

    public CourseEntity postCourse(CourseEntity body) {
        CourseEntity course = new CourseEntity(Require.text(body.getTitle(), "title"), findTeacher(body.getTeacher()));
        return courseRepository.save(course);
    }

    public CourseEntity putCourse(int courseId, CourseEntity body) {
        CourseEntity course = getCourse(courseId);
        course.setTitle(Require.text(body.getTitle(), "title"));
        if (body.getTeacher() != null) {
            course.setTeacher(findTeacher(body.getTeacher()));
        }
        return courseRepository.save(course);
    }

    public void deleteCourse(int courseId) {
        CourseEntity course = getCourse(courseId);
        long topics = topicRepository.countByCourseCourseId(courseId);
        long assessments = assessmentRepository.countByCourseCourseId(courseId);
        long enrollments = enrollmentRepository.countByCourseCourseId(courseId);
        if (topics + assessments + enrollments > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Course still has " + topics + " topic(s), " + assessments + " assessment(s) and "
                            + enrollments + " enrolled student(s). Remove them first.");
        }
        courseRepository.delete(course);
    }

    private TeacherEntity findTeacher(TeacherEntity ref) {
        Require.present(ref, "teacher.teacherId");
        return teacherRepository.findById(ref.getTeacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Teacher " + ref.getTeacherId() + " does not exist"));
    }
}
