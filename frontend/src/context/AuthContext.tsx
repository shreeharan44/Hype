import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { User, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                const userData = await authService.getProfile();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            await AsyncStorage.removeItem('access_token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials);
            await AsyncStorage.setItem('access_token', response.access_token);

            // Fetch full user profile after login
            const userData = await authService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            const response = await authService.register(userData);
            await AsyncStorage.setItem('access_token', response.access_token);

            // Fetch full user profile after registration
            const userProfile = await authService.getProfile();
            setUser(userProfile);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
