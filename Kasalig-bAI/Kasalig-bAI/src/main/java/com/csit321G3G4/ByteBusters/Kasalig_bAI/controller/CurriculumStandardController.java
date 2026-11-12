package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CurriculumStandardEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CurriculumStandardService;

@RestController
@RequestMapping("/api/standard")
public class CurriculumStandardController {

    @Autowired
    private CurriculumStandardService standardService;

    @GetMapping("/getStandards")
    public List<CurriculumStandardEntity> getStandards(@RequestParam(required = false) Integer yearLevel) {
        return standardService.getStandards(yearLevel);
    }

    @GetMapping("/getStandard/{standardId}")
    public CurriculumStandardEntity getStandard(@PathVariable int standardId) {
        return standardService.getStandard(standardId);
    }

    @PostMapping("/postStandard")
    @ResponseStatus(HttpStatus.CREATED)
    public CurriculumStandardEntity postStandard(@RequestBody CurriculumStandardEntity body) {
        return standardService.postStandard(body);
    }

    @PutMapping("/putStandard/{standardId}")
    public CurriculumStandardEntity putStandard(@PathVariable int standardId, @RequestBody CurriculumStandardEntity body) {
        return standardService.putStandard(standardId, body);
    }

    @DeleteMapping("/deleteStandard/{standardId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStandard(@PathVariable int standardId) {
        standardService.deleteStandard(standardId);
    }
}
