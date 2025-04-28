import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground 
      source={require('../../assets/bg.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default BackgroundWrapper;
