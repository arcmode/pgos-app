import { Store } from 'redux';
import { Omit } from '../types/shared';
import { Order } from './reducer';

export async function createOrder(_: Store, order: Omit<Order, 'order'>): Promise<void> {
  await fetch('http://localhost:8080/', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: { ['Content-Type']: 'application/json' },
  });
}

function buildHeaders(offset: number): Record<string, string> {
  return {
    ['X-Pagination-Offset']: String(offset),
  };
}

export async function loadOrdersPage(store: Store, offset?: number): Promise<void> {
  store.dispatch({
    type: 'PGOS_ORDERS_PAGE',
    payload: await (await fetch('http://localhost:8080', {
      headers: offset === undefined ? {} : buildHeaders(offset),
    })).json(),
  });
}
