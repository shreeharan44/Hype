import React, { useState, useEffect } from 'react';
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

export const WithdrawScreen = ({ navigation }: any) => {
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [balanceUsd, setBalanceUsd] = useState<number>(0);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await paymentService.getBalance();
            setBalance(response.balance);
            setBalanceUsd(response.balance_usd);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }

        if (parseFloat(amount) > balanceUsd) {
            Alert.alert('Insufficient Balance', 'You do not have enough balance to withdraw this amount');
            return;
        }

        setIsLoading(true);
        try {
            const response = await paymentService.withdraw(parseFloat(amount), selectedCurrency);
            Alert.alert(
                'Withdrawal Successful',
                `${response.message}\nTransaction Hash: ${response.transaction_hash.substring(0, 10)}...`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Withdraw error:', error);
            Alert.alert(
                'Withdrawal Failed',
                error.response?.data?.detail || 'Failed to process withdrawal. Please try again.'
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
                <Text style={styles.headerTitle}>Withdraw Funds</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>${balanceUsd.toFixed(2)}</Text>
                </View>

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
                    <TouchableOpacity
                        style={styles.maxButton}
                        onPress={() => setAmount(balanceUsd.toFixed(2))}
                    >
                        <Text style={styles.maxButtonText}>MAX</Text>
                    </TouchableOpacity>
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
                        Tokens will be withdrawn from your vault to your wallet. Transaction may take a few seconds to process.
                    </Text>
                </View>

                {/* Withdraw Button */}
                <Button
                    title={isLoading ? 'Processing...' : 'Withdraw'}
                    onPress={handleWithdraw}
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
    balanceCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    balanceLabel: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
        marginBottom: 8,
    },
    balanceAmount: {
        color: colors.primary,
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
    },
    inputContainer: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        position: 'relative',
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
    maxButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    maxButtonText: {
        color: colors.background,
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
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
