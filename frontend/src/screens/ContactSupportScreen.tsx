import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { Button } from '../components';

export const ContactSupportScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What can we help you with?"
                        placeholderTextColor={colors.textMuted}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your issue..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <Button title="Send Message" onPress={() => navigation.goBack()} />

                <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>Or email us directly at</Text>
                    <Text style={styles.emailText}>support@waypay.com</Text>
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
        marginBottom: 24,
    },
    label: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
    },
    textArea: {
        height: 120,
    },
    contactInfo: {
        alignItems: 'center',
        marginTop: 32,
    },
    contactText: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
    },
    emailText: {
        color: colors.primary,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
        marginTop: 4,
    },
});
