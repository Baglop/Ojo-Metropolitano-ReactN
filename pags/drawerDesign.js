import React from "react";
import { View, Text,StyleSheet,StatusBar, Image, TouchableOpacity, Button } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

export default class drawerDesign extends React.Component {
  

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{height:200,backgroundColor:'black'}} >
        </View>
        <View style={{marginTop:30,marginStart:10}} >
            <TouchableOpacity style={styles.button}>
                <Icon name="edit" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Modificar cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Icon name="deleteuser" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Eliminar cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Icon name="logout" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
        <View style={{marginTop:30,marginStart:10}} >
            <TouchableOpacity style={styles.button}>
                <Icon name="questioncircle" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Acerca de</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Icon name="infocirlce" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Contacto</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    height: 100,
    width: 100,
    borderRadius: 200,
    resizeMode : 'stretch',
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    marginEnd: 10,
    color:'black',
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:20
  }
 });



