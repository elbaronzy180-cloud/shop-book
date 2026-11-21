import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { storage } from '../storage';
import { Sale, Expense, Debt, AppData } from '../types';

export const Dashboard = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const d = await storage.loadData();
      setData(d);
      setLoading(false);
    };
    load();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const salesToday = data?.sales.filter((s) => s.date === today) || [];
  const expensesToday = data?.expenses.filter((e) => e.date === today) || [];
  const salesWeek = data?.sales.filter((s) => s.date >= weekStartStr) || [];
  const expensesWeek = data?.expenses.filter((e) => e.date >= weekStartStr) || [];
  const totalOwed = data?.debts.reduce((sum, d) => sum + d.amount - d.amountPaid, 0) || 0;

  const sum = (arr: { amount: number }[]) => arr.reduce((a, b) => a + b.amount, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Shop Book</Text>
      <Text style={styles.subtitle}>Today's summary</Text>

      <View style={styles.row}>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Sales Today</Text>
          <Text style={styles.cardValue}>\u20B5{sum(salesToday).toFixed(2)}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Expenses Today</Text>
          <Text style={styles.cardValue}>\u20B5{sum(expensesToday).toFixed(2)}</Text>
        </Card>
      </View>

      <View style={styles.row}>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Sales This Week</Text>
          <Text style={styles.cardValue}>\u20B5{sum(salesWeek).toFixed(2)}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Expenses This Week</Text>
          <Text style={styles.cardValue}>\u20B5{sum(expensesWeek).toFixed(2)}</Text>
        </Card>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardLabel}>Total Customers Owe</Text>
        <Text style={[styles.cardValue, styles.cardValueOwed]}>\u20B5{totalOwed.toFixed(2)}</Text>
      </Card>

      <View style={styles.actions}>
        <Button title="Record Sale" onPress={() => onNavigate('Sales')} />
        <Button title="Add Expense" onPress={() => onNavigate('Expenses')} variant="outline" />
      </View>

      <View style={styles.actions}>
        <Button title="Manage Stock" onPress={() => onNavigate('Stock')} />
        <Button title="Customer Debts" onPress={() => onNavigate('Debts')} variant="outline" />
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Sales</Text>
        <FlatList
          data={data?.sales.slice(0, 5) || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.product}</Text>
              <Text style={styles.listItemAmount}>\u20B5{item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <FlatList
          data={data?.expenses.slice(0, 5) || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.item}</Text>
              <Text style={styles.listItemAmount}>\u20B5{item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
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
  subtitle: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  card: {
    flex: 1,
    minWidth: 140,
  },
  cardLabel: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  cardValue: {
    fontSize: theme.font.size.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardValueOwed: {
    color: theme.colors.error,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  recentSection: {
    marginBottom: theme.spacing.lg,
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