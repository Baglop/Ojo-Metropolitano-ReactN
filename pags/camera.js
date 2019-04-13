// import React from 'react';
// import {
//   AppRegistry,
//   Image,
//   PixelRatio,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';

// export default class Camera extends React.Component {
//   state = {
//     avatarSource: null,
//     videoSource: null,
//   };

//   constructor(props) {
//     super(props);

//     this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
//     this.selectVideoTapped = this.selectVideoTapped.bind(this);
//   }

//   selectPhotoTapped() {
//     const options = {
//       quality: 1.0,
//       maxWidth: 500,
//       maxHeight: 500,
//       storageOptions: {
//         skipBackup: true,
//       },
//     };

//     ImagePicker.showImagePicker(options, (response) => {
//       console.log('Response = ', response);

//       if (response.didCancel) {
//         console.log('User cancelled photo picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         let source = { uri: response.uri };
//         console.log(source)
//         // You can also display the image using data:
//         let source64 = { uri: 'data:image/jpeg;base64,' + response.data };
//         console.log(source64)


//         ImageResizer.createResizedImage(source64.uri, 8, 6, 'JPEG', 80).then((uri) => {
//           // response.uri is the URI of the new image that can now be displayed, uploaded...
//           // response.path is the path of the new image
//           // response.name is the name of the new image with the extension
//           // response.size is the size of the new image
//           console.log(response);
//           // let resizer = { uri: 'data:image/jpeg;base64,' + response };
//           // console.log(resizer);
//         }).catch((err) => {
//           // Oops, something went wrong. Check that the filename is correct and
//           // inspect err to get more details.
//           console.log(err)
//         });

//         this.setState({
//           avatarSource: source,
//         });
//       }
//     });
//   }

//   selectVideoTapped() {
//     const options = {
//       title: 'Video Picker',
//       takePhotoButtonTitle: 'Take Video...',
//       mediaType: 'video',
//       videoQuality: 'medium',
//     };

//     ImagePicker.showImagePicker(options, (response) => {
//       console.log('Response = ', response);

//       if (response.didCancel) {
//         console.log('User cancelled video picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         this.setState({
//           videoSource: response.uri,
//         });
//       }
//     });
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
//           <View
//             style={[
//               styles.avatar,
//               styles.avatarContainer,
//               { marginBottom: 20 },
//             ]}
//           >
//             {this.state.avatarSource === null ? (
//               <Text>Select a Photo</Text>
//             ) : (
//               <Image style={styles.avatar} source={this.state.avatarSource} />
//             )}
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
//           <View style={[styles.avatar, styles.avatarContainer]}>
//             <Text>Select a Video</Text>
//           </View>
//         </TouchableOpacity>

//         {this.state.videoSource && (
//           <Text style={{ margin: 8, textAlign: 'center' }}>
//             {this.state.videoSource}
//           </Text>
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   avatarContainer: {
//     borderColor: '#9B9B9B',
//     borderWidth: 1 / PixelRatio.get(),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatar: {
//     borderRadius: 75,
//     width: 150,
//     height: 150,
//   },
// });






// import React, { Component } from 'react';
// import { Animated, Dimensions, Keyboard, StyleSheet, TextInput, UIManager } from 'react-native';

// const { State: TextInputState } = TextInput;

// export default class App extends Component {
//   state = {
//     shift: new Animated.Value(0),
//   };

//   componentWillMount() {
//     this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
//     this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
//   }

//   componentWillUnmount() {
//     this.keyboardDidShowSub.remove();
//     this.keyboardDidHideSub.remove();
//   }

//   render() {
//     const { shift } = this.state;
//     return (
//       <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
//         <TextInput
//           placeholder="A"
//           style={styles.textInput}
//         />
//         <TextInput
//           placeholder="B"
//           style={styles.textInput}
//         />
//         <TextInput
//           placeholder="C"
//           style={styles.textInput}
//         />
//         <TextInput
//           placeholder="D"
//           style={styles.textInput}
//         />
//         <TextInput
//           placeholder="E"
//           style={styles.textInput}
//         />
//       </Animated.View>
//     );
//   }

//   handleKeyboardDidShow = (event) => {
//     const { height: windowHeight } = Dimensions.get('window');
//     const keyboardHeight = event.endCoordinates.height;
//     const currentlyFocusedField = TextInputState.currentlyFocusedField();
//     UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
//       const fieldHeight = height;
//       const fieldTop = pageY;
//       const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
//       if (gap >= 0) {
//         return;
//       }
//       Animated.timing(
//         this.state.shift,
//         {
//           toValue: gap,
//           duration: 300,
//           useNativeDriver: true,
//         }
//       ).start();
//     });
//   }

//   handleKeyboardDidHide = () => {
//     Animated.timing(
//       this.state.shift,
//       {
//         toValue: 0,
//         duration: 150,
//         useNativeDriver: true,
//       }
//     ).start();
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'gray',
//     flex: 1,
//     height: '100%',
//     justifyContent: 'space-around',
//     left: 0,
//     position: 'absolute',
//     top: 0,
//     width: '100%'
//   },
//   textInput: {
//     backgroundColor: 'white',
//     height: 40,
//   }
// });




import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
      }),
    };
  }

  animate() {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: LATITUDE + ((Math.random() - 0.5) * (LATITUDE_DELTA / 2)),
      longitude: LONGITUDE + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker.Animated
            ref={marker => { this.marker = marker; }}
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.animate()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Animate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

AnimatedMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default AnimatedMarkers;



