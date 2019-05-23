import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import { PouchDB_Get_Document} from '../PouchDB/PouchDBQuerys';
import { Request_API } from '../networking/server';
const alertURL = ':3030/API/agentePoliciaco/BotonDePanico';
const numbers=[
  {
    key:'1',
    name:'Emergencias:',
    num:'911'
  },
  {
    key:'2',
    name:'Policía de Guadalajara:',
    num:'201-6070'
  },
  {
    key:'3',
    name:'Policía de Zapopan:',
    num:'3836-3636'
  },
  {
    key:'4',
    name:'Policía de Tonalá',
    num:'35866101'
  },
  {
    key:'5',
    name:'Policía de Tlajomulco',
    num:'32834400'
  }
]

export default class PoiliceScreen extends React.Component {

  

  constructor(props){
    super(props);
    this.state = {
      userData:[],
      ubicacionUsuario: {},
      advice:false,
    };
    
    this.getInfo();
    //this.getLocationUser();
  }
/* 
  getLocationUser(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          ubicacionUsuario: position.coords.latitude + ',' + position.coords.longitude
        });
      },
      (error) => console.log(error)
    );
  } */
  adviceChange(){
    this.setState({advice:!this.state.advice})
  }
  async getInfo(){
    await PouchDB_Get_Document('BasicValues')
      .then(response => {
      this.setState({
        userData: response
      })
    });
  }

  async alertaPreventiva(){
    let promise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let pos = position.coords.latitude + ',' + position.coords.longitude;
            resolve(pos);
          },
          (error) => console.log(error)
        )
      });
      
      let position = await promise;

      const params ={
        nombreUsuario: this.state.userData.nombreUsuario,
        tokenSiliconBear: this.state.userData.tokenSiliconBear,
        ubicacionUsuario: position
      }
      console.log(params)
      await Request_API(params, alertURL).then(response => {
          if(response.codigoRespuesta == 200){
              console.log(response)
              this.startRoom();
          }
      })

}

startRoom(){
    const data = {
        nombreUsuario: this.state.userData.nombreUsuario,
    }
    console.log(data);
    socket.emit('botonDePanicoPresionado', data);
    this.trackUserLoc()
    this.adviceChange();
}

endRoom(){
        const data = {
            salaVigilancia: this.state.salaVigilancia
        }
        socket.emit('alertaPublicaTerminada', data);
        navigator.geolocation.clearWatch(this.watchID);
        this.setState({salaVigilancia:''});
        console.log(data)
        clearInterval(this.intervalID)
        this.adviceChange();
}

async trackUserLoc(){
  let promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let data = {
              nombreUsuario: this.state.userData.nombreUsuario,
              coordenadaX: position.coords.latitude.toString(),
              coordenadaY: position.coords.longitude.toString()
          }
          resolve(data);
        },
        (error) => console.log(error)
      )
    });
  
  let firstPos = await promise;
  this.setState({ubicacionUsuario:firstPos}, () => {
      this.intervalID = setInterval(() => {socket.emit('alertaPublica_posicionActualizada', this.state.ubicacionUsuario); console.log( this.state.ubicacionUsuario)}, 2000)
    }
  )
   
  console.log(firstPos)
  this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      var data = {
               nombreUsuario: this.state.userData.nombreUsuario,
               coordenadaX: lastPosition.coords.latitude.toString(),
               coordenadaY: lastPosition.coords.longitude.toString()
           };
           this.setState({ubicacionUsuario:data},() => socket.emit('alertaPublica_posicionActualizada', data));
           console.log(data);
           
  },(error) => console.log(error),{distanceFilter: 10});
}

  _renderItems(item){
    return(
    <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70}}>
        <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
          <Text style={{marginStart: 15,fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{marginStart: 15}}>{item.num}</Text>
        </View>
        <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
            <TouchableOpacity style={styles.buttonIcon}>
                <Icon name="phone" style={styles.buttonIcon} />
            </TouchableOpacity>
        </View>
    </View>
    )
}
_renderAdvice(){
  return(
  <View style={{height:30,flexDirection:'row',padding:5,paddingStart:10,backgroundColor:'yellow'}} >
    <Text style={{fontWeight:'bold'}} >Compartiendo ubicacion</Text>
    <View style={{marginLeft: 'auto'}}>
      <TouchableOpacity onPress={() => this.endRoom()}>
        <Text style={{right:0, }} >Cancelar </Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}
  render() {
    return (
      <View style={{ flex: 1}}>
        {this.state.advice ? this._renderAdvice():null}
        <View style={{marginTop:30,alignItems:'center',justifyContent:'center'}} >
          <TouchableOpacity style={styles.button} onPress={() => this.alertaPreventiva()} >
            <Text style={styles.text}>Botón de pánico</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
      alignItems:'center',
      justifyContent:'center',
      width:250,
      height:250 ,
      marginTop:5,
      marginEnd:5,marginStart:5,
      marginBottom:20,
      backgroundColor:'red',
      borderRadius:300,
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    color: 'black',
  },
  text:{
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  }
 });