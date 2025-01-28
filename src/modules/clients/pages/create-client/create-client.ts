import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import styles from './create-client.style.scss?inline';

import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import { NOTIFICATION_CHANNEL } from '../../../notifications/channels';
import { PublishChannel, publishChannel } from '../../../shared/decorators';
import { NotificationEmit } from '../../../notifications/types';
import { localApi } from '../../../../api/localApi';
import { queryClient } from '../../../shared/libs/query-core/queryClient';

interface ClientForm {
  name: string;
  lastname: string;
  email: string;
  city: string;
}

@customElement('create-client')
export class CreateClient extends LitElement {
  static styles = unsafeCSS(styles);

  @query('form')
  form!: HTMLFormElement;

  @query('#name')
  nameInput!: HTMLInputElement;

  @query('#lastname')
  lastnameInput!: HTMLInputElement;

  @query('#email')
  emailInput!: HTMLInputElement;

  @query('#city')
  cityInput!: HTMLInputElement;

  @state()
  private errors: Partial<Record<keyof ClientForm, string>> = {};

  @state()
  private loading: boolean = false;

  @publishChannel(NOTIFICATION_CHANNEL)
  notificate!: PublishChannel<NotificationEmit>;

  private getFormData(): ClientForm {
    return {
      name: this.nameInput.value,
      lastname: this.lastnameInput.value,
      email: this.emailInput.value,
      city: this.cityInput.value,
    };
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const formData = this.getFormData();
    const newErrors: Partial<Record<keyof ClientForm, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    this.errors = newErrors;

    if (Object.keys(newErrors).length === 0) {
      this.loading = true;

      try {
        await localApi.addClient(formData);

        await queryClient.resetQueries({ queryKey: ['clients'] });

        this.notificate({
          element: this,
          message: 'Usuario creado correctamente',
          variant: 'positive',
        });

        this.resetForm();
      } catch (error) {
        this.notificate({ element: this, message: (error as Error).message, variant: 'error' });
      } finally {
        this.loading = false;
      }
    }
  }

  private resetForm() {
    this.nameInput.value = '';
    this.lastnameInput.value = '';
    this.emailInput.value = '';
    this.cityInput.value = '';
    this.form.reset();

    this.errors = {};
  }

  render() {
    return html`
      <h2>Crear Nuevo Cliente</h2>
      <div class="create-client-container">
        <form @submit=${this.handleSubmit}>
          <div class="form-field">
            <sp-field-label for="name">Nombre</sp-field-label>
            <sp-textfield id="name" ?invalid=${!!this.errors.name}></sp-textfield>
            ${this.errors.name ? html`<div class="error">${this.errors.name}</div>` : ''}
          </div>

          <div class="form-field">
            <sp-field-label for="lastname">Apellido</sp-field-label>
            <sp-textfield id="lastname" ?invalid=${!!this.errors.lastname}></sp-textfield>
            ${this.errors.lastname ? html`<div class="error">${this.errors.lastname}</div>` : ''}
          </div>

          <div class="form-field">
            <sp-field-label for="email">Correo</sp-field-label>
            <sp-textfield id="email" type="email" ?invalid=${!!this.errors.email}></sp-textfield>
            ${this.errors.email ? html`<div class="error">${this.errors.email}</div>` : ''}
          </div>

          <div class="form-field">
            <sp-field-label for="city">Ciudad</sp-field-label>
            <sp-textfield id="city" ?invalid=${!!this.errors.city}></sp-textfield>
            ${this.errors.city ? html`<div class="error">${this.errors.city}</div>` : ''}
          </div>

          <div class="form-actions">
            <sp-button ?pending=${this.loading} type="submit">Crear Cliente</sp-button>
          </div>
        </form>
      </div>
    `;
  }
}
