import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../screens/Dashboard';
import { Sales } from '../screens/Sales';
import { Expenses } from '../screens/Expenses';
import { Stock } from '../screens/Stock';
import { Debts } from '../screens/Debts';
import { Settings } from '../screens/Settings';

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Sales" component={Sales} />
      <Stack.Screen name="Expenses" component={Expenses} />
      <Stack.Screen name="Stock" component={Stock} />
      <Stack.Screen name="Debts" component={Debts} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};
