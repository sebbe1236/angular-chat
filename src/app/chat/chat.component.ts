import { Component, inject } from '@angular/core';
import { SocketService } from '../services/socket-service.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatroomComponent } from '../chatroom/chatroom.component';
@Component({
  selector: 'app-chat',
  imports: [MatButtonModule, MatIconModule, ChatroomComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [SocketService],
})
export class ChatComponent {
  // Create chatroom ui and connect socket when user joins that specific chatroom and not on component level.
  private socketService = inject(SocketService);
  private router = inject(Router);
  constructor() {}

  message: any;
  messages: string[] = [];
  token: any;
  getToken() {
    this.token = localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

  getSocketStatus() {
    console.log(`Socket status is: ${this.socketService.socket.connected}`);
    // return this.socketService.connectSocket();
  }

  ngOnInit() {}
}
