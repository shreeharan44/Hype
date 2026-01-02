import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

export const ProfileDetailsScreen = ({ navigation }: any) => {
    const { user } = useAuth();

    const renderDetailItem = (label: string, value: string, icon: any) => (
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    {renderDetailItem('Username', user?.username || 'N/A', 'person-outline')}
                    <View style={styles.divider} />
                    {renderDetailItem('Email', user?.email || 'N/A', 'mail-outline')}
                    <View style={styles.divider} />
                    {renderDetailItem('Phone', '+1 (555) 123-4567', 'call-outline')}
                    <View style={styles.divider} />
                    {renderDetailItem('User ID', user?.user_id?.toString() || 'N/A', 'finger-print-outline')}
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
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: typography.fontSizes.md,
        color: colors.textPrimary,
        fontWeight: typography.fontWeights.medium,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
