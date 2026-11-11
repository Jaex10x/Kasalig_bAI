package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentItemEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AssessmentItemService;

@RestController
@RequestMapping("/api/item")
public class AssessmentItemController {

    @Autowired
    private AssessmentItemService itemService;

    @GetMapping("/getAssessmentItems/{assessmentId}")
    public List<AssessmentItemEntity> getAssessmentItems(@PathVariable int assessmentId) {
        return itemService.getAssessmentItems(assessmentId);
    }

    @GetMapping("/getItem/{itemId}")
    public AssessmentItemEntity getItem(@PathVariable int itemId) {
        return itemService.getItem(itemId);
    }

    @PostMapping("/postItem")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentItemEntity postItem(@RequestBody AssessmentItemEntity body) {
        return itemService.postItem(body);
    }

    @PutMapping("/putItem/{itemId}")
    public AssessmentItemEntity putItem(@PathVariable int itemId, @RequestBody AssessmentItemEntity body) {
        return itemService.putItem(itemId, body);
    }

    @DeleteMapping("/deleteItem/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable int itemId) {
        itemService.deleteItem(itemId);
    }
}
