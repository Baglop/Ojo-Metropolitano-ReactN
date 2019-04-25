import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Text, Platform, TouchableOpacity, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Request_API } from '../networking/server';
const window = Dimensions.get('window');
const registerUser = ':3030/API/inicio/RegistrarUsuario'
let params = '';

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
      image: null,
      logo: require('../images/No-profile.jpg'),
      image64: null,
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
      quality: 0.90,
      maxWidth: 750,
      maxHeight: 750,
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
          image64: source64
        });
      }
    });
  }

  joinSiliconBear(){
    if(Platform.OS === 'ios'){
    const bodyPetition = {
      nombreUsuario: params.params.nombreUsuario,
      contrasena:    params.params.contrasena,
      celular:       params.params.celular,
      correo:        this.state.correo,
      nombres:       this.state.nombres,
      apellidoPaterno:this.state.apellidoPaterno,
      apellidoMaterno:this.state.apellidoMaterno,
      tokenFirebase: '',
      imagenPerfil:   this.state.image64,
      ubicacionUsuario: this.state.ubicacionUsuario
    }
    console.log(bodyPetition);
    Request_API(bodyPetition, registerUser)
        .then(response => {
        if(response.codigoRespuesta === 200){
          Alert.alert(
            'Correcto',
            response.mensaje,
            [,
              {text: 'OK', onPress: () => this.setState({ visibleModal: null })},
            ],
            {cancelable: false},
          );
        }
        else{
          Alert.alert(
            'Error ' + response.codigoRespuesta,
            response.mensaje,
            [,
              {text: 'OK'},
            ],
            {cancelable: false},
          );
        }
      });
    }
  }

  render() {
    params = this.props.navigation.state;
    console.log(params.params)
    return (
      // <KeyboardAvoidingView
      //   style    = { styles.container }
      //   >
      <KeyboardAvoidingView style = {styles.container} behavior="padding">
      <View style = {styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>

          {this.state.image === null ? (
              <Animated.Image 
              source = { this.state.logo } 
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
          <TouchableOpacity 
          style={{backgroundColor:'#51738e', alignContent:'center',alignItems:'center',padding:10,borderRadius:5}}
          onPress={() => this.joinSiliconBear() }> 
            <Text style={{color:'white'}}>Registrar</Text>
          </TouchableOpacity>
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
        color:        'white',
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