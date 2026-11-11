package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningResourceEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.LearningResourceService;

@RestController
@RequestMapping("/api/resource")
public class LearningResourceController {

    @Autowired
    private LearningResourceService resourceService;

    @GetMapping("/getResources")
    public List<LearningResourceEntity> getResources(@RequestParam(required = false) Integer topicId) {
        return resourceService.getResources(topicId);
    }

    @GetMapping("/getResource/{resourceId}")
    public LearningResourceEntity getResource(@PathVariable int resourceId) {
        return resourceService.getResource(resourceId);
    }

    @PostMapping("/postResource")
    @ResponseStatus(HttpStatus.CREATED)
    public LearningResourceEntity postResource(@RequestBody LearningResourceEntity body) {
        return resourceService.postResource(body);
    }

    @PutMapping("/putResource/{resourceId}")
    public LearningResourceEntity putResource(@PathVariable int resourceId, @RequestBody LearningResourceEntity body) {
        return resourceService.putResource(resourceId, body);
    }

    @DeleteMapping("/deleteResource/{resourceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(@PathVariable int resourceId) {
        resourceService.deleteResource(resourceId);
    }
}
