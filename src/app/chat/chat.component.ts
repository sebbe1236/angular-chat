import { Component } from '@angular/core';
import { SocketService } from '../services/socket-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  constructor(private socketService: SocketService) {}
  message: any;
  messages: string[] = [];

  getSocketStatus() {
    return this.socketService.connectSocket();
  }

  ngOnInit() {
    this.getSocketStatus();
  }

  // getMessages() {
  //   this.socketService.onMessage().subscribe({
  //     next: (message) => {
  //       console.log('Received message from', message);
  //       this.messages.push(`pushed ${message} into array`);
  //     },
  //     error: (error: any) => {
  //       console.error('Error:', error);
  //     },
  //     complete: () => {
  //       console.log('Connection closed, complete block');
  //     },
  //   });
  // }

  // sendMessage() {
  //   this.socketService.sendMessage(this.message);
  //   this.message = '';
  // }

  // ngOnInit() {
  //   this.getMessages();
  // }
}
