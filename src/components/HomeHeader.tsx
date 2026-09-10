import { globalStyles } from '@/styles/global';
import React from 'react';
import { Text, View } from 'react-native';

const HomeHeader = () => {
    const currentDate = new Date().toLocaleDateString( 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    } );
  return (
      <View style={globalStyles.header}>
          <Text style={globalStyles.date}> {currentDate} </Text>
    </View>
  )
}

export default HomeHeader