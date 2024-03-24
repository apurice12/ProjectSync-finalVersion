package com.ProjectSync.backend.chat;

import com.ProjectSync.backend.appuser.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping(path="/users")
@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private ChatService chatService;
    private final AppUserRepository appUserRepository;


    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService, AppUserRepository appUserRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.appUserRepository = appUserRepository;
    }

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable String roomId, @Payload ChatMessage chatMessage) {
        // Handling NEW_COLLABORATOR type within the sendMessage method, if necessary
        if (chatMessage.getType() == MessageType.NEW_COLLABORATOR) {
            System.out.println("New Collaborator Added: " + chatMessage.getSenderEmail());
            // Additional logic for handling new collaborators can be added here
        }

        // Broadcasting the message to the specific room
        messagingTemplate.convertAndSend(String.format("/topic/%s", roomId), chatMessage);

        // Save the message to the database
        chatService.saveMessage(chatMessage);
    }

    @MessageMapping("/chat/{roomId}/addUser")
    public void addUser(@DestinationVariable String roomId, @Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = chatMessage.getSenderEmail();
        headerAccessor.getSessionAttributes().put("username", userEmail);

        // Broadcasting the user's addition to the room
        messagingTemplate.convertAndSend(String.format("/topic/%s", roomId), chatMessage);
    }

    // Endpoint to get messages by roomId
    @GetMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoomId(@PathVariable String roomId) {
        List<ChatMessage> messages = chatService.getMessagesByRoomId(roomId);
        if (messages != null && !messages.isEmpty()) {
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Autowired
    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }
    @GetMapping("/chat/messages/{senderEmail}")
    public ResponseEntity<List<ChatMessage>> getMessagesBySenderEmail(@PathVariable String senderEmail) {
        List<ChatMessage> messages = chatService.getMessagesBySenderEmail(senderEmail);
        if (messages != null && !messages.isEmpty()) {
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/chat/rooms/{senderEmail}")
    public ResponseEntity<List<String>> getRoomsBySenderEmail(@PathVariable String senderEmail) {
        List<String> rooms = chatService.getRoomsBySenderEmail(senderEmail);
        if (rooms != null && !rooms.isEmpty()) {
            return ResponseEntity.ok(rooms);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
