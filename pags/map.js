import React from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, NativeModules, Modal, TouchableOpacity, Picker } from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import { Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const couchbase_liteAndroid = NativeModules.couchbase_lite;

const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'
const realizarReporte= ':3030/API/inicio/LevantarReporte';


export default class MapScreen extends React.Component {

  render() {
    if(this.state.region.latitude > 0)
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
          <ActionButton.Item buttonColor='#9b59b6' size={45} title={this.state.Titulo} onPress={() => this.openModal(true)}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' size={45} title="Mis reportes" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.openModal(!this.state.modalVisible);
          }}
        >
          <View style={styles.containerModal}>
            <MapView style={styles.modalMap}
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.region}>
                <Marker draggable
                  coordinate={this.state.markerCoord}
                  title={"Reportar"}
                  description={"Reporta un incidente"}
                  onDragEnd={(e) => this.setState({markerCoord: e.nativeEvent.coordinate})}
                />
            </MapView>
            <ScrollView style={{width:'100%'}} >
              <Text style={{marginTop:10, marginBottom:5}} >Tipo de delito</Text>
              <Picker
                selectedValue={this.state.idReporte}
                style={{height: 50, width: 200}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({idReporte: itemValue})
                }>
                <Picker.Item label="Secuestro" value="1" />
                <Picker.Item label="Asalto" value="2" />
              </Picker>
              <Text >Descripción</Text>
              <TextInput
                style={{flex:1,height:50,
                  borderWidth: 2,
                  borderColor: 'lightgrey',
                  margin: 10,
                  width:"65%"
                }}
                onChangeText = {(text) => {this.setState({reportDescription:text})}}
                placeholderTextColor="rgba(255,255,255,.4)"
                underlineColorAndroid="transparent"
                returnKeyType = "next"
                multiline={true}
              />
              <Text style={{marginBottom:10}} >Añadir evidencia</Text>
              <Text style={{marginBottom:10}} >Fecha del incidente </Text>
              <DatePicker
                style={{width: 200, marginBottom:10}}
                date={this.state.date}
                mode="datetime"
                placeholder="select date"
                format="YYYY-MM-DD-HH:mm:ss"
                minDate="2015-01-01"
                maxDate={this.state.date}
                confirmBtnText="Aceptar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {this.setState({date: date})}}
              />
              <View style={{flexDirection:"row",width:'100%',justifyContent:"center"}} >
                <TouchableOpacity
                  //style={{height:15,width:15}}
                  onPress={() => {
                    this.makeReportRequest();
                  }}>
                  <Icon name="md-checkmark-circle" style={styles.modalButtonIcon}/>
                </TouchableOpacity>
                <TouchableOpacity
                  //style={{height:15,width:15}}
                  onPress={() => {
                    this.openModal(!this.state.modalVisible);
                  }}>
                  <Icon name="md-close-circle" style={styles.modalButtonIcon}/>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
    else
     return null;
  }

  constructor() {
    super()
    this.state = {
      Titulo: "Reportar",
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      idReporte: 1,
      markerCoord:{
        latitude: 0,
        longitude: 0,
      },
      reports:[],
      userInfo:{
        id:"",
        userName:"",
        tokenSiliconBear:"",
      },
      error: null,
      date:"2019-02-13-13:00:00",
      error: null,
      reportDescription:"",
      modalVisible:false,
    }
  }

  componentWillMount(){
    this.startLocTrack();
  }

  getRegion(region){
    this.setState({region})
  }

  openModal(visible){
    if(visible){
      var currentDate = moment()
        .utcOffset('-06:00')
        .format('YYYY-MM-DD-hh:mm:ss');
      this.setState({
        markerCoord:{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
        },
        date:currentDate
      });
    }
    this.setState({modalVisible:visible})
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

  makeReportRequest(){
    const requestJHONSON = {
      nombreUsuario: this.state.userInfo.userName,
      tipoReporte: this.state.idReporte,
      evidencia:null,
      descripcion: this.state.reportDescription,
      latitud: this.state.markerCoord.latitude,
      longitud: this.state.markerCoord.longitude,
      fechaIncidente: this.state.date,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude
    }
    console.warn(JSON.stringify(requestJHONSON));
    Request_API(requestJHONSON, realizarReporte)
      .then(response => {
        console.warn(JSON.stringify(response));
        console.warn(this.state.userInfo.tokenSiliconBear);
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
  containerModal: {
    height: "100%",
    width: "100%",
    marginStart: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalMap:{
    height: "45%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtonIcon: {
    fontSize: 15,
    height: 15,
    color: 'white',
  },
  modalButtonIcon: {
    fontSize: 40,
    height: 40,
    marginTop:10,
    marginEnd:10,
    color: 'black',
  },
 });
