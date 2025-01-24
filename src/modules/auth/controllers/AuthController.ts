import { ElementController } from '@open-cells/element-controller';
import { ReactiveController, ReactiveControllerHost } from 'lit';

export class AuthController implements ReactiveController {
  isAuthenticate: boolean | undefined;
  elementController: ElementController;

  constructor(host: ReactiveControllerHost) {
    host.addController(this);

    this.elementController = new ElementController(host);
  }

  hostConnected(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.isAuthenticate = true;

      this.elementController.setInterceptorContext({ user: userData });
    }
  }
}
