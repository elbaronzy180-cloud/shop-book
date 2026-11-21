import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList, Alert } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';
import { storage } from '../storage';
import { Debt, AppData } from '../types';

export const Debts = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingDebtId, setPayingDebtId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    const load = async () => {
      const d: AppData = await storage.loadData();
      setDebts(d.debts);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!customer.trim() || !amount.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const newDebt: Debt = {
      id: Date.now().toString(),
      customer: customer.trim(),
      amount: amt,
      amountPaid: 0,
      date,
    };

    const d: AppData = await storage.loadData();
    d.debts.push(newDebt);
    await storage.saveData(d);
    setDebts([...d.debts]);
    setCustomer('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setError(null);
  };

  const handlePayment = async (debt: Debt) => {
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Enter a valid payment amount');
      return;
    }

    const d: AppData = await storage.loadData();
    const debtIndex = d.debts.findIndex((x) => x.id === debt.id);
    if (debtIndex >= 0) {
      d.debts[debtIndex].amountPaid += amt;
      await storage.saveData(d);
      setDebts([...d.debts]);
      setPayingDebtId(null);
      setPaymentAmount('');
    }
  };

  const totalOwed = debts.reduce((sum, d) => sum + d.amount - d.amountPaid, 0);
  const totalLent = debts.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Customer Debts</Text>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Lent</Text>
          <Text style={styles.summaryValue}>\u20B5{totalLent.toFixed(2)}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Still Owed</Text>
          <Text style={[styles.summaryValue, styles.summaryValueOwed]}>\u20B5{totalOwed.toFixed(2)}</Text>
        </Card>
      </View>

      <Card style={styles.card}>
        <Input
          label="Customer Name"
          value={customer}
          onChangeText={setCustomer}
          placeholder="e.g. Kwame"
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
        <Button title="Record Debt" onPress={handleSave} />
      </Card>

      <Text style={styles.sectionTitle}>All Debts</Text>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const remaining = item.amount - item.amountPaid;
          const isPaying = payingDebtId === item.id;
          return (
            <View style={styles.listItem} key={item.id}>
              <View style={styles.listInfo}>
                <Text style={styles.listItemText}>{item.customer}</Text>
                <Text style={styles.listItemDetail}>
                  {item.amountPaid.toFixed(2)} paid of {item.amount.toFixed(2)}
                </Text>
                <Text style={styles.listItemDate}>{item.date}</Text>
              </View>
              <View style={styles.listActions}>
                <Text style={styles.listItemAmount}>
                  \u20B5{remaining.toFixed(2)}
                </Text>
                {isPaying ? (
                  <View style={styles.payInput}>
                    <Input
                      value={paymentAmount}
                      onChangeText={setPaymentAmount}
                      keyboardType="numeric"
                      placeholder="Pay"
                      containerStyle={{ marginBottom: 0, marginRight: theme.spacing.sm }}
                    />
                    <Button
                      title="Pay"
                      onPress={() => handlePayment(item)}
                      variant="outline"
                      style={{ paddingHorizontal: theme.spacing.sm }}
                    />
                  </View>
                ) : (
                  <Button
                    title="Pay"
                    onPress={() => setPayingDebtId(item.id)}
                    variant="outline"
                    style={{ paddingHorizontal: theme.spacing.sm }}
                  />
                )}
              </View>
            </View>
          );
        }}
      />

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
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: theme.colors.surface,
  },
  summaryLabel: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.font.size.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  summaryValueOwed: {
    color: theme.colors.error,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.font.size.sm,
    marginBottom: theme.spacing.sm,
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
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  listItemText: {
    fontSize: theme.font.size.md,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  listItemDetail: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
  },
  listItemDate: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
  },
  listItemAmount: {
    fontSize: theme.font.size.md,
    fontWeight: '600',
    color: theme.colors.primaryDark,
    minWidth: 70,
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  payInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loading: {
    fontSize: theme.font.size.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
  },
});