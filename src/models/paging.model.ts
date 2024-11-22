export class PagingResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
