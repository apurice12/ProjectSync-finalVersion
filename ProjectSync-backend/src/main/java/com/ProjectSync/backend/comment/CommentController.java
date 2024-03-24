package com.ProjectSync.backend.comment;

import com.ProjectSync.backend.appuser.AppUser;
import com.ProjectSync.backend.appuser.AppUserRepository;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllComments() {
        List<Comment> comments = commentService.findByAppUserEmailOrderByCreatedAtDesc();
        return comments.isEmpty() ? ResponseEntity.ok("No comments available at the moment") : ResponseEntity.ok(comments);
    }

    @GetMapping(path="/{category}")
    public ResponseEntity<?> getComments(@PathVariable String category) {
        List<Comment> comments = commentService.getCommentsByCategory(category);
        return comments.isEmpty() ? ResponseEntity.ok("No comments available at the moment") : ResponseEntity.ok(comments);
    }

    // Assuming a need to fetch comments by user email
    @GetMapping(path="/user/{email}")
    public ResponseEntity<List<Comment>> getCommentsByUserEmail(@PathVariable String email ) {
        List<Comment> comments = commentService.getCommentsByUserEmail(email);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/user/{email}")
    public ResponseEntity<?> createComment(@PathVariable String email, @RequestBody Comment comment) {
        try {
            Comment createdComment = commentService.createComment(email, comment);
            return ResponseEntity.ok(createdComment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Adjust update and delete endpoints to work with comment IDs and possibly user email


    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment updatedComment) {
        try {
            Comment comment = commentService.updateComment(id, updatedComment);
            return ResponseEntity.ok(comment);
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping(path="/count")
    public ResponseEntity<?> getCommentsCount() {
        long count = commentService.getCountOfComments();
        return ResponseEntity.ok(count);
    }
}
