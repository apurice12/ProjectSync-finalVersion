package com.ProjectSync.backend.chat;

import com.ProjectSync.backend.appuser.AppUser;
import com.ProjectSync.backend.comment.Comment;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MessageType type;
    private String content;
    private String senderEmail;
    private String roomId;
    // Getters and setters

}
