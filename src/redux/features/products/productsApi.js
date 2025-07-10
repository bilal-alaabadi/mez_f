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

    // جلب جميع المنتجات بدون pagination
    getAllProducts: builder.query({
      query: () => '/',
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

    // جلب منتجات ذات صلة
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // تحديث المنتج
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
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
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

    // جلب أحدث المنتجات
    fetchLatestProducts: builder.query({
      query: (limit = 8) => `/latest?limit=${limit}`,
      providesTags: ["Products"],
    }),
  }),
});

// تصدير جميع hooks
export const {
  useFetchAllProductsQuery,
  useGetAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useFetchLatestProductsQuery,
} = productsApi;

export default productsApi;