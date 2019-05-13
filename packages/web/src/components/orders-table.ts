import { LitElement, html, customElement, property } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
import { Orders, Order, State } from '../redux/reducer';
import { AnyAction, Store } from 'redux';
import { TemplateResult } from 'lit-html';

@customElement('pgos-orders-table')
export class OrdersTable extends connect(store as Store<State, AnyAction>)(LitElement) {
  @property()
  items: Orders = [];

  stateChanged(state: { orders: Orders }): void {
    this.items = state.orders;
    this.requestUpdate();
  }

  render(): TemplateResult {
    return html`
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Coffee</th>
            <th>Method</th>
            <th>Number of Cases</th>
            <th>Packets per Case</th>
            <th>Priority</th>
            <th>Ship Date</th>
          </tr>
        </thead>

        <tbody>
          ${this.items.map(renderItem)}
        </tbody>

        <tbody></tbody>
      </table>

      <button @click="${this.onPrev}">Prev</button>
      <button @click="${this.onNext}">Next</button>
    `;
  }

  onPrev(e: Event): void {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('PGOS_TABLE_PREV', {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  onNext(e: Event): void {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('PGOS_TABLE_NEXT', {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }
}

function renderItem(item: Order): TemplateResult {
  return html`
    <tr title="Order #${item.order}">
      <td>${item.order}</td>
      <td>${item.coffee}</td>
      <td>${item.method}</td>
      <td>${item.numberOfCases}</td>
      <td>${item.packetsPerCase}</td>
      <td>${item.priority}</td>
      <td>${item.shipDate}</td>
    </tr>
  `;
}
