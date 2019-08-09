import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import { Image, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
import backView from '../assets/background.mp4';

export default class Login extends Component {

    loginPress() {
        this.props.navigation.navigate('Inicio', {});
    }

    render() {
        return (
            <View style={styles.root}>
                <StatusBar hidden />
                <Video
                    repeat
                    source={backView}
                    resizeMode='cover'
                    style={StyleSheet.absoluteFill}
                />
                <KeyboardAwareScrollView resetScrollToCoords={{ x: -1, y: -1 }} contentContainerStyle={styles.keyboard}>
                    <View style={styles.body}>
                        <Image style={styles.image} source={require('../assets/ojometropolitano.png')} />
                        <TextInput style={styles.userLogin} />
                        <TextInput style={styles.userLogin} secureTextEntry={true} />
                        <TouchableOpacity style={styles.buttom} onPress={() => this.loginPress()}>
                            <Text style={styles.label}>Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    image: {
        resizeMode: 'stretch',
        height: 200,
        width: 200,
        marginTop: -100,
        alignSelf: 'center'
    },
    body: {
        backgroundColor: "rgba(220,230,240,.4)",
        height: '65%',
        width: '85%',
        borderRadius: 10,
        marginTop: 60
    },
    userLogin: {
        height: 45,
        color: '#020b36',
        borderColor: '#020b36',
        borderBottomWidth: 1,
        fontSize: 18,
        paddingLeft: 15,
        marginTop: 18,
        marginHorizontal: '8%'
    },
    keyboard: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttom: {
        backgroundColor: '#020b36',
        alignContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: '8%',
        marginTop: 50
    },
    label: {
        color: '#00ffd4',
        fontSize: 23,
    }
})
