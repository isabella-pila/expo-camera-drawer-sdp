import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

// Renomeei o componente para refletir a nova função
export default function BarcodeScannerScreen() { 
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  // ... (useEffect e lógica de permissão ficam iguais)
  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão para usar sua câmera.');
        navigation.goBack();
      }
    })();
  }, [requestPermission, navigation]);

  if (!permission?.granted) {
    return <View style={styles.container}><Text style={styles.message}>Solicitando permissão...</Text></View>;
  }


  const handleBarcodeScanned = ({ type, data }: { type: string, data: string }) => {
    if (scanned) {
      return;
    }
    setScanned(true); 
    console.log(`Tipo: ${type}, Dados: ${data}`); // O 'type' vai dizer se foi 'qr', 'ean13', etc.

    const isUrl = data.startsWith('http://') || data.startsWith('https://');

    const openLink = async () => {
      try {
        await Linking.openURL(data);
        navigation.goBack();
      } catch (error) {
        console.error("Erro ao abrir link:", error);
        Alert.alert("Erro", "Não foi possível abrir este link.");
        setScanned(false);
      }
    };

    const alertButtons = [];

    if (isUrl) {
      alertButtons.push({
        text: 'Abrir Link',
        onPress: openLink,
      });
    }

    alertButtons.push({
      text: 'Escanear Novamente',
      onPress: () => setScanned(false),
    });

    alertButtons.push({
      text: 'Voltar',
      onPress: () => navigation.goBack(),
      style: 'cancel' as const,
    });

    // --- MUDANÇA 1: Título do Alerta ---
    Alert.alert(
      isUrl ? 'Link Detectado!' : 'Código Lido!', // Título mais genérico
      data, 
      alertButtons,
      { cancelable: false }
    );
  };
  
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject} 
        barcodeScannerSettings={{
          // --- MUDANÇA 2: Tipos de Códigos ---
          // Adicionamos os tipos de códigos de barra mais comuns
          barcodeTypes: [
            'qr',       // QR Code (mantido)
            'ean13',    // Código de produto (o mais comum)
            'ean8',     // Código de produto (curto)
            'upc_a',    // Código de produto (EUA)
            'upc_e',    // Código de produto (EUA curto)
            'code128',  // Comum em logística
            'code39',   // Comum em indústria
          ], 
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} 
      />
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="close" size={30} color="white" />
      </TouchableOpacity>

      {/* --- MUDANÇA 3: Guia Visual (Estilo) --- */}
      <View style={styles.focusBoxContainer}>
        {/* O estilo 'styles.focusBox' foi alterado para um retângulo */}
        <View style={styles.focusBox}> 
          <Text style={styles.focusText}>Aponte para o código</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  message: { flex: 1, textAlign: 'center', color: 'white', paddingTop: 100 },
  closeButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 50 },
  focusBoxContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // --- MUDANÇA 3 (Estilo) ---
  focusBox: {
    width: 300,  // Mais largo
    height: 150, // Menos alto (formato de código de barras)
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  focusText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
});