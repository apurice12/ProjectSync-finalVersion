package com.ProjectSync.backend.email;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin

public interface EmailSender {
    void send(String to, String email);
}
