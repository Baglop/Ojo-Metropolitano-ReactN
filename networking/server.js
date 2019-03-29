import {Alert} from 'react-native'
const URL = 'http://siliconbear.dynu.net'

 async function Request_API(params, comp){
    try{
        let response = await
        fetch(URL + comp, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        let responseJson = await response.json();
        //console.log(JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
    Alert.alert(
        'Undefined',
        'Error desconocido, por favor intenta de nuevo.',
        [,
            {text: 'OK'},
        ],
            {cancelable: false},
        );
        //console.error(`No se pudo por este problema : ${error}`);
    }
}

export { Request_API }