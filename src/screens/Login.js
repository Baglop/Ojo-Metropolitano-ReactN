import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import { Image, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
import backView from '../assets/background.mp4';

import { connect } from "react-redux";
import { Creators as EventActions, signin } from '../store/ducks/authsuscribe';
import { Creators as TokenActions, getToken } from '../store/ducks/tokenFirebase';
import { Creators as LocationActions, getLocation } from '../store/ducks/location';
import { bindActionCreators } from "redux";

import {PouchDB_DeleteDB} from '../store/Database/PouchDBQuerys'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password:''

        }
    }

    componentWillMount() {
        this.props.getToken();
    }

    loginPress(location, token) {
        const body = {
            nombreUsuario: this.state.username,
            contrasena: this.state.password,
            ubicacionUsuario: location.latitude + ',' + location.longitude
        }
        this.props.signin(body, token)
        // this.props.navigation.navigate('Inicio', {});
    }

    register() {
        this.props.navigation.navigate('Register', {});
    }

    render() {
        this.props.getLocation();
        let { token } = this.props.token
        let { user } = this.props.login
        let { location } = this.props.location
        return (
            <View style={styles.root}>
                <StatusBar hidden={true} />
                <Video
                    repeat
                    source={backView}
                    resizeMode='cover'
                    style={StyleSheet.absoluteFill}
                />
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={styles.keyboard}>
                    <View style={styles.body}>
                        <Image style={styles.image} source={require('../assets/ojometropolitano.png')} />
                        <TextInput
                            style={styles.userLogin}
                            placeholder={'Usuario'}
                            placeholderTextColor='white'
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passInput.focus(); }}
                            onChangeText={text => this.setState({ username: text.replace(/\s/g, '') })}
                            // onFocus={() => this.setState({ errorUsername: false })}
                        />
                        <TextInput
                            ref={(pass) => { this.passInput = pass }}
                            style={styles.userLogin}
                            secureTextEntry={true}
                            placeholder={'Contraseña'}
                            placeholderTextColor='white'
                            returnKeyType="go"
                            onSubmitEditing={() => this.loginPress(location, token)}
                            onChangeText={text => this.setState({ password: text.replace(/\s/g, '') })}
                            // onFocus={() => this.setState({ errorPassword: false })}
                        />
                        <TouchableOpacity style={styles.buttom} onPress={() => this.loginPress(location, token)}>
                            <Text style={styles.label}>Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <Text style={styles.labelRegister}>¿Aún no tiene una cuenta?</Text>
                <Text style={styles.register} onPress={() => this.register()}>Registrate aquí.</Text>
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
        color: 'white',
        borderColor: '#020b36',
        borderBottomWidth: 1,
        fontSize: 18,
        paddingLeft: 15,
        marginTop: 10,
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
        marginTop: 50,
        marginBottom: '4%'
    },
    label: {
        color: '#00ffd4',
        fontSize: 23,
    },
    labelRegister: {
        color: '#00ffd4',
        alignSelf: 'center',
        fontSize: 20
    },
    register: {
        color: '#00ffd4',
        alignSelf: 'center',
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 15,
        textDecorationLine: 'underline'
    }
})

const mapStatetoProps = (state) => ({
    login: state.login,
    token: state.token,
    location: state.location
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators({ EventActions, TokenActions, LocationActions }, dispatch),
    signin: (body, token) => dispatch(signin(body, token)),
    getToken: () => dispatch(getToken()),
    getLocation: () => dispatch(getLocation())
})

export default connect(mapStatetoProps, mapDispatchToProps)(Login);