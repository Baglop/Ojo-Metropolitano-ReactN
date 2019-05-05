import React, { Component } from 'react'
import { ScrollView, View, Text, TextInput, StyleSheet, NativeModules, TouchableOpacity, Picker, KeyboardAvoidingView, Dimensions, Image, Alert, StatusBar} from "react-native";
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
import {createAppContainer, createStackNavigator} from "react-navigation";
const window = Dimensions.get('window');

import PouchDB from 'pouchdb-react-native'; 
const db = new PouchDB('OjoMetropolitano');

const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'
const realizarReporte= ':3030/API/inicio/LevantarReporte';
const infoReporte=':3030/API/inicio/MostrarDetallesReporte';
const reportesUsuario = ':3030/API/inicio/ActualizarMisReportes';

export default class MakeReport extends Component {
    constructor() {
        super()
        
        this.state = {
            region:{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0400,
                longitudeDelta: 0.0200,
            },
            markerCoord:{
                latitude: 0,
                longitude: 0,
            },
            idReporte: null,
            date:null,
            image: require('../images/camera.png'),
        }
        this.getLocationUser();
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        
    }

    static navigationOptions = {
        headerTransparent: true
    }

    getLocationUser(){
        var currentDate = moment()
        .utcOffset('-06:00')
        .format('YYYY/MM/DD-hh:mm:ss');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              region:{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0400,
                longitudeDelta: 0.0200,
              },
              date: currentDate
            });
          },
          (error) => console.log(error)
        );
    }

    getReportType(){
        let data = [
          {value: 'Robo'},
          {value: 'Asalto'},
          {value: 'Acoso'},
          {value: 'Vandalismo'},
          {value: 'Pandillerismo'},
          {value: 'Violación'},
          {value: 'Secuestro o tentativa'},
          {value: 'Asesinato'},
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

    onChangeHandler(value){
        this.getReportTypeID(value);
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

    render() {
        return (
            <KeyboardAvoidingView style={styles.root} behavior="padding">
            <View style={styles.root}>
            <StatusBar hidden/>
            <View style={styles.mapView}>
            <MapView 
              style={styles.modalMap}
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.region}>
              <Marker
                draggable
                coordinate={{latitude: parseFloat(this.state.region.latitude) && parseFloat(this.state.region.latitude), 
                longitude: parseFloat(this.state.region.longitude) && parseFloat(this.state.region.longitude)}}
                // title={"Usted está aquí"}
                description={"Arrastra el marcador para seleccionar la ubicación"}
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
            data={this.getReportType()}
            onChangeText={value => this.onChangeHandler(value)}
            value='Robo'
            />
            </View>
            <View style={styles.date}>
            <DatePicker
            date={this.state.date}
            //style={styles.date}
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
            {/* <Text style={{textAlign:'right'}}>{this.state.date}</Text> */}
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
         
            </ScrollView>
            </View>
            </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        flex: 1
    },
    mapView: {
        flex: 6.5,
    },
    formik: {
        flex: 7,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5
    },
    modalMap:{
        height: "100%",
        width: "100%",
    },
    titles: {
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 20
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
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 10,
        textAlignVertical: 'top',
        width: window.width - 20,
        height: 100
    },
    itemPic: {
        height: 280,
        width: window.width - 20,
        justifyContent: "center",
        resizeMode: 'cover',
        marginTop: 20
      },
})