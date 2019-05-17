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




// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';

// import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';

// const screen = Dimensions.get('window');



// class AnimatedMarkers extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       coordinate: new AnimatedRegion({
//         latitude: 37.78825,
//         longitude: -122.4324
//       }),
//     };
//   }

//   animate() {
//     const { coordinate } = this.state;
//     const newCoordinate = {
//       latitude: 37.78825 + ((Math.random() - 0.5) * (0.0100 / 2)),
//       longitude: -122.4324+ ((Math.random() - 0.5) * (0.0025 / 2)),
//     };

//     if (Platform.OS === 'android') {
//       if (this.marker) {
//         this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
//       }
//     } else {
//       coordinate.timing(newCoordinate).start();
//     }
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <MapView
//           provider={this.props.provider}
//           style={styles.map}
//           initialRegion={{
//             latitude: 37.78825,
//             longitude: -122.4324,
//             latitudeDelta: 0.0100,
//         longitudeDelta: 0.0025,
//           }}
//         >
//           <Marker.Animated
//             ref={marker => { this.marker = marker; }}
//             coordinate={this.state.coordinate}
//           />
//         </MapView>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             onPress={() => this.animate()}
//             style={[styles.bubble, styles.button]}
//           >
//             <Text>Animate</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

// AnimatedMarkers.propTypes = {
//   provider: ProviderPropType,
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   bubble: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 20,
//   },
//   latlng: {
//     width: 200,
//     alignItems: 'stretch',
//   },
//   button: {
//     width: 80,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginVertical: 20,
//     backgroundColor: 'transparent',
//   },
// });

// export default AnimatedMarkers;















// import React, { Component } from "react";
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Animated,
//   Image,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';
// import MapView from "react-native-maps";
// import Marker from "react-native-maps";
// import Modal from "react-native-modal";

// const Images = [
//   { uri: "https://i.imgur.com/sNam9iJ.jpg" },
//   { uri: "https://i.imgur.com/N7rlQYt.jpg" },
//   { uri: "https://i.imgur.com/UDrH0wm.jpg" },
//   { uri: "https://i.imgur.com/Ka8kNST.jpg" }
// ]

// const { width, height } = Dimensions.get("window");

// const CARD_HEIGHT = height / 4;
// const CARD_WIDTH = CARD_HEIGHT - 10;

// export default class screens extends Component {

//   static navigationOptions = {
//     headerTransparent: true
//   } 


//   state = {
//     markers: [
//       {
//         coordinate: {
//           latitude: 45.524548,
//           longitude: -122.6749817,
//         },
//         title: "Best Place",
//         description: "This is the best place in Portland",
//         image: Images[0],
//       },
//       {
//         coordinate: {
//           latitude: 45.524698,
//           longitude: -122.6655507,
//         },
//         title: "Second Best Place",
//         description: "This is the second best place in Portland",
//         image: Images[1],
//       },
//       {
//         coordinate: {
//           latitude: 45.5230786,
//           longitude: -122.6701034,
//         },
//         title: "Third Best Place",
//         description: "This is the third best place in Portland",
//         image: Images[2],
//       },
//       {
//         coordinate: {
//           latitude: 45.521016,
//           longitude: -122.6561917,
//         },
//         title: "Fourth Best Place",
//         description: "This is the fourth best place in Portland",
//         image: Images[3],
//       },
//     ],
//     region: {
//       latitude: 45.52220671242907,
//       longitude: -122.6653281029795,
//       latitudeDelta: 0.04864195044303443,
//       longitudeDelta: 0.040142817690068,
//     },
//   };

//   componentWillMount() {
//     this.index = 0;
//     this.animation = new Animated.Value(0);
//   }
//   componentDidMount() {
//     // We should detect when scrolling has stopped then animate
//     // We should just debounce the event listener here
//     this.animation.addListener(({ value }) => {
//       let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
//       if (index >= this.state.markers.length) {
//         index = this.state.markers.length - 1;
//       }
//       if (index <= 0) {
//         index = 0;
//       }

//       clearTimeout(this.regionTimeout);
//       this.regionTimeout = setTimeout(() => {
//         if (this.index !== index) {
//           this.index = index;
//           const { coordinate } = this.state.markers[index];
//           this.map.animateToRegion(
//             {
//               ...coordinate,
//               latitudeDelta: this.state.region.latitudeDelta,
//               longitudeDelta: this.state.region.longitudeDelta,
//             },
//             350
//           );
//         }
//       }, 10);
//     });
//   }

//   render() {
//     const interpolations = this.state.markers.map((marker, index) => {
//       const inputRange = [
//         (index - 1) * CARD_WIDTH,
//         index * CARD_WIDTH,
//         ((index + 1) * CARD_WIDTH),
//       ];
//       const scale = this.animation.interpolate({
//         inputRange,
//         outputRange: [0.5, 4, 0.5],
//         extrapolate: "clamp",
//       });
//       const opacity = this.animation.interpolate({
//         inputRange,
//         outputRange: [0.35, 2, 0.35],
//         extrapolate: "clamp",
//       });
//       return { scale, opacity };
//     });

