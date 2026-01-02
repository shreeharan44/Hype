import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';

export const ProfileScreen = ({ navigation }: any) => {
    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [notifications, setNotifications] = React.useState(true);
    const { user, logout, refreshUser, isLoading } = useAuth();
    const [balanceUsd, setBalanceUsd] = useState<number>(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    useEffect(() => {
        // Refresh user data when screen is focused
        refreshUser().catch(console.error);
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        setIsLoadingBalance(true);
        try {
            const response = await paymentService.getBalance();
            setBalanceUsd(response.balance_usd);
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.replace('Welcome');
                    },
                },
            ]
        );
    };

    // Format balance from wei to ETH (assuming 18 decimals)
    const formatBalance = (balance: number) => {
        return (balance / 1e18).toFixed(4);
    };

    if (isLoading || !user) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const renderMenuItem = (
        icon: any,
        title: string,
        subtitle?: string,
        hasSwitch?: boolean,
        value?: boolean,
        onValueChange?: (val: boolean) => void,
        onPress?: () => void,
        isDestructive?: boolean
    ) => (
        <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={hasSwitch ? 1 : 0.7}
            onPress={hasSwitch ? undefined : onPress}
        >
            <View style={styles.menuIconContainer}>
                <Ionicons
                    name={icon}
                    size={22}
                    color={isDestructive ? colors.error : colors.primary}
                />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, isDestructive && { color: colors.error }]}>
                    {title}
                </Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {hasSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: colors.backgroundCard, true: colors.primary }}
                    thumbColor={colors.textPrimary}
                    ios_backgroundColor={colors.backgroundCard}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color={colors.primary} />
                        </View>
                        <TouchableOpacity style={styles.editBadge}>
                            <Ionicons name="pencil" size={12} color={colors.background} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    {user.wallet_address && (
                        <Text style={styles.walletAddress} numberOfLines={1}>
                            Wallet: {user.wallet_address.substring(0, 6)}...{user.wallet_address.substring(38)}
                        </Text>
                    )}
                    <View style={styles.balanceContainer}>
                        {isLoadingBalance ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Text style={styles.balanceText}>
                                Balance: ${balanceUsd.toFixed(2)}
                            </Text>
                        )}
                        <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
                            <Ionicons name="refresh" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statusBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.background} />
                        <Text style={styles.statusText}>Verified</Text>
                    </View>
                </View>

                {/* Account Settings */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.menuGroup}>
                    {renderMenuItem('person-outline', 'Personal Information', 'Name, Email, Phone', false, undefined, undefined, () => navigation.navigate('ProfileDetails'))}
                    {renderMenuItem('qr-code-outline', 'My QR Code', 'Scan to receive payment', false, undefined, undefined, () => navigation.navigate('QRCode'))}
                    {renderMenuItem('shield-checkmark-outline', 'Security', 'Password, 2FA, FaceID', false, undefined, undefined, () => navigation.navigate('Security'))}
                </View>

                {/* App Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.menuGroup}>
                    {renderMenuItem('language-outline', 'Language', 'English (US)', false, undefined, undefined, () => navigation.navigate('Language'))}
                </View>

                {/* Support */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.menuGroup}>
                    {renderMenuItem('help-circle-outline', 'Help Center', undefined, false, undefined, undefined, () => navigation.navigate('HelpCenter'))}
                    {renderMenuItem('chatbubble-ellipses-outline', 'Contact Support', undefined, false, undefined, undefined, () => navigation.navigate('ContactSupport'))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={colors.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0</Text>
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
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.backgroundCardDark,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    userName: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.background,
    },
    sectionTitle: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 16,
        marginTop: 8,
    },
    menuGroup: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 8,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
    },
    version: {
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: typography.fontSizes.xs,
        marginTop: 8,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletAddress: {
        fontSize: typography.fontSizes.xs,
        color: colors.textSecondary,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    balanceText: {
        fontSize: typography.fontSizes.sm,
        color: colors.primary,
        fontWeight: typography.fontWeights.semibold,
    },
    refreshButton: {
        padding: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginTop: 8,
        gap: 12,
    },
    logoutText: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
        color: colors.error,
    },
});
