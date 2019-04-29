import React from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, NativeModules, TouchableOpacity, Picker, KeyboardAvoidingView, Dimensions, Image, Alert} from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
import { PouchDB_Insert } from '../PouchDB/PouchDBQuerys'
const window = Dimensions.get('window');

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
          <View style={{marginTop:10, marginBottom:5, flexDirection:'column'}}>
            <Text style={{marginTop:10, marginBottom:10}} >Tipo de delito</Text>
            <Picker
              selectedValue={this.state.idReporte}
              style={{height: 20, width: 300, marginTop:10, marginBottom:10}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({idReporte: itemValue})
              }>
              <Picker.Item label="Robo" value="1" />
              <Picker.Item label="Asalto" value="2" />
              <Picker.Item label="Acoso" value="3" />
              <Picker.Item label="Vandalismo" value="4" />
              <Picker.Item label="Pandillerismo" value="5" />
              <Picker.Item label="Violación" value="6" />
              <Picker.Item label="Secuestro o tentativa" value="7" />
              <Picker.Item label="Asesinato" value="8" />
              <Picker.Item label="Otro" value="9" />
            </Picker>
            </View>
            <Text style={{marginTop:10, marginBottom:10}}>Descripción</Text>
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
        <ActionButton buttonColor="#136bf7" >
          <ActionButton.Item buttonColor='#3d84f4' size={45} title="Reportar" onPress={() => this.openModalReport(true)}/*onPress={() => this.setState({ visibleModal: 5})}*/>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        {this._renderModalReport()}
        {this._renderModalReportInfo()}
        <View justifyContent= "flex-end" position='absolute' bottom= {-10} flex = {0.9} marginEnd= {-10} >
        <Modal
          isVisible={this.state.visibleModal === 5}
          style={styles.bottomModal}
          animationIn="slideInUp"
          animationOut="slideOutUp"
          onBackdropPress={() => this.setState({ visibleModal: null })}
          onRequestClose={() => {
            this.openModalReport(!this.state.modalReport);
          }}>
          {this.renderModalContent()}
        </Modal>
        </View>
      </View>
    );
    else
     return null;
  }
  

  
  getReportType(){
    let data = [
      {value: 'Robo', tipoReporte: 1},
      {value: 'Asalto', tipoReporte: 2},
      {value: 'Acoso',tipoReporte: 3},
      {value: 'Vandalismo', tipoReporte: 4},
      {value: 'Pandillerismo', tipoReporte: 5},
      {value: 'Violación', tipoReporte: 6},
      {value: 'Secuestro o tentativa', tipoReporte: 7},
      {value: 'Asesinato', tipoReporte: 8},
    ];
    return data;
  }

  getReportTypeID(id){
    switch(id){
      case 'Robo':
        return this.setState({idReporte: '1'});
      case 'Asalto':
        return this.setState({idReporte: '2'});
      case 'Acoso':
        return this.setState({idReporte: '3'});
      case 'Vandalismo':
        return this.setState({idReporte: '4'});
      case 'Pandillerismo':
        return this.setState({idReporte: '5'});
      case 'Violación':
        return this.setState({idReporte: '6'});
      case 'Secuestro o tentativa':
        return this.setState({idReporte: '7'});
      case 'Asesinato':
        return this.setState({idReporte: '8'});
    }
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
      if (response.didCancel) {
        // console.log('User cancelled photo picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        let source64 = response.data;
        this.setState({
          image: source,
          imageBase64: source64,
        });
      }
    });
  }

  onChangeHandler = (value) => {
    this.getReportTypeID(value);
    console.log(this.state.idReporte);
  }

  renderModalContent = () => (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.modalContent}>
        <View height = {window.height - 140} alignItems='center'>
        <ScrollView width = {window.width - 30}>
          <Text style={styles.titles}> Levantar un Reporte </Text>
          <View height = {300}>
            <MapView 
              style={styles.modalMap}
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.region}>
              <Marker
                draggable
                coordinate={{latitude: parseFloat(this.state.region.latitude) && parseFloat(this.state.region.latitude), 
                longitude: parseFloat(this.state.region.longitude) && parseFloat(this.state.region.longitude)}}
                title={"Reportar"}
                description={"Reporta un incidente"}
                onDragEnd={(e) => this.setState({markerCoord: e.nativeEvent.coordinate})}
              />
            </MapView>
          </View>
          <Text style={styles.titles}> Selecciona el tipo del Reporte </Text>
          <Dropdown
            style={{marginBottom:0, marginTop:0, width: window.width - 13}}
            data={this.getReportType()}
            onChangeText={value => this.onChangeHandler(value)}
          />
          <Text style={styles.titles}> Añade una descripción </Text>
          <TextInput
            width = {window.width - 15}
            height = {60}
            style={{
              flex:1,
              borderWidth: 1,
              borderColor: 'lightgrey',
            }}
            onChangeText = {(text) => {this.setState({reportDescription:text})}}
            placeholderTextColor="rgba(255,255,255,.4)"
            underlineColorAndroid="transparent"
            returnKeyType = "next"
            multiline={true}
          />
          <Text style={styles.titles} >Añadir evidencia</Text>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <Image style={styles.itemPic} source={this.state.image} />
          </TouchableOpacity>
          <Text style={styles.titles} >Fecha del incidente </Text>
          <DatePicker
            style={{marginBottom:10, width: window.width - 13}}
            date={this.state.date}
            mode="datetime"
            placeholder="select date"
            format="YYYY/MM/DD-HH:mm:ss"
            minDate="2015-01-01"
            maxDate={this.state.date}
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            customStyles = {{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
          />
        </ScrollView>
        </View>
        <View style={{flexDirection:"row", width:'50%',justifyContent:"center", height: '8%', alignItems: 'center'}} >
          <TouchableOpacity flex={1} onPress={() => this.makeReportRequest()}>
            <View style={{flex:1, flexDirection:"column", justifyContent:"center", alignItems: 'center'}}>
              <Text  style={styles.textReportar}>Reportar</Text>
            </View>
          </TouchableOpacity>
          <Text>                 </Text>
          <TouchableOpacity flex={1} justifyContent="center" alignItems= 'center' onPress={() => this.setState({ visibleModal: null })}>
          <View style={{flex: 1, flexDirection:"column", justifyContent:"center", alignItems: 'center'}}>
            <Text textAlign= {'center'} marginEnd={0}  style={styles.textReportar} >Cancelar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  getLocationUser(){
    navigator.geolocation.getCurrentPosition(
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
      (error) => console.log(error)
    );
  }

  constructor() {
    super()
    this.getLocationUser();
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.state = {
      visibleModal: null,
      ubicacionUsuario: '0.0,-0.0',
      Titulo: "Mis reportes",
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      globalReports:true,
      idReporte: null,
      markerCoord:{
        latitude: 0,
        longitude: 0,
      },
      image: require('../images/add_photo-512.png'),
      imageBase64: '',
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
 
 componentDidMount(){
  socket.on('reporteNuevo', (reporte)  => {

    console.log("**************************************** reporteNuevo ****************************************");
    console.log(reporte);

    this.setState({reports:[...this.state.reports,reporte]})
  
    /**
     * NOTAS:
     * - Al ejecutarse este evento se debe agregar el reporte recibido al mapa con una animacion.
    **/
  
  
    // Objeto de reporte recibido:
    // 
    // var reporteNuevo = new Reporte({
    //     _id: new mongoose.Types.ObjectId(),
    //     autorReporte: autorReporte,
    //     tipoReporte: tipoReporte,
    //     descripcion: descripcion,
    //     evidencia: " ",
    //     fechaIncidente: fechaIncidente,
    //     latitud: latitud,
    //     longitud: longitud,
    //     fechaReporte: moment().format('YYYY/MM/D-HH:mm:ss'),
    //     ubicacionUsuario: ubicacionUsuario,
    //     estatus: true
    // });
    
  
    // Agrega reporte al mapa
  
  });
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
    this.setState({ visibleModal: 5})
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
  
  showAlert(title, message){
    Alert.alert(
      title,
      message,
      [,
          {text: 'OK', onPress: () => this.setState({ visibleModal: null})},
      ],
          {cancelable: false},
      );
  }

  makeReportRequest(){
    const requestJHONSON = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
      tipoReporte: this.state.idReporte,
      evidencia:this.state.imageBase64,
      descripcion: this.state.reportDescription,
      latitud: this.state.markerCoord.latitude,
      longitud: this.state.markerCoord.longitude,
      fechaIncidente: this.state.date,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude
    }
    console.log(JSON.stringify(requestJHONSON));
    Request_API(requestJHONSON, realizarReporte).then(response => {
      console.log(response);
      if(response.codigoRespuesta === 200){
        PouchDB_Insert(response.reporte._id, 'userReports', response.reporte)
        socket.emit('reporteNuevo', requestJHONSON);
        this.showAlert("Correcto",response.mensaje);
        
      } else {
        this.showAlert("Error: " + response.codigoRespuesta, response.mensaje);
      }
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
  textReportar:{
    fontSize: 20,
    fontWeight:'bold',
    color: 'black'
  },
  containerModal: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalMap:{
    height: "100%",
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
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  titles: {
    fontWeight: 'bold',
    fontSize:18,
  },
  Label: {
    justifyContent: "center",
    alignItems: 'center',
  },
  itemPic: {
    height: 200,
    width: window.width - 20,
    backgroundColor: '#c5c5c5',
    justifyContent: "center",
  },
 });
