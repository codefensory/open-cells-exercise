import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ElementController } from '@open-cells/element-controller';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import './modules/notifications/container/notification/app-notification';

@customElement('app-index')
export class AppIndex extends LitElement {
  elementController = new ElementController(this);

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
    }

    main {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    main ::slotted(*) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
    }

    main ::slotted([state='active']) {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }
  `;

  render() {
    return html`
      <main role="main" tabindex="-1">
        <sp-theme system="spectrum" color="light" scale="medium">
          <slot></slot>
          <app-notification></app-notification>
        </sp-theme>
      </main>
    `;
  }
}
