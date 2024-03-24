package com.ProjectSync.backend.auth;

import com.ProjectSync.backend.appuser.AppUser;
import com.ProjectSync.backend.auth.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.ProjectSync.backend.auth.JwtUtil;
import com.ProjectSync.backend.appuser.AppUserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AppUserService appUserService; // Assuming this service exists

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Load the fully populated AppUser object (assuming your userDetailsService does this)
            AppUser appUser = (AppUser) appUserService.loadUserByUsername(loginRequest.getEmail());

            // Generate the token
            final String token = jwtUtil.generateToken(appUser);

            // Send the token in a proper object format
            return ResponseEntity.ok(new TokenResponse(token)); // Use an appropriate response class
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed");
        }
    }

    // Define the response class somewhere in your application
    static class TokenResponse {
        private final String token;

        public TokenResponse(String token) {
            this.token = token;
        }

        // Getter
        public String getToken() {
            return token;
        }
    }
}
