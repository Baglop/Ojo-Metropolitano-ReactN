import React from "react";
import { View, Text, FlatList,ScrollView,StyleSheet,TouchableOpacity } from "react-native";
import GroupList from "./groupList";
import ContactList from "./contactsList"
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import { Request_API } from '../networking/server';
import firebase from 'react-native-firebase';

const searchURL =":3030/API/contactos/BuscarUsuario";

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
    this.state ={
      showSearch:false,
      searchResult:[],
    };
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

  _renderItems(item){
    return(
    <View style={{borderBottomWidth:0.5}}>
      <TouchableOpacity style={{margin:10}}>
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
      <View style={{flex:1}}>
        <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center', borderBottomWidth:0.5}} >
          <Icon name="md-search" style={styles.searchIcon}/>
          <TextInput style={{width:'80%', marginStart:5}} onChangeText={(text) => text !== "" ? this.textChangeTrue(text):this.textChangeFalse()} />
        </View>
        {this.state.showSearch ? this._renderItemsSearch():null}
        <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator = {false}>
          <GroupList />
          <ContactList />
        </ScrollView>
      </View>
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
