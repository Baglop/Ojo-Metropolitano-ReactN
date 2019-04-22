import React from "react";
import { View, Text, FlatList,ScrollView,StyleSheet,TouchableOpacity, NativeModules, Platform } from "react-native";
import GroupList from "./groupList";
import ContactList from "./contactsList"
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import {MenuProvider} from 'react-native-popup-menu';
import PouchDB from 'pouchdb-react-native'; 
import PouchdbFind from 'pouchdb-find';
import { PouchDB_Get_Document } from '../PouchDB/PouchDBQuerys'

let couchbase_lite_native = NativeModules.couchbase_lite_native;
const couchbase_lite = NativeModules.couchbase_lite;

const searchURL =":3030/API/contactos/BuscarUsuario";
const sendRequestURL = ":3030/API/contactos/EnviarSolicitudAmistad"
const deleteFrienURL = ":3030/API/contactos/EliminarAmigo"
const friendListURL = ":3030/API/contactos/ActualizarAmigosYGrupos"

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

export default class ContactScreen extends React.Component {

  constructor(props){
    super(props);
    ;
    PouchDB.plugin(PouchdbFind);
    this.state ={
      showSearch:false,
      searchResult:[],
      userData:[],
      contacts:null,
      groups:null
    };
    this.friendsListRequest = this.friendsListRequest.bind(this);
   
  }

  componentWillMount(){
    this.getData();
  }

  static navigationOptions = {
    header: null
  } 

  async searchUserRequest(nombreUsuario){
    const params = {
      nombreUsuario:nombreUsuario
    }
    await Request_API(params,searchURL).then(response =>{
       console.warn(response);
       this.setState({searchResult:response.usuarios})
      }
    )
  }

  textChangeTrue(text){
    this.searchUserRequest(text).then(
    this.setState({showSearch:true}));
  }

  textChangeFalse(){
    this.setState({showSearch:false})
    this.setState({searchResult:[]})
  }

  async getData(){
    await PouchDB_Get_Document('BasicValues')
      .then(response => {
      this.setState({userData: response})
      console.log(response);
    });
    this.friendsListRequest();
  }

  async friendsListRequest(){
    let promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = position.coords.latitude + ',' + position.coords.longitude;
          resolve(pos);
        },
        (error) => console.log(error)
      )
    });
    let position = await promise
    
    const params = {
      nombreUsuario : this.state.userData.nombreUsuario,
	    tokenSiliconBear : this.state.userData.tokenSiliconBear,
      ubicacionUsuario : position
    }

    Request_API(params,friendListURL).then(response => {
      console.log(params);
      console.log(response)
      this.setState({groups: response.grupos,contacts:response.amigos})
      console.log(this.state.groups)

    })
  }

  async deleteFriend(pos){
    const params = {
      nombreUsuario: this.state.userData.nombreUsuario,
      amigo: user,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: pos
    }

    Request_API(params,deleteFrienURL).then(response => {
      console.log(response)
    })
  }

  async sendFriendRequest(user){
    let promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = position.coords.latitude + ',' + position.coords.longitude;
          resolve(pos);
        },
        (error) => console.log(error)
      )
    });
    let position = await promise
    const params = {
      nombreUsuario: this.state.userData.nombreUsuario,
      usuarioSolicitado: user,
      tokenSiliconBear: this.state.userData.tokenSiliconBear,
      ubicacionUsuario: position
    }
    console.log(params)
    Request_API(params,sendRequestURL).then(response => {
      console.log(response)
      if(response.codigo == 505 || response.codigo == 490)
        this.deleteFriend(position)
    })
    this.search.clear()
    this.textChangeFalse()
  }

  _renderItems(item){
    return(
    <View style={{borderBottomWidth:0.5}}>
      <TouchableOpacity style={{margin:10}} onPress={() => this.sendFriendRequest(item)}>
        <Text style={{fontSize:20}} >{item}</Text>
      </TouchableOpacity>
    </View>
    );
  }

  _renderItemsSearch(){
    return(
    <View style={{ height:'100%'}}>
      <View>
        <FlatList
          data={this.state.searchResult}
          ItemSeparatorComponent={() => <View style={{width:10}}/>}
          showsHorizontalScrollIndicator = {false}
          renderItem={({item}) => this._renderItems(item)}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
    );
  }

  render() {
    return (
      <MenuProvider>
      <View style={{flex:1}}>
        <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center', borderBottomWidth:0.5}} >
          <Icon name="md-search" style={styles.searchIcon}/>
          <TextInput ref={input => { this.search = input }} style={{width:'80%', marginStart:5}} onChangeText={(text) => text !== "" ? this.textChangeTrue(text):this.textChangeFalse()} />
        </View>
        {this.state.showSearch ? this._renderItemsSearch():null}
        <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator = {false}>
        {this.state.groups !== null ? <GroupList groups={this.state.groups&&this.state.groups} userData={this.state.userData&&this.state.userData} refrestList={this.friendsListRequest}/>: null }
        {this.state.contacts !== null ? <ContactList contacts={this.state.contacts&&this.state.contacts} userData={this.state.userData&&this.state.userData} refrestList={this.friendsListRequest}/>: null}
        </ScrollView>
      </View>
      
      </MenuProvider>
    );
  }
}
 const styles = StyleSheet.create({
    searchIcon:{
      fontSize: 30,
      height: 30,
      marginStart: 10,
    }
  })
