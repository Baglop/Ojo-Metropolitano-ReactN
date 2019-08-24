import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import { setStore } from './src/store/store';
import { connect } from "react-redux";
import { Creators as EventActions, getUser } from './src/store/ducks/authsuscribe';
import { bindActionCreators } from "redux";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from './src/screens/Contacts';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Police from './src/screens/Police';
import Profile from './src/screens/Profile';
import Register from './src/screens/Register';
import Loading from './src/screens/Loading';

const TabNavigator = (route) => createBottomTabNavigator({
  Inicio: {
    screen: Home,
    navigationOptions: {
      title: 'Inicio',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" style={{ color: tintColor, fontSize: 28,}} />
      ),
      showIcon: true
    }
  },

  Contactos: {
    screen: Contacts,
    navigationOptions: {
      title: 'Contactos',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-people" style={{ color: tintColor, fontSize: 33}} />
      ),
      showIcon: true
    }
  },

  Policia: {
    screen: Police,
    navigationOptions: {
      title: 'Policía',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-radio" style={{ color: tintColor, fontSize: 31}} />
      ),
      showIcon: true
    }
  },

  Perfil: {
    screen: Profile,
    navigationOptions: {
      title: 'Perfil',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ios-person' style={{ color: tintColor, fontSize: 30}} />
      ),
      showIcon: true,
    }
  }
},
  {
    headerMode: "none",
    initialRouteName: route,
    tabBarPosition: 'bottom',
    resetOnBlur: true,
    tabBarOptions: {
      style: {
        backgroundColor: '#020b36',
      },
      activeTintColor: '#00ffd4',
      inactiveTintColor: 'white',
      allowFontScaling: false,
      labelStyle: { fontSize: 13 },
    }
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: Login,
    Register: Register,
    Inicio: TabNavigator('Inicio')
  },
  {
    headerMode: "none",
    initialRouteName: "Login",
  }
);

const MainNavigator = createStackNavigator(
  {
    Inicio: TabNavigator('Inicio')
  },
  {
    headerMode: "none",
    initialRouteName: "Inicio",
  }
);

const mapStateToProps = state => ({
  authsuscribe: state.authsuscribe
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(EventActions, dispatch),
  getUser: () => dispatch(getUser())
})

const AppContainer = createAppContainer(MainNavigator);
const LoginContainer = createAppContainer(LoginNavigator);

class LoginComponent extends React.Component {
  componentWillMount() {
    this.props.getUser()
  }
  render() {
    if(this.props.authsuscribe.user == 'loading')
     return (<Loading/>)
     else if(this.props.authsuscribe.user == 'ready')
      return (<AppContainer />)
      else if(this.props.authsuscribe.user == 'logout')
      return (<LoginContainer />) 

  }
}

const LoginCheck = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default class App extends React.Component {
  render() {
    setStore(store);
    return <Provider store={store}><LoginCheck /></Provider>
  }
}
