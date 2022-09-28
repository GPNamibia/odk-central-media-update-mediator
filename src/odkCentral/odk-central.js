const stag_plist = require('./stag_plist/stag_plist');
const stag_ulist = require('./stag_ulist/stag_ulist');


async function getPtrackerData() {
    try {
        await Promise.all([
            stag_plist.getStagPlistData()
            .then(async(res) => {
                return resolve();
            }),
            stag_ulist.getStagUlistData()
            .then(async(res) => {
                return resolve();
            })
        ])
    } catch (error) {
        reject(`Error while retrieving data:${error} :🚫\n`)
    }
}

module.exports = {
    getPtrackerData
};