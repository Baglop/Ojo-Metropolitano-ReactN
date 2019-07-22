import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native';
import Video from 'react-native-video';
import backView from '../assets/background.mp4';

export default class Login extends Component {

    loginPress(){
        this.props.navigation.navigate('Inicio', {});
    }

    render() {
        return (
            <View style={styles.root}>
                <StatusBar hidden/>
                <Video
                    repeat
                    source={backView}
                    resizeMode='cover'
                    style={StyleSheet.absoluteFill}
                />
                <TouchableOpacity
                    style={{ backgroundColor: '#51738e', alignContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5 }}
                    onPress={() => this.loginPress()}>
                    <Text style={{ color: 'white' }}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center'
    }
})
