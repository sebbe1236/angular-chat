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
  public messages$: BehaviorSubject<
    { username: string; message: string; timeStamp: string }[]
  > = new BehaviorSubject<
    { username: string; message: string; timeStamp: string }[]
  >([]);

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

    this.socket.on('user-joined', (data) => {
      console.log('User joined', data);
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

  // get all active users currently in socket
  getActiveUsers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('active users', (activeUsers: any) => {
        observer.next(activeUsers);
      });
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
  // Listen for messages from server
  listenForMessages(): Observable<{
    username: string;
    message: string;
    timeStamp: string;
  }> {
    console.log('Listening for messages from server');
    return new Observable((observer) => {
      this.socket.on(
        'sent-by',
        (message: {
          username: string;
          message: string;
          roomId: string;
          timeStamp: string;
        }) => {
          console.log('Received message:', message);

          // Update the BehaviorSubject with the new message
          this.messages$.next([...this.messages$.getValue(), message]);

          // Notify the observer with the new message
          observer.next(message);
        }
      );

      return () => {
        console.log('Unsubscribing from send-message in socket');
        this.socket.off('send-message');
      };
    });
  }

  // Send events to server
  emitEvent(event: string, data: any): void {
    console.error('Emitting event:', event, 'with data:', data);
    if (!data) {
      console.error('Data is undefined or null');
    } else {
      this.socket.emit(event, data);
    }
  }
}
