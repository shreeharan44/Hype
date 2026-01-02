import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

const { width } = Dimensions.get('window');

type StatusType = 'success' | 'error' | 'warning';

interface StatusScreenProps {
    navigation: any;
    route: {
        params: {
            type: StatusType;
            title: string;
            message: string;
            primaryActionLabel: string;
            primaryAction?: () => void; // Optional: if not provided, defaults to goBack or navigate home
            secondaryActionLabel?: string;
            secondaryAction?: () => void;
            data?: any; // For passing extra data like transaction details
        };
    };
}

export const StatusScreen = ({ navigation, route }: StatusScreenProps) => {
    const {
        type,
        title,
        message,
        primaryActionLabel,
        primaryAction,
        secondaryActionLabel,
        secondaryAction,
        data
    } = route.params;

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            default:
                return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return colors.success || colors.primary; // Fallback to white
            case 'error':
                return colors.error || '#FF4D4D';
            case 'warning':
                return '#FFC107';
            default:
                return colors.primary;
        }
    };

    const handlePrimaryAction = () => {
        if (primaryAction) {
            primaryAction();
        } else {
            // Default behavior: go back to Home if success, or go back to previous screen if error
            if (type === 'success') {
                navigation.navigate('Main', { screen: 'Home' });
            } else {
                navigation.goBack();
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
                    <Ionicons name={getIconName()} size={80} color={getIconColor()} />
                </View>

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>

                {/* Optional: Display Transaction Details for Success */}
                {data && (
                    <View style={styles.detailsContainer}>
                        {data.amount && (
                            <Text style={styles.amount}>${data.amount}</Text>
                        )}
                        {data.recipient && (
                            <Text style={styles.detailText}>To: {data.recipient}</Text>
                        )}
                        {data.transactionHash && (
                            <Text style={styles.hashText}>Ref: {data.transactionHash.substring(0, 10)}...</Text>
                        )}
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: getIconColor() }]}
                    onPress={handlePrimaryAction}
                >
                    <Text style={styles.buttonText}>{primaryActionLabel}</Text>
                </TouchableOpacity>

                {secondaryActionLabel && (
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={secondaryAction}
                    >
                        <Text style={styles.secondaryButtonText}>{secondaryActionLabel}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },
    message: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    detailsContainer: {
        marginTop: 32,
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.backgroundCard,
        borderRadius: 16,
        width: '100%',
    },
    amount: {
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    detailText: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    hashText: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
        fontFamily: 'monospace',
    },
    footer: {
        paddingBottom: 20,
        gap: 12,
    },
    button: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.textMuted,
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.medium,
    },
});
