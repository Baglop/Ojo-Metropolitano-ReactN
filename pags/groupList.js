import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { Request_API } from '../networking/server';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
//import { TextInput } from "react-native-gesture-handler";
let newGroupURL = ':3030/API/contactos/CrearGrupo';

const groups = [
    {
        key: "1",
        nombreGrupo: "Familia"
    },
    {
        key: "2",
        nombreGrupo: "Amigos"
    },
    {
        key: "3",
        nombreGrupo: "Trabajo"
    },
    {
        key: "4",
        nombreGrupo: "Escuela"
    },
    {
        key: "5",
        nombreGrupo: "Test"
    }
]

export default class GroupList extends React.Component {
   
    constructor(props){
        super(props);
        this.state ={
            groups:this.props.groups,
            userData: this.props.userData,
            modalVisible:false,
            modalGroupVisible:false,
            newGroupName:'',
            actualGroup:null,
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({groups:nextProps.groups,
                        userData: nextProps.userData,})
        
        console.log(this.state.groups)
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
            nombreUsuario: this.state.userData.userName,
            nombreGrupo: this.state.newGroupName,
            tokenSiliconBear: this.state.userData.tokenSiliconBear,
            ubicacionUsuario: position
        }
        console.log(params);
        Request_API(params,newGroupURL).then(response => {
            
            if(response.codigoRespuesta == 200){
                console.log(response)
                this.props.refrestList();
            }
        })
    }

    setModalVisible = () =>
    this.setState({ modalVisible: !this.state.modalVisible });

    setModalGroupVisible = () =>
    this.setState({ modalGroupVisible: !this.state.modalGroupVisible });
    
    
    _renderGroupInfo(){
        return(
        <View>
          <View style={{alignItems:'center',justifyContent:'center',height:'100%'}} >
            <TouchableOpacity style={{overflow:'hidden',borderRadius:200,borderWidth:2}}>
              <Image style={styles.logoStyle} source={{uri: 'https://www.eldesconcierto.cl/wp-content/uploads/2018/08/TopoGigio-800x458.jpg'}}/>
            </TouchableOpacity>
            <Text style={{color:'white',fontWeight:'bold'}}>{this.state.actualGroup}</Text>
          </View>
        </View>
        )
      }

    _renderModalGroup(){
        return(
        <Modal isVisible={this.state.modalGroupVisible}
        onBackButtonPress={this.setModalGroupVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{margin:0,flex:1,height:'100%'}}
        onBackdropPress={this.setModalGroupVisible}>
            <View style={{flex:1,backgroundColor:'white',height:'100%'}}>
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
         
    _renderItems(item){
        return(
        <TouchableOpacity style={styles.button} onPress={() => {this.setState({actualGroup:item.nombreGrupo}),this.setModalGroupVisible()}}>
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
   });
