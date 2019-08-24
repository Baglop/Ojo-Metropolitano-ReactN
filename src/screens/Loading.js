import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color='#00ffd4' />
                    <Text style={styles.label}>{'Cargando...'}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#020b36'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020b36'
    },
    label: {
        color: '#00ffd4',
        fontSize: 25
    }
})
