import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components';
import { colors, typography } from '../theme';

const { width } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000000', '#000000']}
                style={styles.background}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>HyPe</Text>
                    <Text style={styles.subtitle}>The Future of Payments</Text>
                </View>

                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#FFFFFF', '#CCCCCC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Universal Card</Text>
                            <View style={styles.visaLogo}>
                                <Text style={styles.visaText}>VISA</Text>
                            </View>
                        </View>
                        <View style={styles.chipContainer}>
                            <View style={styles.chip} />
                            <View style={styles.contactless} />
                        </View>
                        <Text style={styles.cardNumber}>•••• •••• •••• 8888</Text>
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardName}>Hype</Text>
                            </View>
                            <Text style={styles.cardExpiry}>12/28</Text>
                        </View>
                    </LinearGradient>

                    {/* Decorative elements */}
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.description}>
                        Manage your finances with ease. Secure, fast, and reliable payments anywhere in the world.
                    </Text>
                    <Button
                        title="Get Started"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                    />
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
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: typography.fontSizes.lg,
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 300,
    },
    card: {
        width: width * 0.85,
        height: 220,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        transform: [{ rotate: '-5deg' }],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
        opacity: 0.8,
    },
    visaLogo: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    visaText: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    chipContainer: {
        marginBottom: 10,
    },
    chip: {
        width: 40,
        height: 30,
        backgroundColor: '#FFD700',
        borderRadius: 6,
        opacity: 0.8,
    },
    contactless: {
        // Placeholder for contactless icon
    },
    cardNumber: {
        color: colors.background,
        fontSize: 22,
        fontWeight: typography.fontWeights.bold,
        letterSpacing: 2,
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardName: {
        color: colors.background,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
        opacity: 0.9,
    },
    cardExpiry: {
        color: colors.background,
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.bold,
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    circle1: {
        width: width * 0.8,
        height: width * 0.8,
        top: -20,
    },
    circle2: {
        width: width * 1.2,
        height: width * 1.2,
        top: -80,
    },
    footer: {
        gap: 24,
    },
    description: {
        color: colors.textSecondary,
        textAlign: 'center',
        fontSize: typography.fontSizes.md,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    button: {
        width: '100%',
    },
});
