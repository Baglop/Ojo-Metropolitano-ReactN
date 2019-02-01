import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import AntDesign from 'react-native-vector-icons/AntDesign';


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

        // You can return any component that you like here!
        return <AntComponent name={AntName} size={25} color={tintColor} />;
      },
    }),
  }
);

const AppContainer = createAppContainer(TabNavigator);
export default class MainScreen extends React.Component {
  static navigationOptions = {
    header: null
}
  render() {
    return (
      <AppContainer/>
    );
  }
}

