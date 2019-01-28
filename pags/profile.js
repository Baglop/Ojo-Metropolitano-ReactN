import React from "react";
import { View, Text,StyleSheet,StatusBar, Image, TouchableOpacity, Button } from "react-native";
import { createDrawerNavigator,createAppContainer} from "react-navigation";
import Bg from '../images/citybackground.png';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import drawerDesign from './drawerDesign'

class SideBar extends React.Component{
  render()
  {
    return(
      <Text>Ola</Text>
    );
  }
}

class ProfileScreenConent extends React.Component {
  
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { openBar: false };
  }

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
  buttonIcon: {
    fontSize: 30,
    height: 30,
    color:'black',
  }
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

