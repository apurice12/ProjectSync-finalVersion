package com.ProjectSync.backend.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
public class ProtectedResourceController {

    @GetMapping("/protected")
    @PreAuthorize("hasRole('ROLE_USER')")
    public String getProtectedResource() {
        return "This is a protected resource. You must be authenticated and have the ROLE_USER authority to see this.";
    }
}