import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography } from '../theme';
import { paymentService } from '../services/api';
import { Currency } from '../types/payment';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD'];

export const DepositScreen = ({ navigation }: any) => {
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
    const [isLoading, setIsLoading] = useState(false);

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }

        setIsLoading(true);
        try {
            const response = await paymentService.deposit(parseFloat(amount), selectedCurrency);
            Alert.alert(
                'Deposit Successful',
                `${response.message}\nTransaction Hash: ${response.transaction_hash.substring(0, 10)}...`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Deposit error:', error);
            Alert.alert(
                'Deposit Failed',
                error.response?.data?.detail || 'Failed to process deposit. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Deposit Funds</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Amount Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>{selectedCurrency}</Text>
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                {/* Currency Selector */}
                <View style={styles.currencyContainer}>
                    <Text style={styles.label}>Select Currency</Text>
                    <View style={styles.currencyGrid}>
                        {CURRENCIES.map((currency) => (
                            <TouchableOpacity
                                key={currency}
                                style={[
                                    styles.currencyButton,
                                    selectedCurrency === currency && styles.currencyButtonActive,
                                ]}
                                onPress={() => setSelectedCurrency(currency)}
                            >
                                <Text
                                    style={[
                                        styles.currencyText,
                                        selectedCurrency === currency && styles.currencyTextActive,
                                    ]}
                                >
                                    {currency}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color={colors.primary} />
                    <Text style={styles.infoText}>
                        Funds will be converted to tokens and deposited into your vault. Transaction may take a few seconds to process.
                    </Text>
                </View>

                {/* Deposit Button */}
                <Button
                    title={isLoading ? 'Processing...' : 'Deposit'}
                    onPress={handleDeposit}
                    style={styles.button}
                    disabled={isLoading}
                />
                {isLoading && (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    inputContainer: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        color: colors.primary,
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        padding: 0,
    },
    currencyContainer: {
        marginBottom: 24,
    },
    currencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    currencyButton: {
        backgroundColor: colors.backgroundCard,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    currencyButtonActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    currencyText: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    currencyTextActive: {
        color: colors.primary,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    infoText: {
        flex: 1,
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
        lineHeight: 20,
    },
    button: {
        marginTop: 'auto',
    },
    loader: {
        marginTop: 16,
    },
});
