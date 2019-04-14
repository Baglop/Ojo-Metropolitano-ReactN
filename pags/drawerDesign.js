import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert, Modal, NativeModules, KeyboardAvoidingView, StatusBar,ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { TextInput } from "react-native-gesture-handler";
import { Button } from "../node_modules/react-native-elements";
import { Request_API } from '../networking/server';
let couchbase_lite = NativeModules.couchbase_lite;
let couchbase_lite_native = NativeModules.couchbase_lite_native;
const modURL = ':3030/API/miCuenta/ModificarInformacionUsuario'

export default class drawerDesign extends React.Component {
  
  loguotPress = () =>{
    if(Platform.OS == 'android'){
      couchbase_lite.deleteUserdataDoc(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });

      couchbase_lite.deleteUserInfoDoc(error => {
        console.log(error);
      }, success => {console.log(success);});

      couchbase_lite.deleteUserReportsDoc(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });
    }
    if(Platform.OS == 'ios'){
      couchbase_lite_native.deleteUserDataDocTXT(err => {
        console.log(err);
      }, succ => {
        console.log(succ);
      });
    }
  }

  getUserInfo(){
    if(Platform.OS == 'android'){
      couchbase_lite.getUserInfoDoc(err => {
        console.warn("Archivo no encontrado: " + err);
      },succ => {
        this.setState({userInfo: succ[0]});
      });
      couchbase_lite.getUserdataDoc(err => {
        console.warn("Archivo no encontrado: " + err);
      },succ => {
        this.setState({userData: succ[0]});
      });
    }
  }

  componentWillMount(){
    this.getUserInfo();
  }

  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
      namesModalV: false,
      mailModalV: false,
      phoneModalV: false,
      userInfo:[],
      userData:[],
      title:"",
      actualInfo:"",
      ID:3,
      ubicacionUsuario:'0.0,-0.0',
      newValue:"",
      newNames:"",
      newPSurname:"",
      newMSurname:"",
    };
    this.getLocationUser();
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

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }
  setNamesModalV(visible){
    this.setState({namesModalV: visible});
  }
  setMailModalV(visible){
    this.setState({mailModalV: visible});
  }

  async modRequest(property, value){
    const params = {
      nombreUsuario: this.state.userInfo.nombreUsuario,
      atributoModificado: property,
      valorNuevo: value,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: this.state.ubicacionUsuario,
    }
    Request_API(params,modURL).then(response =>{
       console.warn(response);
       if(Platform.OS == 'android'){
         couchbase_lite.updateUSerInfoDdc(property,value)
       }
       this.getUserInfo();
      }
    )
  }

  _renderNavBar(name, modalID){
    return(
      <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:1}}>
        
        <TouchableOpacity
          onPress={() => {
            if(modalID == 1){
            this.setModalVisible(!this.state.modalVisible)
            StatusBar.setHidden(true);
            }
            else if (modalID == 2)
            this.setNamesModalV(!this.state.namesModalV)
            else if (modalID ==3)
            this.setMailModalV(!this.state.mailModalV)
          }}
          >
          <Icon name="arrowleft" style={{fontSize: 25,height: 25, marginStart:15,marginEnd:15}} />
        </TouchableOpacity>
        <View style={{width:'100%', justifyContent:'flex-start',alignItems: 'flex-start'}} >
          <Text style={{fontWeight: 'bold', fontSize:20}}>{name}</Text>
        </View>
      </View>
    );
  }

  _renderModal(){
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onShow={() => {this.getUserInfo();StatusBar.setHidden(false);}}
        onDismiss={() => StatusBar.setHidden(true)}
        onRequestClose={() => {
          this.setModalVisible(!this.state.modalVisible);
          StatusBar.setHidden(true);
        }}>
        <View>
          {this._renderNavBar("Modificar Cuenta",1)}
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setNamesModalV(!this.state.namesModalV);
              }}
              style={{width:'100%',borderBottomWidth:0.5}}
              >
              <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
                <Text style={styles.boldText}>Nombre</Text>
                <Text>{this.state.userInfo.nombres && this.state.userInfo.nombres 
                  + " " + this.state.userInfo.apellidoPaterno
                  + " " + this.state.userInfo.apellidoMaterno}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({title:"Cambiar numero celular",property:"celular",actualInfo:this.state.userInfo.celular})
                this.setMailModalV(!this.state.mailModalV);
              }}
              style={{width:'100%',borderBottomWidth:0.5}}
              >
              <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
                <Text style={styles.boldText}>Telefono</Text>
                <Text>{this.state.userInfo.celular && this.state.userInfo.celular}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({title:"Cambiar correo electronico",property:"correo",actualInfo:this.state.userInfo.correo})
                this.setMailModalV(!this.state.mailModalV);
              }}
              style={{width:'100%',borderBottomWidth:0.5}}
              >
              <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
                <Text style={styles.boldText}>Correo Electronico</Text>
                <Text>{this.state.userInfo.correo && this.state.userInfo.correo}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setMailModalV(!this.state.mailModalV);
              }}
              style={{width:'100%',borderBottomWidth:0.5}}
              >
              <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
                <Text style={styles.boldText}>Contraseña</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/*this._renderUserNameModal()*/}
        {this._renderModModal(this.state.title,this.state.actualInfo,this.state.ID,this.state.property)}
        {this._renderNamesModal()}
      </Modal>
    );
  }

  _renderNamesModal(){
    return(
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.namesModalV}
      onRequestClose={() => {
        this.setnamesModalV(!this.state.namesModalV)
      }}>
        <View>
          {this._renderNavBar("Cambiar nombre",2)}
          <View style={{width:'100%',borderBottomWidth:0.5}}>
            <View style={{marginStart: 15,marginBottom:15,marginTop:15}} >  
              <Text style={styles.boldText} >Actual</Text>
              <Text>{this.state.userInfo.nombres + " " + this.state.userInfo.apellidoPaterno + " " + this.state.userInfo.apellidoMaterno}</Text>
            </View>
          </View>
          <ScrollView style={{width:'100%',borderBottomWidth:0.5}} >
            <KeyboardAvoidingView behavior="position" style={{flex: 1, marginStart: 15,marginBottom:15,marginTop:15}} >
              <Text style={styles.boldText}>Nuevo nombre</Text>
              <TextInput
              style={{}}
              returnKeyType = "next"
              ref={(input) => this.nuevoNombre = input}
              nChangeText={(text) => this.setState({newNames:text})}
              autoFocus={true}
              placeholder={this.state.userInfo.nombres !== "" ? this.state.userInfo.nombres : "Nombres"}
              />
              <TextInput
              style={{}}
              returnKeyType = "next"
              ref={(input) => this.NuevoApellidoP = input}
              onChangeText={(text) => this.setState({newPSurname:text})}
              placeholder={this.state.userInfo.apellidoPaterno !== "" ? this.state.userInfo.apellidoPaterno : "Apellido Paterno"}
              />
              <TextInput
              style={{}}
              returnKeyType = "go"
              ref={(input) => this.NuevoApellidoM = input}
              onChangeText={(text) => this.setState({newMSurname:text})}
              placeholder={this.state.userInfo.apellidoMaterno !== "" ? this.state.userInfo.apellidoMaterno : "Apellido Materno"}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <View style={{ flex: 1,justifyContent: 'flex-end',}}>
          <KeyboardAvoidingView  enabled behavior="position" style={{justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute',bottom:0,width:'100%',borderTopWidth:0.5}} >
            <View style={{width:80,justifyContent: 'flex-end',alignContent:'flex-end', margin:10}}>
            <Button  onPress={() => {if(this.state.newNames != "")this.modRequest("nombres",this.state.newNames).then(this.setState({newNames:"text"}));
             if(this.state.newPSurname != "")this.modRequest("apellidoPaterno",this.state.newPSurname).then(this.setState({newPSurname:"text"}));
             if(this.state.newMSurname != "")this.modRequest("apellidoMaterno",this.state.newMSurname).then(this.setState({newMSurname:"text"}))}} title="Aceptar"/>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }

  _renderModModal(title,actualInfo,ID,property){
    return(
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.mailModalV}
      onRequestClose={() => {
        this.setMailModalV(!this.state.mailModalV)
      }}>
        <View>
          {this._renderNavBar(title,ID)}
          <View style={{width:'100%',borderBottomWidth:0.5}}>
            <View style={{marginStart: 15,marginBottom:15,marginTop:15}} >  
              <Text style={styles.boldText} >Actual</Text>
              <Text>{actualInfo}</Text>
            </View>
          </View>
          <View style={{width:'100%',borderBottomWidth:0.5}}>
            <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
              <Text style={styles.boldText}>Nuevo</Text>
              <TextInput
              style={{}}
              returnKeyType = "go"
              ref={(input) => this.nuevoUsuario = input}
              autoFocus={true}
              placeholder={actualInfo}
              onChangeText = {(text) => this.setState({newValue: text})}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1,justifyContent: 'flex-end',}}>
          <KeyboardAvoidingView style={{justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute',bottom:0,width:'100%',borderTopWidth:0.5}} >
            <View style={{width:80,justifyContent: 'flex-end',alignContent:'flex-end', margin:10}}>
            <Button  onPress={() => {this.modRequest(property,this.state.newValue).then(this.setMailModalV(!this.state.mailModalV))}} title="Aceptar"/>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{height:200,backgroundColor:'black'}} >
        </View>
        <View style={{marginTop:30,marginStart:10}} >
            <TouchableOpacity style={styles.button} onPress={() => this.setModalVisible(true)}>
                <Icon name="edit" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Modificar cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Icon name="deleteuser" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Eliminar cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.loguotPress}>
                <Icon name="logout" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
        <View style={{marginTop:30,marginStart:10}} >
            <TouchableOpacity style={styles.button}>
                <Icon name="questioncircle" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Acerca de</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Icon name="infocirlce" style={styles.buttonIcon} />
                <Text style={{fontWeight:'bold',fontSize:18}}>Contacto</Text>
            </TouchableOpacity>
            {this._renderModal()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    height: 100,
    width: 100,
    borderRadius: 200,
    resizeMode : 'stretch',
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    marginEnd: 10,
    color:'black',
  },
  boldText:{
    fontWeight: 'bold',
     fontSize:16
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:20
  }
 });



