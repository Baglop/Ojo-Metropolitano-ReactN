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
import {NativeModules, Platform} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

let couch_base = NativeModules.couchbase_lite;
var initialRoute = "Main";

const AppNavigatorM = createStackNavigator(
  {
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
  },
  {
      initialRouteName: "Main",
  }
);

const AppNavigatorL = createStackNavigator(
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
const Logged = createAppContainer(AppNavigatorM);
const Unlogged = createAppContainer(AppNavigatorL);
export default class OjoMetropolitano extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      logged:null,
    };
  }

  componentWillMount() { 
    if(Platform.OS == 'android'){
      couch_base.userDataDocExist(err => {
        this.setState({logged: err});
        console.log(this.state.logged);
      }, succ => {
        this.setState({logged: succ});
        console.log(this.state.logged);
      });
    }
  }

  render() {
    if(this.state.logged)
      return <Logged />
    else 
    {
      console.log(this.state.logged)
      return <Unlogged/>
    }
  }
}