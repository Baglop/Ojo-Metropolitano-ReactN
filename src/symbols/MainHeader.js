import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { NavigationActions } from 'react-navigation';

export default  class MainHeader extends Component {
  backAction = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  }
  render() {
    return (
      <View style={styles.root}>
          <View style={styles.center}>
            <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          </View>
          <View style={styles.right}>
            {/* <TouchableOpacity>
              <Image style={styles.mainLogo} source={images.justLogo} />
            </TouchableOpacity> */}
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