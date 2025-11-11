import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native'; // 1. Importar o Linking
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function QrCodeScannerScreen() {
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


  // --- FUNÇÃO CORRIGIDA ---
  const handleBarcodeScanned = ({ type, data }: { type: string, data: string }) => {
    if (scanned) {
      return;
    }
    setScanned(true); // Trava o scanner
    console.log(`Tipo: ${type}, Dados: ${data}`);

    const isUrl = data.startsWith('http://') || data.startsWith('https://');

    // Função para abrir o link (LÓGICA ATUALIZADA)
    const openLink = async () => {
      try {
        // Tenta abrir o link
        await Linking.openURL(data);
        // Se deu certo, o usuário foi pro navegador, então fechamos o modal.
        navigation.goBack();

      } catch (error) {
        console.error("Erro ao abrir link:", error);
        Alert.alert("Erro", "Não foi possível abrir este link.");
        // Se deu erro, libera o scanner para tentar de novo
        setScanned(false);
      }
    };

    // Montar os botões do Alerta
    const alertButtons = [];

    if (isUrl) {
      alertButtons.push({
        text: 'Abrir Link',
        onPress: openLink, // Chama a nova função
      });
    }

    alertButtons.push({
      text: 'Escanear Novamente',
      onPress: () => setScanned(false), // Apenas libera o scanner
    });

    alertButtons.push({
      text: 'Voltar',
      onPress: () => navigation.goBack(),
      style: 'cancel' as const,
    });

    // Mostrar o Alerta
    Alert.alert(
      isUrl ? 'Link Detectado!' : 'QR Code Lido!',
      data, 
      alertButtons,
      { cancelable: false }
    );
  };
  
  // ... (O resto do seu return e estilos fica igual)
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject} 
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], 
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} 
      />
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="close" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.focusBoxContainer}>
        <View style={styles.focusBox}>
          <Text style={styles.focusText}>Aponte para o QR Code</Text>
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
  focusBox: { width: 250, height: 250, borderWidth: 2, borderColor: 'white', borderRadius: 10, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  focusText: { color: 'white', fontSize: 16, marginBottom: 20 },
});