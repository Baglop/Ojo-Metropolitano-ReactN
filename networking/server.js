const URL = 'http://siliconbear.dynu.net'
const actualizarReportesGlobales = ':3030/API/inicio/ActualizarReportesGlobales'


 async function Request_API(params, comp){
    /*try{
        fetch(URL + ':3030/API/inicio/ActualizarReportesGlobales', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
        .then(response => {
          console.log(JSON.stringify(response));
          return response.codigoRespuesta;
        });
        //return response.codigoRespuesta;
    } catch (error) {
        console.error(`No se pudo por este problema : ${error}`);
    }*/

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