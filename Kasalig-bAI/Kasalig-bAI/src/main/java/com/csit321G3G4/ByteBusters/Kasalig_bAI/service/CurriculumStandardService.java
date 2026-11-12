package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CurriculumStandardEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CurriculumStandardRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TopicRepository;

@Service
public class CurriculumStandardService {

    @Autowired
    private CurriculumStandardRepository standardRepository;

    @Autowired
    private TopicRepository topicRepository;

    public List<CurriculumStandardEntity> getStandards(Integer yearLevel) {
        return yearLevel == null ? standardRepository.findAll() : standardRepository.findByYearLevel(yearLevel);
    }

    public CurriculumStandardEntity getStandard(int standardId) {
        return standardRepository.findById(standardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Standard " + standardId + " not found"));
    }

    public CurriculumStandardEntity postStandard(CurriculumStandardEntity body) {
        String code = Require.text(body.getCode(), "code");
        if (standardRepository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Standard code already in use");
        }
        return standardRepository.save(new CurriculumStandardEntity(code, body.getDescription(), body.getYearLevel()));
    }

    public CurriculumStandardEntity putStandard(int standardId, CurriculumStandardEntity body) {
        CurriculumStandardEntity standard = getStandard(standardId);
        String code = Require.text(body.getCode(), "code");
        if (!standard.getCode().equalsIgnoreCase(code) && standardRepository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Standard code already in use");
        }
        standard.setCode(code);
        standard.setDescription(body.getDescription());
        standard.setYearLevel(body.getYearLevel());
        return standardRepository.save(standard);
    }

    public void deleteStandard(int standardId) {
        CurriculumStandardEntity standard = getStandard(standardId);
        long topics = topicRepository.countByStandardStandardId(standardId);
        if (topics > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Standard is still aligned to " + topics + " topic(s). Realign or delete them first.");
        }
        standardRepository.delete(standard);
    }
}
