package com.ProjectSync.backend.appuser;

import com.ProjectSync.backend.registration.token.ConfirmationToken;
import com.ProjectSync.backend.registration.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@CrossOrigin
@Transactional
public class AppUserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG="User with email %s not found";
    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ConfirmationTokenService confirmationTokenService;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return appUserRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(USER_NOT_FOUND_MSG, email)));
    }


    public String signUpUser(AppUser appUser) {
        boolean userExists = appUserRepository
                .findByEmail(appUser.getEmail())
                .isPresent();

        if (userExists) {

            throw new IllegalStateException("email already taken");
        }

        String encodedPassword = bCryptPasswordEncoder
                .encode(appUser.getPassword());

        appUser.setPassword(encodedPassword);

        appUserRepository.save(appUser);

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                appUser
        );

        confirmationTokenService.saveConfirmationToken(
                confirmationToken);



        return token;
    }
    public Optional<AppUser> findById(Long id) {
        return appUserRepository.findById(id);
    }

    public int enableAppUser(String email) {
        return appUserRepository.enableAppUser(email);
    }

    public void storeProfilePicture(String screenName, MultipartFile file) throws IOException {
        AppUser user = appUserRepository.findByScreenName(screenName)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        // Read the original image
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));

        // Resize the image to 200x200
        BufferedImage resizedImage = resizeImage(originalImage, 1920, 1080);

        // Convert the resized image back to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", baos);
        byte[] pictureBytes = baos.toByteArray();

        // Set the resized image byte array to the user's profile picture
        user.setProfilePicture(pictureBytes);
        appUserRepository.save(user);
    }
    public Optional<String> getAboutMeByScreenName(String screenName) {
        return appUserRepository.findByScreenName(screenName)
                .map(AppUser::getAboutMe); // Assuming AppUser has a getAboutMe method.
    }


    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        // Determine the aspect ratio
        double aspectRatio = (double) originalImage.getWidth() / originalImage.getHeight();

        int newWidth = targetWidth;
        int newHeight = (int) (targetWidth / aspectRatio);

        // If calculated height is greater than target, adjust based on height instead
        if (newHeight > targetHeight) {
            newHeight = targetHeight;
            newWidth = (int) (targetHeight * aspectRatio);
        }

        // Create a new buffered image with target size
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        // Draw the original image to the resized image
        resizedImage.createGraphics().drawImage(originalImage.getScaledInstance(newWidth, newHeight, java.awt.Image.SCALE_SMOOTH), 0, 0, null);

        return resizedImage;
    }

    public byte[] getProfilePictureByScreenName(String screenName) {
        AppUser user = appUserRepository.findByScreenName(screenName)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        byte[] profilePicture = user.getProfilePicture();
        if (profilePicture == null) {
            throw new IllegalStateException("Profile picture not found for user with screenName: " + screenName);
        }

        return profilePicture;
    }
    public Optional<AppUser> updateUser(Long id, AppUser updatedUser) {
        return appUserRepository.findById(id)
                .map(user -> {
                    // Directly update the user entity fields
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setEmail(updatedUser.getEmail());
                    user.setScreenName(updatedUser.getScreenName());
                    user.setOccupation(updatedUser.getOccupation());
                    user.setCountry(updatedUser.getCountry());
                    user.setAboutMe(updatedUser.getAboutMe());
                    // Carefully update other fields, considering security and validation
                    // Example:
                    // user.setEmail(updatedUser.getEmail());
                    return appUserRepository.save(user);
                });
    }


}
