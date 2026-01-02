export interface User {
    user_id: number;
    username: string;
    email: string;
    wallet_address: string | null;
    vault_address: string | null;
    balance: number;
    created_at: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user_id: number;
    username: string;
    wallet_address: string | null;
}

export interface RegisterResponse {
    access_token: string;
    token_type: string;
    user_id: number;
    username: string;
    wallet_address: string | null;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
