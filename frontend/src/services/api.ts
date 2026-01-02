import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, User } from '../types/auth';
import { BalanceResponse, DepositRequest, DepositResponse, WithdrawRequest, WithdrawResponse, SendRequest, SendResponse, TransactionHistoryResponse } from '../types/payment';

// Backend URL - Update based on your environment
// IMPORTANT: 0.0.0.0 is for server binding only, NOT for client connections!
// 
// Choose the correct URL for your platform:
// For Android Emulator: http://10.0.2.2:8000
// For iOS Simulator: http://localhost:8000  
// For Physical Device: Use your computer's IP address (e.g., http://192.168.1.x:8000)
// Backend is running on http://0.0.0.0:8000 (server-side binding)

// Change this based on your platform:
const BASE_URL = 'http://0.0.0.0:8000'; // Change to 'http://10.0.2.2:8000' for Android Emulator

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            await AsyncStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        // Backend expects form-data for login
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const paymentService = {
    getBalance: async (): Promise<BalanceResponse> => {
        const response = await api.get('/payment/balance');
        return response.data;
    },

    deposit: async (amount: number, currency: string = 'USD'): Promise<DepositResponse> => {
        const response = await api.post('/payment/deposit', {
            amount,
            currency,
        });
        return response.data;
    },

    withdraw: async (amount: number, currency: string = 'USD'): Promise<WithdrawResponse> => {
        const response = await api.post('/payment/withdraw', {
            amount,
            currency,
        });
        return response.data;
    },

    send: async (recipientUsername: string, amount: number): Promise<SendResponse> => {
        const response = await api.post('/payment/send', {
            recipient_username: recipientUsername,
            amount,
        });
        return response.data;
    },

    getTransactions: async (): Promise<TransactionHistoryResponse> => {
        const response = await api.get('/payment/transactions');
        return response.data;
    },
};

export default api;

