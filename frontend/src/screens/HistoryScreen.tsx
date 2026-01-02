import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SectionList,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography } from '../theme';
import { paymentService } from '../services/api';
import { Transaction } from '../types/payment';

interface GroupedTransaction {
    title: string;
    data: Transaction[];
}

export const HistoryScreen = ({ navigation }: any) => {
    const [transactions, setTransactions] = useState<GroupedTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Refresh transactions when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [])
    );

    const fetchTransactions = async () => {
        try {
            const response = await paymentService.getTransactions();
            const grouped = groupTransactionsByDate(response.transactions);
            setTransactions(grouped);

            // Calculate totals
            let income = 0;
            let expense = 0;
            response.transactions.forEach(tx => {
                if (tx.type === 'RECEIVE' || tx.type === 'DEPOSIT') {
                    income += tx.amount;
                } else if (tx.type === 'SEND' || tx.type === 'WITHDRAW') {
                    expense += tx.amount;
                }
            });
            setTotalIncome(income);
            setTotalExpense(expense);
        } catch (error: any) {
            console.error('Error fetching transactions:', error);
            Alert.alert(
                'Error',
                error.response?.data?.detail || 'Failed to fetch transaction history.'
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchTransactions();
    }, []);

    const groupTransactionsByDate = (txs: Transaction[]): GroupedTransaction[] => {
        const groups: { [key: string]: Transaction[] } = {};
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        txs.forEach(tx => {
            const txDate = new Date(tx.created_at);
            let dateKey: string;

            if (isSameDay(txDate, today)) {
                dateKey = 'Today';
            } else if (isSameDay(txDate, yesterday)) {
                dateKey = 'Yesterday';
            } else {
                dateKey = txDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
            }

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(tx);
        });

        return Object.keys(groups).map(key => ({
            title: key,
            data: groups[key]
        }));
    };

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getTransactionIcon = (tx: Transaction): any => {
        switch (tx.type) {
            case 'SEND':
                return 'arrow-up';
            case 'RECEIVE':
                return 'arrow-down';
            case 'DEPOSIT':
                return 'add-circle';
            case 'WITHDRAW':
                return 'remove-circle';
            default:
                return 'swap-horizontal';
        }
    };

    const getTransactionName = (tx: Transaction): string => {
        switch (tx.type) {
            case 'SEND':
                return `Sent to ${tx.recipient_username || 'Unknown'}`;
            case 'RECEIVE':
                return `Received from ${tx.sender_username || 'Unknown'}`;
            case 'DEPOSIT':
                return 'Deposit to Vault';
            case 'WITHDRAW':
                return 'Withdraw from Vault';
            default:
                return 'Transaction';
        }
    };

    const getTransactionTime = (tx: Transaction): string => {
        const date = new Date(tx.created_at);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isIncome = (tx: Transaction): boolean => {
        return tx.type === 'RECEIVE' || tx.type === 'DEPOSIT';
    };

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <TouchableOpacity
            style={styles.transactionItem}
            onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}
        >
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: isIncome(item) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)' }
                ]}>
                    <Ionicons
                        name={getTransactionIcon(item)}
                        size={20}
                        color={isIncome(item) ? colors.primary : colors.textPrimary}
                    />
                </View>
                <View>
                    <Text style={styles.transactionName}>{getTransactionName(item)}</Text>
                    <Text style={styles.transactionCategory}>
                        {item.type} • {getTransactionTime(item)}
                    </Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: isIncome(item) ? colors.primary : colors.textPrimary }
            ]}>
                {isIncome(item) ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>

            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={[styles.summaryValue, { color: colors.primary }]}>
                        +${totalIncome.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Expense</Text>
                    <Text style={styles.summaryValue}>-${totalExpense.toFixed(2)}</Text>
                </View>
            </View>

            {transactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
                    <Text style={styles.emptyText}>No transactions yet</Text>
                </View>
            ) : (
                <SectionList
                    sections={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTransaction}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundCard,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
    },
    summaryLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
        color: colors.textSecondary,
        marginTop: 24,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionName: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.medium,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
    },
    transactionAmount: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: typography.fontSizes.md,
        color: colors.textMuted,
        marginTop: 16,
    },
});
