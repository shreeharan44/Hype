export interface BalanceResponse {
    balance: number; // Balance in wei (vault balance for backward compatibility)
    balance_usd: number; // Balance in USD (vault balance)
    vault_address: string;
    vault_balance_wei: number; // Explicit vault balance in wei
    vault_balance_usd: number; // Explicit vault balance in USD
    token_balance_wei: number; // Wallet token balance in wei
    token_balance_usd: number; // Wallet token balance in USD
    total_balance_usd: number; // Combined total
}

export interface DepositRequest {
    amount: number;
    currency: string;
}

export interface DepositResponse {
    success: boolean;
    message: string;
    transaction_hash: string;
    balance: number;
}

export interface WithdrawRequest {
    amount: number;
    currency: string;
}

export interface WithdrawResponse {
    success: boolean;
    message: string;
    transaction_hash: string;
    balance: number;
}

export interface SendRequest {
    recipient_username: string;
    amount: number;
}

export interface SendResponse {
    success: boolean;
    message: string;
    transaction_hash: string;
    recipient: string;
    recipient_wallet: string;
    balance: number;
    balance_usd: number;
}

export interface Transaction {
    id: number;
    type: 'SEND' | 'RECEIVE' | 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    currency: string;
    status: string;
    tx_hash: string;
    created_at: string;
    direction?: 'sent' | 'received' | 'deposited' | 'withdrawn';
    recipient_username?: string;
    recipient_wallet?: string;
    sender_username?: string;
    sender_wallet?: string;
}

export interface TransactionHistoryResponse {
    total: number;
    transactions: Transaction[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'CAD';
