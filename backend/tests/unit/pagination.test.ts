import { buildPaginationMeta, normalizePagination } from "../../src/utils/pagination";

describe("normalizePagination", () => {
  it("defaults to page 1, limit 20 when nothing is provided", () => {
    const result = normalizePagination({});
    expect(result).toEqual({ page: 1, limit: 20, skip: 0, take: 20 });
  });

  it("computes correct skip/take for a given page and limit", () => {
    const result = normalizePagination({ page: "3", limit: "10" });
    expect(result).toEqual({ page: 3, limit: 10, skip: 20, take: 10 });
  });

  it("clamps limit to the maximum of 100", () => {
    const result = normalizePagination({ limit: "5000" });
    expect(result.limit).toBe(100);
  });

  it("falls back to page 1 for invalid/negative input", () => {
    const result = normalizePagination({ page: "-5", limit: "abc" });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});

describe("buildPaginationMeta", () => {
  it("reports hasNextPage/hasPrevPage correctly in the middle of a result set", () => {
    const meta = buildPaginationMeta(2, 10, 35);
    expect(meta).toEqual({
      page: 2,
      limit: 10,
      total: 35,
      totalPages: 4,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });

  it("reports hasNextPage=false on the last page", () => {
    const meta = buildPaginationMeta(4, 10, 35);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPrevPage).toBe(true);
  });
});
