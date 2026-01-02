import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

const FAQS = [
    { question: 'How do I deposit funds?', answer: 'Go to the Home screen and tap "Top Up". Select your currency and amount.' },
    { question: 'Is my wallet secure?', answer: 'Yes, we use industry-standard encryption and security practices.' },
    { question: 'How long do transfers take?', answer: 'Internal transfers are instant. External deposits may take a few minutes.' },
    { question: 'What are the fees?', answer: 'We charge 0% fees for peer-to-peer transfers within the app.' },
];

export const HelpCenterScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                {FAQS.map((faq, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Text style={styles.answer}>{faq.answer}</Text>
                    </View>
                ))}
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
    sectionTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    question: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    answer: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});
