import { Expose } from 'class-transformer';

export interface PaginatedResponseShape<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export abstract class PaginatedResponseDTO<T> implements PaginatedResponseShape<T> {
  @Expose()
  items!: T[];

  @Expose()
  totalItems!: number;

  @Expose()
  currentPage!: number;

  @Expose()
  totalPages!: number;

  @Expose()
  pageSize!: number;

  @Expose()
  hasNext!: boolean;

  @Expose()
  hasPrevious!: boolean;
}
