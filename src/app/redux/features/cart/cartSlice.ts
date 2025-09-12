import { Product } from "@/app/lib/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Cart item interface
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product?: Product;
}

// Cart interface
export interface Cart {
  id: number;
  userId: number;
  createdAt: string; // Changed from Date to string for serialization
  items?: CartItem[];
}

// Cart state interface
interface CartState {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const addItem = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { rejectValue: string }
>("cart/addItem", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}/api/cart`, payload);
    return res.data as CartItem;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || "Failed to add product to cart"
    );
  }
});

export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/api/cart`);
      return res.data as Cart;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const updateItemQuantity = createAsyncThunk<
  CartItem,
  { itemId: number; quantity: number },
  { rejectValue: string }
>("cart/updateItemQuantity", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${baseUrl}/api/cart/${payload.itemId}`, {
      quantity: payload.quantity,
    });
    return res.data as CartItem;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || "Failed to update cart item"
    );
  }
});

export const removeItem = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/removeItem", async (itemId, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/api/cart/${itemId}`);
    return itemId;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove cart item"
    );
  }
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/api/cart/clear`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add item
    builder
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === action.payload.productId
        );

        if (existingItemIndex !== -1) {
          // Replace existing item with updated one from API
          state.items[existingItemIndex] = action.payload;
        } else {
          // Add new item
          state.items.push(action.payload);
        }
      })
      .addCase(addItem.rejected, (state, action) => {
        console.error("addItem rejected:", action.payload, action.error);
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to add item to cart";
      });

    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch cart";
      });

    // Update item quantity
    builder
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update item quantity";
      });

    // Remove item
    builder
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to remove item";
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.cart = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to clear cart";
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
