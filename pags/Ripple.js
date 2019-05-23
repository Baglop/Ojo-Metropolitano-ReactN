import React, { Component } from 'react'
import { Text, View, StyleSheet, Animated } from 'react-native'

export default class Ripple extends Component {

    state = {
        animated: new Animated.Value(0),
        opacityA: new Animated.Value(1),
        animated2: new Animated.Value(0),
        opacityA2: new Animated.Value(1),
    }

    componentDidMount() {
        const { animated, opacityA, animated2, opacityA2 } = this.state;




        Animated.stagger(2000, [
            Animated.loop(
                Animated.parallel([
                    Animated.timing(animated, {
                        toValue: 3,
                        duration: 3000,

                    }),
                    Animated.timing(opacityA, {
                        toValue: 0,
                        duration: 3000,

                    })
                ])
            ),
            Animated.loop(
                Animated.parallel([
                    Animated.timing(animated2, {
                        toValue: 3,
                        duration: 3000,

                    }),
                    Animated.timing(opacityA2, {
                        toValue: 0,
                        duration: 3000,

                    })
                ])
            )

        ]).start()
    }

    render() {
        const { animated, opacityA, animated2, opacityA2 } = this.state;
        return (
            <View style={styles.root}>
                <Animated.View style={{
                    height: 300,
                    width: 300,
                    borderRadius: 300 / 2,
                    backgroundColor: 'red',
                    opacity: opacityA,
                    transform: [
                        {
                            scale: animated
                        }
                    ]
                }}>
                    <Animated.View style={{
                        height: 300,
                        width: 300,
                        borderRadius: 300 / 2,
                        backgroundColor: 'red',
                        opacity: opacityA2,
                        transform: [
                            {
                                scale: animated2
                            }
                        ]
                    }}>
                    </Animated.View>
                </Animated.View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

