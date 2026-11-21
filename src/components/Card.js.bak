import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';


export const Card = ({ children, style, padding = theme.spacing.md }) => {
  return (
    <View style={[styles.card, { padding }, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
