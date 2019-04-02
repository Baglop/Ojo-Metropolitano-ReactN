import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button, Platform, TouchableOpacity} from 'react-native';
import logo from '../images/ojometropolitano.png';
import ImagePicker from 'react-native-image-picker';
import { Request_API } from '../networking/server';
const window = Dimensions.get('window');



export default class RegisterScreen extends React.Component {

  static navigationOptions = {
    header: null
  } 

  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      tokenFirebase: '',
      imagenPerfil: '',
      ubicacionUsuario: '0.0,-0.0',
      image: require('../images/No-profile.jpg')
    };
    this.getLocationUser();
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
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

  selectPhotoTapped() {
    const options = {
      quality: 0.95,
      maxWidth: 800,
      maxHeight: 800,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        let source64 = response.data;
        console.log(source64)
        this.setState({
          image: source,
          atributo: 'evidencia',
          nuevoValor: source64
        });
      }
    });
  }

  render() {
    var { params } = this.props.navigation.state;
    return (
      // <KeyboardAvoidingView
      //   style    = { styles.container }
      //   >
      <KeyboardAvoidingView style = {styles.container} behavior="padding">
      <View style = {styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>

          {this.state.image === null ? (
              <Animated.Image 
              source = { this.state.image } 
              style  = {styles.logo}
            />
            ) : (
              <Animated.Image 
            source = { this.state.image } 
            style  = {styles.logo}
          />
            )}
          
          </TouchableOpacity>
          <View>
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
          </View>
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
      height:       170,
      width: 170,
      margin:       10,
        marginTop:    1,
      borderRadius: 170/2
    },
    loginButton: {
        margin:    10,
        marginTop: 10,
        width: window.width - 30
      },
});