import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography } from '../theme';
import { paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PaymentDetailsScreen = ({ navigation, route }: any) => {
    const { accountId } = route.params;
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBalance, setIsFetchingBalance] = useState(true);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await paymentService.getBalance();
            setBalance(response.vault_balance_usd || response.balance_usd);
        } catch (error: any) {
            console.error('Error fetching balance:', error);
        } finally {
            setIsFetchingBalance(false);
        }
    };

    const handleSend = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            navigation.navigate('Status', {
                type: 'error',
                title: 'Invalid Amount',
                message: 'Please enter a valid amount greater than 0.',
                primaryActionLabel: 'Try Again',
                primaryAction: () => navigation.goBack(),
            });
            return;
        }

        const amountNum = parseFloat(amount);
        if (amountNum > balance) {
            navigation.navigate('Status', {
                type: 'error',
                title: 'Insufficient Balance',
                message: `You do not have enough funds to send $${amountNum}. Your available balance is $${balance.toFixed(2)}.`,
                primaryActionLabel: 'Top Up',
                primaryAction: () => navigation.navigate('Deposit'),
                secondaryActionLabel: 'Cancel',
                secondaryAction: () => navigation.goBack(),
            });
            return;
        }

        setIsLoading(true);
        try {
            console.log('Sending payment:', { accountId, amount: amountNum });
            const response = await paymentService.send(accountId, amountNum);
            console.log('Payment response:', response);

            navigation.navigate('Status', {
                type: 'success',
                title: 'Payment Successful',
                message: `You have successfully sent payment to ${accountId}.`,
                primaryActionLabel: 'Done',
                primaryAction: () => navigation.navigate('Main', { screen: 'Home' }),
                data: {
                    amount: amountNum,
                    recipient: accountId,
                    transactionHash: response.transaction_hash,
                }
            });

        } catch (error: any) {
            console.error('Error sending payment:', error);

            const errorDetail = error.response?.data?.detail;
            let title = 'Payment Failed';
            let message = errorDetail || 'Something went wrong. Please try again.';
            let primaryActionLabel = 'Try Again';
            let primaryAction = () => navigation.goBack();

            // Handle specific error cases based on backend response
            if (error.response?.status === 404) {
                title = 'User Not Found';
                message = `The account ID "${accountId}" does not exist. Please check the username and try again.`;
            } else if (errorDetail === 'Cannot send tokens to yourself') {
                title = 'Invalid Recipient';
                message = 'You cannot send tokens to your own account.';
            }

            navigation.navigate('Status', {
                type: 'error',
                title: title,
                message: message,
                primaryActionLabel: primaryActionLabel,
                primaryAction: primaryAction,
            });
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
                <Text style={styles.headerTitle}>Payment Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Recipient Info */}
                <View style={styles.recipientCard}>
                    <View style={styles.recipientIcon}>
                        <Ionicons name="person" size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.recipientLabel}>Sending to</Text>
                    <Text style={styles.recipientName}>{accountId}</Text>
                </View>

                {/* Balance Display */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    {isFetchingBalance ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
                    )}
                </View>

                {/* Amount Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Amount</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="decimal-pad"
                            editable={!isLoading}
                        />
                    </View>
                </View>

                {/* Quick Amount Buttons */}
                <View style={styles.quickAmounts}>
                    {[10, 25, 50, 100].map((quickAmount) => (
                        <TouchableOpacity
                            key={quickAmount}
                            style={styles.quickAmountButton}
                            onPress={() => setAmount(quickAmount.toString())}
                            disabled={isLoading}
                        >
                            <Text style={styles.quickAmountText}>${quickAmount}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Send Button */}
                <Button
                    title={isLoading ? 'Sending...' : 'Send Payment'}
                    onPress={handleSend}
                    style={styles.button}
                    disabled={isLoading || isFetchingBalance}
                />

                {isLoading && (
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                )}
            </View>
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
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    recipientCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    recipientIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    recipientLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    recipientName: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    balanceCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
    },
    inputContainer: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
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
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    quickAmountButton: {
        flex: 1,
        backgroundColor: colors.backgroundCard,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    quickAmountText: {
        color: colors.primary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    button: {
        marginTop: 'auto',
    },
    loader: {
        marginTop: 16,
    },
});
