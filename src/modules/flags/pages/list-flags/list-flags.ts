import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { QueryController } from '../../../shared/libs/query-core/QueryController';

import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/progress-bar/sp-progress-bar.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sync/sp-picker.js';

import styles from './list-flags.style.scss?inline';

const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

async function getFlags(options: { queryKey: any[] }) {
  const [_, region] = options.queryKey;
  const baseUrl = 'https://restcountries.com/v3.1';
  const url =
    region && region !== 'All' ? `${baseUrl}/region/${region.toLowerCase()}` : `${baseUrl}/all`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }

  return response.json();
}

@customElement('list-flags')
export class ListFlags extends LitElement {
  static styles = unsafeCSS(styles);

  @state()
  selectedRegion: string = 'All';

  private flags = new QueryController(this, () => ['flags', this.selectedRegion], getFlags);

  private handleRegionChange(e: any) {
    this.selectedRegion = e.target.value;
  }

  render() {
    return html`
      <div class="flags-container">
        <div class="filters">
          <sp-picker
            id="picker-m"
            size="m"
            label="Filter by Region"
            value=${this.selectedRegion}
            @change=${this.handleRegionChange}
          >
            ${REGIONS.map(region => html`<sp-menu-item value=${region}>${region}</sp-menu-item>`)}
          </sp-picker>
        </div>

        <sp-table>
          <sp-table-head>
            <sp-table-head-cell>Flag</sp-table-head-cell>
            <sp-table-head-cell>Country</sp-table-head-cell>
            <sp-table-head-cell>Capital</sp-table-head-cell>
            <sp-table-head-cell>Region</sp-table-head-cell>
            <sp-table-head-cell>Population</sp-table-head-cell>
          </sp-table-head>
          <sp-table-body>
            ${this.flags.render({
              pending: () => html`
                <sp-table-row>
                  <sp-table-cell colspan="5">
                    <div class="loading">
                      <sp-progress-bar
                        aria-label="Loading countries"
                        indeterminate
                      ></sp-progress-bar>
                    </div>
                  </sp-table-cell>
                </sp-table-row>
              `,
              error: error => html`
                <sp-table-row>
                  <sp-table-cell colspan="5">
                    <div class="error">Error loading countries: ${error.message}</div>
                  </sp-table-cell>
                </sp-table-row>
              `,
              success: countries =>
                countries.map(
                  (country: any) => html`
                    <sp-table-row>
                      <sp-table-cell>
                        <img
                          src=${country.flags.svg}
                          alt=${country.flags.alt || `Flag of ${country.name.common}`}
                          class="flag-image"
                        />
                      </sp-table-cell>
                      <sp-table-cell>${country.name.common}</sp-table-cell>
                      <sp-table-cell>${country.capital?.[0] || 'N/A'}</sp-table-cell>
                      <sp-table-cell>${country.region}</sp-table-cell>
                      <sp-table-cell>${country.population.toLocaleString()}</sp-table-cell>
                    </sp-table-row>
                  `,
                ),
            })}
          </sp-table-body>
        </sp-table>
      </div>
    `;
  }
}
