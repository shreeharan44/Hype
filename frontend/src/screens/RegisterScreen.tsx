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

export const RegisterScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            await register({ email, username, password });
            // Navigation will be handled automatically by auth state change
            navigation.replace('Main');
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
            Alert.alert('Registration Failed', errorMessage);
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
                            Create your account to get started
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
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail-outline"
                        />

                        <InputField
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon="lock-closed-outline"
                        />

                        <InputField
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            icon="lock-closed-outline"
                        />

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            style={styles.button}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginLink}>Login</Text>
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
        marginBottom: 40,
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
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 8,
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
    },
    loginLink: {
        color: colors.primary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
});
