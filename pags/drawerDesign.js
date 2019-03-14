import React from "react";
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, Button, NativeModules } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
let couchbase_lite = NativeModules.couchbase_lite;
let couchbase_lite_native = NativeModules.couchbase_lite_native;

export default class drawerDesign extends React.Component {
  
  loguotPress = () =>{
    if(Platform.OS == 'android'){
      couchbase_lite.deleteUserdataDoc(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });

      couchbase_lite.deleteUserReportsDoc(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });
    }
    if(Platform.OS == 'ios'){
      couchbase_lite_native.deleteUserDataDocTXT(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });
    }
  }

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
            <TouchableOpacity style={styles.button} onPress={this.loguotPress}>
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



