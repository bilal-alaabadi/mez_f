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
    // جلب جميع المنتجات مع pagination
    fetchAllProducts: builder.query({
      query: ({ page = 1, limit = 10, category }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (category) params.append('category', category);
        
        return `/?${params.toString()}`;
      },
      providesTags: ["Products"],
    }),

    // جلب منتج بواسطة ID
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // إضافة منتج جديد
    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    // تحديث المنتج (معدل)
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-product/${id}`,
        method: "PUT",
        body: formData,
        credentials: "include",
        headers: {
          // لا تضف Content-Type هنا، سيتم تعيينه تلقائياً لـ FormData
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    // حذف المنتج
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // البحث عن المنتجات
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/search',
        params: { q: searchTerm }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery,
} = productsApi;

export default productsApi;