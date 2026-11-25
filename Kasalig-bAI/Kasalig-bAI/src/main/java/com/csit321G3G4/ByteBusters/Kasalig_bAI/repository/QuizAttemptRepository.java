package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.QuizAttemptEntity;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttemptEntity, Long> {

    /** Oldest first, the order the frontend replays them in. */
    List<QuizAttemptEntity> findByStudentStudentIdOrderByTakenAtAscAttemptIdAsc(int studentId);

    /** Every attempt in the school, oldest first (for the teacher's roster). */
    List<QuizAttemptEntity> findAllByOrderByTakenAtAscAttemptIdAsc();

    Optional<QuizAttemptEntity> findByStudentStudentIdAndClientId(int studentId, String clientId);

    @Modifying
    void deleteByStudentStudentId(int studentId);
}
