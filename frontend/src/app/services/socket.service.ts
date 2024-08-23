import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private _socket: Socket;
  private _baseUrl: string = environment.api

  constructor() {
    this._socket = io(this._baseUrl);
  }

  register(userId: string) {
    this._socket.emit('register', userId)
  }

  sendMessage(message: any): void {
    // console.log('sendMessage:', message);
    this._socket.emit('newMessage', (message));
  }

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this._socket.on('messageReceived', (data: any) => {
        // console.log('message receives:', data);
        observer.next(data);
      });
    });
  }

  messageSendfromUser(data: any) {
    // console.log('data from user:', data);
    this._socket.emit('newMessage', (data));
  }

  messageSendfromDoctor(data: any) {
    // console.log('data from doctor:', data);
    this._socket.emit('newMessage', (data));
  }
}
