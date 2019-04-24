import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Dimensions,Alert, KeyboardAvoidingView, Button } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { Request_API } from '../networking/server';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import PouchDB from 'pouchdb-react-native'; 
import { PouchDB_Insert, PouchDB_DeleteDoc, PouchDB_UpdateDoc } from '../PouchDB/PouchDBQuerys'
import PouchdbFind from 'pouchdb-find';
//import { TextInput } from "react-native-gesture-handler";
let newGroupURL = ':3030/API/contactos/CrearGrupo';
const AmigosyGrupos = ':3030/API/contactos/ActualizarAmigosYGrupos';
const deleteGroupURL = ':3030/API/contactos/EliminarGrupo'
const modGroupURL = ':3030/API/contactos/EditarGrupo'
const db = new PouchDB('OjoMetropolitano');
const window = Dimensions.get('window');

export default class GroupList extends React.Component {
   
    constructor(props){
        super(props);
        PouchDB.plugin(PouchdbFind);
        this.state ={
            groups:[],
            userData: this.props.userData,
            modalVisible:false,
            modalGroupVisible:false,
            modalDellVisible:false,
            modModalVisible: false,
            actualInfo:'',
            newValue:'',
            newGroupName:'',
            actualGroup:null,
        };
        this.getGroups();
    }

    async getGroups(){
        await db.find({
            selector: {
              type: 'groups',
            },
            index: {
            fields: ['type']
            }
          }).then(result => {
            this.setState({
              groups: result.docs
            })
            console.log(result)
          }).catch(function (err) {
            console.log(err);
          });
    }

    componentWillReceiveProps(nextProps){
        this.setState({userData: nextProps.userData})

    }

    async modRequest(value){
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
        const params = {
          nombreUsuario: this.state.userData.nombreUsuario,
          atributoModificado: 'nombreGrupo',
          idGrupo:this.state.actualGroup.idGrupo,
          nuevoValor: value,
          tokenSiliconBear: this.state.userData.tokenSiliconBear,
          ubicacionUsuario: position,
        }
        console.log(params)
        Request_API(params, modGroupURL).then(response =>{
          console.log(response)
          if(response.codigoRespuesta === 200){
            PouchDB_UpdateDoc(response.grupo.idGrupo, 'groups', response.grupo);
            setTimeout(() => {
                this.getGroups();
              }, 1500); 
          }
        });
      }

    userFriendsAndGroups(pos){
        const userFyG = {
        nombreUsuario: this.state.userData.userName,
        tokenSiliconBear: this.state.userData.tokenSiliconBear,
        ubicacionUsuario: pos,
        };
        Request_API(userFyG, AmigosyGrupos).then(response => { 
        if(response.codigoRespuesta === 200){
            if(_.size(response.grupos[response.grupos.lenght -1 ]) > 0){
            response.grupos.map((data) => {
                PouchDB_Insert(data.idGrupo, 'groups', data)
            })
            }
        }
        });
    }

    async newGroupRequest(){
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
        const params = {
            nombreUsuario: this.state.userData.nombreUsuario,
            nombreGrupo: this.state.newGroupName,
            tokenSiliconBear: this.state.userData.tokenSiliconBear,
            ubicacionUsuario: position
        }
        console.log(params);
        Request_API(params,newGroupURL).then(response => {
            if(response.codigoRespuesta == 200){
                PouchDB_Insert(response.grupo.idGrupo, 'groups', response.grupo)
                console.log(response)
                setTimeout(() => {
                    this.getGroups();
                  }, 1500);  
            }
        })
    }

    setModalVisible = () =>
    this.setState({ modalVisible: !this.state.modalVisible });

    setModalGroupVisible = () =>
    this.setState({ modalGroupVisible: !this.state.modalGroupVisible });

    setModalDelVisible = () =>{
    this.setState({modalDellVisible: !this.state.modalDellVisible});
        console.log('switch')
    }

    setmodModalVisible = () =>
        this.setState({modModalVisible:!this.state.modModalVisible})
    
    async deleteGroupDoc(idGrupo){
        await db.find({
            selector: {
              type: 'groups',
              idGrupo: idGrupo
            },
            index: {
            fields: ['type']
            }
          }).then(result => {
              console.log(result)
             PouchDB_DeleteDoc(result.docs[0]._id)
            .then(this.getGroups());
          }).catch(function (err) {
            console.log(err);
          });
    }

