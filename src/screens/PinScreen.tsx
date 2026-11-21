import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';

type PinScreenMode = 'verify' | 'set';

interface PinScreenProps {
  pin: string;
  onUnlock: () => void;
  mode?: PinScreenMode;
}

export const PinScreen = ({ pin, onUnlock, mode = 'verify' }: PinScreenProps) => {
  const [entered, setEntered] = useState('');

  const pressDigit = (digit: string) => {
    if (entered.length < 4) {
      setEntered(entered + digit);
    }
  };

  const backspace = () => {
    setEntered(entered.slice(0, -1));
  };

  const submit = () => {
    if (entered.length < 4) {
      Alert.alert('Error', 'Enter a 4-digit PIN');
      return;
    }
    if (entered === pin) {
      onUnlock();
    } else {
      setEntered('');
      Alert.alert('Error', 'Incorrect PIN');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'set' ? 'Set your PIN' : 'Enter PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {mode === 'set' ? 'Choose a 4-digit PIN to lock Shop Book' : 'Enter your PIN to continue'}
      </Text>

      <View style={styles.pinDots}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={[styles.dot, i < entered.length && styles.dotFilled]} />
        ))}
      </View>

      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <TouchableOpacity
            key={digit}
            style={styles.key}
            onPress={() => pressDigit(digit)}
          >
            <Text style={styles.keyText}>{digit}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={() => pressDigit('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={backspace}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.font.size.xxl,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.font.size.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  dotFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  keyText: {
    fontSize: theme.font.size.lg,
    color: theme.colors.textPrimary,
  },
});