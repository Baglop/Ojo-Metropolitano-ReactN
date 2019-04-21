/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import logo from '../images/ojometropolitano.png';
import React from 'react';
import {Platform, StyleSheet, 
        View,     TextInput, 
        Image,    Button, 
        NativeModules, Alert, 
        KeyboardAvoidingView, 
        Animated,Dimensions, 
        Keyboard, StatusBar} from 'react-native';
import { Request_API } from '../networking/server';
import { PouchDB_Insert } from '../PouchDB/PouchDBQuerys'
import _ from 'lodash';
import firebase from 'react-native-firebase'
const URL = ':3030/API/inicio/IniciarSesion';
const URL2 = ':3030/API/miCuenta/ActualizarInformacionUsuario';
const modURL = ':3030/API/miCuenta/ModificarInformacionUsuario';
const reportesUsuario = ':3030/API/inicio/ActualizarMisReportes';
const AmigosyGrupos = ':3030/API/contactos/ActualizarAmigosYGrupos';
const width = '80%';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 1.2;
const IMAGE_HEIGHT_SMALL = window.height / 4;

export default class LoginScreen extends React.Component 
{
  constructor(props){
    super(props);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.state ={
      nombreUsuario:    '',
      contrasena:       '',
      ubicacionUsuario: '0.0,-0.0',
      tokenFireBase:    ''
    };
    this.getLocationUser();
    this.tokenFR();
  }

  getLocationUser(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude
        });
      },
      (error) => console.log(error)
    );
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT,
    }).start();
  };

  static navigationOptions = {
    header: null
  } 

  showAlert(title, message){
    Alert.alert(
      title,
      message,
      [,
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }

  tokenFR(){
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        this.setState({tokenFireBase: fcmToken})
        console.log(fcmToken)
      } else {
        console.log("No hay token")
      } 
    });
  }

  userInfoRequest(info){
    const request = {
      nombreUsuario: this.state.nombreUsuario,
      tokenSiliconBear: info.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario
    }
    const body = {
      nombreUsuario: this.state.nombreUsuario,
      tokenSiliconBear: info.tokenSiliconBear,
      tokenFirebase: this.state.tokenFireBase
    }
    Request_API(request,URL2).then(response => {
        if(response.codigoRespuesta === 200){
          PouchDB_Insert('ActualizarInformacionUsuario', 'ActualizarInformacionUsuario', response.usuario);
          PouchDB_Insert('BasicValues', 'BasicValues', body);
          this.props.navigation.replace('Main', {});
       }
    });    
  }

  userReportsRequest(info){
    const userReports = {
      nombreUsuario: this.state.nombreUsuario,
      tokenSiliconBear: info.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    };
    Request_API(userReports, reportesUsuario).then(response => { 
      if(response.codigoRespuesta === 200){
        response.reportes.map((data) => {
          PouchDB_Insert(data._id, 'userReports', data)
        })
      }
    });
  }

  userFriendsAndGroups(info){
    const userFyG = {
      nombreUsuario: this.state.nombreUsuario,
      tokenSiliconBear: info.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    };
    Request_API(userFyG, AmigosyGrupos).then(response => { 
      if(response.codigoRespuesta === 200){
        if(_.size(response.amigos) > 0){
          response.amigos.map((data) => {
            PouchDB_Insert('friends', 'friends', data)
          })
        }
        if(_.size(response.grupos) > 0){
          response.grupos.map((data) => {
            PouchDB_Insert(data.idGrupo, 'groups', data)
          })
        }
      }
    });
  }

  updateToken(info){
    console.log(info.tokenSiliconBear);
    const params = {
      nombreUsuario: this.state.nombreUsuario,
      atributoModificado: "tokenFirebase",
      valorNuevo: this.state.tokenFireBase,
      tokenSiliconBear: info.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    }
    Request_API(params,modURL).then(response =>{
      console.log(response);
    })
  }

  loginPress(){
    const body = {
      nombreUsuario: this.state.nombreUsuario,
      contrasena: this.state.contrasena,
      ubicacionUsuario: this.state.ubicacionUsuario
    }
    Request_API(body, URL).then(response => {
      if(response.codigoRespuesta === 200){
        this.updateToken(response);
        setTimeout(() => {
          this.userInfoRequest(response);
        }, 1000);
        setTimeout(() => {
          this.userReportsRequest(response);
        }, 1000); 
        setTimeout(() => {
          this.userFriendsAndGroups(response);
        }, 1000);  
      } else {
        this.showAlert('No se puede iniciar sesión',response.mensaje);
      }
    })
  }

  registerPress = () =>{
    this.props.navigation.replace('Register');
  }

  render() {
    var { navigate } = this.props.navigation;
    return (      
      <KeyboardAvoidingView behavior = "padding" style={styles.container}>
        <View style={{alignItems: 'center'}}>
        <StatusBar hidden />
          <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight }]} />
        </View>
        <View style={styles.SectionStyle}>
          <View style={styles.imageBackground}>
            <Image source={require('../images/2x/round_person_white_24dp.png')} style={styles.ImageStyle}/>
          </View>
          <TextInput
            style={{flex:1}}
            placeholder=" Usuario"
            placeholderTextColor="rgba(255,255,255,.4)"
            underlineColorAndroid="transparent"
            returnKeyType = { "next" }
            onSubmitEditing = {() => this.contrasena.focus()}
            onChangeText={(text) => this.setState({nombreUsuario:text})}
          />
        </View>
        {/* <View style={styles.registerButton}>
          <Button
            title = "Camera"
            color = "#51738e"
            onPress = {() => navigate("Camera", {})}
            />
        </View> */}
        <View style={styles.SectionStyle}>
          <View style={styles.imageBackground}>
            <Image source={require('../images/2x/round_lock_white_24dp.png')} style={styles.ImageStyle}/>
          </View>
          <TextInput
            secureTextEntry={true} 
            style={{flex:1}}
            placeholder=" Contraseña"
            placeholderTextColor="rgba(255,255,255,.4)"
            underlineColorAndroid="transparent"
            returnKeyType = "go"
            ref={(input) => this.contrasena = input}
            onChangeText={(text) => this.setState({contrasena:text})}
            />
        </View>
        <View style={styles.loginButton}>
          <Button
            title="Iniciar sesión"
            color="#51738e"
            onPress={() => this.loginPress()}
          />
        </View>
        <View style={styles.registerButton}>
          <Button
            title = "Aún no eres miembro? Registrarte aquí"
            color = "#FFFFFF"
            onPress = {() => navigate("Register", {})}
            />
        </View>
        
      </KeyboardAvoidingView>
    );
  }
}
 
const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    justifyContent:  'center',
    backgroundColor: '#3e4d59',
  },
  
  SectionStyle: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth:  .5,
    borderColor:  'rgba(255,255,255,.4)',
    height:       40,
    borderRadius: 5 ,
    margin:       10,
    marginTop:    10
  },

  loginButton: {
    margin:    10,
    marginTop: 10,
  },

  registerButton: {
    margin:    10,
    marginTop: 10,
  },

  logo: {
    height: IMAGE_HEIGHT,
    resizeMode:   'contain',
    marginBottom: 0,
    padding:      0,
    marginTop:    20
  },

  imageBackground: {
    height: 40,
    width:  40,
    backgroundColor: 'rgba(255,255,255,.4)',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius:    5
  },

  ImageStyle: {
      padding: 15,
      margin:  5,
      height:  25,
      width:   25,
      resizeMode: 'stretch',
      alignItems: 'center'
  },
});