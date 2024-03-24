package com.ProjectSync.backend.registration;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.function.Predicate;
@Service
@CrossOrigin
public class EmailValidator implements Predicate<String> {
    @Override
    public boolean test(String s) {
        //TODO: REGEX TO VALIDATE EMAIL
        return true;
    }
}
