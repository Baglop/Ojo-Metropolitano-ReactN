import React, {Component} from "react";
import { View, Text,StyleSheet, TouchableOpacity, Alert, Dimensions} from "react-native";
import { createDrawerNavigator,createAppContainer, createStackNavigator} from "react-navigation";
import Bg from '../images/citybackground.png';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import drawerDesign from './drawerDesign'
import { Button, Image } from 'react-native-elements';
import Modal from "react-native-modal";
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker';
import { PouchDB_Get_Document } from '../PouchDB/PouchDBQuerys';
import UserReports from './reports'

const window = Dimensions.get('window');

class ProfileScreenConent extends React.Component {

  static navigationOptions = {
    headerTransparent: true
  }
  
  componentWillMount(){
    
  }

  constructor(props) {
    super(props);
    this.getInfo();
    this.state = { 
      openBar: false,
      userData: [],
      userInfo:[],
      image: require('../images/add_photo-512.png'),
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  async getInfo(){
    await PouchDB_Get_Document('ActualizarInformacionUsuario')
      .then(response => {
      this.setState({
        userInfo: response
      })
    })
    await PouchDB_Get_Document('BasicValues')
      .then(response => {
      this.setState({
        userData: response
      })
    });
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
      </Modal>
    );
  }

  showAlert(title, message, _id){
    Alert.alert(
      title,
      message,
      [,
        {text: 'OK', onPress: () => this.deleteReport(_id)},
        {text: 'Cancelar'/*, onPress: () => this.setState({ visibleModal: null })*/},
      ],
    );
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
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        let source64 = response.data;
        console.log(source64)
        this.setState({
          image: source,
          atributo: 'evidencia',
          nuevoValor: source64
        });
      }
    });
  }
  
  _renderProfile(){
    return(
    <View>
      <View style={{alignItems:'center',justifyContent:'center',height:'100%'}} >
        <TouchableOpacity style={{borderRadius:200,borderWidth:2}} onPress={this.selectPhotoTapped.bind(this)}>
          {/* <Image style={styles.logoStyle} source={{uri: this.state.userInfo.imagenPerfil}}/> */}
          {this.state.userInfo.imagenPerfil !== null ? (
              <Image style={styles.logoStyle} source={{uri: this.state.userInfo.imagenPerfil && this.state.userInfo.imagenPerfil}}/>
            ) : (
              <Image style={styles.logoStyle} source={this.state.image && this.state.image} />
            )}
        </TouchableOpacity>
        <Text style={{color:'white',fontWeight:'bold', fontSize: 14}}>{this.state.userInfo.nombreUsuario}</Text>
      </View>
    </View>
    )
  }

  renderLeftSidebar() {
    return(
      <View>
        <Text style={{color:'white',fontWeight:'bold'}}>Ola</Text>
      </View>
    )
  }
  openSideBar = () => this.setState({ openBar: true })

  render() {
    var { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <HeaderImageScrollView
        maxHeight={300}
        minHeight={50}
        headerImage={Bg}
        fadeOutForeground
        renderTouchableFixedForeground={() => (
          <TouchableOpacity style={styles.button}>
            <Icon name="md-menu" style={styles.buttonIcon} onPress={() => this.props.navigation.openDrawer()} />
          </TouchableOpacity>
        )}
        renderForeground={() => this._renderProfile()}
        >
          <View style={{ height: 1000 }}>
            <TriggeringView onHide={() => console.log('text hidden')} >
              <Text>Perfil</Text> 
              <Button
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Mis Reportes!' 
              onPress = {() => navigate("Reportes", {})}
              />
            </TriggeringView>
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titles: {
    margin: 5,
    fontWeight: 'bold'
  },
  logoStyle: {
    height: 100,
    width: 100,
    borderRadius: 48,
    resizeMode : 'stretch',
  },
  button: {
    width:40,
    marginStart:10,
    marginTop:9,
    position:'absolute',
    justifyContent: 'center',
  },
  buttonModal: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonIcon: {
    fontSize: 30,
    height: 30,
    color:'black',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalButtonIcon: {
    fontSize: 35,
    height: 35,
    marginTop:5,
    marginEnd:5,
    color: 'black',
  },
  itemPic: {
    margin: 5,
    height: 300,
    width: window.width - 60,
    backgroundColor: '#c5c5c5',
    justifyContent: "center",
  },
  modalMap:{
    margin: 5,
    height: "100%",
    width: "100%",
  },
 });


 const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: ProfileScreenConent,
    },
    Reportes: {
      screen: UserReports
    },
  },
  {
      initialRouteName: "Home",
  }
);

 const MyDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: AppNavigator,
    }
  },
  {
    contentComponent: drawerDesign,
    drawerWidth: 240
  });

const MyApp = createAppContainer(MyDrawerNavigator);

export default class ProfileScreen extends React.Component {
  render(){
    return(
      <MyApp/>
    );
  }
}