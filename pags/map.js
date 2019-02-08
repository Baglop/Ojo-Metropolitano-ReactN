import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';

const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'



export default class MapScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}>
            <Marker
              coordinate={this.state.region}
              title={"Puto"}
              description={"iOS"}
            />
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
    this.petitionReports()
    this.state = {
      Titulo: "Reportar",
      region:{
        latitude: 20.653814,
        longitude: -103.258566,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      error: null,
    }
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

  componentDidMount() {
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
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  petitionReports(){
    const reportes = {
      nombreUsuario: 'Delta',
      tokenSiliconBear: 'b9c194c8-d9d1-423f-8190-b7f29287fae4',
      ubicacionUsuario: '50.258598,19.020420',
    };
    Request_API(reportes, actualizarReportesGlobales)
    .then(response => {
      console.log(JSON.stringify(response));
      if(response.codigoRespuesta === 200){
        console.warn('Si es codigo 200 alv')
      }
    })
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
