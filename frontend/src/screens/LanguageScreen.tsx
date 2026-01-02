import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

const LANGUAGES = [
    { id: 'en', name: 'English (US)', active: true },
    { id: 'es', name: 'Español', active: false },
    { id: 'fr', name: 'Français', active: false },
    { id: 'de', name: 'Deutsch', active: false },
    { id: 'zh', name: '中文', active: false },
];

export const LanguageScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Language</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    {LANGUAGES.map((lang, index) => (
                        <View key={lang.id}>
                            <TouchableOpacity style={styles.item}>
                                <Text style={[styles.label, lang.active && styles.activeLabel]}>
                                    {lang.name}
                                </Text>
                                {lang.active && (
                                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                            {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
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
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    label: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
        fontWeight: typography.fontWeights.medium,
    },
    activeLabel: {
        color: colors.primary,
        fontWeight: typography.fontWeights.bold,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
