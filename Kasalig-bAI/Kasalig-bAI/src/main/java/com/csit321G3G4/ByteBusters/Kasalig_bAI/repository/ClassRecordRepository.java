package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordKind;

@Repository
public interface ClassRecordRepository extends JpaRepository<ClassRecordEntity, Long> {

    List<ClassRecordEntity> findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind kind);

    List<ClassRecordEntity> findByKindInOrderByCreatedAtAscRecordIdAsc(Collection<ClassRecordKind> kinds);

    List<ClassRecordEntity> findByKindAndPublishedTrueOrderByCreatedAtAscRecordIdAsc(ClassRecordKind kind);

    Optional<ClassRecordEntity> findByKindAndClientId(ClassRecordKind kind, String clientId);

    boolean existsByKindAndClientId(ClassRecordKind kind, String clientId);
}
