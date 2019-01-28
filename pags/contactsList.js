import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';


const contacts = [
    {
        key: "1",
        name: "Pepe"
    },
    {
        key: "2",
        name: "Fursio"
    },
    {
        key: "3",
        name: "Kokun"
    },
    {
        key: "4",
        name: "AMLO"
    },
    {
        key: "5",
        name: "EPN-MIente"
    },
    {
        key: "6",
        name: "Francis"
    },
    {
        key: "6",
        name: "Delta"
    },
    {
        key: "7",
        name: "Luisito Comunica"
    }
]

export default class ContactsList extends React.Component {
    _renderItems(item){
        return(
        <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70}}>
            <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
                <View >
                    <Image source={require('../images/ojometropolitano.png')} style={styles.logoStyle} />
                </View>
                <View style={{marginStart: 15}}>
                    <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                    <Text>Test</Text>
                </View>
            </View>
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <TouchableOpacity style={styles.button}>
                    <Icon name="md-menu" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>
        </View>
        )
    }

  render() {
    return (
      <View style={{ flex: 1}}>
        <View>
            <Text style={{fontWeight:"bold",marginStart:10,marginTop:5}}>Contactos:</Text>
            <FlatList
              data={contacts}
              ItemSeparatorComponent={() => <View style={{width:10}}/>}
              showsHorizontalScrollIndicator = {false}
              renderItem={({item}) => this._renderItems(item)}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    button: {
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        borderBottomStartRadius: 0,
        justifyContent: 'center',
        backgroundColor:'#fff',
    },
    buttonIcon: {
        fontSize: 30,
        height: 30,
        color: 'grey',
      },
    logoStyle: {
      margin: 5,
      height: 50,
      width: 50,
      borderRadius: 100,
      resizeMode : 'stretch',
    },
   });