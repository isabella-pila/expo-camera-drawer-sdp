import React, { useState, useRef } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraType, CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { Ionicons } from '@expo/vector-icons'; // Para os ícones

const ButtonInterface: React.FC<any> = ({ onPress, title, style, children }) => (
  <TouchableOpacity onPress={onPress} style={[localStyles.buttonBase, style]}>
    {children || <Text style={localStyles.buttonText}>{title}</Text>}
  </TouchableOpacity>
);
// --- FIM DOS COMPONENTES SUBSTITUTOS ---


export function VideoScreen() {
  // --- STATES ---
  const [recordUri, setRecordUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  
  // --- PERMISSÕES ---
  // CORREÇÃO 1: Renomeei para requestMicrophonePermission
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  
  // --- REFS E PLAYER ---
  const ref = useRef<CameraView>(null);
  const player = useVideoPlayer(recordUri, player => {
    player.loop = true;
    player.play();
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // --- LÓGICA DE PERMISSÃO ---
  if (!cameraPermission || !microphonePermission) {
    // return <ComponentLoading />; // Seu componente de loading
    return <View style={localStyles.container}><Text style={localStyles.message}>Carregando...</Text></View>;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.message}>Permita acessar a Câmera</Text>
        <Button onPress={requestCameraPermission} title="Permitir Câmera" />
      </View>
    );
  }

  // CORREÇÃO 2: A função de pedir permissão é requestMicrophonePermission
  if (!microphonePermission.granted) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.message}>Permita acessar o Microfone</Text>
        <Button onPress={requestMicrophonePermission} title="Permitir Microfone" />
      </View>
    );
  }

  // --- LÓGICA DE GRAVAÇÃO (BOTÃO ÚNICO) ---
  const handleRecording = async () => {
    if (isRecording) {
      // Se está gravando -> Para
      ref.current?.stopRecording();
      // O `recordAsync` abaixo vai resolver e mudar o estado
    } else {
      // Se está parado -> Começa a gravar
      setIsRecording(true);
      try {
        const data = await ref.current?.recordAsync({
          maxDuration: 10,
        });
        
        if (data) {
          setRecordUri(data.uri); // <-- Muda para a tela de preview
          console.log("Vídeo salvo em:", data.uri);
        }
      } catch (e) {
        console.error("Falha ao gravar:", e);
      } finally {
        setIsRecording(false); // Garante que o estado resete
      }
    }
  };

  // --- LÓGICA DO PREVIEW ---
  const handleRecordAgain = () => {
    player.pause()
    setRecordUri(''); // <-- Volta para a tela da câmera
  };

  // --- RENDERIZAÇÃO ---

  // CORREÇÃO 3: Renderização Condicional (Preview OU Câmera)
  
  // SEÇÃO DE PREVIEW (Já gravou um vídeo)
  if (recordUri) {
    return (
      <View style={localStyles.container}>
        <VideoView 
          style={localStyles.video} 
          player={player} 
          allowsFullscreen 
          allowsPictureInPicture 
        />
        <ButtonInterface onPress={() => isPlaying ? player.pause() : player.play()}
          type='primary' title={isPlaying ? 'Pause' : 'Play'}
        />
        <ButtonInterface onPress={handleRecordAgain}
          type='secondary' title='Gravar Novamente'
        />
      </View>
    );
  }

  // SEÇÃO DA CÂMERA (Gravando ou pronto para gravar)
  return (
    <View style={localStyles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} // Ocupa a tela toda
        facing={facing} 
        ref={ref} 
        mode='video' 
      />
      
      {/* Botão de Inverter Câmera (Canto superior) */}
      <View style={localStyles.topControls}>
        <ButtonInterface 
          onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
          style={localStyles.flipButton}
        >
          <Ionicons name="camera-reverse" size={30} color="white" />
        </ButtonInterface>
      </View>

      {/* Botão de Gravar/Parar (Centro inferior) */}
      <View style={localStyles.bottomControls}>
        <ButtonInterface 
          onPress={handleRecording} 
          style={isRecording ? localStyles.recordButtonStop : localStyles.recordButtonStart}
        />
      </View>
    </View>
  );
}

// --- ESTILOS (Apenas para este exemplo) ---
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  video: {
    width: '100%',
    height: '80%',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  recordButtonStart: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordButtonStop: {
    width: 70,
    height: 70,
    borderRadius: 8, // Quadrado
    backgroundColor: 'red',
    borderWidth: 4,
    borderColor: 'white',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 50,
  },
  buttonBase: { // Substituto para seu ButtonInterface
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});