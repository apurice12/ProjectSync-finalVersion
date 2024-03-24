package com.ProjectSync.backend.comment;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByAppUserId(Long userId);
    List<Comment> findByAppUserEmail(String email);

    List<Comment> findByCategoryOrderByCreatedDateDesc(String category);

}
