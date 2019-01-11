/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, Button} from 'react-native';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const width = '80%';
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
}
  render() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../images/ojometropolitano.png')} style={styles.logoStyle} />
        
        </View>
        <View style={styles.SectionStyle}>
          <View style={styles.imageBackground}>
            <Image source={require('../images/2x/round_person_white_24dp.png')} style={styles.ImageStyle}/>
          </View>
          <TextInput
            style={{flex:1}}
            placeholder="Usuario"
            placeholderTextColor="rgba(255,255,255,.4)"
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.SectionStyle}>
          <View style={styles.imageBackground}>
            <Image source={require('../images/2x/round_lock_white_24dp.png')} style={styles.ImageStyle}/>
          </View>
          <TextInput
            secureTextEntry={true} 
            style={{flex:1}}
            placeholder="Contraseña"
            placeholderTextColor="rgba(255,255,255,.4)"
            underlineColorAndroid="transparent"
            />
        </View>
        <View style={styles.loginButton}>
          <Button
            title="Test"
            color="#51738e"
            onPress={() => this.props.navigation.replace('Main')}
          />
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#3e4d59',
  },
  
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth: .5,
    borderColor: 'rgba(255,255,255,.4)',
    height: 40,
    borderRadius: 5 ,
    margin: 10,
    marginTop: 10
  },

  loginButton: {
    margin:10,
    marginTop: 10,
  },

  logoStyle: {
    margin: 5,
    height: 200,
    width: 200,
    resizeMode : 'stretch',
  },

  imageBackground: {
    height: 40,
    width: 40,
    backgroundColor: 'rgba(255,255,255,.4)',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },

  ImageStyle: {
      padding: 15,
      margin: 5,
      height: 25,
      width: 25,
      resizeMode : 'stretch',
      alignItems: 'center'
  },
});