import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/layout';

export type BadgeVariant = 'primary' | 'turquoise' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'turquoise':
        return {
          backgroundColor: 'rgba(0, 180, 216, 0.15)',
          borderColor: Colors.turquoise,
        };
      case 'success':
        return {
          backgroundColor: Colors.sustainableGreenBg,
          borderColor: Colors.sustainableGreen,
        };
      case 'warning':
        return {
          backgroundColor: Colors.warningBg,
          borderColor: Colors.warningOrange,
        };
      case 'danger':
        return {
          backgroundColor: Colors.dangerBg,
          borderColor: Colors.dangerRed,
        };
      case 'neutral':
        return {
          backgroundColor: Colors.navyCard,
          borderColor: Colors.navyCardBorder,
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'rgba(0, 119, 182, 0.2)',
          borderColor: Colors.aquaticBlue,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'turquoise':
        return Colors.turquoiseLight;
      case 'success':
        return Colors.sustainableGreenLight;
      case 'warning':
        return Colors.warningOrange;
      case 'danger':
        return Colors.dangerRed;
      case 'neutral':
        return Colors.textSecondary;
      case 'primary':
      default:
        return Colors.cyanSoft;
    }
  };

  return (
    <View style={[styles.badge, getContainerStyle(), style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: getTextColor() }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
