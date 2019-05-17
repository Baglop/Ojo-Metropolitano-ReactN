import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button, TouchableWithoutFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../images/ojometropolitano.png';
import DropdownAlert from 'react-native-dropdownalert';
const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 1.6;
const IMAGE_HEIGHT_SMALL = window.height / 5;

import { Request_API } from '../networking/server';
const validarUser = ':3030/API/contactos/BuscarUsuario'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class RegisterScreen extends React.Component {

  static navigationOptions = {
    header: null
  } 

  constructor(props) {
    super(props);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.state = {
      nombreUsuario: '',
      contrasena1:   '',
      contrasena2:   '',
      celular:       '',
      disable:       true,
      password:      false,
      contrasena1TXT: false,
      contrasena2TXT: false,
      celularTXT: false,
    }
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

  validateUserName(){
    if(this.state.nombreUsuario !== ''){
      const bodyPetition = {
        nombreUsuario: this.state.nombreUsuario
      }
      Request_API(bodyPetition, validarUser)
        .then(response => {
        if(response.codigoRespuesta !== 200){
          this.dropdown.alertWithType('success','Correcto','Este nombre de usuario está disponible para su uso')
        }
        else {
          this.dropdown.alertWithType('error','Error','Este usuario ya existe')
        }
      });
    } else {
      this.dropdown.alertWithType('error','Error','Este campo es requerido')
    }
  }

  validatePass1(){
    if(this.state.contrasena1 === ''){
      this.dropdown.alertWithType('error','Error','Este campo es requerido')
    } else {
      if(this.state.contrasena1.length < 5){
        this.dropdown.alertWithType('error','Error','La contraseña debe tener más de 5 caracateres')
      }
    }
  }

  validatePass2(){
  if(this.state.contrasena2 !== ''){
    if(this.state.contrasena1 !== this.state.contrasena2){
      this.dropdown.alertWithType('error','Error','Las contraseñas ingresadas no son las mismas')
    }
  } else {
    this.dropdown.alertWithType('error','Error','Este campo es requerido')
  }
  }

  validatePhone(){
    if(this.state.celular !== ''){
      if(this.state.celular.length < 10){
        this.dropdown.alertWithType('error','Error','Ingresa un número telefónico válido')
      } 
      if(this.state.celular.length > 10) {
        this.dropdown.alertWithType('error','Error','Ingresa un número telefónico válido')
      } else {
        if(this.state.nombreUsuario !== '' && this.state.contrasena1 !== '' && this.state.contrasena2 !== '' && this.state.celular !== ''){
          this.setState({disable: false})
        } else {
          this.dropdown.alertWithType('error','Error','Todos los campos deben de ser completados')
        }
      }
    } else {
      this.dropdown.alertWithType('error','Error','Este campo es requerido')
    }
  }

  render() {
    var { navigate } = this.props.navigation;
    return (
      <DismissKeyboard>
      <View style={styles.root}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#4095ac','#122e39','#050e13','#050c12']} style={styles.root}>
      <KeyboardAvoidingView
        style    = { styles.container }
        behavior = "padding"
        >
        <View style={{alignItems: 'center'}}>
          <Animated.Image 
            source = { logo } 
            style  = { [styles.logo, { height: this.imageHeight }] }
          />
          </View>
          <TextInput
            placeholder          = "Usuario"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style           = { styles.input }
            onSubmitEditing = { () => this.pass.focus() }
            onChangeText    = { text => this.setState({nombreUsuario: text}) }
            onEndEditing    = {() => this.validateUserName()}  
                   
          />
          <TextInput
            placeholder          = "Contraseña"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { {flex:1} }
            style = { styles.input }
            ref   = { (input) => this.pass = input}
            onSubmitEditing = {() => this.confirm_pass.focus() }
            onChangeText    = { (text) => this.setState({contrasena1 :text}) }
            secureTextEntry = { true}
            onEndEditing    = {() => this.validatePass1()}  
          />
          <TextInput
            placeholder          = "Confirmar contraseña"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { {flex:1} }
            style = { styles.input }
            ref   = { (input) => this.confirm_pass = input }
            onSubmitEditing = { () => this.phone.focus() }
            secureTextEntry = { true } 
            onChangeText    = { (text) => this.setState({contrasena2 :text}) }
            onEndEditing    = {() => this.validatePass2()} 
          />
          <TextInput
            placeholder          = "Celular"
            keyboardType         = "number-pad"
            returnKeyType        = "done"
            placeholderTextColor = "rgba(255,255,255,.4)"
            ref   = { (input) => this.phone = input }
            style = { styles.input }
            onChangeText = { (text) => this.setState({celular:text}) }
            onEndEditing    = {() => this.validatePhone()} 
          />
          <View style={styles.loginButton}>
          <TouchableOpacity 
          disabled={this.state.disable}
          style={{backgroundColor:'#51738e', alignContent:'center',alignItems:'center',padding:10,borderRadius:5}}
          onPress={() => navigate("Register2" , { nombreUsuario: this.state.nombreUsuario,
            contrasena:    this.state.contrasena2,
            celular:       this.state.celular})}> 
            <Text style={{color:'white'}}>Continuar</Text>
          </TouchableOpacity>
          </View>
          <DropdownAlert
          ref={ref => this.dropdown = ref}
          showCancel={true}
        />
      </KeyboardAvoidingView>
      </LinearGradient>
      </View>
      </DismissKeyboard>
    );
  }
};

const styles = StyleSheet.create({
  root:{
    flex: 1
  }, 
    container: {
      flex: 1,  
      justifyContent:  'center',
      //backgroundColor: '#3e4d59',
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
        width: window.width - 30,
        paddingLeft: 8,
        fontSize: 17,
        paddingLeft: 8,
        color: 'white',
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