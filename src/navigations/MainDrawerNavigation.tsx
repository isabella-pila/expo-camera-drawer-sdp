import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from './NavigationTypes'; // Mude para RootDrawerParamList se quiser
import { CatalogNavigator } from './CatalogNavigator';
import RegisterProductScreen from '../screens/RegisterProductScreen';

export const colors = { primary: '#4BB9F5', secondary: '#F5C86E', third: '#D9D9D9', black: '#000',
white: '#FFF'
}

const Drawer = createDrawerNavigator<RootTabParamList>();

export function MainDrawerNavigator() {
 return (
 <Drawer.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: colors.white,
    drawerStyle: { backgroundColor: colors.primary },
    drawerActiveTintColor: colors.white,
    drawerInactiveTintColor: colors.white,
  }}
>
  <Drawer.Screen
    name="Catalog"
    component={CatalogNavigator}
    options={{
      title: 'Catálogo',
      headerShown: false,
      drawerIcon: ({ color, size }) => (
        <Ionicons name="list-outline" size={size} color={color} />
      ),
    }}
  />
  <Drawer.Screen
    name="Register"
    component={RegisterProductScreen}
    options={{
      title: 'Cadastrar Produto',
      drawerIcon: ({ color, size }) => (
        <Ionicons name="add-circle-outline" size={size} color={color} />
      ),
    }}
  />
</Drawer.Navigator>

 );
}