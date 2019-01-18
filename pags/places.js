import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const groups = [
  {
      key: "1",
      name: "Casita de Maincra"
  },
  {
      key: "2",
      name: "Kinder"
  },
  {
      key: "3",
      name: "Chamba"
  },
  {
      key: "4",
      name: "Tiendita"
  },
  {
      key: "5",
      name: "Los tacos"
  },
  {
      key: "6",
      name: "Test"
  }
]

export default class PlaceScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      Titulo: "Reportar",
      region:{
        latitude: 20.653814,
        longitude: -103.258566,
        latitudeDelta: 0.0400,
        longitudeDelta: 0.0200,
      },
      error: null,
    }
  }

  _renderItems(item){
    return(
    <TouchableOpacity style={styles.button}>
        <Text>{item.name}</Text>
    </TouchableOpacity>
    )
}

  getRegion(region){
    this.setState({region})
  }

  change_title = () =>{
    if(this.state.Titulo == "Reportar")
      this.setState({Titulo: "No"})
    else
    this.setState({Titulo: "Reportar"})
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          region:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0400,
            longitudeDelta: 0.0200,
          }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={groups}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => this._renderItems(item)}
          />
        </View>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}>
            <Marker
              coordinate={this.state.region}
              title={"Puto"}
              description={"iOS"}
            />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top:100
  },
  button: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    marginTop:15,
    marginEnd:5,marginStart:5,
    marginBottom:5,
    backgroundColor:'#fff',
    borderRadius:100,
  },
 });