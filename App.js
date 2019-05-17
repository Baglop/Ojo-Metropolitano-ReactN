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
import _ from 'lodash';
import {Alert, ImageBackground, Image} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase  from 'react-native-firebase';
//import DropdownAlert from 'react-native-dropdownalert';
import { PouchDB_UpdateDoc } from './PouchDB/PouchDBQuerys';
import Video from 'react-native-video'
import backView from './images/background.mp4'
import { Request_API } from './networking/server';
import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');

const AmigosyGrupos = ':3030/API/contactos/ActualizarAmigosYGrupos';
const respoderSolicitud = ':3030/API/contactos/ResponderSolicitudAmistad'
console.disableYellowBox = true;


const AppNavigatorM = createStackNavigator(
  {
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
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
    //this.getInfo();
    this.getLocationUser();
    this.state = {
      logged:null,
      userInfo: [],
      solicitudAceptada: false,
      ubicacionUsuario: '0.0,-0.0'
    };
  }

  componentDidMount() {
    //StatusBar.setHidden(true);
    this.createNotificationListeners(); 
 }

 componentWillUnmount(){
  this.notificationListener();
  this.notificationOpenedListener();
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


 async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
    console.log(notification);
      console.log(notification._data.funcionAEjecutar);
      
      const { title, body } = notification;
      this.showAlert(title, body, notification._data.funcionAEjecutar, notification._data.nombreUsuario);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
      this.showAlert(title, body, notificationOpen.notification._data.funcionAEjecutar, notificationOpen.notification._data.nombreUsuario);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
      this.showAlert(title, body, notificationOpen.notification._data.funcionAEjecutar, notificationOpen.notification._data.nombreUsuario);
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert(title, body, funcionAEjecutar, usuarioRespondido) {
  solicitudStatus = true;
  Alert.alert(
    title, body,
    [
        { text: 'Aceptar', onPress: () => this.getFuncion(funcionAEjecutar, usuarioRespondido, solicitudStatus)},
        { text: 'Cancelar' }
    ],
  );
}

getFuncion(funcion, usuarioRespondido, solicitudStatus){
  this.setState({solicitudAceptada: solicitudStatus});
  switch(funcion){
    case 'ResponderSolicitudAmistad':
      return this.ResponderSolicitudAmistad(usuarioRespondido);
    case 'ActualizarAmigosYGrupos':
      return this.ActualizarAmigosYGrupos();
  }
}

ResponderSolicitudAmistad(usuarioRespondido){
  console.log("Si manda a llama esta funcion alv ", usuarioRespondido);
  console.log(this.state.userInfo);
  const bodyPetition = {
    nombreUsuario: this.state.userInfo.nombreUsuario,
	  usuarioRespondido: usuarioRespondido,
	  solicitudAceptada: this.state.solicitudAceptada,
	  tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
	  ubicacionUsuario: this.state.ubicacionUsuario,
  }
  console.log(bodyPetition);
  Request_API(bodyPetition, respoderSolicitud).then(response => {
    if(response.codigoRespuesta !== 200){
      Alert.alert(
        'Error ' + response.codigoRespuesta,
          response.mensaje,
          [,
            {text: 'OK', onPress: () => this.setState({ visibleModal: null })},
          ],
          {cancelable: false},
        );
    }
  }); 
}

ActualizarAmigosYGrupos(){
  const userFyG = {
    nombreUsuario: this.state.userInfo.nombreUsuario,
    tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
    ubicacionUsuario: this.state.ubicacionUsuario,
  };
  Request_API(userFyG, AmigosyGrupos).then(response => {
    console.log(response); 
    if(response.codigoRespuesta === 200){
      if(_.size(response.amigos) > 0){
        response.amigos.map((data) => {
          PouchDB_UpdateDoc(data._id, 'friends', data)
        })
      }
      if(_.size(response.grupos) > 0){
        response.grupos.map((data) => {
          PouchDB_UpdateDoc(data.idGrupo, 'groups', data)
        })
      }
    }
  });
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