    async deleteGroup(idGrupo){
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
          idGrupo: idGrupo,
          tokenSiliconBear: this.state.userData.tokenSiliconBear,
          ubicacionUsuario: position
        }

        Request_API(params, deleteGroupURL).then(response => {
            console.log(response)
            if(response.codigoRespuesta == 200){
                this.deleteGroupDoc(idGrupo);
            }
        })
    }
    
    _renderNavBar(){
        return(
        <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:1}}>
            
            <TouchableOpacity
            onPress={this.setmodModalVisible}
            >
            <Icon name="md-arrow-back"  style={{fontSize: 25,height: 25, marginStart:15,marginEnd:15}} />
            </TouchableOpacity>
            <View style={{width:'100%', justifyContent:'flex-start',alignItems: 'flex-start'}} >
            <Text style={{fontWeight: 'bold', fontSize:20}}>Editar Grupo</Text>
            </View>
        </View>
        );
    }
    _renderModModal(){
        return(
          <Modal
          style={{margin:0,flex:1,height:window.height}}
          animationType="slide"
          transparent={false}
          visible={this.state.modModalVisible}
          onRequestClose={this.setmodModalVisible}>
            <View>
              {this._renderNavBar()}
              <View style={{width:'100%',borderBottomWidth:0.5}}>
                <View style={{marginStart: 15,marginBottom:15,marginTop:15}} >  
                  <Text style={styles.boldText} >Actual</Text>
                  <Text>{this.state.actualInfo}</Text>
                </View>
              </View>
              <View style={{width:'100%',borderBottomWidth:0.5}}>
                <View style={{marginStart: 15,marginBottom:15,marginTop:15}}>
                  <Text style={styles.boldText}>Nuevo</Text>
                  <TextInput
                  style={{}}
                  returnKeyType = "go"
                  ref={(input) => this.nuevoNombre = input}
                  autoFocus={true}
                  placeholder={this.state.actualInfo}
                  onChangeText = {(text) => this.setState({newValue: text})}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 1,justifyContent: 'flex-end',}}>
              <KeyboardAvoidingView style={{justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute',bottom:0,width:'100%',borderTopWidth:0.5}} >
                <View style={{width:80,justifyContent: 'flex-end',alignContent:'flex-end', margin:10}}>
                <Button  onPress={() => {this.modRequest(this.state.newValue).then(this.setmodModalVisible())}} title="Aceptar"/>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        );
    }

    _renderGroupInfo(){
        return(
        <View>
          <View style={{alignItems:'center',justifyContent:'center',height:'100%'}} >
            <Text style={{color:'white',fontWeight:'bold',fontSize:18}}>{this.state.actualGroup}</Text>
          </View>
        </View>
        )
      }

    _renderModalGroup(){
        return(
        <Modal 
        style={{margin:0,flex:1,height:window.height}}
        animationType="slide"
        transparent={false}
        visible={this.state.modalGroupVisible}
        onRequestClose={this.setModalGroupVisible}
        
        >
            <View style={{flex:1,backgroundColor:'white',height:window.height}}>
            <HeaderImageScrollView
                maxHeight={300}
                minHeight={50}
                headerImage={{uri:'https://images.pexels.com/photos/1266005/pexels-photo-1266005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}}
                fadeOutForeground
                renderTouchableFixedForeground={() => (
                <TouchableOpacity style={styles.buttonModal} onPress={this.setModalGroupVisible}>
                    <Icon name="md-arrow-back" style={{fontSize: 30,height: 30, marginStart:15,marginEnd:15}} />
                </TouchableOpacity>
                )}
                renderForeground={() => this._renderGroupInfo()}
            >
                <TriggeringView onHide={() => console.log('text hidden')} style={{padding:5}} >
                    <Text style={{fontWeight:"bold", fontSize:18}} >Miembros</Text>
                    
                </TriggeringView>
            </HeaderImageScrollView>
            </View>
        </Modal>
        );
    }

    _renderModal(){
        return(
        <Modal isVisible={this.state.modalVisible}
        onBackButtonPress={this.setModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        onBackdropPress={this.setModalVisible}>
            <View style={styles.modalContent} >
                <Text style={{fontWeight:"bold", fontSize:18}} >Nuevo Grupo</Text>
                <View style={{width:'70%', borderBottomWidth:0.5}} >  
                    <TextInput
                        placeholder="Nombre del grupo"
                        placeholderTextColor="rgba(255,255,255,.4)"
                        underlineColorAndroid="rgba(255,255,255,.4)"
                        autoFocus={true}
                        /* returnKeyType = { "next" } */
                        /* onSubmitEditing = {() => this.contrasena.focus()} */
                        onChangeText={(text) => this.setState({newGroupName:text})}/>
                </View>
                <View style ={{flexDirection: 'row', marginTop:5}} >
                <TouchableOpacity keyboardShouldPersistTaps="handled"onPress={() => this.newGroupRequest()} >
                    <Text style={{margin:5}} >Crear</Text>
                </TouchableOpacity>
                <TouchableOpacity keyboardShouldPersistTaps="handled">
                    <Text style={{margin:5}}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
        </Modal>
        );
    }

    showAlert(group,idGrupo){
        Alert.alert(
            'Confirmar',
            '¿Eliminar el grupo ' + group + ' permanentemente?',
            [
              {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Confirmar', onPress: () => {this.deleteGroup(idGrupo),this.setModalDelVisible()}},
            ],
            {cancelable: true},
          );
      }

    _renderDeleteEditModal(){
        return(
            <Modal isVisible={this.state.modalDellVisible}
                onBackButtonPress={this.setModalDelVisible}
                animationIn="slideInRight"
                animationOut="slideOutLeft"
                onBackdropPress={this.setModalDelVisible}>
                <View style={styles.modalContent} >
                    <TouchableOpacity style={{padding:15,borderBottomWidth:0.5, alignItems:'center',borderColor:'rgba(0,0,0,0.5)',width:'100%'}} keyboardShouldPersistTaps="handled" onPress={() => {this.setState({actualInfo:this.state.actualGroup.nombreGrupo}),this.setmodModalVisible()}} >
                        <Text style={{margin:5}} >Editar grupo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding:15, alignItems:'center', width:'100%'}} keyboardShouldPersistTaps="handled" onPress={() => this.showAlert(this.state.actualGroup.nombreGrupo,this.state.actualGroup.idGrupo)}>
                        <Text style={{margin:5}}>Eliminar grupo</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
         
    _renderItems(item){
        return(
        <TouchableOpacity style={styles.button} onPress={() => {this.setState({actualGroup:item.nombreGrupo}),this.setModalGroupVisible()}} onLongPress={() => {this.setState({actualGroup:item}),this.setModalDelVisible()}}>
            <Text>{item.nombreGrupo}</Text>
        </TouchableOpacity>
        )
    }

    _renderAddButton(){
        return(
            <TouchableOpacity style={styles.button} onPress={this.setModalVisible} >
                <Icon name="md-add" style={styles.modalButtonIcon} />
            </TouchableOpacity>
        )
    }

  render() {
    return (
      <View >
        <View>
            <Text style={{fontWeight:"bold",marginStart:10,marginTop:5}}>Grupos:</Text>
            <FlatList
              data={[{nombreGrupo:"add"},...this.state.groups]}
              horizontal = {true}
              showsHorizontalScrollIndicator = {false}
              renderItem={({item}) => item.nombreGrupo === "add" ?this._renderAddButton() : this._renderItems(item)}
            />
        </View>
        {this._renderModal()}
        {this._renderModalGroup()}
        {this._renderDeleteEditModal()}
        {this._renderModModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    button: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:70,
        height:70,
        marginTop:5,
        marginEnd:5,marginStart:5,
        marginBottom:5,
        backgroundColor:'#fff',
        borderRadius:100,
    },
    buttonModal: {
        width:50,
        marginStart:10,
        marginTop:9,
        position:'absolute',
        justifyContent: 'center',
    },
    modalButtonIcon: {
        fontSize: 35,
        height: 35,
        color: 'grey',
      },
      logoStyle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        resizeMode : 'stretch',
      },
      modalContent: {
        backgroundColor: "white",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
      boldText:{
        fontWeight: 'bold',
         fontSize:16
      },
   });
