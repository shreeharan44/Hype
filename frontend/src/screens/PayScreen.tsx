import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography } from '../theme';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

export const PayScreen = ({ navigation }: any) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [facing, setFacing] = useState<CameraType>('back');

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        // Assuming the QR code contains the account ID
        navigation.navigate('PaymentDetails', { accountId: data });
    };

    const handleProceed = () => {
        if (!accountId) {
            Alert.alert('Error', 'Please enter an Account ID');
            return;
        }
        navigation.navigate('PaymentDetails', { accountId });
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan to Pay</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.scannerContainer}>
                    <CameraView
                        style={styles.camera}
                        facing={facing}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                    >
                        <View style={styles.scannerOverlay}>
                            <View style={styles.scannerFrame}>
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                            </View>
                        </View>
                    </CameraView>
                    <Text style={styles.scannerText}>Align QR code within the frame</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Account ID</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                        <TextInput
                            style={styles.input}
                            value={accountId}
                            onChangeText={setAccountId}
                            placeholder=" Name"
                            placeholderTextColor={colors.textMuted}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <Button
                    title="Proceed"
                    onPress={handleProceed}
                    style={styles.button}
                />
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
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    scannerContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    camera: {
        width: SCANNER_SIZE,
        height: SCANNER_SIZE,
        borderRadius: 24,
        overflow: 'hidden',
    },
    scannerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerFrame: {
        width: SCANNER_SIZE * 0.8,
        height: SCANNER_SIZE * 0.8,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: colors.primary,
        borderWidth: 3,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scannerText: {
        color: colors.textSecondary,
        marginTop: 16,
        fontSize: typography.fontSizes.sm,
        textAlign: 'center',
    },
    inputContainer: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.fontSizes.sm,
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        color: colors.primary,
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        padding: 0,
    },
    usernameInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        padding: 0,
    },
    button: {
        marginTop: 'auto',
    },
    loader: {
        marginTop: 16,
    },
});
