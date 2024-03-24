package com.ProjectSync.backend.Apply;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/user/apply")
public class ApplyController {

    @Autowired
    private ApplyService applyService;

    private static class ApplyRequest {
        public String appliant;
        public String content;

        public String appliantAboutMe;
    }

    @PostMapping("/{commentId}")
    public ResponseEntity<?> createApply(@PathVariable Long commentId, @RequestBody ApplyRequest applyRequest) {
        try {
            Apply apply = applyService.createApply(commentId, applyRequest.appliant, applyRequest.content, applyRequest.appliantAboutMe);
            return ResponseEntity.ok(apply);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{applyId}/accept")
    public ResponseEntity<?> acceptApply(@PathVariable Long applyId) {
        try {
            Apply updatedApply = applyService.acceptApply(applyId);
            return ResponseEntity.ok(updatedApply);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{applyId}/decline")
    public ResponseEntity<?> declineApply(@PathVariable Long applyId) {
        try {
            Apply updatedApply = applyService.declineApply(applyId);
            return ResponseEntity.ok(updatedApply);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-comment/{commentId}")
    public ResponseEntity<List<Apply>> getApplicationsByCommentId(@PathVariable Long commentId) {
        try {
            List<Apply> applications = applyService.findApplicationsByCommentId(commentId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            // Return an empty list with BAD_REQUEST status, or consider using NOT_FOUND if more appropriate
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
    @GetMapping("/by-appliant/{appliant}")
    public ResponseEntity<List<Apply>> getApplicationsByAppliant(@PathVariable String appliant) {
        try {
            List<Apply> applications = applyService.findApplicationsByAppliant(appliant);
            if (applications.isEmpty()) {
                // Consider returning NOT_FOUND if no applications found for the appliant
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            // Handle exceptions appropriately
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
    // In ApplyController.java
    @GetMapping("/count/in-progress/{commentId}")
    public ResponseEntity<Long> getCountApplicationsInProgressByCommentId(@PathVariable Long commentId) {
        try {
            long count = applyService.countApplicationsInProgressByCommentId(commentId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



}


