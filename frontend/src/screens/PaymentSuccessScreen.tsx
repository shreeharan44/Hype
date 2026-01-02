import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography } from '../theme';

export const PaymentSuccessScreen = ({ navigation, route }: any) => {
    const { amount = '0.00' } = route.params || {};
    const date = new Date().toLocaleString();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.successIconContainer}>
                    <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.successIconBg}
                    >
                        <Ionicons name="checkmark" size={48} color={colors.background} />
                    </LinearGradient>
                </View>

                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successSubtitle}>
                    Your payment has been processed successfully
                </Text>

                <View style={styles.receiptCard}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Total Amount</Text>
                        <Text style={styles.amount}>${amount}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>To</Text>
                        <View style={styles.recipientInfo}>
                            <View style={styles.recipientIcon}>
                                <Ionicons name="business" size={16} color={colors.primary} />
                            </View>
                            <Text style={styles.detailValue}>Starbucks Coffee</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{date}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <Text style={styles.detailValue}>Wallet (USDT)</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>#TRX89238923</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Done"
                        onPress={() => navigation.navigate('Home')}
                        style={styles.button}
                    />

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.secondaryButtonText}>Share Receipt</Text>
                    </TouchableOpacity>
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
    content: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        paddingTop: 60,
    },
    successIconContainer: {
        marginBottom: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    successIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
    },
    receiptCard: {
        width: '100%',
        backgroundColor: colors.backgroundCard,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    amount: {
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 24,
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
    },
    detailValue: {
        fontSize: typography.fontSizes.sm,
        color: colors.textPrimary,
        fontWeight: typography.fontWeights.medium,
    },
    recipientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    recipientIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    button: {
        width: '100%',
    },
    secondaryButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.medium,
    },
});
