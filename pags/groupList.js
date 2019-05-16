import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Dimensions,Alert, KeyboardAvoidingView, Button } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import Modal from "react-native-modal";
import { Request_API } from '../networking/server';
import { Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider} from 'react-native-popup-menu';

import PouchDB from 'pouchdb-react-native'; 
import { PouchDB_Insert, PouchDB_DeleteDoc, PouchDB_UpdateDoc } from '../PouchDB/PouchDBQuerys'
import PouchdbFind from 'pouchdb-find';
//import { TextInput } from "react-native-gesture-handler";
let newGroupURL = ':3030/API/contactos/CrearGrupo';
const AmigosyGrupos = ':3030/API/contactos/ActualizarAmigosYGrupos';
const deleteGroupURL = ':3030/API/contactos/EliminarGrupo'
const modGroupURL = ':3030/API/contactos/EditarGrupo'
const addFriendGroupURL = ':3030/API/contactos/AgregarAmigosAGrupo'
const deleteFriendGroupURL = ":3030/API/contactos/BorrarAmigosDeGrupo"
const alertURL = ':3030/API/contactos/EnviarAlertaPreventiva';
const db = new PouchDB('OjoMetropolitano');
const window = Dimensions.get('window');

class renderButton extends React.Component {
    render(){
        return(
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <TouchableOpacity style={styles.hamburgerMenu} onPress={this.props.onPress}>
                    <Icon name="md-menu" style={styles.hamburgerMenuIcon} />
                </TouchableOpacity>
            </View> 
        );
    }
}

