import React, { Component } from 'react';
import { Text, StyleSheet, View, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from "react-navigation";
import ActionButton from 'react-native-action-button';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this._getCoords = this._getCoords.bind(this);
        this.state = {
            region: {
                latitude: null,
                longitude: null,
            },
        };
    }

    animate() {
        let r = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: 0.00400,
            longitudeDelta: 0.00200,
        };
        this.mapView.animateToRegion(r, 1000);
    }

    componentDidMount() {
        this._getCoords();
    }

    _getCoords = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
            }
        );
    };

    render() {
        return (
            <View style={styles.root}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.root} colors={['#020b36', '#04335d', '#2b8ea8']}>
                    <StatusBar translucent backgroundColor="transparent" animated barStyle="light-content" />
                    {Platform.OS === 'android' && Platform.Version >= 20 ? <View style={{ height: 24 }} /> : null}
                    <SafeAreaView style={styles.root} forceInset={{ bottom: 'always', top: 'always' }} >
                        <View style={styles.body}>
                            <MapView
                                ref={(ref) => this.mapView = ref}
                                provider={PROVIDER_GOOGLE}
                                style={styles.root}
                                showsUserLocation={true}
                                followUserLocation={true}
                                region={{
                                    latitude: Number(this.state.region.latitude),
                                    longitude: Number(this.state.region.longitude),
                                    latitudeDelta: 0.3,
                                    longitudeDelta: 0.3,
                                }}

                            >
                            </MapView>
                            <ActionButton
                                buttonColor="#3dabaf"
                                onPress={() => {
                                    this.animate();
                                }}

                            />
                        </View>
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
    }
})
