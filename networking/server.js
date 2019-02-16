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
        console.log(JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        console.error(`No se pudo por este problema : ${error}`);
    }
}

export { Request_API }