import React from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, NativeModules, Modal, TouchableOpacity, Picker } from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');

const couchbase_liteAndroid = NativeModules.couchbase_lite;
const couchbase_lite_native = NativeModules.couchbase_lite_native;

const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'
const realizarReporte= ':3030/API/inicio/LevantarReporte';
const infoReporte=':3030/API/inicio/MostrarDetallesReporte';
const reportesUsuario = ':3030/API/inicio/ActualizarMisReportes';


export default class MapScreen extends React.Component {

  _renderModalReport(){
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalReport}
        onRequestClose={() => {
          this.openModalReport(!this.state.modalReport);
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
              format="YYYY/MM/DD-HH:mm:ss"
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
                  this.openModalReport(!this.state.modalReport);
                }}>
                <Icon name="md-close-circle" style={styles.modalButtonIcon}/>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  _renderModalReportInfo(){
    if(this.state.actualReportInfo != null)
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalInfoReport}
        onRequestClose={() => {
          this.openModalReportInfo(!this.state.modalInfoReport);
        }}
      >
      <View style={styles.containerModal}>
        <Text> </Text>
        <Text style={styles.textStyle} >Autor del reporte: {this.state.actualReportInfo.autorReporte}</Text>
        <Text style={styles.textStyle} >Fecha del incidente: {this.state.actualReportInfo.fechaIncidente}</Text>
        <Text style={styles.textStyle} >Fecha en que se reporto: {this.state.actualReportInfo.fechaReporte}</Text>
        <Text style={styles.textStyle} >Descripcion: </Text>
        <ScrollView style={{maxHeight:'15%',width:'94.6%',marginBottom:10,marginStart:10,backgroundColor:'rgba(50,50,50,0.1)'}} >
          <Text style={{margin:5}} >{this.state.actualReportInfo.descripcion}</Text>
        </ScrollView>
        <Text style={styles.textStyle} >Evidencia: </Text>
        <View style={styles.bottom}>
          <TouchableOpacity 
            onPress={() => this.openModalReportInfo(!this.state.modalInfoReport)}
          >
            <Text>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>
    );
  }

  render() {
    if(this.state.region.latitude > 0)
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}>
            {this.state.globalReports ? this._renderGlobalReports():null}
        </MapView>
        <ActionButton buttonColor="rgba(0,200,200,1)" >
          <ActionButton.Item buttonColor='#9b59b6' size={45} title="Reportar" onPress={() => this.openModalReport(true)}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' size={45} title={this.state.Titulo} onPress={() => this.changeReports()}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        {this._renderModalReport()}
        {this._renderModalReportInfo()}
      </View>
    );
    else
     return null;
  }

  constructor() {
    super()
    this.state = {
      Titulo: "Mis reportes",
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      globalReports:true,
      idReporte: 1,
      markerCoord:{
        latitude: 0,
        longitude: 0,
      },
      
      reports:[],
      userReports:[],

      userInfo:[],

      actualReportInfo:null,
      error: null,
      date:null,
      reportDescription:"",
      modalReport:false,
      modalInfoReport:false,
      color:false,
    }
  }

  generateRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color   = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  _renderGlobalReports(){
    return(
      this.state.reports.map((marker, key) => (
        <Marker
          key = {key}
          coordinate={{latitude:Number(marker.latitud), longitude:Number(marker.longitud)}}
          title="Asalto"
          description={marker.fechaIncidente}
          onCalloutPress={() => this.makeReportInfoRequest(marker.id)}
          pinColor = {this.generateRandomColor()}
        />
      ))
    );
  }

  changeReports(){
    if(this.state.globalReports){
      this.setState({globalReports:false,Titulo:"Reportes globales"})
    }
    else{
      this.setState({globalReports:true,Titulo:"Mis reportes"})
    }
  }

  componentWillMount(){
    this.startLocTrack().then(() => 
      this.reportsRequest(),
    );
    
  }

  getRegion(region){
    this.setState({region})
  }

  openModalReport(visible){
    if(visible){
      var currentDate = moment()
        .utcOffset('-06:00')
        .format('YYYY/MM/DD-hh:mm:ss');
      this.setState({
        markerCoord:{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
        },
        date:currentDate
      });
    }
    this.setState({modalReport:visible})
  }

  openModalReportInfo(visible){
    this.setState({modalInfoReport:visible})
  }

  async startLocTrack() {
    try {
      this.setState({ userInfo: await db.get('BasicValues')});
      console.log(this.state.userInfo.tokenSiliconBear)
    } catch (err) {
      //console.log(err);
    }
    this.watchId = await navigator.geolocation.watchPosition(
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

  reportsRequest(){
    const userPetition = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude,
    };
    Request_API(userPetition, actualizarReportesGlobales).then(response => {
      if(response.codigoRespuesta === 200){
        this.setState({reports:response.reportes});
      }
    });
  }
  
  makeReportRequest(){
    const requestJHONSON = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
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

  makeReportInfoRequest(idReport){
    const requestJHONSON = {
      idReporte:idReport,
      nombreUsuario: this.state.userInfo.nombreUsuario,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude
    }
    console.warn(JSON.stringify(requestJHONSON));
    Request_API(requestJHONSON, infoReporte)
      .then(response => {
        //console.warn(JSON.stringify(response));
        this.setState({actualReportInfo: response.reporte})
        console.warn(this.state.actualReportInfo);
        this.openModalReportInfo(true);
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
  textStyle:{
    marginBottom:10,
    marginStart:10,
    fontSize:16,
    fontWeight:'bold',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    width:'100%',
    alignItems: 'center',
    marginBottom: 35
  }
 });
