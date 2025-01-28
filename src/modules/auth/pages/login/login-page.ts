import { PageController } from '@open-cells/page-controller';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import style from './login-page.style.scss?inline';

import { localApi } from '../../../../api/localApi';
import { encodeText } from '../../../shared/utils';
import { PATHS } from '../../../shared/paths';
import { PublishChannel, publishChannel } from '../../../shared/decorators';
import { NOTIFICATION_CHANNEL } from '../../../notifications/channels';
import { NotificationEmit } from '../../../notifications/types';
import { AuthController } from '../../controllers/AuthController';

import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/button/sp-button.js';

@customElement('login-page')
export class LoginPage extends LitElement {
  pageController = new PageController(this);

  authController = new AuthController(this);

  static styles = unsafeCSS(style);

  @query('#email')
  emailElement!: any;

  @query('#password')
  passwordElement!: any;

  @state()
  isLoading: boolean = false;

  @publishChannel(NOTIFICATION_CHANNEL)
  notification!: PublishChannel<NotificationEmit>;

  render() {
    if (this.authController.isAuthenticate) {
      this.pageController.navigate(PATHS.dashboard, { page: 'home' });

      return;
    }

    return html`
      <div id="container">
        <p>Iniciar sesión</p>
        <form>
          <div>
            <sp-field-label for="email">Correo</sp-field-label>
            <sp-textfield id="email" type="email" quiet></sp-textfield>
          </div>

          <div>
            <sp-field-label for="password">Contraseña</sp-field-label>
            <sp-textfield id="password" type="password" quiet></sp-textfield>
          </div>

          <sp-button @click=${this.handleSubmit} ?pending=${this.isLoading}
            >Iniciar sesión</sp-button
          >
        </form>
      </div>
    `;
  }

  async handleSubmit() {
    this.isLoading = true;

    try {
      const email = await encodeText(this.emailElement.value);
      const password = await encodeText(this.passwordElement.value);

      await localApi.login(email, password);

      localStorage.setItem('user', `${email}:${password}`);

      this.pageController.navigate(PATHS.dashboard, { page: 'home' });
    } catch (error) {
      this.notification({ element: this, message: (error as Error).message, variant: 'error' });
    } finally {
      this.isLoading = false;
    }
  }
}
