import { ReactiveController, ReactiveControllerHost } from 'lit';

export class AuthController implements ReactiveController {
  isAuthenticate: boolean | undefined;

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.isAuthenticate = true;
    }
  }
}
