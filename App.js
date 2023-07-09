import React, {useEffect, useState} from 'react';

import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { theme } from './colors'

const STORAGE_KEY = "@todos"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState({});

  useEffect(()=>{
    loadTodos()
  },[])

  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)
  const loadTodos = async () => {
    try{
      const loadData = await AsyncStorage.getItem(STORAGE_KEY)
      setTodos(JSON.parse(loadData))
    } catch(e) {
      throw e
    }
  }

  const addTodo = async () => {
    if(text === ""){
      return
    }
    // const newTodos = Object.assign({}, todos, {[Date.now()]: {text, work: working}})
    const newTodos = {
      ...todos,
      [Date.now()]: {text, working}
    }

    setTodos(newTodos)
    await saveTodos(newTodos)
    setText("")
    console.log(todos)
  }

  const saveTodos = async (toSave) => {
    try{
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch(e) {
      throw e
    }
  }

  const deleteTodos = (key) => {
    Alert.alert(
      `Delete ${todos[key].text}?`, 
      "Are you Sure?",
      [
        { text: "cancel"},
        { text: "I'm sure", 
        style: "destructive",
        onPress: async () => {
          const newTodos = {...todos}
          delete newTodos[key]
      
          setTodos(newTodos)
          await saveTodos(newTodos)
        }}
      ]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? theme.white : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? theme.white : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          style={styles.input} 
          value={text}
          placeholder={working ? 'Add a Todo!' : 'Where do you go?'}
          returnKeyType='done'
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
        ></TextInput>
      </View>
      <ScrollView>
        {Object.keys(todos).map(key => 
          todos[key].working === working ? (
          <View style={styles.todo} key={key}>
            <Text style={styles.todoText}>{todos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteTodos(key)}><Ionicons name="trash-bin-outline" size={18} color="pink" /></TouchableOpacity>
          </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100
  },
  btnText: {
    fontSize: 38,
    fontWeight: 600,
    color: theme.white 
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500
  }
});