import { connect } from 'pwa-helpers';
import { LitElement, html, customElement } from 'lit-element';
import { loadOrdersPage, createOrder } from '../redux/commands';
import { Store, AnyAction } from 'redux';
import { store as store_ } from '../redux/store';
import { State } from '../redux/reducer';

const store = store_ as Store<State, AnyAction>;

@customElement('pgos-orders-page')
export class OrdersPage extends connect(store)(LitElement) {
  dialog: 'PGOS_ORDER_CREATE' | null = null;

  location = {
    params: {
      page: undefined,
    },
  };

  firstUpdated() {
    this.addEventListener('PGOS_TABLE_NEXT', this.handleNext);
    this.addEventListener('PGOS_TABLE_PREV', this.handlePrev);
    this.addEventListener('PGOS_DIALOG_CLOSE', (event: Event) => {
      this.handleDialog(event as CustomEvent);
    });

    loadOrdersPage(store as Store<State, AnyAction>, Number(this.location.params.page || 0));
  }

  render() {
    return html`
      <a href="#" @click="${this.createOrderDialog}">Create Order</a>
      <pgos-orders-table> </pgos-orders-table>
      ${this.dialog == 'PGOS_ORDER_CREATE' ? this.renderDialog() : null}
    `;
  }

  renderDialog() {
    return html`
      <pgos-order-dialog></pgos-order-dialog>
    `;
  }

  handleNext() {
    const page = Number(this.location.params.page || 0) + 1;
    window.history.pushState({}, '', `/${page}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  handlePrev() {
    const page = Number(this.location.params.page || 0) - 1;
    window.history.pushState({}, '', `/${page}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async handleDialog(event: CustomEvent) {
    if (event.detail.order) {
      await createOrder(store, event.detail.order);
      if (!this.location.params.page || this.location.params.page === '0') {
        await loadOrdersPage(store, 0);
      }
    }
    this.dialog = null;
    this.requestUpdate();
  }

  createOrderDialog() {
    this.dialog = 'PGOS_ORDER_CREATE';
    this.requestUpdate();
  }
}
