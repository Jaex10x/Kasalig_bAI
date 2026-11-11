package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CurriculumStandardEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentItemRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CurriculumStandardRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningGapRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningResourceRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.ProgressRecordRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CurriculumStandardRepository standardRepository;

    @Autowired
    private AssessmentItemRepository itemRepository;

    @Autowired
    private LearningResourceRepository resourceRepository;

    @Autowired
    private ProgressRecordRepository progressRepository;

    @Autowired
    private LearningGapRepository gapRepository;

    public List<TopicEntity> getTopics(Integer courseId, Integer standardId) {
        if (courseId != null && standardId != null) {
            return topicRepository.findByCourseCourseIdAndStandardStandardId(courseId, standardId);
        }
        if (courseId != null) {
            return topicRepository.findByCourseCourseId(courseId);
        }
        if (standardId != null) {
            return topicRepository.findByStandardStandardId(standardId);
        }
        return topicRepository.findAll();
    }

    public TopicEntity getTopic(int topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic " + topicId + " not found"));
    }

    public TopicEntity postTopic(TopicEntity body) {
        TopicEntity topic = new TopicEntity(
                Require.text(body.getTitle(), "title"),
                findCourse(body.getCourse()),
                findStandard(body.getStandard()));
        return topicRepository.save(topic);
    }

    /** Updates the title and the aligned standard. A topic stays in the course it was created in. */
    public TopicEntity putTopic(int topicId, TopicEntity body) {
        TopicEntity topic = getTopic(topicId);
        topic.setTitle(Require.text(body.getTitle(), "title"));
        if (body.getStandard() != null) {
            topic.setStandard(findStandard(body.getStandard()));
        }
        return topicRepository.save(topic);
    }

    public void deleteTopic(int topicId) {
        TopicEntity topic = getTopic(topicId);
        if (itemRepository.existsByTopicTopicId(topicId) || resourceRepository.existsByTopicTopicId(topicId)
                || progressRepository.existsByTopicTopicId(topicId) || gapRepository.existsByTopicTopicId(topicId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Topic is still used by assessment items, learning resources or student records. Remove them first.");
        }
        topicRepository.delete(topic);
    }

    private CourseEntity findCourse(CourseEntity ref) {
        Require.present(ref, "course.courseId");
        return courseRepository.findById(ref.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Course " + ref.getCourseId() + " does not exist"));
    }

    /** The standard is optional: a null reference means the topic is not aligned yet. */
    private CurriculumStandardEntity findStandard(CurriculumStandardEntity ref) {
        if (ref == null) {
            return null;
        }
        return standardRepository.findById(ref.getStandardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Standard " + ref.getStandardId() + " does not exist"));
    }
}
