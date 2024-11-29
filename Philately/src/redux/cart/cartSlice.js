// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    items: [],  // Array to hold cart items
    totalQuantity: 0,  // Total number of items in the cart
    totalAmount: 0,   // Total price of items in the cart
    isLoading: false,
    error: null,
    isCartVisible: false  
};

export const fetchUserCart = createAsyncThunk(
    'cart/fetchUserCart',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/cart/fetch-cart/${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to save cart
export const saveUserCart = createAsyncThunk(
    'cart/saveUserCart',
    async ({ userId, items }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/cart/save-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, items }),
            });

            if (!response.ok) {
                throw new Error('Failed to save cart');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            
            state.totalQuantity++;

            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            } else {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price
                });
            }

            state.totalAmount += newItem.price;
        },
        
        removeItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.items = state.items.filter(item => item.id !== id);
            }
        },
        
        decreaseItemQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                state.totalQuantity--;
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
                state.totalAmount -= existingItem.price;

                if (existingItem.quantity === 0) {
                    state.items = state.items.filter(item => item.id !== id);
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },

        updateCart: (state, action) => {
            state.items = action.payload.items;
            state.totalQuantity = action.payload.totalQuantity;
            state.totalAmount = action.payload.totalAmount;
        },
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder.addCase(fetchUserCart.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUserCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalQuantity = action.payload.totalQuantity;
            state.totalAmount = action.payload.totalAmount;
            state.isLoading = false;
        });
        builder.addCase(fetchUserCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Save cart
        builder.addCase(saveUserCart.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(saveUserCart.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(saveUserCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
        builder.addCase('/api/auth/signOut', (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        });
    }
});

export const { addItem, removeItem, decreaseItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
