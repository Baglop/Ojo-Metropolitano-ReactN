import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradiantBelow from '../symbols/LinearGradiantBelow';
import { withNamespaces } from 'react-i18next';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { t } = this.props;
        return (
            <View style={styles.root}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color='#0797fd' />
                    <Text style={styles.label}>{t("loading.loading")}</Text>
                </View>
                <LinearGradiantBelow />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)'
    },
    label: {
        color: '#0797fd',
        fontSize: 25
    }
})

export default withNamespaces()(Loading);