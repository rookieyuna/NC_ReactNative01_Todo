import React, {useEffect, useState} from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';


export default function TodoList() {

  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text>Work</Text>
        <Text>Travel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    flexDirection: 'row',
  },
  btnText: {
    color: 'white'
  }
});
