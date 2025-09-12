import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../categories/categoriesSlice";

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  price: number;
  stock: number;
  unit?: string | null;
  brand?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: Date | null;
  updatedAt: Date;
}

export interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetch-all", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Product[]>(`${baseUrl}/api/products`);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch Product"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  {
    name: string;
    description?: string | null;
    categoryId?: number | null;
    price: number;
    stock: number;
    unit?: string | null;
    brand?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: Date | null;
    updatedAt: Date;
  },
  { rejectValue: string }
>("products/add", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post<Product>(`${baseUrl}/api/products`, payload);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add Product"
    );
  }
});

export const getProductById = createAsyncThunk<
  Product,
  { id: number },
  { rejectValue: string }
>("products/fetch-by-id", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.get<Product>(
      `${baseUrl}/api/products/${payload.id}`
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch Product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  {
    id: number;
    name: string;
    description?: string | null;
    categoryId?: number | null;
    price: number;
    stock: number;
    unit?: string | null;
    brand?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: Date | null;
    updatedAt: Date;
  },
  {
    rejectValue: string;
  }
>("products/update", async (payload, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = payload;
    const res = await axios.put<Product>(
      `${baseUrl}/api/products/${id}`,
      updateData
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update Product"
    );
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  {
    id: string;
  },
  { rejectValue: string }
>("products/delete", async (payload, { rejectWithValue }) => {
  try {
    await axios.delete<void>(`${baseUrl}/api/products/${payload.id}`);
    return Number(payload.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete Product"
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch By Id
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      }
    );
    builder.addCase(getProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add
    builder.addCase(
      createProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      }
    );

    // Update
    builder.addCase(
      updateProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    );

    // Delete
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      }
    );
  },
});

export default productsSlice.reducer;
