import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger} from 'react-native-popup-menu';
import {Request_API} from '../networking/server'

const editfriendURL = ':3030/API/contactos/EditarAmigo';
const deleteFriendURL = ':3030/API/contactos/EliminarAmigo';

const contacts = [
    {
        key: "1",
        name: "Pepe"
    },
    {
        key: "2",
        name: "Fursio"
    },
    {
        key: "3",
        name: "Kokun"
    },
    {
        key: "4",
        name: "AMLO"
    },
    {
        key: "5",
        name: "EPN-MIente"
    },
    {
        key: "6",
        name: "Francis"
    },
    {
        key: "7",
        name: "Delta"
    },
    {
        key: "8",
        name: "Luisito Comunica"
    }
]

class renderButton extends React.Component {
    render(){
        return(
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
                    <Icon name="md-menu" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View> 
        );
    }
}

export default class ContactsList extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
          contacts:this.props.contacts,
          userData:this.props.userData,
          newAlias:null,
          modalVisible:false,
          actualFriend:null,
        };
      }

      componentWillReceiveProps(nextProps){
        this.setState({contacts:nextProps.contacts,
                        userData: nextProps.userData,})
        
        console.log(this.state.contacts)
    }

      async deleteFriend(user){
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
          nombreUsuario: this.state.userData.userName,
          amigo: user,
          tokenSiliconBear: this.state.userData.tokenSiliconBear,
          ubicacionUsuario: position
        }

        Request_API(params, deleteFriendURL).then(response => {
            console.log(response)
            if(response.codigoRespuesta == 200){
                this.props.refrestList();
            }
        })
      }

      async editFriend(){
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
          nombreUsuario: this.state.userData.userName,
          amigo: this.state.actualFriend,
          nuevoAlias: this.state.newAlias,
          tokenSiliconBear: this.state.userData.tokenSiliconBear,
          ubicacionUsuario: position
        }

        Request_API(params, editfriendURL).then(response => {
            if(response.codigoRespuesta == 200){
                console.log(response)
                this.props.refrestList();
            }
        })
      }

      setModalVisible = () =>
          this.setState({modalVisible:!this.state.modalVisible})

      _renderModal(){
          return(
            <Modal isVisible={this.state.modalVisible}
            onBackButtonPress={this.setModalVisible}
            animationIn="slideInRight"
            animationOut="slideOutLeft"
            onBackdropPress={this.setModalVisible}>
                <View style={styles.modalContent} >
                    <Text style={{fontWeight:"bold", fontSize:18}} >Nuevo Alias</Text>
                    <View style={{width:'70%', borderBottomWidth:0.5}} >  
                        <TextInput
                            placeholder="Nombre del grupo"
                            placeholderTextColor="rgba(255,255,255,.4)"
                            underlineColorAndroid="rgba(255,255,255,.4)"
                            autoFocus={true}
                            /* returnKeyType = { "next" } */
                            /* onSubmitEditing = {() => this.contrasena.focus()} */
                            onChangeText={(text) => this.setState({newAlias:text})}/>
                    </View>
                    <View style ={{flexDirection: 'row', marginTop:5}} >
                    <TouchableOpacity keyboardShouldPersistTaps="handled" onPress={() => this.editFriend()} >
                        <Text style={{margin:5}} >Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity keyboardShouldPersistTaps="handled">
                        <Text style={{margin:5}}>Cancelar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal> 
          );
      }

      showAlert(user){
        Alert.alert(
            'Confirmar',
            '¿Eliminar al usuario ' + user + ' de su lista de amigos?',
            [
              {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Confirmar', onPress: () => this.deleteFriend(user)},
            ],
            {cancelable: true},
          );
      }

    _renderItems(item){
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
            </View>{/* 
            <View style={{justifyContent: 'flex-end',marginEnd: 10}}>
                <TouchableOpacity style={styles.button}>
                    <Icon name="md-menu" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View> */}
            <Menu>
                <MenuTrigger customStyles={{
                    TriggerTouchableComponent: renderButton,
                }}/>
                <MenuOptions>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={() => {this.setModalVisible(), this.setState({actualFriend:item.nombreUsuario})}}>
                        <Text style={{fontSize:16,margin:5}} >Editar</Text>
                    </MenuOption>
                    <MenuOption customStyles={{TriggerTouchableComponent:TouchableOpacity}} onSelect={() => this.showAlert(item.nombreUsuario)} >
                        <Text style={{fontSize:16,margin:5}} >Eliminar</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </View>
        )
    }

  render() {
    return (
      <View style={{ flex: 1}}>
        <View>
            <Text style={{fontWeight:"bold",marginStart:10,marginTop:5}}>Contactos:</Text>
            <FlatList
              data={this.state.contacts&&this.state.contacts}
              ItemSeparatorComponent={() => <View style={{width:10}}/>}
              showsHorizontalScrollIndicator = {false}
              renderItem={({item}) => this._renderItems(item)}
            />
            
        </View>
        {this._renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        backgroundColor:'#fff',
    },
    buttonIcon: {
        fontSize: 30,
        height: 30,
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
   });
