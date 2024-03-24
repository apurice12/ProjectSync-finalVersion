package com.ProjectSync.backend.Apply;

import javax.persistence.*;

import com.ProjectSync.backend.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Apply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @JoinColumn(name="comment_screen_name")
    private String owner;

    private String appliant;

    private String content;

    private String accepted="in progress";

    private String appliantAboutMe;

    @JoinColumn(name="comment_room")
    private String commentRoom;
}