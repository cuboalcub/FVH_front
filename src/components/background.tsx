import React from 'react';
import { View, ImageBackground } from 'react-native';

const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground 
      source={require('../../assets/bg.png')} 
      className="flex-1"
      resizeMode="cover"
      blurRadius={2} // Efecto de desenfoque sutil
    >
      <View className="flex-1 bg-black/20"> {/* Capa semitransparente para mejor legibilidad */}
        <View className="flex-1 p-4">
          {children}
        </View>
      </View>
    </ImageBackground>
  );
};

export default BackgroundWrapper;