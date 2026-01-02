import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography } from '../theme';

export const SwapScreen = ({ navigation }: any) => {
    const [fromAmount, setFromAmount] = useState('100');
    const [toAmount, setToAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState({ name: 'USDT', icon: 'cash', color: colors.usdt });
    const [toCurrency, setToCurrency] = useState({ name: 'ETH', icon: 'logo-ethereum', color: colors.eth });

    const handleSwap = () => {
        // Swap logic here
        Alert.alert('Success', 'Swap executed!');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Swap</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* From Currency */}
                <View style={styles.currencyCard}>
                    <View style={styles.currencyHeader}>
                        <Text style={styles.currencyLabel}>From</Text>
                        <TouchableOpacity style={styles.maxButton}>
                            <Text style={styles.maxText}>Max</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.currencyInput}>
                        <TextInput
                            style={styles.amountInput}
                            value={fromAmount}
                            onChangeText={setFromAmount}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={colors.textMuted}
                        />
                        <View style={styles.currencySelector}>
                            <View style={[styles.currencyIcon, { backgroundColor: fromCurrency.color + '20' }]}>
                                <Ionicons name={fromCurrency.icon as any} size={20} color={fromCurrency.color} />
                            </View>
                            <Text style={styles.currencyName}>{fromCurrency.name}</Text>
                            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
                        </View>
                    </View>
                    <Text style={styles.balance}>$0.00</Text>
                </View>

                {/* Swap Button */}
                <View style={styles.swapIconContainer}>
                    <TouchableOpacity style={styles.swapIcon}>
                        <Ionicons name="swap-vertical" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* To Currency */}
                <View style={styles.currencyCard}>
                    <View style={styles.currencyHeader}>
                        <Text style={styles.currencyLabel}>To</Text>
                        <TouchableOpacity style={styles.maxButton}>
                            <Text style={styles.maxText}>Max</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.currencyInput}>
                        <TextInput
                            style={styles.amountInput}
                            value={toAmount}
                            onChangeText={setToAmount}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={colors.textMuted}
                        />
                        <View style={styles.currencySelector}>
                            <View style={[styles.currencyIcon, { backgroundColor: toCurrency.color + '20' }]}>
                                <Ionicons name={toCurrency.icon as any} size={20} color={toCurrency.color} />
                            </View>
                            <Text style={styles.currencyName}>{toCurrency.name}</Text>
                            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
                        </View>
                    </View>
                    <Text style={styles.balance}>$0.00</Text>
                </View>

                {/* Exchange Info */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="sync" size={16} color={colors.textMuted} />
                        <Text style={styles.infoLabel}>1 USDT = 0.00024 ETH</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Route</Text>
                        <Text style={styles.infoValue}>USDT - ETH</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Rate</Text>
                        <Text style={styles.infoValue}>1 USDT = 0.00024 ETH</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Network Fee</Text>
                        <Text style={styles.infoValue}>0.00012 ETH</Text>
                    </View>
                </View>

                {/* Swap Button */}
                <Button
                    title="Swap"
                    onPress={handleSwap}
                    style={styles.swapButton}
                />
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
    headerTitle: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    currencyCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    currencyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    currencyLabel: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
    },
    maxButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    maxText: {
        color: colors.primary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    currencyInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    amountInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.xxxl,
        fontWeight: typography.fontWeights.bold,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCardDark,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    currencyIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencyName: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    balance: {
        color: colors.textMuted,
        fontSize: typography.fontSizes.sm,
    },
    swapIconContainer: {
        alignItems: 'center',
        marginVertical: -8,
        zIndex: 1,
    },
    swapIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.background,
    },
    infoCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 16,
        padding: 16,
        marginTop: 24,
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoLabel: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
    },
    infoValue: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    swapButton: {
        marginTop: 'auto',
        marginBottom: 32,
    },
});
