import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.6;

export const QRCodeScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const qrValue = user?.username || 'user';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrValue}&bgcolor=ffffff&color=000000`;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My QR Code</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.qrCard}>
                    <View style={styles.qrContainer}>
                        <Image
                            source={{ uri: qrUrl }}
                            style={styles.qrImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.username}>@{user?.username}</Text>
                    <Text style={styles.instruction}>Scan to pay me</Text>
                </View>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    qrCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    qrContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        marginBottom: 24,
    },
    qrImage: {
        width: QR_SIZE,
        height: QR_SIZE,
    },
    username: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    instruction: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
    },
});
