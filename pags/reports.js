import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  StatusBar

} from "react-native";
import IconDelete from 'react-native-vector-icons/EvilIcons';
import IconClose from 'react-native-vector-icons/EvilIcons';
import IconUpdate from 'react-native-vector-icons/EvilIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Marker from "react-native-maps";
import Modal from "react-native-modal";
import { PouchDB_Get_Document, PouchDB_DeleteDoc, PouchDB_UpdateDoc } from '../PouchDB/PouchDBQuerys';
import ImagePicker from 'react-native-image-picker';
import { Request_API } from '../networking/server';
import { Sae } from 'react-native-textinput-effects';

import _ from 'lodash';
import PouchdbFind from 'pouchdb-find';
import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');

const updateReporte = ':3030/API/inicio/ModificarReporte'
const deleteReporteUsuario = ':3030/API/inicio/EliminarReporte';
const window = Dimensions.get('window');

const myMap = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 10;

export default class screens extends Component {

  static navigationOptions = {
    headerTransparent: true
  } 

  constructor(props){
    super(props);
    PouchDB.plugin(PouchdbFind);
    this.getInfo();
    this.getLocationUser();
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

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

  async getInfo(){
    await db.find({
      selector: {
        type: 'userReports',
      },
      index: {
      fields: ['type']
      }
    }).then(result => {
      this.setState({
        userReports: result.docs
      })
    }).catch(function (err) {
      console.log(err);
    });

    await PouchDB_Get_Document('BasicValues')
      .then(response => {
      this.setState({
        userData: response
      })
    });
  }

  state = {
    openBar: true,
    userData:[],
    userReports:[],
    reporte: [],
    nuevoValor: '',
    visibleModal: null,
    image: null,
    atributo: '',
    ubicacionUsuario: '0.0,-0.0',
    region: {
      latitude: 20.601611, 
      longitude: -103.337112,
      latitudeDelta: 0.483,
      longitudeDelta: 0.293,
    },
  };

  // renderButton = (text, onPress) => (
  //   <TouchableOpacity onPress={onPress}>
  //     <View style={styles.button}>
  //       <Text>{text}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  // renderModalContent = () => (
  //   <View style={styles.modalContent}>
  //     <Text>Hello!</Text>
  //     {this.renderButton("Close", () => this.setState({ visibleModal: null }))}
  //   </View>
  // );

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= this.state.userReports.length) {
        index = this.state.userReports.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const coordinate2 = {
            latitude: Number(this.state.userReports[index].latitud),
            longitude: Number(this.state.userReports[index].longitud),
          }
          this.map.animateToRegion(
            {
              ...coordinate2,
              latitudeDelta: Number(this.state.region.latitudeDelta),
              longitudeDelta: Number(this.state.region.longitudeDelta),
            },
            350
          );
        }
      }, 10);
    });
  }

  generateRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color   = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  showAlert(title, message, _id){
    Alert.alert(
      title,
      message,
      [,
        {text: 'OK', onPress: () => this.deleteReport(_id)},
        {text: 'Cancelar'},
      ],
    );
  }

  deleteReport(id){
    const bodyPetition = {
      idReporte: id,
      nombreUsuario: this.state.userData.nombreUsuario,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    }
    Request_API(bodyPetition, deleteReporteUsuario).then(response => {
      if(response.codigoRespuesta === 200){
        _.pullAllBy(this.state.userReports, [{ '_id': `${id}`}], '_id');
        PouchDB_DeleteDoc(id);
        this.setState({ visibleModal: null })
      }
    }); 
  }

  updateReports(reporte){
    const bodyPetition = {
      idReporte: reporte._id,
      nombreUsuario: this.state.userData.nombreUsuario,
      atributoModificado: this.state.atributo,
      valorNuevo: this.state.nuevoValor,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    }
    console.log(bodyPetition)
    if(this.state.atributo === 'evidencia'){
      Request_API(bodyPetition, updateReporte).then(response => {
        if(response.codigoRespuesta === 200){
          console.log(response);
          _.set(_.find(this.state.userReports, {_id: reporte._id}), 'evidencia', `${response.reporte.evidencia}`);
          PouchDB_UpdateDoc(reporte._id, reporte.type, response.reporte);
          Alert.alert(
          'Correcto',
            response.mensaje,
            [,
              {text: 'OK', onPress: () => this.setState({ visibleModal: null })},
            ],
            {cancelable: false},
          );
        }
        else{
        Alert.alert(
          'Error ' + response.codigoRespuesta,
          response.mensaje,
            [,
              {text: 'OK'},
            ],
            {cancelable: false},
          );
        }
      }); 
      
    } else if(this.state.atributo === 'descripcion'){
      Request_API(bodyPetition, updateReporte).then(response => {
          if(response.codigoRespuesta === 200){
            _.set(_.find(this.state.userReports, {_id: reporte._id}), 'descripcion', `${response.reporte.descripcion}`);
            PouchDB_UpdateDoc(reporte._id, reporte.type, response.reporte);
            Alert.alert(
              'Correcto',
              response.mensaje,
              [,
                {text: 'OK', onPress: () => this.setState({ visibleModal: null })},
              ],
              {cancelable: false},
            );
          }
          else{
            Alert.alert(
              'Error ' + response.codigoRespuesta,
              response.mensaje,
              [,
                {text: 'OK'},
              ],
              {cancelable: false},
            );
          }
        }); 
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
          atributo: 'evidencia',
          nuevoValor: source64
        });
      }
    });
  }

  renderModalContent(){
    return(
    <KeyboardAvoidingView behavior="padding">
    <View style={styles.modalContent}>
      <View style = {{height: 300}}>
        <ScrollView width = {window.width - 70} alignItems= "center">
        <View width = {window.width - 70}>
          <Text style={styles.titles}>Categoría del reporte:</Text>
          <Text style={{margin:5}}>{this.getReportType(this.state.reporte.tipoReporte)}</Text>
          <Text style={styles.titles}>Fecha y hora del Incidente:</Text>
          <Text style={{margin:5}}>{this.state.reporte.fechaIncidente}</Text>
          <Text style={styles.titles}>Fecha y hora del Reporte:</Text>
          <Text style={{margin:5}}>{this.state.reporte.fechaReporte}</Text>
          <Sae
          style={{color: 'black'}}
          iconClass={FontAwesomeIcon}
          iconName={'pencil'}
          iconColor={'black'}
          inputPadding={16}
          labelHeight={24}
          // active border height
          borderHeight={1}
          // TextInput props
          labelStyle={{ color: 'black' }}
          inputStyle={{ color: 'black' }}
          value={this.state.reporte.descripcion}
          multiline = {true}
          />
          <Text style={styles.titles}>Descripción:</Text>
          <TextInput style={{margin:5}} multiline = {true} onChangeText={(text) => this.setState({nuevoValor: text, atributo: 'descripcion'})}>{this.state.reporte.descripcion}</TextInput>
          <Text style={styles.titles}>Evidencia:</Text>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          {this.state.image === null ? (
              <Image style={styles.itemPic} source={{uri: this.state.reporte.evidencia && this.state.reporte.evidencia}}/>
            ) : (
              <Image style={styles.itemPic} source={this.state.image && this.state.image} />
            )}
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={{flexDirection:"row", width:'50%',justifyContent:'space-between', height: '8%'}} >
        <TouchableOpacity
          onPress={() => this.setState({ visibleModal: null })}>
          <IconClose name="close" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.showAlert('Confirmación','¿Seguro que quieres eliminar este reporte?', this.state.reporte._id)}>
          <IconDelete name="trash" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateReports(this.state.reporte)}>
          <IconUpdate name="refresh" style={styles.modalButtonIcon}/>
        </TouchableOpacity>
      </View>
    </View>
   </KeyboardAvoidingView>
    )
  };

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
  
  render() {
    const interpolations = this.state.userReports.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [0.5, 4, 0.5],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 2, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
       <StatusBar hidden/>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.container}
          customMapStyle = {myMap}
        >
          {this.state.userReports.map((marker, index) => {
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            const coordinate = {
              latitude: Number(marker.latitud),
              longitude: Number(marker.longitud)
            } 
            return (
              <MapView.Marker key={index} coordinate={coordinate} title={this.getReportType(marker.tipoReporte)}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.userReports.map((marker, index) => (
            <TouchableOpacity key={index} style={styles.cardImage} onPress={() => this.setState({ visibleModal: 2, reporte: marker, image: null })}>
            <View style={styles.card} key={index}>
            <View style={styles.cardImage}>
              <Image
                source={{uri: marker.evidencia}}
                style={styles.cardImage}
                resizeMode="cover"
              /> 
              </View>
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{this.getReportType(marker.tipoReporte)}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.descripcion}
                </Text>
              </View>
            </View>
            </TouchableOpacity>
          ))
          }
        </Animated.ScrollView>
        <Modal
          isVisible={this.state.visibleModal === 2}
          animationIn="slideInRight"
          animationOut="slideOutLeft"
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 15,
    height: 15,
    borderRadius: 15/2,
    // backgroundColor: "rgba(130,4,150, 0.9)",
    backgroundColor: "red",
  },
  ring: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderColor: "rgba(130,4,150, 0.5)",
  },
  modalButtonIcon: {
    fontSize: 35,
    height: 35,
    marginTop:5,
    marginEnd:5,
    color: 'black',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalMap:{
    margin: 5,
    height: "100%",
    width: "100%",
  },
  itemPic: {
    height: 300,
    width: window.width - 60,
    backgroundColor: '#c5c5c5',
    justifyContent: "center",
  },
  titles: {
    margin: 5,
    fontWeight: 'bold'
  },
});

AppRegistry.registerComponent("mapfocus", () => screens);