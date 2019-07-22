import React from 'react';
import LoginScreen from './pags/login';
import MainScreen from './pags/main';
import RegisterScreen from './pags/register';
import Register2Screen from './pags/register2';
import CameraScreen from './pags/camera';
import DrawerDesign from './pags/drawerDesign'
import { createStackNavigator, createAppContainer } from "react-navigation";
import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');
console.disableYellowBox = true;

const AppNavigatorM = createStackNavigator(
  {
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
    DrawerDesign: {
      screen: DrawerDesign
    }
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



const Logged = createAppContainer(AppNavigatorM);
const Unlogged = createAppContainer(AppNavigatorL);
export default class OjoMetropolitano extends React.Component {

  constructor(props) {
    super(props);
    //this.getInfo();
    this.state = {
      logged:null,
      userInfo: [],
      solicitudAceptada: false,
      ubicacionUsuario: '0.0,-0.0'
    };
  }


async getInfo(){
  await db.get('BasicValues').then(doc => {
    this.setState({logged: true, userInfo: doc})
  });
}

componentWillMount() { 
  db.get('BasicValues').then(doc => {
    this.setState({logged: true, userInfo: doc})
  });

  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    console.log(result.rows);
  }).catch(function (err) {
    console.log(err);
  });
}

  // render() {
  //   if(this.state.logged != null)
  //     if(this.state.logged)
  //       return <Logged />
  //     else 
  //       return <Unlogged/>
  //   else
  //     return <Unlogged/>;
  // }

  render(){
    return this.state.logged ? (<Logged ref='navigator'/>):(<Unlogged ref='navigator'/>)
  }
}