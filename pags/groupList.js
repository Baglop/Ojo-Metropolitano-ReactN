import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const groups = [
    {
        key: "1",
        nombreGrupo: "Familia"
    },
    {
        key: "2",
        nombreGrupo: "Amigos"
    },
    {
        key: "3",
        nombreGrupo: "Trabajo"
    },
    {
        key: "4",
        nombreGrupo: "Escuela"
    },
    {
        key: "5",
        nombreGrupo: "Test"
    }
]

export default class GroupList extends React.Component {
   
    constructor(props){
        super(props);
        this.state ={
            groups:this.props.groups,
        };
      }
         
    _renderItems(item){
        return(
        <TouchableOpacity style={styles.button}>
            <Text>{item.nombreGrupo}</Text>
        </TouchableOpacity>
        )
    }

    _renderAddButton(){
        return(
            <TouchableOpacity style={styles.button}>
                <Icon name="md-add" style={styles.modalButtonIcon} />
            </TouchableOpacity>
        )
    }

  render() {
    return (
      <View >
        <View>
            <Text style={{fontWeight:"bold",marginStart:10,marginTop:5}}>Grupos:</Text>
            <FlatList
              data={[{nombreGrupo:"add"},...groups]}
              horizontal = {true}
              showsHorizontalScrollIndicator = {false}
              renderItem={({item}) => item.nombreGrupo === "add" ?this._renderAddButton() : this._renderItems(item)}
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
    modalButtonIcon: {
        fontSize: 35,
        height: 35,
        color: 'grey',
      },
   });
