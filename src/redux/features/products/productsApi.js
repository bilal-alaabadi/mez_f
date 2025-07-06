import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({ page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        }).toString();

        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: {
          ...newProduct,
          date: new Date(newProduct.date).toISOString(),
          deliveryDate: new Date(newProduct.deliveryDate).toISOString(),
          returnDate: new Date(newProduct.returnDate).toISOString()
        },
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
    }),

    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `update-product/${id}`,
        method: "PATCH",
        body: {
          ...body,
          date: body.date ? new Date(body.date).toISOString() : undefined,
          deliveryDate: body.deliveryDate ? new Date(body.deliveryDate).toISOString() : undefined,
          returnDate: body.returnDate ? new Date(body.returnDate).toISOString() : undefined
        },
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery
} = productsApi;

export default productsApi;