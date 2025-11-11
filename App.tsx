

import 'react-native-gesture-handler'; 
import React from 'react';

import { ProductProvider } from './src/context/ProductContext';
import AppNavigator from './src/navigations/AppNavigator';
// import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ProductProvider>

      <AppNavigator />
    </ProductProvider>
  );}
