import { startApp } from '@open-cells/core';
import { routes } from './router/routes';

import './app';

startApp({
  routes,
  mainNode: 'app-content',
  viewLimit: 1,
  interceptor: function (navigation: any): any {
    let intercept = false;
    let redirect;

    if (navigation.to.page === 'dashboard-bad') {
      intercept = true;

      redirect = { page: 'dashboard', params: { page: 'home' } };
    }

    return { intercept, redirect };
  },
});
