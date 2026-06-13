import { createAsyncThunk } from "@reduxjs/toolkit";
import { History, LocationState } from "history";

import {
    OrderError,
    OrderItemResponse,
    OrderRequest,
    OrderResponse
} from "../../types/types";

import RequestService from "../../utils/request-service";

import { ORDER } from "../../constants/urlConstants";
import { ORDER_FINALIZE } from "../../constants/routeConstants";

/* =========================
   FETCH USER ORDERS
========================= */
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (page: number, thunkApi) => {

        try {

            const response = await RequestService.get(
                `${ORDER}?page=${page}`,
                true
            );

            return response.data;

        } catch (error: any) {

            return thunkApi.rejectWithValue(
                error.response.data
            );
        }
    }
);

/* =========================
   FETCH ORDER BY ID
========================= */
export const fetchOrderById = createAsyncThunk<
    OrderResponse,
    string,
    { rejectValue: string }
>(
    "order/fetchOrderById",
    async (orderId, thunkApi) => {

        try {

            const response = await RequestService.get(
                `${ORDER}/${orderId}`,
                true
            );

            return response.data;

        } catch (error: any) {

            return thunkApi.rejectWithValue(
                error.response.data
            );
        }
    }
);

/* =========================
   FETCH ORDER ITEMS
========================= */
export const fetchOrderItemsByOrderId = createAsyncThunk<
    Array<OrderItemResponse>,
    string
>(
    "order/fetchOrderItemsByOrderId",
    async (orderId) => {

        const response = await RequestService.get(
            `${ORDER}/${orderId}/items`,
            true
        );

        return response.data;
    }
);

/* =========================
   ADD ORDER
========================= */
export const addOrder = createAsyncThunk<
    OrderResponse,
    {
        order: OrderRequest;
        history: History<LocationState>;
    },
    { rejectValue: OrderError }
>(
    "order/addOrder",
    async ({ order, history }, thunkApi) => {

        try {

            const response = await RequestService.post(
                ORDER,
                order,
                true
            );

            localStorage.removeItem("perfumes");

            history.push(ORDER_FINALIZE);

            return response.data;

        } catch (error: any) {

            return thunkApi.rejectWithValue(
                error.response.data
            );
        }
    }
);