import { Component, inject, signal } from '@angular/core';
import { SocketService } from '../services/socket-service.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
@Component({
  selector: 'app-chatroom',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatCardModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css',
  providers: [SocketService, AuthService],
})
export class ChatroomComponent {
  private socketService = inject(SocketService);

  // Use Angular Signals to hold component state for better reactivity and
  // easier change detection.
  public chatBoxes = signal<
    { roomId: string; username: string; messages: string[] }[]
  >([]);

  public allRooms = signal<
    {
      roomId: string;
      createdBy: string;
      messages: string[];
      message?: string;
    }[]
  >([]);

  // messages grouped by roomId
  public messages = signal<{
    [roomId: string]: { message: string; username: string }[];
  }>({});

  public activeUsers = signal<any[]>([]);

  // visibility flag for rooms list
  viewRooms = signal(false);
  // TODO: Display messages in specific chatbox. Use response from ListenToSentByEvent to update the messages in the specific chatbox.

  /**
   * Toggles the visibility of the chat rooms list and fetches the latest active rooms from the backend.
   */
  toggleRooms() {
    this.viewRooms.update((v) => !v);
    console.log('clicked view rooms');
    this.listenActiveRooms();
  }

  // function to create a new chatroom, this creates a new thread in Map of active rooms in backend
  /**
   * Creates a new chatroom by emitting a 'create-room' event to the backend with a random roomId.
   */
  createRoom() {
    console.log('clicked create room');
    const roomId = `${Math.floor(Math.random() * 1000)}`;
    //const username = 'test';
    this.socketService.emitEvent('create-room', {
      roomId: roomId,
    });
  }

  // pushing users into chatBoxes array when they join a specific room, to loop messages property.
  /**
   * Adds a new chatbox to the chatBoxes array for a specific room and user.
   * Used to display messages for a specific chatroom in the UI.
   */
  generateChatroom(roomId: string, username: string) {
    // Use signal update to append a new chatbox if it doesn't already exist
    this.chatBoxes.update((prev) => {
      const exists = prev.some((b) => b.roomId === roomId);
      if (exists) return prev;
      return [...prev, { roomId: roomId, username: username, messages: [] }];
    });
  }

  // function to join a room by roomId and username of user joining
  /**
   * Emits a 'join-room' event to the backend to join a specific chatroom with the given username.
   * Listens for the 'user-info' event to confirm joining and logs the response.
   */
  joinRoom(roomId: string, username: string) {
    this.socketService.emitEvent('join-room', {
      roomId: roomId,
      username: username,
    });
    this.socketService.listenEvent('user-info').subscribe((data: any) => {
      console.log('joined room', data);
    });
  }

  // emits event to backend to send message to specific room
  /**
   * Emits a 'send-message' event to the backend to send a message to a specific chatroom.
   * @param roomId The ID of the chatroom to send the message to.
   * @param message The message content to send.
   */
  sendMessage(roomId: string, message: any) {
    this.socketService.emitEvent('send-message', {
      roomId: roomId,
      message: message,
    });
  }

  // function to listen to messages sent by other users in the same room
  /**
   * Listens for 'sent-by' events from the backend, which are messages sent by users in specific rooms.
   * Updates the messages object to group messages by roomId for display in the UI.
   */
  listenToSentByEvent() {
    console.log('listening to sent-by event');
    this.socketService.listenEvent('sent-by').subscribe((data: any) => {
      // Handle the received data (e.g., update the UI)
      console.log('Received message:', data);
      // Update the messages signal in an immutable way
      this.messages.update((prev) => {
        const next = { ...(prev || {}) } as {
          [roomId: string]: { message: string; username: string }[];
        };
        const roomId = data.roomId;
        if (!next[roomId]) next[roomId] = [];
        next[roomId] = [
          ...next[roomId],
          { message: data.message, username: data.username },
        ];
        return next;
      });

      console.log(
        `After push, messages for roomId ${data.roomId}:`,
        this.messages()[data.roomId]
      );
    });
  }

  // gets all users active in current socket
  /**
   * Fetches the list of active users from the backend and updates the activeUsers array.
   * Logs the response, errors, and completion status.
   */
  getActiveUsers() {
    this.socketService.getActiveUsers().subscribe({
      next: (response) => {
        console.log(response, 'active users');
        this.activeUsers.set(response);
      },
      error: (error) => {
        console.log(error, 'error from active users');
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  // listens to all changes in active rooms map from backend
  /**
   * Listens for updates to the list of active chat rooms from the backend.
   * Updates the allRooms array and generates chatboxes for each room.
   */
  listenActiveRooms() {
    this.socketService
      .listenEvent('active rooms list')
      .subscribe(
        (
          rooms: { roomId: string; createdBy: string; messages: string[] }[]
        ) => {
          // saving rooms live from socket in allRooms array to get roomId and createdBy from socket to loop it in html template.
          this.allRooms.set(rooms);
          rooms.forEach((room) => {
            this.generateChatroom(room.roomId, room.createdBy);
          });
          console.log('rooms', rooms);
        }
      );
  }

  /**
   * Angular lifecycle hook that runs on component initialization.
   * Fetches active users and starts listening for messages sent by users in rooms.
   */
  ngOnInit() {
    this.getActiveUsers();
    // this.listenActiveRooms();
    this.listenToSentByEvent();
    console.log('Chatroom component initialized');
  }
}
