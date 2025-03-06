import { Component, inject } from '@angular/core';
import { SocketService } from '../services/socket-service.service';
import { AuthService } from '../services/auth-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-chatroom',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css',
  providers: [SocketService, AuthService],
})
export class ChatroomComponent {
  private socketService = inject(SocketService);
  private authService = inject(AuthService);

  // creation of chatroom ui and connection to socket when user joins that specific chatroom and not on component level goes here.
  createRoom() {
    // creation of new chatroom by user by generating a id for the room and sending to backend
    console.log('clicked create room');
    const roomId = `${Math.floor(Math.random() * 1000)}`;
    this.socketService.emitEvent('create-room', {
      room_id: roomId,
    });
  }

  getActiveUsers() {
    this.socketService.getActiveUsers().subscribe({
      next: (response) => {
        console.log(response, 'active users');
      },
      error: (error) => {
        console.log(error, 'error from active users');
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  ngOnInit() {
    console.log('ngonintit called');
    this.getActiveUsers();
    console.log('Chatroom component initialized');
  }
}
