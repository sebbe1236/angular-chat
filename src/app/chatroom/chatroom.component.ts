import { Component, inject } from '@angular/core';
import { SocketService } from '../services/socket-service.service';
import { AuthService } from '../services/auth-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
  public chatBoxes: { roomId: string; username: string; messages: string[] }[] =
    [];
  public allRooms: {
    roomId: string;
    createdBy: string;
    messages: string[];
    message?: string;
  }[] = [];
  public messages: {
    [roomId: string]: { message: string; username: string }[];
  } = {};
  public activeUsers: any[] = [];
  viewRooms: boolean = false;
  // TODO: Display messages in specific chatbox. Use response from ListenToSentByEvent to update the messages in the specific chatbox.

  toggleRooms() {
    this.viewRooms = !this.viewRooms;
    console.log('clicked view rooms');
    this.listenActiveRooms();
  }

  // function to create a new chatroom, this creates a new thread in Map of active rooms in backend
  createRoom() {
    console.log('clicked create room');
    const roomId = `${Math.floor(Math.random() * 1000)}`;
    //const username = 'test';
    this.socketService.emitEvent('create-room', {
      roomId: roomId,
    });
  }

  // pushing users into chatBoxes array when they join a specific room, to loop messages property.
  generateChatroom(roomId: string, username: string) {
    this.chatBoxes.push({ roomId: roomId, username: username, messages: [] });
  }

  // function to join a room by roomId and username of user joining
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
  sendMessage(roomId: string, message: any) {
    this.socketService.emitEvent('send-message', {
      roomId: roomId,
      message: message,
    });
  }

  // function to listen to messages sent by other users in the same room
  listenToSentByEvent() {
    console.log('listening to sent-by event');
    this.socketService.listenEvent('sent-by').subscribe((data: any) => {
      // Handle the received data (e.g., update the UI)
      console.log('Received message:', data);
      // Check if the roomId already exists in the messages object
      if (!this.messages[data.roomId]) {
        this.messages[data.roomId] = []; // Initialize the array if it doesn't exist
      }
      // Push the new message to the corresponding roomId array
      console.log(
        `Before push, messages for roomId ${data.roomId}:`,
        this.messages[data.roomId]
      );
      this.messages[data.roomId].push({
        message: data.message,
        username: data.username,
      });

      console.log(
        `After push, messages for roomId ${data.roomId}:`,
        this.messages[data.roomId]
      );
    });
  }

  // gets all users active in current socket
  getActiveUsers() {
    this.socketService.getActiveUsers().subscribe({
      next: (response) => {
        console.log(response, 'active users');
        this.activeUsers = response;
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
  listenActiveRooms() {
    this.socketService
      .listenEvent('active rooms list')
      .subscribe(
        (
          rooms: { roomId: string; createdBy: string; messages: string[] }[]
        ) => {
          // saving rooms live from socket in allRooms array to get roomId and createdBy from socket to loop it in html template.
          this.allRooms = rooms;
          rooms.forEach((room) => {
            this.generateChatroom(room.roomId, room.createdBy);
          });
          console.log('rooms', rooms);
        }
      );
  }

  ngOnInit() {
    this.getActiveUsers();
    // this.listenActiveRooms();
    this.listenToSentByEvent();
    console.log('Chatroom component initialized');
  }
}
