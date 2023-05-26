export type HttpResponse<T> = {
  data?: T;
  errors?: unknown;
};

/**
 * This is a workaround to fix the issue that
 * `nestia` does not generate the right types
 * when we use generic types in the response model.
 * It creates something like `DataResponse_lt_T_gt_`,
 * which is not ideal although it shows the right type
 * when you expand the schema in Swagger UI.
 */
export interface TextResponse extends HttpResponse<string> {}
