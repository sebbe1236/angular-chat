import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket!: Socket;
  private socketUrl: string = environment.socketUrl;
  public messages$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor() {
    this.connect();
  }

  // connect to server and authenticate the user with token
  private connect(): void {
    const token = localStorage.getItem('token');

    this.socket = io(this.socketUrl, {
      path: '/chat',
      auth: {
        token: token,
      },
      transports: environment.transport, // Force WebSocket transport
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.connected);
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server:', this.socket.disconnected);
    });

    this.socket.on('token verified', (isValidToken: boolean) => {
      console.log('Token verified:', isValidToken);
      if (isValidToken) {
        console.log('Token is valid');
      } else {
        this.socket.disconnect();
        console.log('Token is invalid');
      }
    });
  }

  getActiveUsers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('active users', (activeUsers: any) => {
        observer.next(activeUsers);
        console.log('Active users:', activeUsers);
      });
      // return () => {
      //   console.log('Unsubscribing from active users list in socket');
      //   this.socket.off('active Users');
      // };
    });
  }
  // Listen to events from server
  listenEvent(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
      return () => {
        console.log('Unsubscribing from event in socket');
        this.socket.off(event);
      };
    });
  }

  // Send events to server
  emitEvent(event: string, data: any): void {
    console.error('Emitting event:', event, 'with data:', data);
    this.socket.emit(event, data);
  }
}
