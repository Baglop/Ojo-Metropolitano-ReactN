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
import RegisterScreen from './pags/register';
import Register2Screen from './pags/register2';
import CameraScreen from './pags/camera';

import {StatusBar} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase  from 'react-native-firebase';
import PouchdbFind from 'pouchdb-find';
import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');

console.disableYellowBox = true;
var initialRoute = "Main";

const AppNavigatorM = createStackNavigator(
  {
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Register2: {
      screen: Register2Screen
    },
    Camera: {
      screen: CameraScreen
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
    Register:{
      screen: RegisterScreen
    },
    Register2: {
      screen: Register2Screen
    },
    Camera: {
      screen: CameraScreen
    },
  },
  {
      initialRouteName: "Login",
  }
);

firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      // user has permissions
    } else {
      // user doesn't have permission
    } 
  });

  firebase.messaging().requestPermission()
  .then(() => {
    // User has authorised  
  })
  .catch(error => {
    // User has rejected permissions  
  });

const Logged = createAppContainer(AppNavigatorM);
const Unlogged = createAppContainer(AppNavigatorL);
export default class OjoMetropolitano extends React.Component {
  
  constructor(props) {
    super(props);
    PouchDB.plugin(PouchdbFind);
    this.state = {
      logged:null,
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
 }

  async componentWillMount() { 

    await db.get('BasicValues').then(doc => {
      this.setState({logged: true})
    });
    // await db.get('ActualizarMisReportes').then(doc => {
    //   console.log(doc[0]);
    // });

    // await db.find({
    //   selector: {
    //     type: 'userReports',
    //     _id: '5cbbc02e4b2a640886bf5ac9'
    //   },
    //   index: {
    //   fields: ['type']
    //   }
    // }).then(result => {
    //   console.log(result);
    // }).catch(function (err) {
    //   console.log(err);
    // });

    await db.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log(result.rows);
    }).catch(function (err) {
      console.log(err);
    });
  }

  render() {
    if(this.state.logged != null)
      if(this.state.logged)
        return <Logged />
      else 
        return <Unlogged/>
    else
      return <Unlogged/>;
  }
}
