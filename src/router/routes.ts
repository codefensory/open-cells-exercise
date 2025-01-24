import { RouteDefinition } from '@open-cells/core/types';
import { PATHS, PATHS_INFORMATION } from '../modules/shared/paths';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => {
      await import('../pages/home/home-page');
    },
  },
  {
    path: PATHS.login,
    name: 'login',
    component: 'login-page',
    action: async () => {
      await import('../modules/auth/pages/login/login-page');
    },
  },
  {
    path: PATHS.logout,
    name: 'logout',
    component: 'logout-page',
    action: async () => {
      await import('../modules/auth/pages/logout/logout-page');
    },
  },
  {
    path: `${PATHS.dashboard}/:page`,
    name: 'dashboard',
    component: 'dashboard-page',
    action: async () => {
      await import('../modules/dashboard/pages/dashboard-page/dashboard-page');
    },
  },
  {
    path: `${PATHS.dashboard}`,
    name: 'dashboard-bad',
    component: 'dashboard-page',
    action: async () => {
      await import('../modules/dashboard/pages/dashboard-page/dashboard-page');
    },
  },
];
