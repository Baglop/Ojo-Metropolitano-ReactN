import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { NavigationActions } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome5";

export default class NavigationHeader extends Component {
  backAction = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  }
  render() {
    return (
      <View style={styles.root}>
          <TouchableOpacity style={styles.left} onPress={this.backAction}>
            <Icon name="angle-left" style={styles.backIcon} />
            <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: 52,
    width: '100%',
    // backgroundColor: '#26bfc1',
    //justifyContent: '',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  center: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginLeft: 8
  },
  mainLogo: {
    width: 98,
    height: 30,
  },
  right: {
    height: 40,
    justifyContent: 'center',
    marginRight: 13,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backIcon: {
    fontSize: 34,
    color: "white",
    marginLeft: 18
  }
});
