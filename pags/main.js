import React from "react";
import MapScreen from "./map"
import PlaceScreen from "./places"
import PoliceScreen from "./police"
import ContactScreen from "./contacts"
import ProfileScreen from "./profile"
import { createBottomTabNavigator, createAppContainer } from "react-navigation";


const TabNavigator = createBottomTabNavigator({
  Perfil: ProfileScreen,
  Contactos: ContactScreen,
  Inicio: MapScreen,
  Lugares: PlaceScreen,
  Policia: PoliceScreen
  },
  {
    initialRouteName: "Inicio",
}
);

const AppContainer = createAppContainer(TabNavigator);
export default class MainScreen extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}
