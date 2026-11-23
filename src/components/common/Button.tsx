import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/layout';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    let paddingVertical = Spacing.sm + 3;
    let paddingHorizontal = Spacing.md + 4;

    if (size === 'sm') {
      paddingVertical = Spacing.xs + 2;
      paddingHorizontal = Spacing.sm + 4;
    } else if (size === 'lg') {
      paddingVertical = Spacing.md;
      paddingHorizontal = Spacing.xl;
    }

    let backgroundColor = Colors.aquaticBlue;
    let borderColor: string | undefined;
    let borderWidth: number | undefined;

    switch (variant) {
      case 'primary':
        backgroundColor = Colors.aquaticBlue;
        break;
      case 'secondary':
        backgroundColor = Colors.navyLight;
        borderColor = Colors.navyCardBorder;
        borderWidth = 1;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = Colors.turquoise;
        borderWidth = 1.5;
        break;
      case 'success':
        backgroundColor = Colors.sustainableGreen;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
    }

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.md,
      opacity: disabled || loading ? 0.6 : 1,
      paddingVertical,
      paddingHorizontal,
      backgroundColor,
      borderColor,
      borderWidth,
    };
  };

  const getTextStyle = (): TextStyle => {
    let fontSize = 15;
    if (size === 'sm') {
      fontSize = 13;
    } else if (size === 'lg') {
      fontSize = 17;
    }

    let color = Colors.white;
    switch (variant) {
      case 'primary':
      case 'success':
        color = Colors.white;
        break;
      case 'secondary':
        color = Colors.cyanSoft;
        break;
      case 'outline':
        color = Colors.turquoise;
        break;
      case 'ghost':
        color = Colors.turquoiseLight;
        break;
    }

    return {
      fontWeight: '600',
      fontSize,
      color,
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.turquoise : Colors.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
