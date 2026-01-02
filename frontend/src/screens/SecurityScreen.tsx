import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

export const SecurityScreen = ({ navigation }: any) => {
    const [biometrics, setBiometrics] = React.useState(true);
    const [twoFactor, setTwoFactor] = React.useState(false);

    const renderSwitchItem = (label: string, description: string, value: boolean, onValueChange: (val: boolean) => void) => (
        <View style={styles.item}>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: colors.backgroundCardDark, true: colors.primary }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.backgroundCardDark}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    {renderSwitchItem('Biometric ID', 'Use FaceID/TouchID to login', biometrics, setBiometrics)}
                    <View style={styles.divider} />
                    {renderSwitchItem('Two-Factor Auth', 'Extra layer of security', twoFactor, setTwoFactor)}
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
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
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: typography.fontSizes.md,
        color: colors.textPrimary,
        fontWeight: typography.fontWeights.medium,
        marginBottom: 4,
    },
    description: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    button: {
        backgroundColor: colors.backgroundCard,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    buttonText: {
        color: colors.primary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
    },
});
