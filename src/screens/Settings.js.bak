import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';
import { storage } from '../storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { DEFAULT_SETTINGS } from '../types';


export const Settings = ({ onNavigate }) => {
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [currency, setCurrency] = useState('GHS');

  useEffect(() => {
    const load = async () => {
      const d = await storage.loadData();
      setHasPin(!!d.settings.pin);
      setCurrency(d.settings.currency || 'GHS');
    };
    load();
  }, []);

  const setPinAction = async () => {
    if (!newPin || newPin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }
    const d = await storage.loadData();
    d.settings.pin = newPin;
    await storage.saveData(d);
    setHasPin(true);
    setNewPin('');
    setConfirmPin('');
    Alert.alert('Success', 'PIN set');
  };

  const removePinAction = async () => {
    const d = await storage.loadData();
    d.settings.pin = null;
    await storage.saveData(d);
    setHasPin(false);
    setPin('');
    Alert.alert('Success', 'PIN removed');
  };

  const verifyPin = async () => {
    const d = await storage.loadData();
    if (d.settings.pin === pin) {
      Alert.alert('Success', 'PIN correct');
    } else {
      Alert.alert('Error', 'Incorrect PIN');
    }
  };

  const backupData = async () => {
    try {
      const json = await storage.exportData();
      const uri = FileSystem.documentDirectory + 'shop_book_backup.json';
      await FileSystem.writeAsStringAsync(uri, json);
      if (Platform.OS !== 'web') {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Backup', 'Backup saved to ' + uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Backup failed');
    }
  };

  const restoreData = async () => {
    Alert.alert(
      'Restore',
      'Restore from a backup file is not yet supported on this platform. Please use the backup file to import manually.',
      [{ text: 'OK' }]
    );
  };

  const exportMonthCSV = async () => {
    const month = prompt('Enter month (YYYY-MM):');
    if (!month) return;
    try {
      const d = await storage.loadData();
      const sales = d.sales.filter((s) => s.date.startsWith(month));
      const expenses = d.expenses.filter((e) => e.date.startsWith(month));
      let csv = 'Type,Item,Amount,Date\n';
      sales.forEach((s) => {
        csv += `Sale,"${s.product}",${s.amount},${s.date}\n`;
      });
      expenses.forEach((e) => {
        csv += `Expense,"${e.item}",${e.amount},${e.date}\n`;
      });
      const uri = FileSystem.documentDirectory + `shop_book_${month}.csv`;
      await FileSystem.writeAsStringAsync(uri, csv);
      if (Platform.OS !== 'web') {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Export', 'CSV saved to ' + uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Export failed');
    }
  };

  const exportMonthPDF = async () => {
    const month = prompt('Enter month (YYYY-MM):');
    if (!month) return;
    try {
      const d = await storage.loadData();
      const sales = d.sales.filter((s) => s.date.startsWith(month));
      const expenses = d.expenses.filter((e) => e.date.startsWith(month));
      const totalSales = sales.reduce((a, b) => a + b.amount, 0);
      const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);

      let html = `
        <html><body style='font-family: sans-serif; padding: 20px;'>
        <h1>Shop Book - ${month}</h1>
        <h2>Sales</h2>
        <table border='1' cellpadding='5'>
          <tr><th>Product</th><th>Amount</th><th>Date</th></tr>
          ${sales.map((s) => `<tr><td>${s.product}</td><td>\u20B5${s.amount.toFixed(2)}</td><td>${s.date}</td></tr>`).join('')}
        </table>
        <p><strong>Total Sales: \u20B5${totalSales.toFixed(2)}</strong></p>

        <h2>Expenses</h2>
        <table border='1' cellpadding='5'>
          <tr><th>Item</th><th>Amount</th><th>Date</th></tr>
          ${expenses.map((e) => `<tr><td>${e.item}</td><td>\u20B5${e.amount.toFixed(2)}</td><td>${e.date}</td></tr>`).join('')}
        </table>
        <p><strong>Total Expenses: \u20B5${totalExpenses.toFixed(2)}</strong></p>
        <p><strong>Net: \u20B5${(totalSales - totalExpenses).toFixed(2)}</strong></p>
        </body></html>
      `;

      const uri = FileSystem.documentDirectory + `shop_book_${month}.pdf`;
      const result = await Print.printToFileAsync({ html, base64: false, filename: `shop_book_${month}` });
      if (Platform.OS !== 'web') {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert('Export', 'PDF saved to ' + result.uri);
      }
    } catch (e) {
      Alert.alert('Error', 'PDF export failed');
    }
  };

  const clearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all sales, expenses, stock and debts. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: async () => {
          await storage.clearAllData();
          Alert.alert('Success', 'All data cleared');
        } },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>PIN Lock</Text>
        {!hasPin ? (
          <View>
            <Text style={styles.hint}>Protect your app with a PIN</Text>
            <Input label="New PIN" value={newPin} onChangeText={setNewPin} secureTextEntry placeholder="1234" />
            <Input label="Confirm PIN" value={confirmPin} onChangeText={setConfirmPin} secureTextEntry placeholder="1234" />
            <Button title="Set PIN" onPress={setPinAction} />
          </View>
        ) : (
          <View>
            <Text style={styles.hint}>PIN is set</Text>
            <Input label="Current PIN" value={pin} onChangeText={setPin} secureTextEntry placeholder="1234" />
            <Button title="Verify PIN" onPress={verifyPin} />
            <Button title="Remove PIN" onPress={removePinAction} variant="outline" />
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Currency</Text>
        <Input label="Currency Code" value={currency} onChangeText={setCurrency} placeholder="GHS" />
        <Button title="Save Currency" onPress={async () => {
          const d = await storage.loadData();
          d.settings.currency = currency;
          await storage.saveData(d);
          Alert.alert('Success', 'Currency updated');
        }} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Backup &amp; Restore</Text>
        <Button title="Backup Data to File" onPress={backupData} />
        <Button title="Restore from File" onPress={restoreData} variant="outline" />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Export Month</Text>
        <Text style={styles.hint}>Export sales and expenses for a month as CSV or PDF</Text>
        <Button title="Export as CSV" onPress={exportMonthCSV} />
        <Button title="Export as PDF" onPress={exportMonthPDF} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <Button title="Clear All Data" onPress={clearData} variant="danger" />
      </Card>

      <Button title="Back to Dashboard" onPress={() => onNavigate('Dashboard')} variant="outline" style={styles.backButton} />
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
  sectionTitle: {
    fontSize: theme.font.size.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
});
