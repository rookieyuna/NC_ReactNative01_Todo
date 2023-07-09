import React, {useEffect, useState} from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'; 


const API_KEY = '7b26c92417fd3678d52eac12dc870222' 
// 405fd687120fd01f306cbe14b2e8baa4 내꺼 
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const icons = {
    Clear: "day-sunny",
    Clouds: "cloudy",
    Rain: "rain",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Drizzle: "day-rain",
    Thunderstorm: "lightning",  
  };

export default function App() {

  const [ city, setCity ] = useState('Loading...');
  const [ okay, setOkay ] = useState(true);
  const [ forecasts, setForeCasts ] = useState([]);
  
  useEffect(()=> {
    getWeather();
  }, [])

  const getWeather = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if(!granted) {
      setOkay(false)
    }

    const { coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const address = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    setCity(address[0].city)

    // const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json()

    setForeCasts(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("12:00:00")) {
          return weather;
        }
        })
      );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.weather}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          persistentScrollbar 
        >
          { forecasts.length === 0 ? 
            (<View style={{...styles.day, alignItems: 'center'}}>
              <ActivityIndicator color='black' size='large' style={{marginTop: 10 }}/>
            </View>)
            : 
            (forecasts.map((day, index) => 
            <View key={index}>
              <View style={styles.date}>
                <Text style={styles.dateText}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              </View>
              <View style={styles.day} >
              <View style={styles.tempBox}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={45} color="white" />
              </View>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.tinyDesc}>{day.weather[0].description}</Text>
            </View>
            </View>
            ) )
          }
        </ScrollView>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightpink'
    
  },
  city: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cityName: {
    fontSize: 56,
    fontWeight: 500,
  },
  weather: {
    flex: 2.5,
  },
  date: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 40,
    fontWeight: 400,
    color: 'white'
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 30,
  },
  tempBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  temp: {
    marginTop: 20,
    fontSize: 100,
    color: 'white'
  },
  desc: {
    marginTop: -20,
    fontSize: 50,
  },
  tinyDesc: {
    fontSize: 24,
  }
});
