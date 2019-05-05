import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button, TouchableWithoutFeedback} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import logo from '../images/ojometropolitano.png';
import Video from 'react-native-video'
import backView from '../images/background.mp4'
const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 1.6;
const IMAGE_HEIGHT_SMALL = window.height / 5;

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
      contrasena:    '',
      celular:       '',
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

  render() {
    var { navigate } = this.props.navigation;
    return (
      <DismissKeyboard>
      <View style={styles.root}>
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
            placeholder          = " Usuario"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style           = { styles.input }
            onSubmitEditing = { () => this.pass.focus() }
            onChangeText    = { (text) => this.setState({nombreUsuario:text}) }            
          />
          <TextInput
            placeholder          = " Contraseña"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { {flex:1} }
            style = { styles.input }
            ref   = { (input) => this.pass = input}
            onSubmitEditing = {() => this.confirm_pass.focus() }
            secureTextEntry = { true}  
          />
          <TextInput
            placeholder          = " Confirmar contraseña"
            returnKeyType        = "next"
            placeholderTextColor = "rgba(255,255,255,.4)"
            style = { {flex:1} }
            style = { styles.input }
            ref   = { (input) => this.confirm_pass = input }
            onSubmitEditing = { () => this.phone.focus() }
            secureTextEntry = { true } 
            onChangeText    = { (text) => this.setState({contrasena:text}) }
          />
          <TextInput
            placeholder          = " Celular"
            keyboardType         = "number-pad"
            returnKeyType        = "done"
            placeholderTextColor = "rgba(255,255,255,.4)"
            ref   = { (input) => this.phone = input }
            style = { styles.input }
            onChangeText = { (text) => this.setState({celular:text}) }
          />
          <View style={styles.loginButton}>
          <TouchableOpacity 
          style={{backgroundColor:'#51738e', alignContent:'center',alignItems:'center',padding:10,borderRadius:5}}
          onPress={() => () => navigate("Register2" , { nombreUsuario: this.state.nombreUsuario,
            contrasena:    this.state.contrasena,
            celular:       this.state.celular})}> 
            <Text style={{color:'white'}}>Continuar</Text>
          </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
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
      backgroundColor: '#3e4d59',
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
        fontSize: 14
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