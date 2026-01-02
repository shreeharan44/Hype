import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
}) => {
    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.primaryText}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                variant === 'outline' && styles.outline,
                disabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        variant === 'outline' && styles.outlineText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryText: {
        color: colors.background,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
    },
    outline: {
        borderWidth: 2,
        borderColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outlineText: {
        color: colors.primary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    text: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    disabled: {
        opacity: 0.5,
    },
});
