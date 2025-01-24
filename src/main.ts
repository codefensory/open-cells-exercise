import { publish, startApp } from '@open-cells/core';
import { routes } from './router/routes';

import './app';
import { ToastVariants } from '@spectrum-web-components/toast';

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

declare global {
  interface Window {
    notification(el: HTMLElement, message: string, variant?: ToastVariants): void;
  }
}

window.notification = (el: HTMLElement, message: string, variant?: ToastVariants) => {
  publish('notification', { element: el, detail: { message, variant } });
};
