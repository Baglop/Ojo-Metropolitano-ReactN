import React from "react";
import { View, Text, StyleSheet, NativeModules, Modal } from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import { Platform } from 'react-native';
const couchbase_liteAndroid = NativeModules.couchbase_lite;

const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'



export default class MapScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}>
            {this.state.reports.map(marker => (
            <Marker
              coordinate={{latitude:Number(marker.latitud), longitude:Number(marker.longitud)}}
              title={marker.id}
              description={marker.fechaIncidente}
            />
            ))}
        </MapView>
        <ActionButton buttonColor="rgba(0,200,200,1)" >
          <ActionButton.Item buttonColor='#9b59b6' size={45} title={this.state.Titulo} onPress={this.change_title}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' size={45} title="Mis reportes" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

  constructor() {
    super()
    this.state = {
      Titulo: "Reportar",
      region:{
        latitude: 20.653814,
        longitude: -103.258566,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      reports:[],
      userInfo:{
        id:"",
        userName:"",
        tokenSiliconBear:"",
      },
      error: null,
    }
    this.startLocTrack();
  }



  getRegion(region){
    this.setState({region})
  }

  change_title = () =>{
    if(this.state.Titulo == "Reportar")
      this.setState({Titulo: "No"})
    else
    this.setState({Titulo: "Reportar"})
  }

  // User location Track 
  startLocTrack() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          region:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0400,
            longitudeDelta: 0.0200,
          }
        });
        this.petitionReports();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  petitionReports(){
    if (Platform.OS == 'android'){
      couchbase_liteAndroid.getUserdataDoc(err => {
        console.warn("chale me humillo")
      },succ => {
        this.setState({userInfo: succ[0]})
        const userPetition = {
          nombreUsuario: succ[0].userName,
          tokenSiliconBear: succ[0].tokenSiliconBear,
          ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude,
        };
        Request_API(userPetition, actualizarReportesGlobales)
        .then(response => {
          console.warn(JSON.stringify(response));
          console.warn(this.state.userInfo.tokenSiliconBear);
          if(response.codigoRespuesta === 200){
            couchbase_liteAndroid.setReportDataDoc(JSON.stringify(response));
            this.setState({reports:response.reportes});
            console.warn(this.state.reports.id);
          }
        })
      });
    } 
    if (Platform.OS == 'ios'){
      const reportes = {
        nombreUsuario: 'Delta',
        tokenSiliconBear: 'b9c194c8-d9d1-423f-8190-b7f29287fae4',
        ubicacionUsuario: '50.258598,19.020420',
      };
      Request_API(reportes, actualizarReportesGlobales)
      .then(response => {
        console.log(JSON.stringify(response));
        if(response.codigoRespuesta === 200){
          this.setState({reports:response.reportes});
        }
      });
    };
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtonIcon: {
    fontSize: 15,
    height: 15,
    color: 'white',
  },
 });
