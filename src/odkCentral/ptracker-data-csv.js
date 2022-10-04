const sqlBuilder = require('../db/sql-builder');
const fastcsv = require("fast-csv");
const fs = require('fs');
const { OdkCentral } = require("./odk-central-openmrs-api");
const odkCentral = new OdkCentral();


//Retrieve submissions from MySQL and convert to CSV
async function convertRecordsToCSV(model, table_name, form_name, form_csv_name, form_csv_name_path) {
    return new Promise(async(resolve, reject) => {
        await sqlBuilder.readData(model)
            .then(async(res) => {
                const ws = fs.createWriteStream(`./src/stag_csv/${form_csv_name}`);
                const jsonData = JSON.parse(JSON.stringify(res));
                console.log(`1. Succesfully  ✅ retrieved 【${jsonData.length}】records from:'【${table_name}】 table.\n`);
                fastcsv
                    .write(jsonData, { headers: true })
                    .on("finish", function() {
                        console.log(`2. Write to ${form_csv_name} successfully! ✅ \n`);
                    })
                    .pipe(ws);
                await postFormAsDraftFunction(form_name, form_csv_name, form_csv_name_path);

            }).catch(err => { console.log(`Error while retrieving records from 【${table_name}】: ${err} :🚫:\n`) });
    })
}

function postFormAsDraftFunction(form_name, form_csv_name, form_csv_name_path) {
    return new Promise((resolve, reject) => {
        odkCentral.postFormAsDraft(form_name)
            .then(async(res) => {
                let result = JSON.parse(res.body);
                console.log(`3. Succesfully ✅ created draft for 【${form_name}】form \n`);
                await postFormAsAttachmentFunction(form_name, form_csv_name, form_csv_name_path)
            })
            .catch(err => {
                return reject(`Error while creating draft for 【${form_name}】form: ${err} 🚫\n`)
            });
    });
}

function postFormAsAttachmentFunction(form_name, form_csv_name, form_csv_name_path) {
    return new Promise((resolve, reject) => {
        odkCentral.postFormAttachment(form_name, form_csv_name, form_csv_name_path)
            .then(async(res) => {
                let result = JSON.parse(res.body);
                console.log(`4. Succesfully ✅ posted attachment for 【${form_name}】draft form \n`);
                await getFormVersionFunction(form_name).then(async(res) => {
                        const version = res.toString();
                        setTimeout(() => {
                            publishAndUpdateFormversion(form_name, version)
                                .then(async(res) => {
                                    console.log(res)
                                })
                                .catch((err) => { console.error(err) })
                        }, 5000);

                    })
                    .catch(err => {});
            })
            .catch(err => {
                return reject(`Error while posting attachment for 【${form_name}】draft form: ${err} 🚫\n`)
            });
    });
}

function getFormVersionFunction(form_name) {
    return new Promise((resolve, reject) => {
        odkCentral.getFormVersion(form_name)
            .then(async(res) => {
                let result = JSON.parse(res.body);
                let form_version = result.version;
                form_version++;
                return resolve(form_version);
            })
            .catch(err => {
                return reject(`Error while publishing & updating version for for 【${form_name}】draft form: ${err} 🚫\n`)
            });
    });
}


function publishAndUpdateFormversion(form_name, form_version) {
    return new Promise((resolve, reject) => {
        odkCentral.publisAndUpdateFormVersion(form_name, form_version)
            .then(async(res) => {
                let result = JSON.parse(res.body);
                console.log(`5. Succesfully ✅ published & updated version for 【${form_name}】draft form \n`);
            })
            .catch(err => {
                return reject(`Error while publishing & updating version for for 【${form_name}】draft form: ${err} 🚫\n`)
            });
    });
}

module.exports = {
    convertRecordsToCSV,
};