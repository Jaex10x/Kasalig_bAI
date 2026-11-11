package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.CourseHeatmap;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.CourseHeatmap.StudentRow;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.CourseHeatmap.TopicColumn;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ProgressRecordEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.ProgressRecordRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class ProgressRecordService {

    @Autowired
    private ProgressRecordRepository progressRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    /** Adds a mastery snapshot. Called by the assessment analysis after every attempt. */
    public ProgressRecordEntity record(StudentEntity student, TopicEntity topic, float masteryLevel, LocalDateTime when) {
        return progressRepository.save(new ProgressRecordEntity(student, topic, masteryLevel, when));
    }

    /** The student's full history, newest first. Pass a topicId to see one topic only. */
    public List<ProgressRecordEntity> getStudentProgress(int studentId, Integer topicId) {
        requireStudent(studentId);
        if (topicId == null) {
            return progressRepository.findByStudentStudentIdOrderByRecordedAtDescProgressIdDesc(studentId);
        }
        return progressRepository.findByStudentStudentIdAndTopicTopicIdOrderByRecordedAtDescProgressIdDesc(studentId, topicId);
    }

    /** Where the student stands now: only the latest record of each topic. */
    public List<ProgressRecordEntity> getStudentMastery(int studentId) {
        requireStudent(studentId);
        Map<Integer, ProgressRecordEntity> latestByTopic = new LinkedHashMap<>();
        for (ProgressRecordEntity record : progressRepository.findByStudentStudentIdOrderByRecordedAtDescProgressIdDesc(studentId)) {
            latestByTopic.putIfAbsent(record.getTopic().getTopicId(), record);
        }
        return new ArrayList<>(latestByTopic.values());
    }

    /** Topics against enrolled students, each cell being the student's latest mastery of the topic. */
    public CourseHeatmap getCourseHeatmap(int courseId) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " not found"));

        List<TopicColumn> topics = topicRepository.findByCourseCourseId(courseId).stream()
                .map(topic -> new TopicColumn(topic.getTopicId(), topic.getTitle()))
                .toList();

        // Rows arrive oldest first, so each put overwrites an older mastery with a newer one.
        Map<Integer, Map<Integer, Float>> latestByStudent = new HashMap<>();
        for (ProgressRecordEntity record : progressRepository.findByTopicCourseCourseIdOrderByRecordedAtAscProgressIdAsc(courseId)) {
            latestByStudent.computeIfAbsent(record.getStudent().getStudentId(), id -> new TreeMap<>())
                    .put(record.getTopic().getTopicId(), record.getMasteryLevel());
        }

        List<StudentRow> students = new ArrayList<>();
        for (EnrollmentEntity enrollment : enrollmentRepository.findByCourseCourseId(courseId)) {
            StudentEntity student = enrollment.getStudent();
            students.add(new StudentRow(student.getStudentId(), student.getFullName(),
                    latestByStudent.getOrDefault(student.getStudentId(), Map.of())));
        }
        return new CourseHeatmap(course.getCourseId(), course.getTitle(), topics, students);
    }

    private void requireStudent(int studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found");
        }
    }
}
