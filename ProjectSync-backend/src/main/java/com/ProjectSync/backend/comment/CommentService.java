package com.ProjectSync.backend.comment;

import com.ProjectSync.backend.appuser.AppUser;
import com.ProjectSync.backend.appuser.AppUserRepository;
import com.ProjectSync.backend.comment.Comment;
import com.ProjectSync.backend.comment.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final AppUserRepository appUserRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, AppUserRepository appUserRepository) {
        this.commentRepository = commentRepository;
        this.appUserRepository = appUserRepository;
    }

    public List<Comment> findByAppUserEmailOrderByCreatedAtDesc() {
        return commentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"));
    }


    public List<Comment> getCommentsByUserEmail(String email) {
        return commentRepository.findByAppUserEmail(email);
    }

    public List<Comment> getCommentsByCategory(String category) {
        return commentRepository.findByCategoryOrderByCreatedDateDesc(category);
    }
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }
    public long getCountOfComments() {
        return commentRepository.count();
    }
    public Comment createComment(String email, Comment comment) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        comment.setAppUser(user);
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long commentId, Comment updatedComment) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        comment.setContent(updatedComment.getContent());
        // Update other fields as necessary
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Comment not found with id: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}
