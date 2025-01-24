import { localApi } from '../../../api/localApi';

const ITEMS_PER_PAGE = 10; // Número de elementos por página

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getClients(options: { queryKey: any[] }): Promise<PaginatedResponse<any>> {
  const [_, page = 0] = options.queryKey;

  const allClients = await localApi.getClients();

  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedClients = allClients.slice(start, end);

  return {
    data: paginatedClients,
    total: allClients.length,
    totalPages: Math.ceil(allClients.length / ITEMS_PER_PAGE),
    currentPage: page,
  };
}
