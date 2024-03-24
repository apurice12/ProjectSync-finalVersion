package com.ProjectSync.backend.appuser;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/api/user") // Adjust the base URL as necessary
public class AppUserController {

    private final AppUserService appUserService; // Assuming you have a service for user operations

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PostMapping("/{screenName}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable String screenName,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            appUserService.storeProfilePicture(screenName, file);
            return ResponseEntity.ok().body("Profile picture updated successfully.");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to update profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/{screenName}/picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String screenName) {
        try {
            byte[] profilePicture = appUserService.getProfilePictureByScreenName(screenName);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(profilePicture);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@PathVariable Long id, @RequestBody AppUser appUser) {
        return appUserService.updateUser(id, appUser)
                .map(user -> ResponseEntity.ok().body(user))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{screenName}/about-me")
    public ResponseEntity<?> getAboutMeByScreenName(@PathVariable String screenName) {
        return appUserService.getAboutMeByScreenName(screenName)
                .map(user -> ResponseEntity.ok().body(user))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserDetailsById(@PathVariable Long id) {
        return appUserService.findById(id)
                .map(user -> {
                    Map<String, Object> userDetails = new HashMap<>();
                    userDetails.put("id", user.getId());
                    userDetails.put("firstName", user.getFirstName());
                    userDetails.put("lastName", user.getLastName());
                    userDetails.put("email", user.getEmail());
                    userDetails.put("screenName", user.getScreenName());
                    userDetails.put("occupation", user.getOccupation());
                    userDetails.put("country", user.getCountry());
                    userDetails.put("aboutMe", user.getAboutMe());
                    return ResponseEntity.ok().body(userDetails);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
