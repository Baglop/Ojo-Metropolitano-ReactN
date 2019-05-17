import React from "react";
import { ScrollView, Platform, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Dimensions, Image, Alert, TouchableWithoutFeedback, Keyboard} from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import { Request_API } from '../networking/server';
import DatePicker from 'react-native-datepicker';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
import { PouchDB_Insert } from '../PouchDB/PouchDBQuerys'
import {createAppContainer, createStackNavigator} from "react-navigation";
import PouchDB from 'pouchdb-react-native'; 
import IconClose from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
const db = new PouchDB('OjoMetropolitano');
const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'
const realizarReporte= ':3030/API/inicio/LevantarReporte';
const infoReporte=':3030/API/inicio/MostrarDetallesReporte';
const window = Dimensions.get('window');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const data = [
  {value: 'Robo'},
  {value: 'Asalto'},
  {value: 'Acoso'},
  {value: 'Vandalismo'},
  {value: 'Pandillerismo'},
  {value: 'Violación'},
  {value: 'Secuestro o tentativa'},
  {value: 'Asesinato'}
]

class MapScreen extends React.Component {

  constructor(props) {
    super(props);
    this.startLocTrack()
    this.getLocationUserJoin();
    this.state = {
      region:{
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      markerCoord:{
        latitude: 0,
        longitude: 0,
      },
      userInfo: [],
      reporte: [],
      globalReports: true,
      reports:[],
      visibleModal: null,
      modalReport:false,
      image: require('../images/camera.png'),
      image64: null,
      date:null,
      idReporte: null,
      reportDescription: null,
    }
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  
  static navigationOptions = {
    headerTransparent: true
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  componentWillMount(){
    this.startLocTrack().then(() => 
      this.reportsRequest(),
    );
  }

  componentDidMount(){
    socket.on('reporteNuevo', (reporte) => {
    this.setState({reports:[...this.state.reports,reporte]})  
  });
 } 

  async startLocTrack() {
    try {
      this.setState({ userInfo: await db.get('BasicValues')});
      console.log(this.state.userInfo.tokenSiliconBear)
    } catch (err) {
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

  getLocationUserJoin(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude,
          markerCoord:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      },
      (error) => console.log(error)
    );
  }

  getReportType(id){
    switch(id){
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

  getReportTypeID2(id){
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

  generateRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color   = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onChangeHandler(value){
    this.getReportTypeID2(value);
}

  selectPhotoTapped() {
    const options = {
      quality: 0.90,
      maxWidth: 750,
      maxHeight: 750,
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
          image64: source64
        });
      }
    });
  }

  _renderGlobalReports(){
    return(
      this.state.reports.map((marker, key) => (
        <Marker
          key = {key}
          coordinate={{latitude:Number(marker.latitud), longitude:Number(marker.longitud)}}
          title={this.getReportType(marker.tipo)}
          description={marker.fechaIncidente}
          pinColor = {this.generateRandomColor()}
        >
          <MapView.Callout  onPress={() => this.makeReportInfoRequest(marker.id)}>
            <TouchableOpacity style={styles.communityButton} >
                <View style={styles.viewCallout}>
                <Text style={styles.titleMarker}>{this.getReportType(marker.tipo)}</Text>
                <Text style={styles.descriptionMarker}>{marker.fechaIncidente}</Text>
                </View>
            </TouchableOpacity>
          </MapView.Callout>
        </Marker>
      ))
    );
  }

  showAlert(title, message){
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => this.setState({ visibleModal: null})}],
      {cancelable: false},
    );
  }

  _renderMakeReport(){
    if(Platform.OS === 'android'){
    return(
      <DismissKeyboard>
        <View style={styles.root}>
          <LinearGradient start={{x: 0, y: 1}} end={{x: 0, y: 0}} colors={['#4095ac','#122e39','#050e13','#050c12']} style={styles.root}>
            <View style={styles.mapView}>
              <MapView 
                style={styles.modalMap}
                provider={PROVIDER_GOOGLE}
                initialRegion={this.state.region}>
                <Marker
                  draggable
                  coordinate={this.state.markerCoord}
                  description={'Arrastra el marcador para cambiar la ubicación'}
                  onDragEnd={(e) => this.setState({markerCoord: e.nativeEvent.coordinate})}
                />
              </MapView>
            </View>
            <View style={styles.formik}>
              <ScrollView>
                <Text style={styles.titles}>Tipo del reporte y fecha</Text>
                  <View style={styles.dateAndDrop}>
                    <View style={styles.drop}>
                      <Dropdown
                        marginLeft={8}
                        data={data}
                        onChangeText={value => this.onChangeHandler(value)}
                        textColor='white'
                        selectedItemColor='black'
                        fontSize={18}
                        baseColor='white'
                        itemColor='black'
                        value='Robo'
                      />
                    </View>
                  <View style={styles.date}>
                    <DatePicker
                      date={this.state.date}
                      style={{width:58}}
                      mode="datetime"
                      format="YYYY/MM/DD-HH:mm:ss"
                      minDate="2015-01-01"
                      maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          width:60,
                          height:55,
                          marginLeft: 15
                        },
                        dateInput: {
                          height: 0,
                          width: 0,
                        }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                    />
                  </View>
                </View>
                <Text style={styles.titles}> Añade una descripción </Text>
                <TextInput
                  style={styles.textDescription}
                  onChangeText = {(text) => {this.setState({reportDescription:text})}}
                  returnKeyType = 'done'
                  multiline={true}
                />
                <Text style={styles.titles} >Añadir evidencia</Text>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <Image style={styles.itemPic} source={this.state.image} />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', flex: 1, justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity 
                    style={{backgroundColor:'#51738e', justifyContent:'center',alignItems:'center', borderRadius:10, height: 45, marginBottom: 15, marginTop: 20, flex: 1, marginRight: 5}}
                    onPress={() => this.makeReportRequest()}> 
                    <Text style={{color:'white', fontSize:20}}>Reportar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{backgroundColor:'#51738e', justifyContent:'center',alignItems:'center', borderRadius:10, height: 45, marginBottom: 15, marginTop: 20, flex: 1, marginLeft: 5}}
                    onPress={() => this.setState({visibleModal: null})}> 
                    <Text style={{color:'white', fontSize:20}}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </LinearGradient>
        </View>
      </DismissKeyboard>
    )
    } else {
      return(
      <DismissKeyboard>
        <View style={styles.root}>
          <LinearGradient start={{x: 0, y: 1}} end={{x: 0, y: 0}} colors={['#4095ac','#122e39','#050e13','#050c12']} style={styles.root}>
            <KeyboardAvoidingView style={styles.root} behavior="padding">
              <View style={styles.mapView}>
                <MapView 
                  style={styles.modalMap}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={this.state.region}>
                <Marker
                  draggable
                  coordinate={this.state.markerCoord}
                  description={'Arrastra el marcador para cambiar la ubicación'}
                  onDragEnd={(e) => this.setState({markerCoord: e.nativeEvent.coordinate})}
                />
                </MapView>
              </View>
              <View style={styles.formik}>
                <ScrollView>
                  <Text style={styles.titles}>Tipo del reporte y fecha</Text>
                  <View style={styles.dateAndDrop}>
                    <View style={styles.drop}>
                      <Dropdown
                        marginLeft={8}
                        data={data}
                        onChangeText={value => this.onChangeHandler(value)}
                        textColor='white'
                        selectedItemColor='black'
                        fontSize={18}
                        baseColor='white'
                        itemColor='black'
                        value='Robo'
                      />
                    </View>
                    <View style={styles.date}>
                      <DatePicker
                        date={this.state.date}
                        style={{width:58}}
                        mode="datetime"
                        format="YYYY/MM/DD-HH:mm:ss"
                        minDate="2015-01-01"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            width:60,
                            height:55,
                            marginLeft: 15
                          },
                          dateInput: {
                            height: 0,
                            width: 0,
                          }
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                      />
                    </View>
                  </View>
                  <Text style={styles.titles}> Añade una descripción </Text>
                  <TextInput
                    style={styles.textDescription}
                    onChangeText = {(text) => {this.setState({reportDescription:text})}}
                    returnKeyType = 'done'
                    multiline={true}
                  />
                  <Text style={styles.titles} >Añadir evidencia</Text>
                  <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <Image style={styles.itemPic} source={this.state.image} />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', flex: 1, justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity 
                      style={{backgroundColor:'#51738e', justifyContent:'center',alignItems:'center', borderRadius:10, height: 45, marginBottom: 15, marginTop: 20, flex: 1, marginRight: 5}}
                      onPress={() => this.makeReportRequest()}> 
                      <Text style={{color:'white', fontSize:20}}>Reportar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{backgroundColor:'#51738e', justifyContent:'center',alignItems:'center', borderRadius:10, height: 45, marginBottom: 15, marginTop: 20, flex: 1, marginLeft: 5}}
                      onPress={() => this.setState({visibleModal: null})}> 
                      <Text style={{color:'white', fontSize:20}}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
          </KeyboardAvoidingView>
        </LinearGradient>
        </View>
      </DismissKeyboard>
      )
    }
  }

  renderModalContent(){
    return(
    <KeyboardAvoidingView behavior="padding">
    <View style={styles.modalContent}>
      <View style = {{height: 330}}>
        <ScrollView width = {window.width - 70} alignItems= "center">
        <View width = {window.width - 70}>
          <Text style={styles.titlesDetails}>Categoría del reporte:</Text>
          <Text style={{margin:5}}>{this.getReportType(this.state.reporte.tipoReporte)}</Text>
          <Text style={styles.titlesDetails}>Autor del reporte:</Text>
          <Text style={{margin:5}}>{this.state.reporte.autorReporte}</Text>
          <Text style={styles.titlesDetails}>Fecha y hora del Incidente:</Text>
          <Text style={{margin:5}}>{this.state.reporte.fechaIncidente}</Text>
          <Text style={styles.titlesDetails}>Fecha y hora del Reporte:</Text>
          <Text style={{margin:5}}>{this.state.reporte.fechaReporte}</Text>
          <Text style={styles.titlesDetails}>Descripción:</Text>
          <Text style={{margin:5}} multiline = {true}>{this.state.reporte.descripcion}</Text>
          <Text style={styles.titlesDetails}>Evidencia:</Text>
          <Image style={styles.itemPic} source={{uri: this.state.reporte.evidencia && this.state.reporte.evidencia}}/>
          </View>
        </ScrollView>
      </View>
      <View style={{flexDirection:"row", width:'50%',justifyContent:'center', height: '8%'}} >
        <TouchableOpacity onPress={() => this.setState({ visibleModal: null })}>
          <IconClose name="close" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
      </View>
    </View>
   </KeyboardAvoidingView>
    )
  };

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

  makeReportInfoRequest(idReport){
    const requestJHONSON = {
      idReporte:idReport,
      nombreUsuario: this.state.userInfo.nombreUsuario,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude
    }
    Request_API(requestJHONSON, infoReporte).then(response => {
      console.log(response);
      if(response.codigoRespuesta === 200){
        this.setState({reporte:response.reporte, visibleModal: 2});
      }
    })
  }

    makeReportRequest(){
    const requestJHONSON = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
      tipoReporte: this.state.idReporte,
      evidencia:this.state.image64,
      descripcion: this.state.reportDescription,
      latitud: this.state.markerCoord.latitude,
      longitud: this.state.markerCoord.longitude,
      fechaIncidente: this.state.date,
      tokenSiliconBear: this.state.userInfo.tokenSiliconBear,
      ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude
    }
    console.log(requestJHONSON);
    Request_API(requestJHONSON, realizarReporte).then(response => {
      console.log(response);
      if(response.codigoRespuesta === 200){
        PouchDB_Insert(response.reporte._id, 'userReports', response.reporte)
        this.showAlert("Correcto",response.mensaje);
      } else {
        this.showAlert("Error: " + response.codigoRespuesta, response.mensaje);
      }
    })
  }

  render() {
    return this.state.region.latitude ? (
      <View style={styles.root}>
        <MapView style={styles.root}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}>
          {this.state.globalReports ? this._renderGlobalReports():null}
        </MapView>
        <ActionButton buttonColor="#1e4e56" onPress={() => this.setState({visibleModal: 5})}/>
        <Modal
          isVisible={this.state.visibleModal === 2}
          animationIn="slideInDown"
          animationOut="slideOutLeft"
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 5}
          style={styles.bottomModal}
          onBackdropPress={() => this.setState({ visibleModal: null })}
          >
          {this._renderMakeReport()}
        </Modal>
      </View>
    ):null
  }
}

