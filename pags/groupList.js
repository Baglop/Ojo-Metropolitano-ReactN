import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const groups = [
    {
        key: "1",
        name: "Familia"
    },
    {
        key: "2",
        name: "Amigos"
    },
    {
        key: "3",
        name: "Trabajo"
    },
    {
        key: "4",
        name: "Escuela"
    },
    {
        key: "5",
        name: "Test"
    }
]

export default class GroupList extends React.Component {
    _renderItems(item){
        return(
        <TouchableOpacity style={styles.button}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
        )
    }

  render() {
    return (
      <View >
        <View>
            <Text style={{fontWeight:"bold",marginStart:10,marginTop:5}}>Grupos:</Text>
            <FlatList
              data={groups}
              horizontal = {true}
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
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:70,
        height:70,
        marginTop:5,
        marginEnd:5,marginStart:5,
        marginBottom:5,
        backgroundColor:'#fff',
        borderRadius:100,
    },
   });
