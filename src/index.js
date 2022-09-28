const express = require("express");
const ptrackerData = require('./odkCentral/odk-central.js');
const privateConfig = require('./config/private-config.json');
const { getQueryParameters } = require('./openHIM/initialize.js');
const db = require('./models');
const app = express();


//openHIM
getQueryParameters();

app.all('*', async(req, res) => {
    // Starts when a new request is triggered by the polling channel
    console.log(`\n---------------------------------------------------------------------------------`,
        `\n${ new Date().toUTCString('en-GB', { timeZone: 'UTC' }) }  - `,
        `The PTracker update media file mediator has received a new request. \n`
    );
    ptrackerData.getPtrackerData()
        .then((results) => {
            try {
                console.log(results)
                res.json('PTracker Data openMRS Database retrieved.');
            } catch (error) {
                console.error(`Error retrieving PTracker Data from openMRS Database: ${error}`)
            }

        }).catch(error => { console.error(`Error retrieving PTracker Data: ${error}`) })
});

//Server PORT
db.sequelize.sync({}).then((req) => {
    app.listen(privateConfig.appConfig.PORT, (err) => {
        if (err) console.log(`Error: ${err}`)
        console.log(`${privateConfig.appConfig.mediatorName}  listening on port ${privateConfig.appConfig.PORT}...  \n`);
    });
}).then(() => {
    console.log(`Succesfully connected to '${privateConfig.development.database}' database...  \n`)
}).catch(err => { console.log(`Error when connecting to '${privateConfig.development.database}' database...:: \n`, err) });