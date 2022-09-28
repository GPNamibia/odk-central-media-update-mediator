const { table_name, form_csv_name, form_csv_namePath, next_form_id } = require('./tableColums');
const ptracker_data_csv = require('../ptracker-data-csv');
const { stag_ulist } = require("../../models")


async function getStagUlistData() {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            ptracker_data_csv.convertRecordsToCSV(stag_ulist, table_name, next_form_id, form_csv_name, form_csv_namePath)
                .then(async (res) => {
                    return resolve();
                })
                .catch((err) => { console.error(err) })
        }, 5000);
    })
}


module.exports = { getStagUlistData };