package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AdminEntity;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Integer> {
    boolean existsByEmailIgnoreCase(String email);

    Optional<AdminEntity> findByEmailIgnoreCase(String email);
}
