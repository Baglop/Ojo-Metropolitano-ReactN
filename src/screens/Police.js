import React, { Component } from 'react';
import { Text, StyleSheet, View, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from "react-navigation";
import MainHeader from '../symbols/MainHeader';

export default class Police extends Component {
    render() {
        return (
            <View style={styles.root}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.root} colors={['#020b36', '#04335d', '#2b8ea8']}>
                    <StatusBar translucent backgroundColor="transparent" animated barStyle="light-content" />
                    {Platform.OS === 'android' && Platform.Version >= 20 ? <View style={{ height: 24 }} /> : null}
                    <SafeAreaView style={styles.root} forceInset={{ bottom: 'always', top: 'always' }}>
                    {/* <MainHeader title={'Policía'} navigation={this.props.navigation} /> */}
                        <View style={styles.body}>
                            <Text> textInComponent </Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: 'white'
    }
})
