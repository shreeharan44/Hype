import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, getFontFamily } from '../theme';
import { Transaction } from '../types/payment';

interface RouteParams {
    transaction: Transaction;
}

export const TransactionDetailsScreen = ({ navigation, route }: any) => {
    const { transaction } = route.params as RouteParams;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getTransactionDirection = () => {
        switch (transaction.type) {
            case 'SEND':
                return {
                    to: transaction.recipient_username || transaction.recipient_wallet || 'Unknown',
                    from: 'You',
                    icon: 'arrow-up-circle' as const,
                    iconColor: colors.primary
                };
            case 'RECEIVE':
                return {
                    to: 'You',
                    from: transaction.sender_username || transaction.sender_wallet || 'Unknown',
                    icon: 'arrow-down-circle' as const,
                    iconColor: colors.primary
                };
            case 'DEPOSIT':
                return {
                    to: 'Vault',
                    from: 'You',
                    icon: 'add-circle' as const,
                    iconColor: colors.primary
                };
            case 'WITHDRAW':
                return {
                    to: 'You',
                    from: 'Vault',
                    icon: 'remove-circle' as const,
                    iconColor: colors.primary
                };
            default:
                return {
                    to: 'Unknown',
                    from: 'Unknown',
                    icon: 'swap-horizontal' as const,
                    iconColor: colors.textMuted
                };
        }
    };

    const direction = getTransactionDirection();

    // Mock fee calculation (2.5% platform fee)
    const platformFeePercentage = 2.5;
    const platformFee = (transaction.amount * platformFeePercentage) / 100;
    const baseAmount = transaction.amount - platformFee;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Status Icon */}
                <View style={styles.statusContainer}>
                    <View style={[styles.statusIconContainer, {
                        backgroundColor: transaction.status === 'completed' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                    }]}>
                        <Ionicons
                            name={transaction.status === 'completed' ? 'checkmark-circle' : 'time'}
                            size={64}
                            color={transaction.status === 'completed' ? colors.primary : colors.textMuted}
                        />
                    </View>
                    <Text style={styles.statusText}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                </View>

                {/* Amount */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
                    <Text style={styles.currency}>{transaction.currency}</Text>
                </View>

                {/* Transaction Details Card */}
                <View style={styles.detailsCard}>
                    <Text style={styles.cardTitle}>Transaction Information</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                            {transaction.tx_hash.slice(0, 10)}...{transaction.tx_hash.slice(-8)}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>From</Text>
                        <Text style={styles.detailValue}>{direction.from}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>To</Text>
                        <Text style={styles.detailValue}>{direction.to}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{formatDate(transaction.created_at)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{formatTime(transaction.created_at)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type</Text>
                        <View style={styles.typeContainer}>
                            <Ionicons
                                name={direction.icon}
                                size={16}
                                color={direction.iconColor}
                                style={styles.typeIcon}
                            />
                            <Text style={styles.detailValue}>{transaction.type}</Text>
                        </View>
                    </View>
                </View>

                {/* Fee Breakdown Card */}
                <View style={styles.detailsCard}>
                    <Text style={styles.cardTitle}>Fee Breakdown</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Base Amount</Text>
                        <Text style={styles.detailValue}>${baseAmount.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Platform Fee ({platformFeePercentage}%)</Text>
                        <Text style={styles.detailValue}>${platformFee.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>${transaction.amount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Transaction Hash Card */}
                <View style={styles.hashCard}>
                    <Text style={styles.hashLabel}>Transaction Hash</Text>
                    <Text style={styles.hashValue}>{transaction.tx_hash}</Text>
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: getFontFamily('bold'),
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    statusIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statusText: {
        fontFamily: getFontFamily('semibold'),
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textPrimary,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    amountLabel: {
        fontFamily: getFontFamily('regular'),
        fontSize: typography.fontSizes.sm,
        color: colors.textMuted,
        marginBottom: 8,
    },
    amount: {
        fontFamily: getFontFamily('bold'),
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        marginBottom: 4,
    },
    currency: {
        fontFamily: getFontFamily('regular'),
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
    },
    detailsCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontFamily: getFontFamily('semibold'),
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textPrimary,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLabel: {
        fontFamily: getFontFamily('regular'),
        fontSize: typography.fontSizes.sm,
        color: colors.textMuted,
        flex: 1,
    },
    detailValue: {
        fontFamily: getFontFamily('medium'),
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'right',
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    typeIcon: {
        marginRight: 6,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    totalLabel: {
        fontFamily: getFontFamily('bold'),
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    totalValue: {
        fontFamily: getFontFamily('bold'),
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        flex: 1,
        textAlign: 'right',
    },
    hashCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    hashLabel: {
        fontFamily: getFontFamily('regular'),
        fontSize: typography.fontSizes.sm,
        color: colors.textMuted,
        marginBottom: 12,
    },
    hashValue: {
        fontFamily: getFontFamily('medium'),
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.textPrimary,
        lineHeight: typography.lineHeights.relaxed * typography.fontSizes.xs,
    },
});
