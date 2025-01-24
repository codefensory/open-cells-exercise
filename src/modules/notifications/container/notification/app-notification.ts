import { ToastVariants } from '@spectrum-web-components/toast';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators';
import { channel } from '../../../shared/decorators';
import { NotificationEmit } from '../../types';

@customElement('app-notification')
export class AppNotificacion extends LitElement {
  static styles = css`
    .alerts {
      width: 100vw;
      text-align: center;
      position: fixed;
      bottom: 0;
      display: flex;
      flex-direction: column;
    }

    .alerts sp-toast {
      margin: 0 auto 24px;
    }
  `;

  @state()
  private alerts: Map<
    HTMLElement,
    {
      count: number;
      message: string;
      variant: ToastVariants;
      element: (count: number, message: string, variant: ToastVariants) => TemplateResult;
    }
  > = new Map();

  render() {
    return html`
      ${this.alerts.size
        ? html`
            <div class="alerts" role="region">
              ${[...this.alerts.values()].map(alert =>
                alert.element(alert.count, alert.message, alert.variant ?? 'info'),
              )}
            </div>
          `
        : html``}
    `;
  }

  @channel('notification')
  handleAlert(value: NotificationEmit) {
    const target = value.element;

    if (!this.alerts.has(target)) {
      const close = () => {
        this.alerts.delete(target);
        target.focus();
        this.requestUpdate();
      };
      this.alerts.set(target, {
        count: 0,
        message: '',
        variant: '',
        /**
         * <sp-toast> does not allow a `timeout` of less that 6000 use this as a cheat to reset the
         * timeout to 6000 for every additional alert.
         */

        element: (count: number, message: string, variant: ToastVariants) => {
          import('@spectrum-web-components/toast/sp-toast.js');
          return html`
            <sp-toast .timeout=${count} variant=${variant} @close=${close} open>
              ${message} ${count > 1 ? `(${count} alerts)` : ''}
            </sp-toast>
          `;
        },
      });
    }

    const alert = this.alerts.get(target);

    this.alerts.set(target, {
      element: alert!.element,
      count: alert!.count + 1,
      variant: value.variant ?? 'info',
      message: value.message,
    });

    this.requestUpdate();
  }
}
