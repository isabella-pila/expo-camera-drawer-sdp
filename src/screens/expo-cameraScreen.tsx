import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../context/ProductContext';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 

export default function CameraScreen_ExpoCamera() {
  const navigation = useNavigation();
  const { setTempImageUri } = useProducts();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);


  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão para usar sua câmera.');
        navigation.goBack();
      }
    })();
  }, [requestPermission, navigation]); // Adicionadas dependências

  // 3. Funções de controle da Câmera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      // Qualidade 0.5 é um bom equilíbrio para apps
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setPhoto(pic);
    }
  }

  // 4. Funções da tela de Preview
  function retry() {
    setPhoto(null);
  }

  function usePhoto() {
    if (photo) {
      setTempImageUri(photo.uri); // <-- Envia para o Contexto
      navigation.goBack();       // <-- Fecha o Modal
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Solicitando permissão...</Text>
      </View>
    );
  }

  // Se uma foto foi tirada (photo !== null), mostra a tela de PREVIEW
  if (photo) {
    return (
      <ImageBackground source={{ uri: photo.uri }} style={styles.previewContainer}>
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity onPress={retry} style={styles.previewButton}>
            <Ionicons name="refresh" size={30} color="white" />
            <Text style={styles.previewButtonText}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={usePhoto} style={styles.previewButton}>
            <Ionicons name="checkmark" size={30} color="white" />
            <Text style={styles.previewButtonText}>Usar Foto</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Se não tem foto, mostra a CÂMERA
  return (
    <View style={styles.container}>
      
      <CameraView 
        ref={cameraRef} 
        facing={facing} 
        style={StyleSheet.absoluteFill} 
      />

    
      <TouchableOpacity 
        style={[styles.iconButton, styles.closeButton]}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="close" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.bottomControls}>
        <View style={styles.placeholder} /> 
        
   
        <TouchableOpacity onPress={takePicture} style={styles.shutterButton} />
        
       
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
          <Ionicons name="camera-reverse" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  loadingText: { color: 'white', fontSize: 18 },
  container: { flex: 1, backgroundColor: 'black' },

  // Controles da Câmera
  closeButton: { top: 50, left: 20 },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'grey',
  },
  iconButton: {
    padding: 10,
  },
  placeholder: { width: 55, height: 55 }, // Apenas para alinhamento

  // Controles do Preview
  previewContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Alinha botões na parte inferior
  },
  previewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewButton: {
    alignItems: 'center',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
});