import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import AntDesign from 'react-native-vector-icons/AntDesign'
import {NativeModules, Platform } from 'react-native'
import firebase from 'react-native-firebase'
import { Request_API } from '../networking/server';

let couchbase_lite_native = NativeModules.couchbase_lite_native;
const couchbase_lite = NativeModules.couchbase_lite;

const modURL = ':3030/API/miCuenta/ModificarInformacionUsuario'

const TabNavigator = createBottomTabNavigator({
  Perfil: ProfileScreen,
  Contactos: ContactScreen,
  Inicio: MapScreen,
  Lugares: PlaceScreen,
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
        }else if (routeName === 'Lugares'){
          AntName='pushpino';
        }else if (routeName === 'Policia'){
          AntName='Safety';
        }
        return <AntComponent name={AntName} size={25} color={tintColor} />;
      },
    })
  }
);

const AppContainer = createAppContainer(TabNavigator);
export default class MainScreen extends React.Component {
    
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = { 
      ubicacionUsuario: '0.0,-0.0',
      userInfo:[],
      userData: []
    };
    
  }

  getInfo(){
    if(Platform.OS == 'android'){
      couchbase_lite.getUserInfoDoc(err => {
          console.warn(err)
        }, succ => {
          this.setState({userInfo: succ[0]})
          console.log(succ)
        }
     )
    }
  }

  getData(){
    if (Platform.OS === 'android'){
      couchbase_lite.getUserdataDoc(err => {
        console.warn("chale me humillo")
      },succ => {
        this.setState({userData: succ[0]})
      });
    }
  }

  tokenFR(){
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        if(fcmToken != this.state.userInfo.tokenFirebase){
          this.modRequest(fcmToken);
        }
        console.log(fcmToken)
      } else {
        // user doesn't have a device token yet
        console.log("No hay token")
      } 
    });
  }
  
  modRequest(value){
    const params = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
      atributoModificado: "tokenFirebase",
      valorNuevo: value,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    }
    console.log(params)
    Request_API(params,modURL).then(response =>{
       console.log(response);
       if(Platform.OS == 'android' && response.codigoRespuesta == 200){
         couchbase_lite.updateUSerInfoDdc("tokenFirebase",value)
       }
       this.getUserInfo();
      }
    )
  }

  componentWillMount(){
    this.getInfo();
    this.getData();
  }

  componentDidMount() {
    this.test();
  } 

  async test(){

    let promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = position.coords.latitude + ',' + position.coords.longitude;
          resolve(pos);
        },
        (error) => console.log(error)
      )
    });

    let position = await promise
    console.log(position)

    this.setState({
      ubicacionUsuario: position
    })
    
    this.tokenFR()
  }

  /*constructor(props){
    super(props);
    this.state ={
      nombreUsuario: '',
      tokenSiliconBear: '',
      ubicacionUsuario: '0.0,-0.0'
    };
  }

  upgrapeGlobalReports = () => {
    var { params } = this.props.navigation.state;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude});
        this.setState({ nombreUsuario : params.nombreUsuario});
        this.setState({ tokenSiliconBear : params.tokenSiliconBear});
      },
      (error) => console.log(error)
    );
    fetch(URL,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
      if(response.codigoRespuesta == 200){
        if(Platform.OS == 'android'){

        }
        if(Platform.OS == "ios"){

        }
      } else{
        this.showAlert();
      }
    })
    .catch(err => console.error(err));
  }*/

  render() {
    return (
      <AppContainer/>
    );
  }
}

