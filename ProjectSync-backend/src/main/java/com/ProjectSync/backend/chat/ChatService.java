package com.ProjectSync.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ChatService {

    // Repository for ChatMessage operations
    private final ChatMessageRepository chatMessageRepository;

    // Constructor injection for ChatMessageRepository
    @Autowired
    public ChatService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    // Saves a message to the database
    public ChatMessage saveMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    // Retrieves messages for a specific roomId
    public List<ChatMessage> getMessagesByRoomId(String roomId) {
        return chatMessageRepository.findByRoomId(roomId);
    }

    // Broadcasts and saves a message
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        // Save message to DB
        return saveMessage(chatMessage);
    }

    // Retrieves all messages from the database
    public List<ChatMessage> getAllMessages() {
        return chatMessageRepository.findAll();
    }

    // Retrieve recent messages with a custom method to define "recent"
    public List<ChatMessage> getRecentMessages() {
        // Assuming there's a method in your repository to fetch recent messages
        // This is a placeholder for the actual method call, e.g., findTop10ByOrderByIdDesc()
        List<ChatMessage> recentMessages = chatMessageRepository.findAll(); // Update this line with the actual method

        // Reverse the order of messages to maintain chronological order, if necessary
        Collections.reverse(recentMessages);

        return recentMessages;
    }
    public List<ChatMessage> getMessagesBySenderEmail(String senderEmail) {
        // Implement logic to retrieve messages by sender's email from the database
        return chatMessageRepository.findBySenderEmail(senderEmail);
    }
    public List<String> getRoomsBySenderEmail(String senderEmail) {
        return chatMessageRepository.findDistinctRoomsBySenderEmail(senderEmail);
    }
}
