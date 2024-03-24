package com.ProjectSync.backend.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Method to fetch recent messages with pagination
    List<ChatMessage> findTopNByOrderByIdDesc(); // Adjusted to fetch top 10 messages
    List<ChatMessage> findByRoomId(String roomId);
    List<ChatMessage> findBySenderEmail(String senderEmail);

    @Query("SELECT DISTINCT cm.roomId FROM ChatMessage cm WHERE cm.senderEmail = ?1")
    List<String> findDistinctRoomsBySenderEmail(String senderEmail);
}
