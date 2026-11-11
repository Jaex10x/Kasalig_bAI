package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;

@Repository
public interface TopicRepository extends JpaRepository<TopicEntity, Integer> {

    List<TopicEntity> findByCourseCourseId(Integer courseId);

    List<TopicEntity> findByStandardStandardId(Integer standardId);

    List<TopicEntity> findByCourseCourseIdAndStandardStandardId(Integer courseId, Integer standardId);

    long countByCourseCourseId(Integer courseId);

    long countByStandardStandardId(Integer standardId);
}
