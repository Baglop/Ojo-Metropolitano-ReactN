import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import AntDesign from 'react-native-vector-icons/AntDesign'


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
    header: null
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

