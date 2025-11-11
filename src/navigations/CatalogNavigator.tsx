import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CatalogStackParamList } from './NavigationTypes';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../navigations/MainDrawerNavigation';
import { DrawerActions } from '@react-navigation/native'; // <-- 1. IMPORTE AQUI

// Telas
import CatalogScreen from '../screens/CatalogScreen';

const CatalogStack = createStackNavigator<CatalogStackParamList>();

export function CatalogNavigator() {
 return (
 <CatalogStack.Navigator
 screenOptions={{
 headerStyle: { backgroundColor: colors.primary },
 headerTintColor: colors.white,
 }}>
<CatalogStack.Screen
 name="CatalogList"
 component={CatalogScreen}
 options={({ navigation }) => ({
 title: 'Catálogo',
 headerLeft: () => (
 <Ionicons
 name="menu"
 size={28}
 color={colors.white}
style={{ marginLeft: 15 }}
              // 2. MUDE O onPress PARA USAR 'dispatch'
 onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
 />
 ),
 })}
 />

 </CatalogStack.Navigator> );
}