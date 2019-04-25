import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'

const numbers=[
  {
    key:'1',
    name:'Emergencias:',
    num:'911'
  },
  {
    key:'2',
    name:'Policía de Guadalajara:',
    num:'201-6070'
  },
  {
    key:'3',
    name:'Policía de Zapopan:',
    num:'3836-3636'
  },
  {
    key:'4',
    name:'Policía de Tonalá',
    num:'35866101'
  },
  {
    key:'5',
    name:'Policía de Tlajomulco',
    num:'32834400'
  }
]

export default class PoiliceScreen extends React.Component {
  _renderItems(item){
    return(
    <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70}}>
        <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
          <Text style={{marginStart: 15,fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{marginStart: 15}}>{item.num}</Text>
        </View>
        <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
            <TouchableOpacity style={styles.buttonIcon}>
                <Icon name="phone" style={styles.buttonIcon} />
            </TouchableOpacity>
        </View>
    </View>
    )
}
  
  render() {
    return (
      <View style={{ flex: 1}}>
        <View style={{marginTop:30,alignItems:'center',justifyContent:'center',borderBottomWidth:0.5,borderBottomColor:'rgba(0,0,0,0.1)'}} >
          <TouchableOpacity style={styles.button} >
            <Text>Botón de pánico</Text>
          </TouchableOpacity>
        </View>
          <FlatList
            data={numbers}
            ItemSeparatorComponent={() => <View style={{width:10}}/>}
            showsVerticalScrollIndicator = {false}
            renderItem={({item}) => this._renderItems(item)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
      borderWidth:1,
      borderColor:'rgba(0,0,0,0.2)',
      alignItems:'center',
      justifyContent:'center',
      width:250,
      height:250 ,
      marginTop:5,
      marginEnd:5,marginStart:5,
      marginBottom:20,
      backgroundColor:'red',
      borderRadius:300,
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    color: 'black',
  },
 });