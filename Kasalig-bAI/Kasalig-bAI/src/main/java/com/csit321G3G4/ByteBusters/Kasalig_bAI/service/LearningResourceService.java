package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningResourceEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningResourceRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class LearningResourceService {

    @Autowired
    private LearningResourceRepository resourceRepository;

    @Autowired
    private TopicRepository topicRepository;

    public List<LearningResourceEntity> getResources(Integer topicId) {
        return topicId == null ? resourceRepository.findAll() : resourceRepository.findByTopicTopicId(topicId);
    }

    public LearningResourceEntity getResource(int resourceId) {
        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource " + resourceId + " not found"));
    }

    public LearningResourceEntity postResource(LearningResourceEntity body) {
        LearningResourceEntity resource = new LearningResourceEntity(
                findTopic(body.getTopic()),
                Require.text(body.getTitle(), "title"),
                body.getType(),
                body.getUrl(),
                Require.present(body.getDifficulty(), "difficulty"));
        return resourceRepository.save(resource);
    }

    public LearningResourceEntity putResource(int resourceId, LearningResourceEntity body) {
        LearningResourceEntity resource = getResource(resourceId);
        resource.setTitle(Require.text(body.getTitle(), "title"));
        resource.setType(body.getType());
        resource.setUrl(body.getUrl());
        resource.setDifficulty(Require.present(body.getDifficulty(), "difficulty"));
        if (body.getTopic() != null) {
            resource.setTopic(findTopic(body.getTopic()));
        }
        return resourceRepository.save(resource);
    }

    /** Also removes the recommendations that point at the resource (database ON DELETE CASCADE). */
    public void deleteResource(int resourceId) {
        resourceRepository.delete(getResource(resourceId));
    }

    private TopicEntity findTopic(TopicEntity ref) {
        Require.present(ref, "topic.topicId");
        return topicRepository.findById(ref.getTopicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Topic " + ref.getTopicId() + " does not exist"));
    }
}
