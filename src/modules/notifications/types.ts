import { ToastVariants } from '@spectrum-web-components/toast';

export type NotificationEmit = {
  element: HTMLElement;
  message: string;
  variant?: ToastVariants;
};
