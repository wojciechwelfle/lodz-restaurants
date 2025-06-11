import type IRestaurant from "./IRestaurant";

export default interface IPaginatedResponse {
  content: IRestaurant[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
  size: number;
}
