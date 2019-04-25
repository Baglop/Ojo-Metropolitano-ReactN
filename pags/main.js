import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import AntDesign from 'react-native-vector-icons/AntDesign';
import io from 'socket.io-client/dist/socket.io.js';
const url = 'http://siliconbear.dynu.net:3030';

const TabNavigator = createBottomTabNavigator({
  Perfil: ProfileScreen,
  Contactos: ContactScreen,
  Inicio: MapScreen,
  //Lugares: PlaceScreen,
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
    this.startSocket();
  }
    startSocket(){
      global.socket = io.connect(url);
    }

  render() {
    return (
      <AppContainer/>
    );
  }
}

