import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';
import { storage } from '../storage';
import { StockItem, AppData } from '../types';

export const Stock = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const d: AppData = await storage.loadData();
      setStock(d.stock);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!product.trim() || !quantity.trim() || !costPrice.trim() || !sellingPrice.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const qty = parseInt(quantity, 10);
    const cp = parseFloat(costPrice);
    const sp = parseFloat(sellingPrice);
    if (isNaN(qty) || qty <= 0 || isNaN(cp) || cp < 0 || isNaN(sp) || sp <= 0) {
      setError('Enter valid numbers');
      return;
    }

    const newItem: StockItem = {
      id: Date.now().toString(),
      name: product.trim(),
      quantity: qty,
      unit: 'pcs',
      minQuantity: 0,
      costPrice: cp,
      sellingPrice: sp,
    };

    const d: AppData = await storage.loadData();
    d.stock.push(newItem);
    await storage.saveData(d);
    setStock([...d.stock]);
    setProduct('');
    setQuantity('');
    setCostPrice('');
    setSellingPrice('');
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

  const totalValue = stock.reduce((sum, s) => sum + s.quantity * s.sellingPrice, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manage Stock</Text>

      <Card style={styles.card}>
        <Input label="Product" value={product} onChangeText={setProduct} placeholder="e.g. Maize flour" />
        <Input label="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="0" />
        <Input label="Cost Price (\u20B5)" value={costPrice} onChangeText={setCostPrice} keyboardType="numeric" placeholder="0.00" />
        <Input label="Selling Price (\u20B5)" value={sellingPrice} onChangeText={setSellingPrice} keyboardType="numeric" placeholder="0.00" />
        <Input label="Date" value={date} onChangeText={setDate} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Add Stock Item" onPress={handleSave} />
      </Card>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Stock Value</Text>
        <Text style={styles.totalValue}>\u20B5{totalValue.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Stock Items</Text>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listItemText}>{item.name}</Text>
              <Text style={styles.listItemDetail}>
                {item.quantity} x \u20B5{item.sellingPrice.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.listItemAmount}>\u20B5{(item.quantity * item.sellingPrice).toFixed(2)}</Text>
          </View>
        )}
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
  listItemDetail: {
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