const styles = StyleSheet.create({
  root:{
    flex: 1
  },
  communityButton:{
    height: 50,
    width: 130
  },
  viewCallout:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column'
  },
  titleMarker:{
    fontSize: 20,
    fontWeight: "bold"
  },
  descriptionMarker:{
    fontSize: 14,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  titlesDetails: {
    margin: 5,
    fontWeight: 'bold'
  },
  itemPic: {
    height: 300,
    width: window.width - 60,
    backgroundColor: '#c5c5c5',
    justifyContent: "center"
  },
  modalButtonIcon: {
    fontSize: 34,
    height: 35,
    marginTop:5,
    marginEnd:5,
    color: 'black'
  },
mapView: {
    flex: 6.5,
},
formik: {
    flex: 7,
    marginHorizontal: 10,
    marginVertical: 5,
},
modalMap:{
    height: "100%",
    width: "100%",
},
titles: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    color: 'white'
},
dateAndDrop:{
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
},
drop:{
    height: 60,
    flex: 12,
    width: 90,
    justifyContent: 'center'
},
date:{
    height: 60,
    width: 60,
    flex: 3,
    justifyContent: 'center'
},
textDescription:{
    flex:1,
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    textAlignVertical: 'top',
    width: window.width - 20,
    height: 100,
    color: 'white',
    fontSize: 18
},
itemPic: {
    height: 280,
    width: window.width - 20,
    justifyContent: "center",
    resizeMode: 'cover',
    marginTop: 20,
    backgroundColor: '#c5c5c5'
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
 });

 const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: MapScreen,
    }
  },
  {
    mode: 'modal',
    initialRouteName: "Home",
  }
);
const MyScreen = createAppContainer(AppNavigator);

export default class ScreenContact extends React.Component {
  render(){ return(<MyScreen/>); }
}