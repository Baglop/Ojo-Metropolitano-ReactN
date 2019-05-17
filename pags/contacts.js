import React from "react";
import { View, Text, FlatList,ScrollView,StyleSheet,TouchableOpacity, NativeModules, Platform } from "react-native";
import { SearchBar,Divider  } from 'react-native-elements';
import GroupList from "./groupList";
import ContactList from "./contactsList"
import { Request_API } from '../networking/server';
import {MenuProvider} from 'react-native-popup-menu';
import PouchDB from 'pouchdb-react-native'; 
import PouchdbFind from 'pouchdb-find';
import { PouchDB_Get_Document, PouchDB_Insert } from '../PouchDB/PouchDBQuerys'
import CameraScreen from './camera';
import {createAppContainer, createStackNavigator} from "react-navigation";


const db = new PouchDB('OjoMetropolitano');

const searchURL =":3030/API/contactos/BuscarUsuario";
const sendRequestURL = ":3030/API/contactos/EnviarSolicitudAmistad"
const deleteFrienURL = ":3030/API/contactos/EliminarAmigo"
const friendListURL = ":3030/API/contactos/ActualizarAmigosYGrupos"

class ContactScreen extends React.Component {

  constructor(props){
    super(props);
    PouchDB.plugin(PouchdbFind);
    this.getData();
    this.state ={
      showSearch:false,
      searchResult:[],
      userData:[],
      contacts:[],
      groups:[],
      searchValue:"",
      searchIcon:false,
      advice:false,
    };
    this.getData();
    this.friendsListRequest = this.friendsListRequest.bind(this);
    this.adviceChange = this.adviceChange.bind(this);
  }

  adviceChange(){
    this.setState({advice:!this.state.advice})
  }

  componentWillReceiveProps(nextProps){
    this.setState({userData: nextProps.userData})

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
    this.setState({searchIcon:true})
    this.setState({searchValue:text})
    this.searchUserRequest(text).then(
    this.setState({showSearch:true}),
    this.setState({searchIcon:false}));
  }

  textChangeFalse(){
    this.setState({searchValue:""})
    this.setState({showSearch:false})
    this.setState({searchResult:[]})
  }

  async getData(){
    await PouchDB_Get_Document('BasicValues')
      .then(response => {
      this.setState({userData: response})
    });
    this.friendsListRequest();
  }

  async friendsListRequest(){
    
    await db.find({
      selector: {
        type: 'friends',
      },
      index: {
      fields: ['type']
      }
    }).then(result => {
      this.setState({
        contacts:result.docs
      })
    }).catch(function (err) {
      console.log(err);
    });
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
      if(response.codigoRespuesta == 505 || response.codigoRespuesta == 490)
        this.deleteFriend(position)
      else if(response.codigoRespuesta == 200)
        this.friendsListRequest();
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

  _renderAdvice(){
    return(
    <View style={{height:30,flexDirection:'row',padding:5,paddingStart:10,backgroundColor:'yellow'}} >
      <Text style={{fontWeight:'bold'}} >Compartiendo ubicacion</Text>
      <View style={{marginLeft: 'auto'}}>
        <TouchableOpacity onPress={() => {this.contactList.endRoom(),this.grouplist.endRoom()}}>
          <Text style={{right:0, }} >Cancelar </Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  render() {
    var { navigate } = this.props.navigation;
    return (
      <MenuProvider>
      <View style={{flex:1}}>
        {/* <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center', borderBottomWidth:0.5}} > */}
          {/* <Icon name="md-search" style={styles.searchIcon}/>
          <TextInput ref={input => { this.search = input }} style={{width:'80%', marginStart:5}} onChangeText={(text) => text !== "" ? this.textChangeTrue(text):this.textChangeFalse()} /> */}
        {/* </View> */}
        {this.state.advice ? this._renderAdvice():null}
        <SearchBar
          lightTheme ={true}
          placeholder="Buscar amigo"
          onChangeText={(text) => text !== "" ? this.textChangeTrue(text):this.textChangeFalse()}
          value={this.state.searchValue}
          showLoading={this.state.searchIcon}
          inputContainerStyle={{backgroundColor:'white'}}
          containerStyle={{backgroundColor: '#e8e9ed'}}
        />
          
        {this.state.showSearch ? this._renderItemsSearch():null}
        <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator = {false}>
        { this.state.userData !== [] ? <GroupList ref={instance => { this.grouplist = instance; }} contacts={this.state.contacts&&this.state.contacts} userData={this.state.userData&&this.state.userData} adviceChange={this.adviceChange}/>:null}
        <Divider style={{ backgroundColor: '#e8e9ed', height:10 }} />
        {this.state.contacts.length > 0 ? <ContactList ref={instance => { this.contactList = instance; }} contacts={this.state.contacts&&this.state.contacts} userData={this.state.userData&&this.state.userData} refrestList={this.friendsListRequest} adviceChange={this.adviceChange} />: null}
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

  const AppNavigator = createStackNavigator(
    {
      Home: {
        screen: ContactScreen,
      },
      Camera: {
        screen: CameraScreen
      },
    },
    {
        initialRouteName: "Home",
    }
  );

const MyScreen = createAppContainer(AppNavigator);

  export default class ScreenContact extends React.Component {
    render(){
      return(
        <MyScreen/>
      );
    }
  }