/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import LoginScreen from './pags/login';
import MainScreen from './pags/main';
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
  },
  {
      initialRouteName: "Login",
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class OjoMetropolitano extends React.Component {
  
  render() {
    return <AppContainer />;
  }
}