export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function normalizePagination(query: PaginationQuery): NormalizedPagination {
  const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}
