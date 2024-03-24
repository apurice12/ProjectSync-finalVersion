package com.ProjectSync.backend.Apply;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {

    // In ApplyRepository
    Optional<Apply> findByCommentIdAndAppliant(Long commentId, String appliant);
    List<Apply> findByOwner(String owner);
    // Assuming the owner is identified by a unique identifier like email or username
    List<Apply> findByCommentId(Long commentId);
    List<Apply> findByCommentIdAndAcceptedFalse(Long commentId);

    List<Apply> findByCommentIdAndAcceptedTrue(Long commentId);

    List<Apply> findByAppliant(String appliant);

    // In ApplyRepository.java
    // In ApplyRepository.java
    long countByCommentIdAndAccepted(Long commentId, String accepted);



}
