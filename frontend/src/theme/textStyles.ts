import { typography } from './typography';

// Helper function to get font family based on weight
export const getFontFamily = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
    return typography.fontFamily[weight];
};

// Common text style presets with Manrope font
export const textStyles = {
    // Headers
    h1: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSizes.xxxl,
        lineHeight: typography.fontSizes.xxxl * typography.lineHeights.tight,
    },
    h2: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSizes.xxl,
        lineHeight: typography.fontSizes.xxl * typography.lineHeights.tight,
    },
    h3: {
        fontFamily: typography.fontFamily.semibold,
        fontSize: typography.fontSizes.xl,
        lineHeight: typography.fontSizes.xl * typography.lineHeights.normal,
    },
    h4: {
        fontFamily: typography.fontFamily.semibold,
        fontSize: typography.fontSizes.lg,
        lineHeight: typography.fontSizes.lg * typography.lineHeights.normal,
    },

    // Body text
    bodyLarge: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSizes.lg,
        lineHeight: typography.fontSizes.lg * typography.lineHeights.normal,
    },
    bodyMedium: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSizes.md,
        lineHeight: typography.fontSizes.md * typography.lineHeights.normal,
    },
    bodySmall: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSizes.sm,
        lineHeight: typography.fontSizes.sm * typography.lineHeights.normal,
    },

    // Labels
    labelLarge: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSizes.md,
        lineHeight: typography.fontSizes.md * typography.lineHeights.tight,
    },
    labelMedium: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSizes.sm,
        lineHeight: typography.fontSizes.sm * typography.lineHeights.tight,
    },
    labelSmall: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSizes.xs,
        lineHeight: typography.fontSizes.xs * typography.lineHeights.tight,
    },

    // Buttons
    button: {
        fontFamily: typography.fontFamily.semibold,
        fontSize: typography.fontSizes.md,
        lineHeight: typography.fontSizes.md * typography.lineHeights.tight,
    },

    // Caption
    caption: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSizes.xs,
        lineHeight: typography.fontSizes.xs * typography.lineHeights.normal,
    },
};
