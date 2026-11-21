import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'outline' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) => {
  const base = [
    styles.container,
    {
      backgroundColor:
        variant === 'danger'
          ? theme.colors.error
          : variant === 'outline'
          ? 'transparent'
          : theme.colors.primary,
      borderColor: theme.colors.primary,
      borderWidth: variant === 'outline' ? 1 : 0,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const text = [
    styles.text,
    {
      color:
        variant === 'danger'
          ? '#FFFFFF'
          : variant === 'outline'
          ? theme.colors.primary
          : '#FFFFFF',
    },
    textStyle,
  ];

  return (
    <TouchableOpacity style={base} onPress={disabled ? undefined : onPress} disabled={disabled}>
      <View style={styles.inner} />
      <View style={styles.label}>
        <Text style={text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  inner: {
    flex: 1,
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: theme.font.size.md,
  },
});