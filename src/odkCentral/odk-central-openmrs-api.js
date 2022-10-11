const request = require('request');
const privateConfig = require('../config/private-config.json');
const fs = require('fs');

const config = privateConfig.odkCentralConfig;

class OdkCentral {
    constructor() {}
    sendRequest(options) {
        return new Promise((resolve, reject) => {
            request(options, function(err, response, body) {
                if (err) return reject(`Error sending request to ODK Central: ${err.message}`)
                const contentType = response.headers['content-type']
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return resolve({ response: response, body: body })
                } else {
                    return reject(null)
                }
            });
        })
    }

    getUsersFromOpenMrs() {
        let options = {
            method: 'GET',
            url: config.apiURL + `/ws/rest/v1/user`,
            qs: {},
            headers: config.headers,
            form: false,
            auth: {
                user: config.username,
                pass: config.password
            }
        }
        return this.sendRequest(options)
    }


    postFormAsDraft(form_name) {
        let options = {
            method: 'POST',
            url: config.apiURL + `${form_name}/draft?ignoreWarnings=false`,
            qs: {},
            headers: config.headersXLS,
            form: false,
            auth: {
                user: config.username,
                pass: config.password
            },
        }
        return this.sendRequest(options)
    }

    postFormAttachment(form_name, form_csv_name, form_csv_name_path) {
        // const binary = this.convertFileToBinary();
        // const bin = binary.toString('binary');
        let options = {
            method: 'POST',
            url: config.apiURL + `${form_name}/draft/attachments/${form_csv_name}`,
            qs: {},
            headers: config.headersCsv,
            form: false,
            auth: {
                user: config.username,
                pass: config.password
            },
            body: fs.createReadStream(`./src/stag_csv/${form_csv_name_path}`)
        }
        return this.sendRequest(options)

    }

    getFormVersion(form_name) {
        let options = {
            method: 'GET',
            url: config.apiURL + `${form_name}/draft`,
            qs: {},
            headers: config.headers,
            form: false,
            auth: {
                user: config.username,
                pass: config.password
            }
        }
        return this.sendRequest(options)
    }

    publisAndUpdateFormVersion(form_name, form_version) {
        let options = {
            method: 'POST',
            url: config.apiURL + `${form_name}/draft/publish?version=${form_version}`,
            qs: {},
            //headers: config.headers,
            form: false,
            auth: {
                user: config.username,
                pass: config.password
            },
            body: form_version
        }
        return this.sendRequest(options)
    }
}

module.exports = {
    OdkCentral
};