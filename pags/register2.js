import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button, Platform} from 'react-native';
import logo from '../images/ojometropolitano.png';
import { Request_API } from '../networking/server';
const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 1.5;
const IMAGE_HEIGHT_SMALL = window.height / 5;

export default class RegisterScreen extends React.Component {

  static navigationOptions = {
    header: null
  } 

  constructor(props) {
    super(props);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.state = {
      correo: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      tokenFirebase: '',
      imagenPerfil: '',
      ubicacionUsuario: '0.0,-0.0'
    };
    this.getLocationUser();
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

  render() {
    var { params } = this.props.navigation.state;
    return (
      <KeyboardAvoidingView
        style    = { styles.container }
        behavior = "padding"
        >
          <Animated.Image 
            source = { logo } 
            style  = { [styles.logo, { height: this.imageHeight }] }
          />
          <TextInput
            placeholder          = " Email"
            returnKeyType        = "next"
            keyboardType         = "email-address"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style           = { styles.input }
            onSubmitEditing = { () => this.email.focus() }
            onChangeText    = { (text) => this.setState({correo:text}) }
          />
          <TextInput
            placeholder          = " Nombre(s)"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { styles.input }
            ref   = { (input) => this.email = input }
            onSubmitEditing = { () => this.names.focus() } 
            onChangeText    = { (text) => this.setState({nombres:text}) }           
          />
          <TextInput
            placeholder          = " Apellido paterno"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { styles.input }
            ref   = { (input) => this.names = input }
            onSubmitEditing = { () => this.laste_name.focus() }
            onChangeText    = { (text) => this.setState({apellidoPaterno:text}) }
          />
          <TextInput
            placeholder          = " Apellido materno"
            returnKeyType        = "done"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { styles.input }
            ref   = { (input) => this.laste_name = input }     
            onChangeText    = { (text) => this.setState({apellidoMaterno:text}) }       
          />
          <View style={styles.loginButton}>
            <Button
              title = "Registrar"
              color = "#FFFF"
              
              //onPress = {() => this.props.navigation.replace('Login')}
              //onPress = {this.joinSB}
              onPress = {() => {const bodyJoin = {
                nombreUsuario: params.nombreUsuario,
                contrasena:    params.contrasena,
                celular:       params.celular,
                correo:        this.state.correo,
                nombres:       this.state.nombres,
                apellidoPaterno:this.state.apellidoPaterno,
                apellidoMaterno:this.state.apellidoMaterno,
                tokenFirebase: '',
                imagenPerfil: '',
                ubicacionUsuario: this.state.ubicacionUsuario
              }
            console.warn(bodyJoin); }}
            />
          </View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3e4d59',      
      alignItems:      'center',
      justifyContent:  'center',
    },
    input: {
        flexDirection:   'row',
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: 'rgba(255,255,255,0)',        
        borderColor:     'rgba(255,255,255,.4)',
        borderWidth:  .5,
        height:       40,
        borderRadius: 5 ,
        margin:       10,
        marginTop:    1,
        width: window.width - 30
      },
    logo: {
      height:       IMAGE_HEIGHT,
      resizeMode:   'contain',
      marginBottom: 0,
      padding:      20,
      marginTop:    -10
    },
    loginButton: {
        margin:    10,
        marginTop: 10,
        width: window.width - 30
      },
});