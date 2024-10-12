import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private socketUrl: string = environment.socketUrl;
  public messages$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor() {
    this.socket = io(this.socketUrl, {
      path: '/chat',
      transports: environment.transport, // Force WebSocket transport
    });
  }
  connectSocket() {
    this.socket.connect();
    console.log('Connected to socket');
  }

  // emit message to server
  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  public getNewMessage() {
    this.socket.on('message', (message) => {
      this.messages$.next(message);
    });
    return this.messages$.asObservable();
  }

  // listen for messages from server
  onMessage() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on('new-message', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }
}
