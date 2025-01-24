import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators';

import { QueryController } from '../../../shared/libs/query-core/QueryController';
import { getClients } from '../../services/clientsServices';

import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/infield-button/sp-infield-button.js';
import '@spectrum-web-components/progress-bar/sp-progress-bar.js';

import styles from './list-client.style.scss?inline';

@customElement('list-clients')
export class ListClients extends LitElement {
  static styles = unsafeCSS(styles);

  @state()
  currentPage: number = 0;

  @state()
  totalPages: number = 10; // Ajusta esto según tus necesidades

  private clients = new QueryController(this, () => ['clients', this.currentPage], getClients);

  handlePreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  handleNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  render() {
    return html`
      <div class="container">
        <sp-table>
          <sp-table-head>
            <sp-table-head-cell>ID</sp-table-head-cell>
            <sp-table-head-cell>Nombre</sp-table-head-cell>
            <sp-table-head-cell>Apellido</sp-table-head-cell>
            <sp-table-head-cell style="min-width: 250px">Email</sp-table-head-cell>
            <sp-table-head-cell>Ciudad</sp-table-head-cell>
          </sp-table-head>
          <sp-table-body>
            ${this.clients.render({
              pending: () => html`
                <sp-table-row>
                  <sp-table-cell style="min-width: 100%; max-with: 100%">
                    <div id="loading">
                      <sp-progress-bar
                        aria-label="Loaded an unclear amount"
                        indeterminate
                      ></sp-progress-bar>
                    </div>
                  </sp-table-cell>
                </sp-table-row>
              `,
              success: clients =>
                clients.data.map(
                  client => html`
                    <sp-table-row>
                      <sp-table-cell>${client.id}</sp-table-cell>
                      <sp-table-cell>${client.name}</sp-table-cell>
                      <sp-table-cell>${client.lastname}</sp-table-cell>
                      <sp-table-cell style="min-width: 250px; max-with: 250px"
                        >${client.email}</sp-table-cell
                      >
                      <sp-table-cell>${client.city}</sp-table-cell>
                    </sp-table-row>
                  `,
                ),
            })}
          </sp-table-body>
        </sp-table>

        ${this.clients.status === 'success' && this.clients.data
          ? html`
              <div class="pagination">
                <sp-infield-button
                  ?disabled=${this.currentPage === 0}
                  @click=${this.handlePreviousPage}
                >
                  <
                </sp-infield-button>
                <span class="page-info"
                  >Pagina ${this.currentPage + 1} de ${this.clients.data.totalPages}</span
                >
                <sp-infield-button
                  ?disabled=${this.currentPage === this.clients.data.totalPages - 1}
                  @click=${this.handleNextPage}
                >
                  >
                </sp-infield-button>
              </div>
            `
          : null}
      </div>
    `;
  }
}
