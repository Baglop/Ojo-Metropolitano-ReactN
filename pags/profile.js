import React from "react";
import { View, Text,StyleSheet,Platform, TouchableOpacity, ScrollView, NativeModules} from "react-native";
import { createDrawerNavigator,createAppContainer} from "react-navigation";
import Bg from '../images/citybackground.png';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import drawerDesign from './drawerDesign'
import { Card } from 'react-native-elements'
import { Button, Image } from 'react-native-elements';
import Modal from "react-native-modal";
import _ from 'lodash';
import { Request_API } from '../networking/server';
const reportesUsuario = ':3030/API/inicio/ActualizarMisReportes';

const couchbase_liteAndroid = NativeModules.couchbase_lite;

class ProfileScreenConent extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { 
      openBar: false,
      userInfo: [],
      visibleModal: null,
      region:{
        latitude: 0,
        longitude: 0
      }
    }
  }

  startLocTrack(){
      if (Platform.OS == 'android'){
        couchbase_liteAndroid.getUserdataDoc(err => {
          console.warn("chale me humillo")
        },succ => {
          this.setState({userInfo: succ[0]})
          const userPetition = {
            nombreUsuario: succ[0].userName,
            tokenSiliconBear: succ[0].tokenSiliconBear,
            ubicacionUsuario: this.state.region.latitude + ',' + this.state.region.longitude,
          };
          Request_API(userPetition, reportesUsuario)
          .then(response => {
            console.warn(JSON.stringify(response));
            if(response.codigoRespuesta === 200){
              couchbase_liteAndroid.setReportDataDoc(JSON.stringify(response),2);
              this.setState({userReports:response.reportes});
              console.warn(this.state.reports.id);
            }
          })
        });
      }
  }

  componentDidMount(){
    this.startLocTrack()
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonModal}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style = {{height: 300}}>
        <ScrollView style={{height: 500, }}>
          <Text style={{margin:5}}> { this.state.userInfo[0]} </Text>
        </ScrollView>
      </View>
      {this.renderButton("Close", () => this.setState({ visibleModal: null }))}
    </View>
  );

  _renderProfile(){
    return(
    <View>
      <View style={{alignItems:'center',justifyContent:'center',height:'100%'}} >
      
        <TouchableOpacity style={{overflow:'hidden',borderRadius:200,borderWidth:2}}>
            <Image source={require('../images/oW1dGDI.jpg')} style={styles.logoStyle} />
        </TouchableOpacity>
        <Text style={{color:'white',fontWeight:'bold'}}>2B</Text>
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
    var payments = [];
    for(let i = 0; i <1; i++){
      payments.push(
          this.renderButton("Sliding from the sides", () =>
          this.setState({ visibleModal: 2 }),
        )
      )
    }
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
              <ScrollView horizontal = {true} showsHorizontalScrollIndicator = { false }>
                {payments}                
              </ScrollView>
                <Modal
                  isVisible={this.state.visibleModal === 2}
                  animationIn="slideInRight"
                  animationOut="slideOutLeft"
                  onBackdropPress={() => this.setState({ visibleModal: null })}>
                  {this.renderModalContent()}
                </Modal>
            </TriggeringView>
          </View>
        </HeaderImageScrollView>
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
 });

 const MyDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: ProfileScreenConent,
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