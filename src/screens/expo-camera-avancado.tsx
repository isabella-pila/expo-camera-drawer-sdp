import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import Slider from '@react-native-community/slider'; 
import { 
  CameraView, 
  CameraType, 
  useCameraPermissions, 
  CameraCapturedPicture, 
  FlashMode,

  FocusMode  // <-- Importar Enum FocusMode
} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../context/ProductContext'; // Ajuste o caminho se necessário
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function ImagePickerCameraScreen_AdvancedControls() {
  const navigation = useNavigation();
  const { setTempImageUri } = useProducts();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // --- STATES PARA OS CONTROLES (Usando Enums) ---
// --- STATES PARA OS CONTROLES (Usando Strings) ---
 const [zoom, setZoom] = useState(0);
  
  // O tipo é FlashMode, o valor inicial é a string 'off'
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  
  // O tipo é FocusMode, o valor inicial é a string 'on'
  const [autoFocus, setAutoFocus] = useState<FocusMode>('on');
  // Pedir permissão ao carregar
  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão para usar sua câmera.');
        navigation.goBack();
      }
    })();
  }, [requestPermission, navigation]);

  // --- FUNÇÕES DE CONTROLE (Usando Enums) ---
  // --- FUNÇÕES DE CONTROLE (Usando Strings) ---
// --- FUNÇÕES DE CONTROLE (Usando Strings) ---
  const toggleFlash = () => {
    if (flashMode === 'off') setFlashMode('on');
    else if (flashMode === 'on') setFlashMode('auto');
    else setFlashMode('off');
  };

  const toggleFocus = () => {
    setAutoFocus(current => (current === 'on' ? 'off' : 'on'));
  };

  // O mapeamento de ícones (já estava correto)
  const flashIcon = flashMode === 'off' ? 'flash-off' : (flashMode === 'on' ? 'flash' : 'flash-outline');
  const focusIcon = autoFocus === 'on' ? 'aperture' : 'aperture-outline';


  


  // --- Funções Padrão ---
  async function takePicture() {
    if (cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setPhoto(pic);
    }
  }
  function retry() { setPhoto(null); }
  function usePhoto() {
    if (photo) {
      setTempImageUri(photo.uri); 
      navigation.goBack();       
    }
  }

  // --- RENDERIZAÇÃO ---
  if (!permission?.granted) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Solicitando permissão...</Text></View>;
  }

  // Tela de PREVIEW
  if (photo) {
    return (
      <ImageBackground source={{ uri: photo.uri }} style={styles.previewContainer}>
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity onPress={retry} style={styles.previewButton}><Ionicons name="refresh" size={30} color="white" /><Text style={styles.previewButtonText}>Repetir</Text></TouchableOpacity>
          <TouchableOpacity onPress={usePhoto} style={styles.previewButton}><Ionicons name="checkmark" size={30} color="white" /><Text style={styles.previewButtonText}>Usar Foto</Text></TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Tela da CÂMERA
  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        facing={facing} 
        style={StyleSheet.absoluteFill} 
        zoom={zoom}
        flash={flashMode}
        autofocus={autoFocus} // <-- Prop correta (minúscula)
      />

      {/* Controles do TOPO */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={30} color="white" />
        </TouchableOpacity>
        
        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={flashIcon} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFocus}>
            <Ionicons name={focusIcon} size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Controles de BAIXO */}
      <View style={styles.bottomControls}>
        {/* Controle de ZOOM */}
        <View style={styles.zoomContainer}>
          <Text style={styles.zoomText}>ZOOM</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Platform.OS === 'ios' ? 0.035 : 1} 
            value={zoom}
            onValueChange={setZoom}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#AAAAAA"
          />
        </View>
        
        {/* Shutter e Virar Câmera */}
        <View style={styles.shutterContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))}>
            <Ionicons name="camera-reverse" size={35} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={takePicture} style={styles.shutterButton} />
          
          <View style={styles.placeholder} /> 
        </View>
      </View>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  loadingText: { color: 'white', fontSize: 18 },
  container: { flex: 1, backgroundColor: 'black' },

  // --- Controles do TOPO ---
  topControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    marginHorizontal: 5,
  },

  // --- Controles de BAIXO ---
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Controles do ZOOM
  zoomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  zoomText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },

  // Controles do SHUTTER
  shutterContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'grey',
  },
  placeholder: { width: 55, height: 55 }, // Apenas para alinhamento

  // --- PREVIEW --- 
  previewContainer: { flex: 1, justifyContent: 'flex-end' },
  previewButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 120, backgroundColor: 'rgba(0,0,0,0.5)' },
  previewButton: { alignItems: 'center' },
  previewButtonText: { color: 'white', fontSize: 16, marginTop: 5, fontWeight: 'bold' },
});