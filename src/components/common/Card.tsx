import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'highlight' | 'sustainable' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'highlight':
        return {
          backgroundColor: Colors.navyCard,
          borderColor: Colors.turquoise,
          borderWidth: 1.5,
        };
      case 'sustainable':
        return {
          backgroundColor: Colors.navyCard,
          borderColor: Colors.sustainableGreen,
          borderWidth: 1.5,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors.navyCardBorder,
          borderWidth: 1,
        };
      case 'default':
      default:
        return {
          backgroundColor: Colors.navyLight,
          borderColor: Colors.navyCardBorder,
          borderWidth: 1,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.card, getVariantStyle(), style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
});
