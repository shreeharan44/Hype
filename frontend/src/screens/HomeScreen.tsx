import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography } from '../theme';
import { paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types/payment';

export const HomeScreen = ({ navigation }: any) => {
    const [balance, setBalance] = useState<number>(0);
    const [vaultBalance, setVaultBalance] = useState<number>(0);
    const [tokenBalance, setTokenBalance] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const walletAssets = [
        { id: '1', name: 'USDT', balance: '1250.60', icon: 'cash', color: colors.usdt },
        { id: '2', name: 'ETH', balance: '850.50', icon: 'logo-ethereum', color: colors.eth },
        { id: '3', name: 'USDC', balance: '500.50', icon: 'card', color: colors.usdc },
    ];

    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [notifications, setNotifications] = React.useState(true);
    const { user, logout, refreshUser, isLoading } = useAuth();
    const [balanceUsd, setBalanceUsd] = useState<number>(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Refresh user data when screen is focused
        refreshUser().catch(console.error);
        fetchData();
    }, []);

    // Refresh balance and transactions when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        setIsLoadingBalance(true);
        try {
            const [balanceResponse, transactionsResponse] = await Promise.all([
                paymentService.getBalance(),
                paymentService.getTransactions()
            ]);

            setBalanceUsd(balanceResponse?.balance_usd || 0);
            // Take only the first 4 transactions for the home screen
            const transactions = transactionsResponse?.transactions || [];
            setRecentTransactions(transactions.slice(0, 4));
        } catch (error) {
            console.error('Error fetching data:', error);
            setBalanceUsd(0);
            setRecentTransactions([]);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    const formatBalance = (amount: number) => {
        return (amount || 0).toFixed(2);
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'SEND': return 'arrow-up';
            case 'RECEIVE': return 'arrow-down';
            case 'DEPOSIT': return 'add';
            case 'WITHDRAW': return 'remove';
            default: return 'swap-horizontal';
        }
    };

    const getTransactionName = (tx: Transaction) => {
        if (tx.type === 'SEND') return `Sent to ${tx.recipient_username || 'User'}`;
        if (tx.type === 'RECEIVE') return `Received from ${tx.sender_username || 'User'}`;
        return tx.type.charAt(0) + tx.type.slice(1).toLowerCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="wallet" size={24} color={colors.primary} />
                    <Text style={styles.headerTitle}>HyPe</Text>
                </View>
                <View style={styles.headerRight}>

                    <TouchableOpacity
                        style={styles.profile}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <View style={styles.profileCircle}>
                            <Ionicons name="person" size={20} color={colors.primary} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingBalance}
                        onRefresh={fetchData}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Virtual Card */}
                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#FFFFFF', '#CCCCCC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Total Balance</Text>
                            <View style={styles.visaLogo}>
                                <Text style={styles.visaText}>VAULT</Text>
                            </View>
                        </View>
                        {isLoadingBalance ? (
                            <ActivityIndicator size="large" color={colors.background} />
                        ) : (
                            <Text style={styles.balance}>${formatBalance(balanceUsd)}</Text>
                        )}
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardNumber}>•••• •••• •••• {user?.user_id || '000'}</Text>
                                <Text style={styles.cardName}>{user?.username || 'User'}</Text>
                            </View>
                            <Text style={styles.cardExpiry}>12/28</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Deposit')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="add" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionLabel}>Top Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Pay')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="arrow-up" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionLabel}>Pay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Swap')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionLabel}>Swap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('History')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="time" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionLabel}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent transaction</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('History')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    {recentTransactions.length === 0 ? (
                        <Text style={{ color: colors.textMuted, textAlign: 'center', padding: 20 }}>
                            No recent transactions
                        </Text>
                    ) : (
                        recentTransactions.map((transaction) => (
                            <TouchableOpacity
                                key={transaction.id}
                                style={styles.transactionItem}
                                onPress={() => navigation.navigate('TransactionDetails', { transaction })}
                            >
                                <View style={styles.transactionLeft}>
                                    <View style={styles.transactionIcon}>
                                        <Ionicons name={getTransactionIcon(transaction.type)} size={24} color={colors.primary} />
                                    </View>
                                    <View>
                                        <Text style={styles.transactionName}>{getTransactionName(transaction)}</Text>
                                        <Text style={styles.transactionTime}>{formatDate(transaction.created_at)}</Text>
                                    </View>
                                </View>
                                <View style={styles.transactionRight}>
                                    <Text style={[
                                        styles.transactionAmount,
                                        { color: (transaction.type === 'RECEIVE' || transaction.type === 'DEPOSIT') ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {(transaction.type === 'RECEIVE' || transaction.type === 'DEPOSIT') ? '+' : '-'}${transaction.amount.toFixed(2)}
                                    </Text>
                                    <Text style={styles.transactionDate}>{transaction.status}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    notification: {
        padding: 4,
    },
    profile: {
        padding: 4,
    },
    profileCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    cardContainer: {
        marginBottom: 24,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        minHeight: 200,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        opacity: 0.8,
    },
    visaLogo: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    visaText: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    balance: {
        color: colors.background,
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardNumber: {
        color: colors.background,
        fontSize: typography.fontSizes.md,
        marginBottom: 4,
    },
    cardName: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        opacity: 0.8,
    },
    cardExpiry: {
        color: colors.background,
        fontSize: typography.fontSizes.md,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.sm,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: 16,
    },
    seeAll: {
        color: colors.primary,
        fontSize: typography.fontSizes.sm,
    },
    walletList: {
        gap: 12,
    },
    walletItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: 16,
        padding: 16,
    },
    walletItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    assetIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetName: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    assetLabel: {
        color: colors.textMuted,
        fontSize: typography.fontSizes.xs,
    },
    assetBalance: {
        color: colors.primary,
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionName: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    transactionTime: {
        color: colors.textMuted,
        fontSize: typography.fontSizes.xs,
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    transactionDate: {
        color: colors.textMuted,
        fontSize: typography.fontSizes.xs,
    },
});
