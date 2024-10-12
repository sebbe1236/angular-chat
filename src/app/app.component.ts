import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SocketService } from './services/socket-service.service';
import { io } from 'socket.io-client';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'WebSocket Test';
  message = '';
  error: any = null;
  connected = false;

  ngOnInit() {}
}
