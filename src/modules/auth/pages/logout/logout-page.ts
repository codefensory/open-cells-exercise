import { PageController } from '@open-cells/page-controller';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PATHS } from '../../../shared/paths';

@customElement('logout-page')
export class LogoutPage extends LitElement {
  pageController = new PageController(this);

  onPageEnter() {
    localStorage.removeItem('user');

    this.pageController.navigate(PATHS.login);
  }
}
