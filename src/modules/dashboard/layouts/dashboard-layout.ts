import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { DASHBOARD_PATHS, PATHS } from '../../shared/paths';

import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import { PageController } from '@open-cells/page-controller';

@customElement('dasboard-layout')
export class DashboardLayout extends LitElement {
  pageController = new PageController(this);

  static styles = css`
    #content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 16px 24px;
    }
  `;

  render() {
    return html`
      <div id="header" role="navigation" style="padding: 3px 10px;">
        <sp-top-nav ignoreURLParts="search">
          <sp-top-nav-item @click=${this.handleNavClick} href="${'#!' + DASHBOARD_PATHS.home}"
            >BBVA</sp-top-nav-item
          >
          <sp-top-nav-item
            @click=${this.handleNavClick}
            href="${'#!' + DASHBOARD_PATHS.clients}"
            style="margin-inline-start: auto;"
          >
            Clientes
          </sp-top-nav-item>
          <sp-top-nav-item
            @click=${this.handleNavClick}
            href="${'#!' + DASHBOARD_PATHS.createClient}"
            >Nuevo Cliente</sp-top-nav-item
          >
          <sp-action-menu style="margin-inline-start: auto;" quiet>
            <sp-menu-item @click=${() => this.pageController.navigate(PATHS.logout)}>
              Cerrar sesión
            </sp-menu-item>
          </sp-action-menu>
        </sp-top-nav>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

  handleNavClick(e: any) {
    e.preventDefault();

    const [_, route, page] = e.target.href.split('/');

    this.pageController.navigate(route, { page });
  }
}
