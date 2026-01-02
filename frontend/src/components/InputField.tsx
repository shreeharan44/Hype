import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface InputFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    error,
    icon,
    secureTextEntry,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={colors.textMuted}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    {...props}
                    secureTextEntry={secureTextEntry && !showPassword}
                    style={styles.input}
                    placeholderTextColor={colors.textMuted}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
    },
    inputError: {
        borderColor: colors.error,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        paddingVertical: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    error: {
        color: colors.error,
        fontSize: typography.fontSizes.xs,
        marginTop: 4,
    },
});
