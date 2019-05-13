export * from '@webcomponents/webcomponentsjs';
export * from './components/orders-table';
export * from './components/orders-page';
export * from './components/order-dialog'; // @ts-ignore

import { Router } from '@vaadin/router';
const outlet = document.getElementById('outlet');
const router = new Router(outlet);
const POPSTATE = Router.NavigationTrigger.POPSTATE;
Router.setTriggers(POPSTATE);
router.setRoutes([
  {
    path: '/',
    children: [
      {
        path: '/:page?',
        component: 'pgos-orders-page',
      },
    ],
  },
]);
