import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  image?: string;
  products?: Product[];
}

export interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

export const baseUrl = "http://localhost:3000";

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetch-all", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Category[]>(`${baseUrl}/api/categories`);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch categories"
    );
  }
});

export const createCategory = createAsyncThunk<
  Category,
  {
    name: string;
    description?: string;
    image: string;
    slug: string;
    parentId?: number;
    products: Product[];
  },
  { rejectValue: string }
>("categories/add", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post<Category>(
      `${baseUrl}/api/categories`,
      payload
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add category"
    );
  }
});

export const getCategoryById = createAsyncThunk<
  Category,
  { id: number },
  { rejectValue: string }
>("categories/fetch-by-id", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.get<Category>(
      `${baseUrl}/api/categories/${payload.id}`
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch category"
    );
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  {
    id: number;
    name: string;
    description?: string;
    image: string;
    slug: string;
    parentId?: number;
    products: Product[];
  },
  {
    rejectValue: string;
  }
>("categories/update", async (payload, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = payload;
    const res = await axios.put<Category>(
      `${baseUrl}/api/categories/${id}`,
      updateData
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update category"
    );
  }
});

export const deleteCategory = createAsyncThunk<
  number,
  {
    id: string;
  },
  { rejectValue: string }
>("categories/delete", async (payload, { rejectWithValue }) => {
  try {
    await axios.delete<void>(`${baseUrl}/api/categories/${payload.id}`);
    return Number(payload.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete Category"
    );
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.items = action.payload;
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch By Id
    builder.addCase(getCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getCategoryById.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      }
    );
    builder.addCase(getCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.items.push(action.payload);
      }
    );

    // Update
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    );

    // Delete
    builder.addCase(
      deleteCategory.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      }
    );
  },
});

export default categoriesSlice.reducer;
