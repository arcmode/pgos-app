export interface Order {
  coffee: string;
  method: string;
  numberOfCases: number;
  order: number;
  packetsPerCase: number;
  priority: boolean;
  shipDate: string;
}

export type Orders = readonly Order[];

export interface State {
  orders: Orders;
}

const INITIAL_STATE: State = {
  orders: [],
};

interface OrdersPageAction {
  type: 'PGOS_ORDERS_PAGE';
  payload: Orders;
}

type Action = OrdersPageAction;

export const reducer = (state = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case 'PGOS_ORDERS_PAGE':
      return {
        ...state,
        orders: action.payload,
      };
    default:
      return state;
  }
};
