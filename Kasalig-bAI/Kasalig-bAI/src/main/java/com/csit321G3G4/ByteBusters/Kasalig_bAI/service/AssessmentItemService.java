package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentItemEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentItemRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentResultRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class AssessmentItemService {

    @Autowired
    private AssessmentItemRepository itemRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AssessmentResultRepository resultRepository;

    public List<AssessmentItemEntity> getAssessmentItems(int assessmentId) {
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment " + assessmentId + " not found");
        }
        return itemRepository.findByAssessmentAssessmentId(assessmentId);
    }

    public AssessmentItemEntity getItem(int itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item " + itemId + " not found"));
    }

    public AssessmentItemEntity postItem(AssessmentItemEntity body) {
        AssessmentEntity assessment = findAssessment(body.getAssessment());
        AssessmentItemEntity item = new AssessmentItemEntity(
                assessment,
                findTopic(body.getTopic(), assessment),
                Require.text(body.getQuestion(), "question"),
                validMaxScore(Require.present(body.getMaxScore(), "maxScore")));
        return itemRepository.save(item);
    }

    /**
     * Updates the question, max score and topic. Once students have results on the item, its max
     * score and topic are locked, because changing them would falsify the mastery already computed.
     */
    public AssessmentItemEntity putItem(int itemId, AssessmentItemEntity body) {
        AssessmentItemEntity item = getItem(itemId);
        String question = Require.text(body.getQuestion(), "question");
        int maxScore = body.getMaxScore() == null ? item.getMaxScore() : validMaxScore(body.getMaxScore());
        TopicEntity topic = body.getTopic() == null ? item.getTopic() : findTopic(body.getTopic(), item.getAssessment());

        boolean scoringChanged = maxScore != item.getMaxScore() || topic.getTopicId() != item.getTopic().getTopicId();
        if (scoringChanged && resultRepository.existsByItemItemId(itemId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Item already has student results; only its question text can be changed.");
        }
        item.setQuestion(question);
        item.setMaxScore(maxScore);
        item.setTopic(topic);
        return itemRepository.save(item);
    }

    public void deleteItem(int itemId) {
        AssessmentItemEntity item = getItem(itemId);
        if (resultRepository.existsByItemItemId(itemId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Item already has student results and cannot be deleted.");
        }
        itemRepository.delete(item);
    }

    private int validMaxScore(int maxScore) {
        if (maxScore < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "maxScore must be at least 1");
        }
        return maxScore;
    }

    private AssessmentEntity findAssessment(AssessmentEntity ref) {
        Require.present(ref, "assessment.assessmentId");
        return assessmentRepository.findById(ref.getAssessmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Assessment " + ref.getAssessmentId() + " does not exist"));
    }

    /** An item can only be tagged with a topic from the same course as its assessment. */
    private TopicEntity findTopic(TopicEntity ref, AssessmentEntity assessment) {
        Require.present(ref, "topic.topicId");
        TopicEntity topic = topicRepository.findById(ref.getTopicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Topic " + ref.getTopicId() + " does not exist"));
        if (topic.getCourse().getCourseId() != assessment.getCourse().getCourseId()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Topic " + topic.getTopicId() + " belongs to a different course than the assessment");
        }
        return topic;
    }
}
