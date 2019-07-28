import React, { Component } from 'react';
import { Text, StyleSheet, View, StatusBar, Platform, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from "react-navigation";
import MainHeader from '../symbols/MainHeader';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import ImagePicker from 'react-native-image-picker';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openBar: false,
            userData: [],
            userInfo: [],
            image: require('../assets/add_photo-512.png'),
        };
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    }

    selectPhotoTapped() {
        const options = {
            quality: 0.95,
            maxWidth: 1000,
            maxHeight: 1000,
            storageOptions: {
                skipBackup: true,
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };
                let source64 = response.data;
                console.log(source64)
                this.setState({
                    image: source,
                    atributo: 'evidencia',
                    nuevoValor: source64
                });
            }
        });
    }

    render() {
        return (
            <View style={styles.root}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.root} colors={['#020b36', '#04335d', '#2b8ea8']}>
                    <StatusBar translucent backgroundColor="transparent" animated barStyle="light-content" />
                    {Platform.OS === 'android' && Platform.Version >= 20 ? <View style={{ height: 24 }} /> : null}
                    <SafeAreaView style={styles.root} forceInset={{ bottom: 'always', top: 'always' }}>
                        <MainHeader title={'Perfil'} navigation={this.props.navigation} />
                        <HeaderImageScrollView
                            maxHeight={200}
                            minHeight={0}
                            fadeOutForeground
                            headerImage={require("../assets/citybackground.png")}
                            renderTouchableFixedForeground={() => (
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }} >
                                    <TouchableOpacity style={{ borderRadius: 130 / 2, }} onPress={() => this.selectPhotoTapped()}>
                                        <Image style={styles.logoStyle} source={this.state.image && this.state.image} />
                                    </TouchableOpacity>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{'Que pedo'}</Text>
                                </View>
                            )}
                        >
                            <View style={{ height: 1000 }}>
                                <TriggeringView onHide={() => console.log("text hidden")}>
                                    <Text>Scroll Me!</Text>
                                </TriggeringView>
                            </View>
                        </HeaderImageScrollView>
                    </SafeAreaView>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: 'white'
    },
    portada: {
        height: 200,
        backgroundColor: 'red'
    },
    logoStyle: {
        height: 130,
        width: 130,
        borderRadius: 130 / 2,
        resizeMode: 'cover',
    },
})
