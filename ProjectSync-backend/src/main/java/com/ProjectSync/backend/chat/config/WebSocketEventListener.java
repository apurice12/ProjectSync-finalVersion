package com.ProjectSync.backend.chat.config;

import com.ProjectSync.backend.appuser.AppUserRepository;
import com.ProjectSync.backend.chat.ChatMessage;
import com.ProjectSync.backend.chat.MessageType;
import com.ProjectSync.backend.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final AppUserRepository appUserRepository;
    private final ChatService chatService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            // Optional: Fetch AppUser for additional logging or operations
            appUserRepository.findByEmail(username).ifPresent(user -> {
                log.info("User disconnected: {}, email: {}", user.getScreenName(), user.getEmail());
                // Perform any additional operations needed on user disconnect
            });

            // Fetch recent messages when a user disconnects
            List<ChatMessage> recentMessages = chatService.getRecentMessages(); // Fetching recent messages

            // Send recent messages to the user who just disconnected
            messagingTemplate.convertAndSendToUser(username, "/topic/recentMessages", recentMessages);

            // Proceed with creating and sending the leave message
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .senderEmail(username) // Consider using a more specific identifier if needed
                    .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
