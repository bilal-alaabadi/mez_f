import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (!isExist) {
        state.products.push({ 
          ...action.payload, 
          quantity: 1,
          url: `/product/${action.payload._id}` // إضافة رابط المنتج
        });
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
    },
    updateQuantity: (state, action) => {
      state.products = state.products.map((product) => {
        if (product._id === action.payload.id) {
          if (action.payload.type === 'increment') {
            product.quantity += 1;
          } else if (action.payload.type === 'decrement' && product.quantity > 1) {
            product.quantity -= 1;
          }
        }
        return product;
      });

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter((product) => product._id !== action.payload.id);
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
    }
  },
});

// دوال المساعدة
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce((total, product) => total + (product.quantity * product.price), 0);

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;