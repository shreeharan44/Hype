import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, InputField } from '../components';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            await login({ username, password });
            // Navigation will be handled automatically by auth state change
            navigation.replace('Main');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#000000', '#000000']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.logo}>HyPe</Text>
                        <Text style={styles.subtitle}>
                            Welcome back! Login to continue
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <InputField
                            label="Username"
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            icon="person-outline"
                        />

                        <InputField
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon="lock-closed-outline"
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.button}
                        />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register')}
                            >
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: typography.fontSizes.sm,
    },
    button: {
        marginBottom: 24,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
    },
    registerLink: {
        color: colors.primary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
});
