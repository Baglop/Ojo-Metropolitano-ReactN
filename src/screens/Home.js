import React, { Component } from 'react';
import { Text, StyleSheet, View, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from "react-navigation";
import ActionButton from 'react-native-action-button';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

import { connect } from "react-redux";
import { Creators as ReportsActions, getGlobalReports } from '../store/ducks/home'
import { bindActionCreators } from "redux";
import Loading from './Loading';

class Home extends Component {

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

    componentWillMount() {

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
        let authsuscribe = this.props.authsuscribe.userInfo;
        let location = this.props.location;
        console.log(location)
        if (authsuscribe) {

            const body = {
                nombreUsuario: authsuscribe.nombreUsuario,
                tokenSiliconBear: authsuscribe.tokenSiliconBear,
                ubicacionUsuario: location.latitude + "," + location.longitude

            }
            this.props.getGlobalReports(body)
        }
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


    getReportType(id) {
        switch (id) {
            case '1':
                return 'Robo';
            case '2':
                return 'Asalto';
            case '3':
                return 'Acoso';
            case '4':
                return 'Vandalismo';
            case '5':
                return 'Pandillerismo';
            case '6':
                return 'Violación';
            case '7':
                return 'Secuestro o tentativa';
            case '8':
                return 'Asesinato';
        }
    }

    generateRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    render() {
        let { global_reports } = this.props.home
        console.log(global_reports)
        if (global_reports) {
            return (
                <View style={styles.root}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.root} colors={['#020b36', '#04335d', '#2b8ea8']}>
                        <StatusBar hidden={false} translucent backgroundColor="transparent" animated barStyle="light-content" />
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
                                    {
                                        global_reports.map((report, key) => {
                                            return (
                                                <Marker
                                                    key={key}
                                                    coordinate={{ latitude: Number(report.latitud), longitude: Number(report.longitud) }}
                                                    title={this.getReportType(report.tipo)}
                                                    description={report.fechaIncidente}
                                                    pinColor={this.generateRandomColor()}
                                                >

                                                </Marker>
                                            )
                                        })
                                    }
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
        } else {
            return <Loading />
        }

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

const mapStateToProps = state => ({
    home: state.home,
    authsuscribe: state.authsuscribe,
    location: state.location
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ReportsActions, dispatch),
    getGlobalReports: (body) => dispatch(getGlobalReports(body))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);