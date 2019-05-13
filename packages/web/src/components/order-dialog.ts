import { LitElement, html, customElement, css } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
import { Order } from '../redux/reducer';
import { Omit } from '../types/shared';

enum Coffee {
  BELLA_DONOVAN = 'BELLA_DONOVAN',
  GIANT_STEPS = 'GIANT_STEPS',
}

enum CoffeeLabel {
  BELLA_DONOVAN = 'Bella Donovan',
  GIANT_STEPS = 'Giant Steps',
}

enum PacketsPerCase {
  TWENTY_FIVE = 25,
  FIFTY = 50,
}

function packetsPerCaseLabel(ppc: PacketsPerCase) {
  switch (ppc) {
    case PacketsPerCase.TWENTY_FIVE:
      return 'Twenty five (25)';
    case PacketsPerCase.FIFTY:
      return 'Fifty (50)';
  }
}

enum Method {
  AEROPRESS = 'AEROPRESS',
  COFFEE_MAKER = 'COFFEE_MAKER',
  COLD_BREW = 'COLD_BREW',
  FRENCH_PRESS = 'FRENCH_PRESS',
  POUR_OVER = 'POUR_OVER',
}

enum MethodLabel {
  AEROPRESS = 'Aeropress',
  COFFEE_MAKER = 'Coffee Maker',
  COLD_BREW = 'Cold Brew',
  FRENCH_PRESS = 'French Press',
  POUR_OVER = 'Pour Over',
}

@customElement('pgos-order-dialog')
export class OrdersModal extends connect(store)(LitElement) {
  static styles = css`
    dialog {
      position: fixed;
      top: 162px;
    }
  `;

  render() {
    return html`
      <dialog open>
        <form @submit="${this.submit}" method="post">
          <fieldset>
            <legend>Create Order</legend>

            <select name="coffee" id="coffee">
              ${renderCoffeeOptions()}
            </select>
            <select name="method" id="method">
              ${renderMethodOptions()}
            </select>
            <input type="number" min="0" name="numberOfCases" id="numberOfCases" placeholder="N. of Cases" />
            <input type="date" required name="shipDate" id="shipDate" placeholder="Ship date" />
            <select name="packetsPerCase" id="packetsPerCase">
              ${renderPacksPerCaseOptions()}
            </select>
            <input type="checkbox" name="priority" id="priority" />Priority<br />
          </fieldset>
          <br />
          <button>Ok</button>
        </form>
        <button @click="${() => this.close()}">Close</button>
      </dialog>
    `;
  }

  async submit(event: Event) {
    event.preventDefault();
    const { shadowRoot } = this;
    if (!shadowRoot) return false;
    const order = {
      coffee: (shadowRoot.getElementById('coffee') as HTMLSelectElement).value,
      method: (shadowRoot.getElementById('method') as HTMLSelectElement).value,
      numberOfCases: Number((shadowRoot.getElementById('numberOfCases') as HTMLInputElement).value),
      packetsPerCase: Number((shadowRoot.getElementById('packetsPerCase') as HTMLSelectElement).value),
      priority: Boolean((shadowRoot.getElementById('priority') as HTMLInputElement).checked),
      shipDate: (shadowRoot.getElementById('shipDate') as HTMLInputElement).value,
    };
    this.close(order);
    return false;
  }

  close(order?: Omit<Order, 'order'>) {
    this.dispatchEvent(
      new CustomEvent('PGOS_DIALOG_CLOSE', {
        bubbles: true,
        composed: true,
        detail: { order },
      }),
    );
  }
}

function renderMethodOptions() {
  return [Method.AEROPRESS, Method.COFFEE_MAKER, Method.COLD_BREW, Method.FRENCH_PRESS, Method.POUR_OVER].map(i =>
    renderMethodOption(i),
  );
}

function renderMethodOption(method: Method) {
  return html`
    <option value="${method}">${MethodLabel[method]}</option>
  `;
}

function renderPacksPerCaseOptions() {
  return [PacketsPerCase.TWENTY_FIVE, PacketsPerCase.FIFTY].map(i => renderPacketsPerCaseOption(i));
}

function renderPacketsPerCaseOption(packetsPerCase: PacketsPerCase) {
  return html`
    <option value="${packetsPerCase}">${packetsPerCaseLabel(packetsPerCase)}</option>
  `;
}

function renderCoffeeOptions() {
  return [Coffee.BELLA_DONOVAN, Coffee.GIANT_STEPS].map(i => renderCoffeeOption(i));
}

function renderCoffeeOption(coffee: Coffee) {
  return html`
    <option value="${coffee}">${CoffeeLabel[coffee]}</option>
  `;
}
