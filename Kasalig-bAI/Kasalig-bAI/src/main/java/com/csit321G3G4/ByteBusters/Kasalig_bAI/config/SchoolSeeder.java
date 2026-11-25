package com.csit321G3G4.ByteBusters.Kasalig_bAI.config;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordKind;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.ClassRecordRepository;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * Adds the starting sections (the same ones as SEED_CLASSES in the frontend's schoolData.js) the
 * first time the app runs, so the admin pages are not empty. A marker record remembers that this
 * was done: sections the admin later deletes are not brought back on the next restart.
 */
@Component
public class SchoolSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchoolSeeder.class);
    private static final String MARKER = "school-seeded";

    private record Section(String id, String name, int gradeLevel, String adviser, List<String> subjectIds, int studentCount) {
    }

    private static final List<Section> SECTIONS = List.of(
            new Section("g9-sampaguita", "Sampaguita", 9, "Maria Santos", List.of("foundations", "math9"), 10),
            new Section("g9-rosal", "Rosal", 9, "Jose Ramirez", List.of("foundations", "math9"), 38),
            new Section("g9-ilang", "Ilang-Ilang", 9, "Liza Fernandez", List.of("foundations", "math9"), 36),
            new Section("g8-narra", "Narra", 8, "Ramon Cruz", List.of("foundations"), 40),
            new Section("g8-molave", "Molave", 8, "Ana Dizon", List.of("foundations"), 39),
            new Section("g7-rizal", "Rizal", 7, "Carlo Mendoza", List.of("foundations"), 42));

    private final ClassRecordRepository records;
    private final ObjectMapper json;

    public SchoolSeeder(ClassRecordRepository records, ObjectMapper json) {
        this.records = records;
        this.json = json;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (records.existsByKindAndClientId(ClassRecordKind.SETTING, MARKER)) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        for (Section s : SECTIONS) {
            if (records.existsByKindAndClientId(ClassRecordKind.SCHOOL_CLASS, s.id())) {
                continue;
            }
            ObjectNode body = json.createObjectNode();
            body.put("id", s.id());
            body.put("name", s.name());
            body.put("gradeLevel", s.gradeLevel());
            body.put("adviser", s.adviser());
            s.subjectIds().forEach(body.putArray("subjectIds")::add);
            body.put("studentCount", s.studentCount());
            records.save(record(ClassRecordKind.SCHOOL_CLASS, s.id(), json.writeValueAsString(body), now));
        }
        records.save(record(ClassRecordKind.SETTING, MARKER, "{}", now));
        log.info("Added {} starting sections.", SECTIONS.size());
    }

    private static ClassRecordEntity record(ClassRecordKind kind, String clientId, String payload, LocalDateTime now) {
        ClassRecordEntity r = new ClassRecordEntity();
        r.setKind(kind);
        r.setClientId(clientId);
        r.setPayload(payload);
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        r.setAuthorRole("system");
        return r;
    }
}
