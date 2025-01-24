import { parentPath } from './utils';

export const PATHS = {
  dashboard: '/dashboard',
  login: '/login',
  logout: '/logout',
};

export const DASHBOARD_PAGES = {
  home: '/home',
  clients: '/clients',
  createClient: '/create-client',
};

export const DASHBOARD_PATHS = parentPath(PATHS.dashboard, DASHBOARD_PAGES);

export const PATHS_INFORMATION = {
  [PATHS.login]: {
    title: 'Iniciar Sesión',
  },
  [PATHS.logout]: {
    title: 'Cerrar sesión',
  },
  [PATHS.dashboard]: {
    title: 'Inicio',
  },
  [DASHBOARD_PATHS.clients]: {
    title: 'Consulta de clientes',
  },
  [DASHBOARD_PATHS.createClient]: {
    title: 'Crear cliente',
  },
  [PATHS.logout]: {
    title: 'Cerrar sesión',
  },
};
