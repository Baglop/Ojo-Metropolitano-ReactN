import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import Ripple from './Ripple'
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import firebase  from 'react-native-firebase';
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import {Alert, Modal, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { PouchDB_UpdateDoc,PouchDB_Get_Document } from '../PouchDB/PouchDBQuerys';
import AntDesign from 'react-native-vector-icons/AntDesign';
import io from 'socket.io-client/dist/socket.io.js';
import { Request_API } from '../networking/server';

const AmigosyGrupos = ':3030/API/contactos/ActualizarAmigosYGrupos';
const respoderSolicitud = ':3030/API/contactos/ResponderSolicitudAmistad'
const vigilarUsuarioURL = ':3030/API/contactos/VigilarUsuario'
const vigilarPublicaURL = ':3030/API/agentePoliciaco/VigilarSalaPublica'
const url = 'http://siliconbear.dynu.net:3030';

const TabNavigator = createBottomTabNavigator({
  Perfil: ProfileScreen,
  Contactos: ContactScreen,
  Inicio: MapScreen,
  // Lugares: Ripple,
  Policia: PoliceScreen
  },
  {
    initialRouteName: "Inicio",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let AntComponent = AntDesign;
        let AntName;
        if (routeName === 'Perfil') {
          AntName = 'profile';
        } else if (routeName === 'Inicio') {
          AntName = 'home';
        }else if (routeName === 'Contactos'){
          AntName='contacts';
        }else if (routeName === 'Policia'){
          AntName='Safety';
        }
        return <AntComponent name={AntName} size={25} color={tintColor} />;
      },
    })
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

const AppContainer = createAppContainer(TabNavigator);

export default class MainScreen extends React.Component {
    
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = { 
      ubicacionUsuario: '0.0,-0.0',
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      alertUserPos:{
           coordenadaX: "0.0",
           coordenadaY: "0.0",
           horaActualizacion: "horaActualizacion"
       },
      solicitudAceptada: false,
      userData: [],
      modalVisible:false,
    };
    this.getData();
    this.getLocationUser();
    this.startSocket();
  }
  setModalVisible = () =>
    this.setState({ modalVisible: !this.state.modalVisible });

    startSocket(){
      global.socket = io.connect(url);
    }
    async getData(){
      await PouchDB_Get_Document('BasicValues')
        .then(response => {
        this.setState({userData: response})
      });
      this.friendsListRequest();
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
        ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude,
        region:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0400,
          longitudeDelta: 0.0200,
        }
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
      this.showAlert(title, body, notification._data.funcionAEjecutar, notification._data);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
      this.showAlert(title, body, notificationOpen.notification._data.funcionAEjecutar, notificationOpen.notification._data);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
      this.showAlert(title, body, notificationOpen.notification._data.funcionAEjecutar, notificationOpen.notification._data);
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert(title, body, funcionAEjecutar, data) {
  solicitudStatus = true;
  Alert.alert(
    title, body,
    [
        { text: 'Aceptar', onPress: () => this.getFuncion(funcionAEjecutar, data, solicitudStatus)},
        { text: 'Cancelar' }
    ],
  );
}

getFuncion(funcion, data, solicitudStatus){
  
  switch(funcion){
    case 'ResponderSolicitudAmistad':
      this.setState({solicitudAceptada: solicitudStatus});
      return this.ResponderSolicitudAmistad(data.nombreUsuario);
    case 'ActualizarAmigosYGrupos':
      this.setState({solicitudAceptada: solicitudStatus});
      return this.ActualizarAmigosYGrupos();
    case 'VigilarUsuario':
      return this.VigilarUsuario(data.salaVigilancia);
    case 'VigilarSalaPublica':
      return this.VigilarSalaPublica(data.salaVigilancia);
  }
}

