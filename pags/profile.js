import React from "react";
import { View, Text,StyleSheet,Platform, TouchableOpacity, ScrollView, NativeModules, Alert, TextInput, Dimensions, KeyboardAvoidingView} from "react-native";
import { createDrawerNavigator,createAppContainer} from "react-navigation";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Bg from '../images/citybackground.png';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import drawerDesign from './drawerDesign'
import { Card } from 'react-native-elements'
import { Button, Image } from 'react-native-elements';
import Modal from "react-native-modal";
import _ from 'lodash';
import { Request_API } from '../networking/server';
const window = Dimensions.get('window');
const reportesUsuario = ':3030/API/inicio/ActualizarMisReportes';
const deleteReporteUsuario = ':3030/API/inicio/EliminarReporte';
const image = 'http://okcundinamarca.com/wp-content/uploads/2017/08/robo-a-mano-armada.jpg'
const profile = 'https://images.goodsmile.info/cgm/images/product/20170721/6596/46630/large/fc0a3e0931f953140831e0be59d36123.jpg'

let couchbase_lite_native = NativeModules.couchbase_lite_native;
const couchbase_liteAndroid = NativeModules.couchbase_lite;


class ProfileScreenConent extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { 
      openBar: false,
      userData: [],
      userReports:[],
      visibleModal: null,
      reporte: [],
      ubicacionUsuario: '0.0,-0.0',
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0100,
        longitudeDelta: 0.0025,
      },
      userInfo:[]
    };
    this.getLocationUser();
    
  }

  getInfo(){
    if(Platform.OS == 'android'){
      couchbase_liteAndroid.getUserInfoDoc(err => {
          console.warn(err)
        }, succ => {
          this.setState({userInfo: succ[0]})
          console.warn(succ)
        }
     )
    }
  }

  startLocTrack(){
      if (Platform.OS === 'android'){
        couchbase_liteAndroid.getUserdataDoc(err => {
          console.warn("chale me humillo")
        },succ => {
          this.setState({userData: succ[0]})
          const userPetition = {
            nombreUsuario: succ[0].userName,
            tokenSiliconBear: succ[0].tokenSiliconBear,
            ubicacionUsuario: this.state.ubicacionUsuario
          };
          Request_API(userPetition, reportesUsuario)
          .then(response => {
            console.warn(JSON.stringify(response));
            if(response.codigoRespuesta === 200){
              couchbase_liteAndroid.setReportDataDoc(JSON.stringify(response),2);
              this.setState({userReports:response.reportes});
              console.warn(this.state.reports.id);
            }
          })
        });
      }
      if(Platform.OS === 'ios'){
        couchbase_lite_native.getUserdataDocTXT(err => {
          console.warn("chale me humillo")
        },succ => {
          this.setState({userData: succ[0]})
          const userPetition = {
            nombreUsuario: succ[0].userName,
            tokenSiliconBear: succ[0].tokenSiliconBear,
            ubicacionUsuario: this.state.ubicacionUsuario
          }
          Request_API(userPetition, reportesUsuario)
          .then(response => {
            if(response.codigoRespuesta === 200){
              //couchbase_liteAndroid.setReportDataDoc(JSON.stringify(response),2);
              this.setState({userReports: response.reportes});
            }
          })
      });
    }
  }

  deleteReport(id){
    if(Platform.OS === 'android'){
      const bodyPetition = {
        idReporte: id,
        nombreUsuario: this.state.userData.userName,
        tokenSiliconBear: this.state.userData.tokenSiliconBear,
        ubicacionUsuario: this.state.ubicacionUsuario,
      }
      Request_API(bodyPetition, deleteReporteUsuario)
        .then(response => {
        if(response.codigoRespuesta === 200){
          console.warn('Se elimino con exito')
          let result = _.pull(this.state.userReports, `${id}`);
          console.warn(result)
        }
      }); 
    }
    if(Platform.OS === 'ios'){
      const bodyPetition = {
        idReporte: id,
        nombreUsuario: this.state.userData.userName,
        tokenSiliconBear: this.state.userData.tokenSiliconBear,
        ubicacionUsuario: this.state.ubicacionUsuario,
      }
      Request_API(bodyPetition, deleteReporteUsuario)
        .then(response => {
        if(response.codigoRespuesta === 200){
          let result = _.pull(this.state.userReports, `${id}`);
          console.warn(result)
        }
      }); 
    }
}
  async componentWillMount(){
    await this.getInfo();
    this.startLocTrack();
  }

  showAlert(title, message, _id){
    Alert.alert(
      title,
      message,
      [,
        {text: 'OK', onPress: () => this.deleteReport(_id)},
        {text: 'Cancelar', onPress: () => this.setState({ visibleModal: null })},
      ],
    );
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonModal}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  getLocationUser(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude
        });
      },
      (error) => console.log(error)
    );
  }

  renderModalContent(){
    return(
    <KeyboardAvoidingView behavior="padding">
    <View style={styles.modalContent}>
      <View style = {{height: 300}}>
        <ScrollView width = {window.width - 60}>
        <View>
          <Text style={styles.titles}> ID del Reporte:</Text>
          <Text style={{margin:5}}> {this.state.reporte._id} </Text>
          <Text style={styles.titles}> Autor:</Text>
          <Text style={{margin:5}}> {this.state.reporte.autorReporte} </Text>
          <Text style={styles.titles}> Tipo:</Text>
          <Text style={{margin:5}}> {this.state.reporte.tipoReporte} </Text>
          <Text style={styles.titles}> Fecha y hora del Incidente:</Text>
          <Text style={{margin:5}}> {this.state.reporte.fechaIncidente} </Text>
          <Text style={styles.titles}> Fecha y hora del Reporte:</Text>
          <Text style={{margin:5}}> {this.state.reporte.fechaReporte} </Text>
          <Text style={styles.titles}> Descripción:</Text>
          <TextInput style={{margin:5}} multiline = {true}> {this.state.reporte.descripcion} </TextInput>
          <Text style={styles.titles}> Evidencia:</Text>
          <Image style={styles.itemPic} source={{uri: image}}/>
          <Text style={{margin:5}}> {this.state.reporte.evidencia} </Text>
          <Text style={styles.titles}> Ubicación del reporte:</Text>
          <View height={250}>
            <MapView style={styles.modalMap}
            zoomEnabled = {false}
            pitchEnabled	= {false}
            rotateEnabled = {false}
            scrollEnabled = {false}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: parseFloat(this.state.reporte.latitud) && parseFloat(this.state.reporte.latitud),
                longitude: parseFloat(this.state.reporte.longitud) && parseFloat(this.state.reporte.longitud),
                latitudeDelta: 0.0100,
                longitudeDelta: 0.0025}}>
                <Marker
                  coordinate={{latitude: parseFloat(this.state.reporte.latitud) && parseFloat(this.state.reporte.latitud), 
                               longitude: parseFloat(this.state.reporte.longitud) && parseFloat(this.state.reporte.longitud)}}
                />
            </MapView>
          </View>
          </View>
        </ScrollView>
      </View>
      <View style={{flexDirection:"row", width:'200%',justifyContent:"center"}} >
        <TouchableOpacity
          onPress={() => this.setState({ visibleModal: null })}>
          <Icon name="md-checkmark-circle" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.showAlert('Confirmación','¿Seguro que quieres eliminar este reporte?', this.state.reporte._id)}>
          <Icon name="md-close-circle" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setState({ visibleModal: null })}>
          <Icon name="md-arrow-dropup-circle" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
      </View>
    </View>
   </KeyboardAvoidingView>
    )
  };

  _renderProfile(){
    return(
    <View>
      <View style={{alignItems:'center',justifyContent:'center',height:'100%'}} >
        <TouchableOpacity style={{overflow:'hidden',borderRadius:200,borderWidth:2}}>
          <Image style={styles.logoStyle} source={{uri: this.state.userInfo.imagenPerfil}}/>
        </TouchableOpacity>
        <Text style={{color:'white',fontWeight:'bold'}}>{this.state.userInfo.nombreUsuario}</Text>
      </View>
    </View>
    )
  }

  renderLeftSidebar() {
    return(
      <View>
        <Text style={{color:'white',fontWeight:'bold'}}>Ola</Text>
      </View>
    )
  }
  openSideBar = () => this.setState({ openBar: true })

  render() {
    return (
      
      <View style={{ flex: 1 }}>
        <HeaderImageScrollView
        maxHeight={300}
        minHeight={50}
        headerImage={Bg}
        fadeOutForeground
        renderTouchableFixedForeground={() => (
          <TouchableOpacity style={styles.button}>
            <Icon name="md-menu" style={styles.buttonIcon} onPress={() => this.props.navigation.openDrawer()} />
          </TouchableOpacity>
        )}
        renderForeground={() => this._renderProfile()}
        >
          <View style={{ height: 1000 }}>
            <TriggeringView onHide={() => console.log('text hidden')} >
              <Text>Perfil</Text> 
              <ScrollView horizontal = {true} showsHorizontalScrollIndicator = { false }>
                {
                  this.state.userReports && this.state.userReports.map((getData, key) => {
                    return(
                      <TouchableOpacity key = {key} onPress={() => this.setState({ visibleModal: 2, reporte: getData })}>
                      <View style={styles.buttonModal}>
                        <Text>{getData._id}</Text>
                      </View>
                    </TouchableOpacity>  
                    )                     
                })
                }                
              </ScrollView>
                <Modal
                  isVisible={this.state.visibleModal === 2}
                  animationIn="slideInRight"
                  animationOut="slideOutLeft"
                  onBackdropPress={() => this.setState({ visibleModal: null })}>
                  {this.renderModalContent()}
                </Modal>
            </TriggeringView>
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titles: {
    //fontFamily: 'lucida',
    margin: 5,
    fontWeight: 'bold'
  },
  logoStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode : 'stretch',
  },
  button: {
    width:40,
    marginStart:10,
    marginTop:9,
    position:'absolute',
    justifyContent: 'center',
  },
  buttonModal: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    color:'black',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalButtonIcon: {
    fontSize: 35,
    height: 35,
    marginTop:5,
    marginEnd:5,
    color: 'black',
  },
  itemPic: {
    margin: 5,
    height: 300,
    width: window.width - 60,
    backgroundColor: '#c5c5c5',
    justifyContent: "center",
  },
  modalMap:{
    margin: 5,
    height: "100%",
    width: "100%",
  },
 });

 const MyDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: ProfileScreenConent,
    }
  },
  {
    contentComponent: drawerDesign,
    drawerWidth: 240
  });

const MyApp = createAppContainer(MyDrawerNavigator);

export default class ProfileScreen extends React.Component {
  render(){
    return(
      <MyApp/>
    );
  }
}