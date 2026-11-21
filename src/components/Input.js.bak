import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../theme';


export const Input = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  style,
  containerStyle,
  label,
  error,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.font.size.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.font.size.sm,
    marginTop: theme.spacing.xs,
  },
});
