import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
    LoginScreen,
    RegisterScreen,
    HomeScreen,
    SwapScreen,
    PayScreen,
    PaymentDetailsScreen,
    PaymentSuccessScreen,
    ProfileScreen,
    HistoryScreen,
    WelcomeScreen,
    DepositScreen,
    WithdrawScreen,
    StatusScreen,
    ProfileDetailsScreen,
    SecurityScreen,
    LanguageScreen,
    HelpCenterScreen,
    ContactSupportScreen,
    QRCodeScreen,
    TransactionDetailsScreen,
} from '../screens';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
    return (
        <Stack.Navigator id="AuthStack" screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

// Main App Navigator (Bottom Tabs)
const MainNavigator = () => {
    return (
        <Tab.Navigator
            id="MainTab"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 70,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Root Navigator
export const AppNavigator = () => {
    return (
        <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="Swap" component={SwapScreen} />
            <Stack.Screen name="Pay" component={PayScreen} />
            <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
            <Stack.Screen name="Deposit" component={DepositScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="Status" component={StatusScreen} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
            <Stack.Screen name="QRCode" component={QRCodeScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
        </Stack.Navigator>
    );
};
