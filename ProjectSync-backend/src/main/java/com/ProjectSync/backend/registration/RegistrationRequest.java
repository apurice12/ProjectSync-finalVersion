package com.ProjectSync.backend.registration;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.springframework.web.bind.annotation.CrossOrigin;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@CrossOrigin
public class RegistrationRequest {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String screenName;
    private final String password;


}
