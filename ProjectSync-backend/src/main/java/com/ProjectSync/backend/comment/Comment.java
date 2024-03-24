package com.ProjectSync.backend.comment;

import com.ProjectSync.backend.Apply.Apply;
import com.ProjectSync.backend.appuser.AppUser;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_email", nullable = false, referencedColumnName = "email")
    @JsonBackReference
    private AppUser appUser;

    @Column(columnDefinition = "TEXT")
    private String screenName;

    @Column
    private String category;


    @Column
    private Integer Capacity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column
    private Integer currentCapacity=0;

    @Column
    private Integer commentRoom;
    @PrePersist
    protected void onCreate() {
        Random random = new Random();
        commentRoom = random.nextInt(1000000);
    }

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate = new Date(); // Initialize with the current Date




}

