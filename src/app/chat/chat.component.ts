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
}