ResponderSolicitudAmistad(usuarioRespondido){
  console.log("Si manda a llama esta funcion alv ", usuarioRespondido);
  console.log(this.state.userData);
  const bodyPetition = {
    nombreUsuario: this.state.userData.nombreUsuario,
	  usuarioRespondido: usuarioRespondido,
	  solicitudAceptada: this.state.solicitudAceptada,
	  tokenSiliconBear: this.state.userData.tokenSiliconBear,
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
    nombreUsuario: this.state.userData.nombreUsuario,
    tokenSiliconBear: this.state.userData.tokenSiliconBear,
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

VigilarUsuario(salaVigilancia){
  const params = {
    nombreUsuario: this.state.userData.nombreUsuario,
    salaVigilancia: salaVigilancia,
    tokenSiliconBear: this.state.userData.tokenSiliconBear,
    ubicacionUsuario: this.state.ubicacionUsuario,
  };
  Request_API(params, vigilarUsuarioURL).then(response => {
    console.log(response);
    const data = {
      salaVigilancia : response.salaVigilancia
    }
    socket.emit('vigilarUsuario', data);
    socket.on('alertaPrivada_posicionActualizada', (ubicacionUsuario) => {
        console.log(ubicacionUsuario)
        this.setState({region:{
          latitude: ubicacionUsuario.coordenadaX,
          longitude: ubicacionUsuario.coordenadaY,
          latitudeDelta: 0.0400,
          longitudeDelta: 0.0200,
        },alertUserPos:ubicacionUsuario})
      }
    )
    this.setModalVisible()
  });
}

VigilarSalaPublica(salaVigilancia){
  const params = {
    nombreUsuario: this.state.userData.nombreUsuario,
    salaVigilancia: salaVigilancia,
    tokenSiliconBear: this.state.userData.tokenSiliconBear,
    ubicacionUsuario: this.state.ubicacionUsuario,
  };
  Request_API(params, vigilarPublicaURL).then(response => {
    console.log(response);
    const data = {
      salaVigilancia : salaVigilancia
    }
    //socket.emit('botonDePanicoPresionado', data);
    socket.on('alertaPublica_posicionActualizada', (ubicacionUsuario) => {
        console.log(ubicacionUsuario)
        this.setState({region:{
          latitude: Number(ubicacionUsuario.coordenadaX),
          longitude: Number(ubicacionUsuario.coordenadaY),
          latitudeDelta: 0.0400,
          longitudeDelta: 0.0200,
        },alertUserPos:ubicacionUsuario})
      }
    )
    this.setModalVisible()
  });
}

  _renderNavBar(){
    var title = "Vigilando usuario"
    return(
    <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:1}}>
        
        <TouchableOpacity
        onPress={() => this.setState({alertUserPos:{
            coordenadaX: "0.0",
            coordenadaY: "0.0",
            horaActualizacion: "horaActualizacion"
        }},this.setModalVisible())}
        >
        <Icon name="md-arrow-back"  style={{fontSize: 25,height: 25, marginStart:15,marginEnd:15}} />
        </TouchableOpacity>
        <View style={{width:'70%', justifyContent:'flex-start',alignItems: 'flex-start'}} >
            <Text style={{fontWeight: 'bold', fontSize:20}}>{title}</Text>
        </View>
    </View>
    );
  }

  _renderModal(){
    return(
      <Modal
      style={{margin:0,flex:1,height:window.height}}
      animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={this.setModalVisible}
      >
        <View>
          {this._renderNavBar()}
          <MapView 
            style={styles.modalMap}
            provider={PROVIDER_GOOGLE}
            initialRegion={this.state.region}>
            <Marker
              coordinate={{latitude: parseFloat(this.state.alertUserPos.coordenadaX) && parseFloat(this.state.alertUserPos.coordenadaX), 
              longitude: parseFloat(this.state.alertUserPos.coordenadaY) && parseFloat(this.state.alertUserPos.coordenadaY)}}
              title={"Usuario"}
              description={"Ubicacion usuario"}
            />
          </MapView>
        </View>
      </Modal>
    );
  }

  

  render() {
    return (
      <View style={{height:'100%',width:'100%'}}>
        <AppContainer/>
        {this._renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  modalMap:{
    height: "100%",
    width: "100%",
  },
 });