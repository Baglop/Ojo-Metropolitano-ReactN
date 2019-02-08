import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, Dimensions, StyleSheet,Button} from 'react-native';
import logo from '../images/ojometropolitano.png';
import {  } from 'react-native';
const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 2;
const IMAGE_HEIGHT_SMALL = window.width /7;

export default class RegisterScreen extends React.Component {

    static navigationOptions = {
        header: null
      } 

  constructor(props) {
    super(props);

    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
          <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight }]} />
          <TextInput
            placeholder="Email"
            returnKeyType = "next"
            onSubmitEditing = {() => this.user.focus()}
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            returnKeyType = "next"
            ref={(input) => this.user = input}
            onSubmitEditing = {() => this.pass.focus()}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            returnKeyType = "next"
            ref={(input) => this.pass = input}
            onSubmitEditing = {() => this.confirm_pass.focus()}
            secureTextEntry={true} 
            style={{flex:1}}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            ref={(input) => this.confirm_pass = input}
            secureTextEntry={true} 
            style={{flex:1}}
            returnKeyType = "go"
            style={styles.input}
          />
          <View style={styles.loginButton}>
            <Button
                title="Test"
                color="#51738e"
                onPress = {() => navigate("Register2")}
            />
          </View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#3e4d59',
      flex: 1,
      alignItems:     'center',
      justifyContent: 'center',
    },

    input: {
        flexDirection:  'row',
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: 'rgba(255,255,255,0)',
        borderWidth:  .5,
        borderColor:  'rgba(255,255,255,.4)',
        height:       50,
        borderRadius: 5 ,
        margin:       10,
        marginTop:    10,
        width: window.width - 30
      },
    logo: {
      height: IMAGE_HEIGHT,
      resizeMode:   'contain',
      marginBottom: 20,
      padding:      10,
      marginTop:    20
    },
    loginButton: {
        margin:    10,
        marginTop: 10,
        width: window.width - 30
      },
});