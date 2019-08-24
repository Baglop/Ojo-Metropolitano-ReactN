import React, { Component } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from "react-redux";
import { Creators as LogoutActions, logout } from '../store/ducks/authsuscribe';
import { bindActionCreators } from "redux";

class MainHeader extends Component {
  logout() {
    this.props.logout();
  }

  backAction() {
    let { t } = this.props;
    Alert.alert(
      'Alerta',
      '¿Estás seguro de cerrar seión, se perderá toda la información almacenada?',
      [,
        { text: 'Cancelar' },
        { text: 'Aceptar', onPress: () => this.logout() }
      ],
    );
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.center}>
          <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.right}>
          {
            this.props.title == 'Perfil' ?
              <TouchableOpacity onPress={() => this.backAction()}>
                <Icon name="ios-log-out" style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginRight: 12 }} />
                {/* <Image style={styles.mainLogo} source={images.justLogo} /> */}
              </TouchableOpacity>
              :
              null
          }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: 52,
    width: '100%',
    alignItems: 'center'
  },
  left: {
    width: 40,
    height: 40,
    marginLeft: 13,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 55,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold'
  },
  mainLogo: {
    width: 30,
    height: 30,
    marginRight: 15,
    resizeMode: 'contain'
  },
  right: {
    height: 52,
    width: 52,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  }
});

const mapStatetoProps = (state) => ({
  authsuscribe: state.authsuscribe
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(LogoutActions, dispatch),
  logout: () => dispatch(logout)
})

export default connect(mapStatetoProps, mapDispatchToProps)(MainHeader);