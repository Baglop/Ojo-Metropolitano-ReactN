import React, { Component } from 'react';
import { View, TextInput, Text, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button, Platform, TouchableOpacity, Alert, TouchableWithoutFeedback} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Request_API } from '../networking/server';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';
const window = Dimensions.get('window');
const registerUser = ':3030/API/inicio/RegistrarUsuario'
let params = '';

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
            response.mensaje + ' Verifica tu correo para poder continuar.',
            [,
              {text: 'OK', onPress: () => this.props.navigation.navigate('Login', {})},
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

  validateEmail(){
    if(this.state.correo !== ''){

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(this.state.correo) === false)
    {
    this.dropdown.alertWithType('error','Error','Se requiere un email válido')
    }
    else {
      console.log("Email is Correct");
    }
    

    } else {
      this.dropdown.alertWithType('error','Error','Este campo es requerido')
    }
  }

  render() {
    params = this.props.navigation.state;
    return (
      // <KeyboardAvoidingView
      //   style    = { styles.container }
      //   >
      <DismissKeyboard>
      <View style = {styles.root}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#4095ac','#122e39','#050e13','#050c12']} style={styles.root}>
      <KeyboardAvoidingView style = {styles.container} behavior="padding">
      <View style={{alignItems: 'center'}}>
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
          </View>
          <View>
          <TextInput
            placeholder          = "Email"
            returnKeyType        = "next"
            keyboardType         = "email-address"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style           = { styles.input }
            onSubmitEditing = { () => this.email.focus() }
            onChangeText    = { (text) => this.setState({correo: text})}
            onEndEditing    = {() => this.validateEmail()}  
          />
          <TextInput
            placeholder          = "Nombre's (opcional)"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { styles.input }
            ref   = { (input) => this.email = input }
            onSubmitEditing = { () => this.names.focus() } 
            onChangeText    = { (text) => this.setState({nombres:text}) }       
          />
          <TextInput
            placeholder          = "Apellido paterno (opcional)"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { styles.input }
            ref   = { (input) => this.names = input }
            onSubmitEditing = { () => this.laste_name.focus() }
            onChangeText    = { (text) => this.setState({apellidoPaterno:text}) }
          />
          <TextInput
            placeholder          = "Apellido materno (opcional)"
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
        width: window.width - 30,
        paddingLeft: 8,
        fontSize: 17,
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