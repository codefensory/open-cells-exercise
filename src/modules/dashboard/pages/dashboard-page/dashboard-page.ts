import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { DASHBOARD_PAGES, PATHS } from '../../../shared/paths';

import '../../layouts/dashboard-layout';
import '../../../clients/pages/list-clients/list-client';
import '../../../clients/pages/create-client/create-client';
import { AuthController } from '../../../auth/controllers/AuthController';
import '../../../flags/pages/list-flags/list-flags';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  pageController = new PageController(this);

  authController = new AuthController(this);

  @property({ type: Object })
  params: { page?: string } = {};

  render() {
    if (!this.authController.isAuthenticate) {
      this.pageController.navigate(PATHS.login);

      return;
    }

    if (window.location.hash === `#!${PATHS.dashboard}`) {
      this.pageController.navigate(PATHS.dashboard, { page: 'home' });

      return;
    }

    return html`<dasboard-layout> ${this.renderRouter()}</dasboard-layout>`;
  }

  onPageEnter() {}

  renderRouter() {
    switch (`/${this.params.page}`) {
      case DASHBOARD_PAGES.home:
        return html`
          <h1 style="margin: 0; padding: 0;">Bienvenido</h1>
          <p style="font-size: 16px;">
            Interacciona con la barra de navegacion para conocer la pagina
          </p>
        `;
      case DASHBOARD_PAGES.clients:
        return html`<list-clients></list-clients>`;
      case DASHBOARD_PAGES.createClient:
        return html`<create-client></create-client>`;
      case DASHBOARD_PAGES.flags:
        return html`<list-flags></list-flags>`;
      default:
        return html`<h1>Oops! Parece que te perdiste</h1>`;
    }
  }
}
