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
let couchbase_lite = NativeModules.couchbase_lite;
let couchbase_lite_native = NativeModules.couchbase_lite_native;
const URL = 'http://siliconbear.dynu.net:3030/API/inicio/IniciarSesion';
const URL2 = ':3030/API/miCuenta/ActualizarInformacionUsuario';
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
      ubicacionUsuario: '0.0,-0.0'
    };
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
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  userInfoRequest(info){
    const request = {
      nombreUsuario: this.state.nombreUsuario,
      tokenSiliconBear: info.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario
    }
    Request_API(request,URL2).then(response => {
       console.log(JSON.stringify(response));
      
        if(Platform.OS == 'android'){
            couchbase_lite.setUserInfoDoc(JSON.stringify(response))
        }
        this.props.navigation.replace('Main', {nombreUsuario: info.nombreUsuario, tokenSiliconBear: info.tokenSiliconBear});
      }
    )    
  }

  loginPress(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude
        });
      },
      (error) => console.log(error)
    );
    fetch(URL,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
      if(response.codigoRespuesta == 200){
        this.userInfoRequest(response);
        if(Platform.OS == 'android'){
          couchbase_lite.setUserdataDoc(response.tokenSiliconBear, this.state.nombreUsuario);
          
        }
        if(Platform.OS == "ios"){
          couchbase_lite_native.setUserdataDocTXT(response.tokenSiliconBear, this.state.nombreUsuario);
        }
      } else{
        this.showAlert('No se puede iniciar sesión','El usuario o contraseña ingresada son incorrectos');
      }
    })
    .catch(err => console.error(err));
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