//     return (
//       <View style={styles.container}>
//         <MapView
//           ref={map => this.map = map}
//           initialRegion={this.state.region}
//           style={styles.container}
//         >
//           {this.state.markers.map((marker, index) => {
//             const scaleStyle = {
//               transform: [
//                 {
//                   scale: interpolations[index].scale,
//                 },
//               ],
//             };
//             const opacityStyle = {
//               opacity: interpolations[index].opacity,
//             };
//             return (
//               <MapView.Marker key={index} coordinate={marker.coordinate}>
//                 <Animated.View style={[styles.markerWrap, opacityStyle]}>
//                   <Animated.View style={[styles.ring, scaleStyle]} />
//                   <View style={styles.marker} />
//                 </Animated.View>
//               </MapView.Marker>
//               // <MapView.Marker key={index} coordinate={marker.coordinate} title={marker.title}>
//               // </MapView.Marker>
//             );
//           })}
//         </MapView>
//         <Animated.ScrollView
//           horizontal
//           scrollEventThrottle={1}
//           showsHorizontalScrollIndicator={false}
//           snapToInterval={CARD_WIDTH}
//           onScroll={Animated.event(
//             [
//               {
//                 nativeEvent: {
//                   contentOffset: {
//                     x: this.animation,
//                   },
//                 },
//               },
//             ],
//             { useNativeDriver: true }
//           )}
//           style={styles.scrollView}
//           contentContainerStyle={styles.endPadding}
//         >
//           {this.state.markers.map((marker, index) => (
//             <View style={styles.card} key={index}>
//             <TouchableOpacity style={styles.cardImage}>
//               <Image
//                 source={marker.image}
//                 style={styles.cardImage}
//                 resizeMode="cover"
//               />
//               </TouchableOpacity>
//               <View style={styles.textContent}>
//                 <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
//                 <Text numberOfLines={1} style={styles.cardDescription}>
//                   {marker.description}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </Animated.ScrollView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     position: "absolute",
//     bottom: 30,
//     left: 0,
//     right: 0,
//     paddingVertical: 10,
//   },
//   endPadding: {
//     paddingRight: width - CARD_WIDTH,
//   },
//   card: {
//     padding: 10,
//     elevation: 2,
//     backgroundColor: "#FFF",
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowRadius: 5,
//     shadowOpacity: 0.3,
//     shadowOffset: { x: 2, y: -2 },
//     height: CARD_HEIGHT,
//     width: CARD_WIDTH,
//     overflow: "hidden",
//   },
//   cardImage: {
//     flex: 3,
//     width: "100%",
//     height: "100%",
//     alignSelf: "center",
//   },
//   textContent: {
//     flex: 1,
//   },
//   cardtitle: {
//     fontSize: 12,
//     marginTop: 5,
//     fontWeight: "bold",
//   },
//   cardDescription: {
//     fontSize: 12,
//     color: "#444",
//   },
//   markerWrap: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   marker: {
//     width: 10,
//     height: 10,
//     borderRadius: 10/2,
//     backgroundColor: "rgba(130,4,150, 0.9)",
//   },
//   ring: {
//     width: 30,
//     height: 30,
//     borderRadius: 30/2,
//     backgroundColor: "rgba(130,4,150, 0.3)",
//     position: "absolute",
//     borderColor: "rgba(130,4,150, 0.5)",
//   },
//   modalButtonIcon: {
//     fontSize: 35,
//     height: 35,
//     marginTop:5,
//     marginEnd:5,
//     color: 'black',
//   },
// });

// AppRegistry.registerComponent("mapfocus", () => screens);








/**
 * Example usage of react-native-modal
 * @format
 */

import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
import Modal from "react-native-modal";

export default class Example extends Component {
  state = {
    visibleModal: null,
  };

  static navigationOptions = {
    headerTransparent: true
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Hello!</Text>
      {this.renderButton("Close", () => this.setState({ visibleModal: null }))}
    </View>
  );

  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };

  handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  render() {
    return (
     
      <ScrollView>
         <StatusBar hidden/>
      <View style={styles.container}>
        {this.renderButton("Default modal", () =>
          this.setState({ visibleModal: 1 }),
        )}
        {this.renderButton("Sliding from the sides", () =>
          this.setState({ visibleModal: 2 }),
        )}
        {this.renderButton("A slower modal", () =>
          this.setState({ visibleModal: 3 }),
        )}
        {this.renderButton("Fancy modal!", () =>
          this.setState({ visibleModal: 4 }),
        )}
        {this.renderButton("Bottom half modal", () =>
          this.setState({ visibleModal: 5 }),
        )}
        {this.renderButton("Modal that can be closed on backdrop press", () =>
          this.setState({ visibleModal: 6 }),
        )}
        {this.renderButton("Swipeable modal", () =>
          this.setState({ visibleModal: 7 }),
        )}
        {this.renderButton("Scrollable modal", () =>
          this.setState({ visibleModal: 8 }),
        )}
        <Modal isVisible={this.state.visibleModal === 1}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 2}
          animationIn="slideInLeft"
          animationOut="slideOutRight">
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 3}
          animationInTiming={2000}
          animationOutTiming={2000}
          backdropTransitionInTiming={2000}
          backdropTransitionOutTiming={2000}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 4}
          backdropColor={"red"}
          backdropOpacity={1}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 5}
          style={styles.bottomModal}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 6}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 7}
          onSwipeComplete={() => this.setState({ visibleModal: null })}
          swipeDirection="left">
          {this.renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 8}
          onSwipeComplete={() => this.setState({ visibleModal: null })}
          swipeDirection="down"
          scrollTo={this.handleScrollTo}
          scrollOffset={this.state.scrollOffset}
          scrollOffsetMax={400 - 300} // content height - ScrollView height
          style={styles.bottomModal}>
          <View style={styles.scrollableModal}>
            <ScrollView
              ref={ref => (this.scrollViewRef = ref)}
              onScroll={this.handleOnScroll}
              scrollEventThrottle={16}>
              <View style={styles.scrollableModalContent1}>
                <Text>Scroll me up</Text>
              </View>
              <View style={styles.scrollableModalContent1}>
                <Text>Scroll me up</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  scrollableModal: {
    height: 300,
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
  },
});
