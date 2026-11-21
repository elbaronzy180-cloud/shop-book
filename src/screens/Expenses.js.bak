import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';
import { storage } from '../storage';


export const Expenses = ({ onNavigate }) => {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const d = await storage.loadData();
      setExpenses(d.expenses);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!item.trim() || !amount.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      item: item.trim(),
      amount: amt,
      date,
    };

    const d = await storage.loadData();
    d.expenses.push(newExpense);
    await storage.saveData(d);
    setExpenses([...d.expenses]);
    setItem('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setError(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Record Expense</Text>

      <Card style={styles.card}>
        <Input
          label="Item"
          value={item}
          onChangeText={setItem}
          placeholder="e.g. Transport, Rent"
        />
        <Input
          label="Amount (\u20B5)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
        />
        <Input label="Date" value={date} onChangeText={setDate} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Save Expense" onPress={handleSave} />
      </Card>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalValue}>\u20B5{total.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>All Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listItemText}>{item.item}</Text>
              <Text style={styles.listItemDate}>{item.date}</Text>
            </View>
            <Text style={styles.listItemAmount}>\u20B5{item.amount.toFixed(2)}</Text>
          </View>
        )}
      </FlatList>

      <Button title="Back to Dashboard" onPress={() => onNavigate('Dashboard')} variant="outline" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.font.size.xxl,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.font.size.sm,
    marginBottom: theme.spacing.sm,
  },
  totalCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.font.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  totalValue: {
    fontSize: theme.font.size.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: theme.font.size.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listItemText: {
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
  },
  listItemDate: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
  },
  listItemAmount: {
    fontSize: theme.font.size.md,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  loading: {
    fontSize: theme.font.size.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
  },
});