class renderButtonNav extends React.Component {
    render(){
        return(
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <TouchableOpacity style={styles.hamburgerMenu} onPress={this.props.onPress}>
                    <Icon name="md-more" style={styles.hamburgerMenuIcon} />
                </TouchableOpacity>
            </View> 
        );
    }
}
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
            modalAddVisible: false,
            modalDelFriendVisible: false,
            actualInfo:'',
            newValue:'',
            newGroupName:'',
            actualGroup:null,
            actualGroupID:"",
            contacts:this.props.contacts,
            checkeList:[],
            checkedDelList:[],
            friendsToAdd:[],
            friendsToDelete:[],
            members:[],
            groupMembers:[],
            salaVigilancia:'',
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
        this.setState({userData: nextProps.userData, contacts:nextProps.contacts})
        this.startList();
    }
    componentWillUnmount(){
        this.endRoom();
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

    async addMemberGroupRequest(){
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
            idGrupo: this.state.actualGroupID,
            listaAmigos: this.state.friendsToAdd,
            tokenSiliconBear: this.state.userData.tokenSiliconBear,
            ubicacionUsuario: position
        }
        console.log(params)
        Request_API(params,addFriendGroupURL).then(response => {
            console.log(response)
            if(response.codigoRespuesta == 200){
                const docParams = {
                    idGrupo:this.state.actualGroupID,
                    miembros:[...this.state.groupMembers.map(a => a.nombreUsuario) ,...this.state.friendsToAdd],
                    nombreGrupo:this.state.actualGroup,
                }
                console.log(docParams)
                PouchDB_UpdateDoc(this.state.actualGroupID, 'groups', docParams)
                this.setModalAddVisible()
                
                
                setTimeout(() => {
                    this.getGroups();
                  }, 500); 
                  setTimeout(() => {
                    this.startContactList();
                  }, 1000);  
            }
        })
    }

    async deletememberGroupRequest(){
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
            idGrupo: this.state.actualGroupID,
            listaAmigos:this.state.friendsToDelete,
            tokenSiliconBear: this.state.userData.tokenSiliconBear,
            ubicacionUsuario: position
        }
        console.log(params)
        Request_API(params,deleteFriendGroupURL).then(response => {
            console.log(response)
            if(response.codigoRespuesta == 200){
                let temp = this.state.groupMembers.slice();
                for(let i = 0; i < this.state.friendsToDelete.length;i++){
                        let index = temp.findIndex(obj => obj.nombreUsuario ===this.state.friendsToDelete[i])
                        temp.splice(index,1)
                }
                const docParams = {
                    idGrupo:this.state.actualGroupID,
                    miembros:temp.map(obj => obj.nombreUsuario),
                    nombreGrupo:this.state.actualGroup,
                }
                console.log(docParams)
                PouchDB_UpdateDoc(this.state.actualGroupID, 'groups', docParams)
                this.startList();
                
                setTimeout(() => {
                    this.getGroups();
                  }, 500); 
                  setTimeout(() => {
                    this.startContactList();
                  }, 1000);  
            }
        })
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
            listaAmigos: [...this.state.groupMembers.map(a => a.nombreUsuario)],
            tokenSiliconBear: this.state.userData.tokenSiliconBear,
            ubicacionUsuario: position
          }
  
          await Request_API(params, alertURL).then(response => {
              if(response.codigoRespuesta == 200){
                  console.log(response)
                  this.setState({salaVigilancia:response.salaVigilancia},this.startRoom())
              }
          })

    }

    startRoom(){
        const data = {
            nombreUsuario: this.state.userData.nombreUsuario,
            salaVigilancia: this.state.salaVigilancia
        }
        console.log(data);
        socket.emit('alertaPreventivaEnviada', data);
        this.trackUserLoc()
        this.props.adviceChange('groups');
    }

    endRoom(){
        if(this.state.salaVigilancia != ''){
            const data = {
                salaVigilancia: this.state.salaVigilancia
            }
            socket.emit('alertaPreventivaTerminada', data);
            navigator.geolocation.clearWatch(this.watchID);
            this.setState({salaVigilancia:''});
            console.log(data + ' grupos')
            this.props.adviceChange();
        }
    }

    async trackUserLoc(){
        let promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                let data = {
                    salaVigilancia: this.state.salaVigilancia,
                    coordenadaX: position.coords.latitude,
                    coordenadaY: position.coords.longitude
                }
                resolve(data);
              },
              (error) => console.log(error)
            )
          });
          
        let firstPos = await promise;
        socket.emit('alertaPrivada_posicionActualizada', firstPos);
        console.log(firstPos)
        this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
            var data = {
                     salaVigilancia: this.state.salaVigilancia,
                     coordenadaX: lastPosition.coords.latitude,
                     coordenadaY: lastPosition.coords.longitude
                 };
                 console.log(data);
            socket.emit('alertaPrivada_posicionActualizada', data);
        },(error) => console.log(error),{distanceFilter: 10});
    }

    setModalVisible = () =>
    this.setState({ modalVisible: !this.state.modalVisible });

    setModalGroupVisible = () =>
    this.setState({ modalGroupVisible: !this.state.modalGroupVisible });

    setModalDelVisible = () =>{
    this.setState({modalDellVisible: !this.state.modalDellVisible});
        console.log('switch')
    }
    setModalDelFriendVisible = () =>
        this.setState({modalDelFriendVisible: !this.state.modalDelFriendVisible})
    setModalAddVisible = () => 
        this.setState({modalAddVisible: !this.state.modalAddVisible})
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
    /* ================================ */
    addItem(name){
        this.setState(prev => ({friendsToAdd:[...prev.friendsToAdd,name]}))
    }
    deleteItem(name){
        this.setState(({ friendsToAdd }) => {
            const temp = [ ...friendsToAdd ]
            const index = temp.findIndex(obj => obj === name)
            temp.splice(index, 1)
            return { friendsToAdd: temp }
          })
    }
    updateCheck(index, name){
        var temp = this.state.checkeList
        temp[index] = !temp[index];
        this.setState({checkeList: temp})
        temp[index] ? this.addItem(name) : this.deleteItem(name)
        console.log(this.state.friendsToAdd)
    }
    /* ================================ */
    addDelItem(name){
        this.setState(prev => ({friendsToDelete:[...prev.friendsToDelete,name]}))
    }

    deleteDelItem(name){
        this.setState(({ friendsToDelete }) => {
            const temp = [ ...friendsToDelete ]
            const index = temp.findIndex(obj => obj === name)
            temp.splice(index, 1)
            return { friendsToDelete: temp }
          })
    }
    updateCheckDel(index, name){
        var temp = this.state.checkedDelList
        temp[index] = !temp[index];
        this.setState({checkedDelList: temp})
        temp[index] ? this.addDelItem(name) : this.deleteDelItem(name)
        console.log(this.state.friendsToDelete)
    }
    /* ================================ */
    showAlertContact(contact){
        Alert.alert(
            'Confirmar',
            '¿Eliminar a ' + contact + ' de '+ this.state.actualGroup +'?',
            [
              {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Confirmar', onPress: () => {this.setState({friendsToDelete:[contact]},this.deletememberGroupRequest)}},
            ],
            {cancelable: true},
          );
      }
    _renderContactsAdd(item,index){
        return(
            <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:0.5}}>
                <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
                    <View >
                        <Image source={{uri :item.imagenPerfil}} style={styles.logoStyle} />
                    </View>
                    <View style={{marginStart: 15}}>
                        <Text style={{fontWeight: 'bold'}}>{item.alias}</Text>
                        <Text>{item.nombreUsuario}</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <CheckBox 
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checkeList[index]}
                    onPress={() => this.updateCheck(index,item.nombreUsuario)}/>
                </View>
            </View>
            )
    }
    _renderContactsDel(item,index){
        return(
            <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:0.5}}>
                <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
                    <View >
                        <Image source={{uri :item.imagenPerfil}} style={styles.logoStyle} />
                    </View>
                    <View style={{marginStart: 15}}>
                        <Text style={{fontWeight: 'bold'}}>{item.alias}</Text>
                        <Text>{item.nombreUsuario}</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <CheckBox 
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checkedDelList[index]}
                    onPress={() => this.updateCheckDel(index,item.nombreUsuario)}/>
                </View>
            </View>
            )
    }
    _renderContactsGroup(item){
        return(
        <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:0.5}}>
            <View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center'}}>
                <View >
                    <Image source={{uri :item.imagenPerfil}} style={styles.logoStyle} />
                </View>
                <View style={{marginStart: 15}}>
                    <Text style={{fontWeight: 'bold'}}>{item.alias}</Text>
                    <Text>{item.nombreUsuario}</Text>
                </View>
            </View>
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
            <Menu>
                <MenuTrigger customStyles={{
                    TriggerTouchableComponent: renderButton,
                }}/>
                <MenuOptions>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={() => this.showAlertContact(item.nombreUsuario,this.state.actualGroupID)} >
                        <Text style={{fontSize:16,margin:5}} >Eliminar</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
            </View>
        </View>
        )
    }
    _renderNavBar(type){
        var title = ""
        var width = "80%"
        if(type==1){
            title = "Editar Grupo"
        }else if(type == 2){
            title = this.state.actualGroup
        }else{
            title = "Elegir contactos"
            width = "60%"
        }
        return(
        <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',height:70, borderBottomWidth:1}}>
            
            <TouchableOpacity
            onPress={() => {if( type == 1) this.setmodModalVisible(); else if(type == 2) this.setModalGroupVisible(); else if(type == 3 )this.setModalAddVisible(); else this.setModalDelFriendVisible()}}
            >
            <Icon name="md-arrow-back"  style={{fontSize: 25,height: 25, marginStart:15,marginEnd:15}} />
            </TouchableOpacity>
            <View style={{width:width, justifyContent:'flex-start',alignItems: 'flex-start'}} >
                <Text style={{fontWeight: 'bold', fontSize:20}}>{title}</Text>
            </View>
            { type == 2 ? 
            <Menu>
                <MenuTrigger customStyles={{
                    TriggerTouchableComponent: renderButtonNav,
                }}/>
                <MenuOptions>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={this.setModalAddVisible} >
                        <Text style={{fontSize:16,margin:5}} >Añadir miembros</Text>
                    </MenuOption>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={() => this.alertaPreventiva()} >
                        <Text style={{fontSize:16,margin:5}} >Enviar alerta preventiva</Text>
                    </MenuOption>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={this.setModalDelFriendVisible}>
                        <Text style={{fontSize:16,margin:5}} >Eliminar miembros</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
            : null}
            { type == 3 ? 
                <Button title='Aceptar' onPress={() => this.addMemberGroupRequest()} disabled={this.state.friendsToAdd.length === 0 ? true : false}/>
            : null}
            { type == 4 ? 
                <Button title='Aceptar' onPress={() => this.deletememberGroupRequest()} disabled={this.state.friendsToDelete.length === 0 ? true : false}/>
            : null}
        </View>
        );
    }
    noMembersList(){
        let tempCList = this.state.contacts.slice();
        console.log(tempCList)
        console.log(this.state.groupMembers)
        if(this.state.groupMembers.length > 0)
            for(let i = 0; i < this.state.groupMembers.length ;i++){
                const index = tempCList.findIndex(obj => obj.nombreUsuario === this.state.groupMembers[i].nombreUsuario)
                
                tempCList.splice(index, 1)
                console.log(index)
            }
        this.startList()
        this.setState({members:tempCList})
    }

    _renderDelModal(){
        return(
            <Modal
            style={{margin:0,flex:1,height:window.height}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalDelFriendVisible}
            onShow={() => {this.startList(),console.log(this.state.groupMembers)}}
            onRequestClose={this.setModalDelFriendVisible}>
              <View style={{height:'100%'}}> 
                {this._renderNavBar(4)}
                <FlatList
                    data={this.state.groupMembers&&this.state.groupMembers}
                    ItemSeparatorComponent={() => <View style={{width:10}}/>}
                    showsHorizontalScrollIndicator = {false}
                    renderItem={({item,index}) => this._renderContactsDel(item,index)}
                />
              </View>
            </Modal>
        );
    }

    _renderAddModal(){
        return(
            <Modal
            style={{margin:0,flex:1,height:window.height}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalAddVisible}
            onShow={() => {this.noMembersList(),console.log(this.state.members)}}
            onRequestClose={this.setModalAddVisible}>
              <View style={{height:'100%'}}> 
                {this._renderNavBar(3)}
                <FlatList
                    data={this.state.members&&this.state.members}
                    ItemSeparatorComponent={() => <View style={{width:10}}/>}
                    showsHorizontalScrollIndicator = {false}
                    renderItem={({item,index}) => this._renderContactsAdd(item,index)}
                />
              </View>
            </Modal>
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
              {this._renderNavBar(1)}
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

        startList(){
            let initialCheck = this.state.contacts.map(() => false)
            this.setState({checkeList : initialCheck, checkedDelList:initialCheck,friendsToDelete:[], friendsToAdd:[]})
            console.log(initialCheck)
        }

        startContactList(){
            const index = this.state.groups.findIndex(obj => obj.nombreGrupo === this.state.actualGroup)
            const tempG = this.state.groups[index]
            
            console.log(this.state.contacts)
            
            var groupMemberstemp = []
            console.log(tempG.miembros)
                for(let i = 0; i < tempG.miembros.length;i++){
                    const conIndex = this.state.contacts.findIndex(obj => obj.nombreUsuario === tempG.miembros[i] )
                    console.log(this.state.contacts)
                    groupMemberstemp.push(this.state.contacts[conIndex])
                }
            this.setState({groupMembers:groupMemberstemp });
        }

    _renderModalGroup(){
        return(
             <Modal
             style={{margin:0,flex:1,height:window.height}}
             animationType="slide"
             transparent={false}
             visible={this.state.modalGroupVisible}
             onRequestClose={this.setModalGroupVisible}
             onShow={() => {this.startContactList(),console.log(this.state.groupMembers)}}
             >
             
        <MenuProvider>
             <View style={{height:'100%'}}> 
                 {this._renderNavBar(2)}
                 {this._renderAddModal()}
                 {this._renderDelModal()}
                 <FlatList
                     data={this.state.groupMembers&&this.state.groupMembers}
                     ItemSeparatorComponent={() => <View style={{width:10}}/>}
                     showsHorizontalScrollIndicator = {false}
                     renderItem={({item}) => this._renderContactsGroup(item)}
                 />
             </View>
             
        </MenuProvider>
             </Modal>
        );
    }

    _renderModal(){
        return(
          
           <View style={styles.modalContent} >
           <KeyboardAvoidingView behavior="padding">
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
                <TouchableOpacity keyboardShouldPersistTaps="handled" onPress={() => {this.newGroupRequest(),this.setModalVisible()}}>
                    <Text style={{margin:5}} >Crear</Text>
                </TouchableOpacity>
                <TouchableOpacity keyboardShouldPersistTaps="handled" onPress={this.setModalVisible}>
                    <Text style={{margin:5}}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
            
        </Modal>
        </KeyboardAvoidingView>
        </View>
       
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
        <TouchableOpacity style={styles.button} onPress={() => {this.setState({actualGroup:item.nombreGrupo,actualGroupID:item.idGrupo}),this.setModalGroupVisible()}} onLongPress={() => {this.setState({actualGroup:item}),this.setModalDelVisible()}}>
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
      <View style={{borderBottomWidth:0.5, borderBottomColor:'rgba(0,0,0,0.08)'}}>
        <View>
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
        marginTop:10,
        marginEnd:5,marginStart:5,
        marginBottom:0,
        backgroundColor:'#fff',
        borderRadius:100,
    },
    hamburgerMenu:{
        justifyContent: 'center',
        backgroundColor:'#fff',
    },
    hamburgerMenuIcon:{
        fontSize: 30,
        height: 30,
        color: 'grey',
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
        margin: 5,
        height: 50,
        width: 50,
        borderRadius: 25,
        resizeMode : 'cover',
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
