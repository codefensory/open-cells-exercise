import { html, LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { customElement } from 'lit/decorators';
import { AuthController } from '../../modules/auth/controllers/AuthController';
import { PATHS } from '../../modules/shared/paths';

@customElement('home-page')
export class HomePage extends LitElement {
  pageController = new PageController(this);

  auth = new AuthController(this);

  onPageEnter() {
    this.pageController.navigate(this.auth.isAuthenticate ? PATHS.dashboard : PATHS.login);
  }
}
