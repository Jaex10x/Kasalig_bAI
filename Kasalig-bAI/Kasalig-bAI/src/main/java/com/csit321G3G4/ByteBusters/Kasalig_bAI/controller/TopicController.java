package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TopicService;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("/getTopics")
    public List<TopicEntity> getTopics(@RequestParam(required = false) Integer courseId,
                                       @RequestParam(required = false) Integer standardId) {
        return topicService.getTopics(courseId, standardId);
    }

    @GetMapping("/getTopic/{topicId}")
    public TopicEntity getTopic(@PathVariable int topicId) {
        return topicService.getTopic(topicId);
    }

    @PostMapping("/postTopic")
    @ResponseStatus(HttpStatus.CREATED)
    public TopicEntity postTopic(@RequestBody TopicEntity body) {
        return topicService.postTopic(body);
    }

    @PutMapping("/putTopic/{topicId}")
    public TopicEntity putTopic(@PathVariable int topicId, @RequestBody TopicEntity body) {
        return topicService.putTopic(topicId, body);
    }

    @DeleteMapping("/deleteTopic/{topicId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTopic(@PathVariable int topicId) {
        topicService.deleteTopic(topicId);
    }
}
