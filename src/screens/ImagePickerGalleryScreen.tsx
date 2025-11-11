import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../context/ProductContext';

export default function ImagePickerGalleryScreen() {
  const navigation = useNavigation();
  const { setTempImageUri } = useProducts();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
        navigation.goBack();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, aspect: [4, 3], quality: 1,
      });

      if (!result.canceled) {
        setTempImageUri(result.assets[0].uri);
      } else {
        setTempImageUri(null);
      }
      navigation.goBack();
    })();
  }, []);

  return <View><Text>Abrindo galeria...</Text></View>;
}