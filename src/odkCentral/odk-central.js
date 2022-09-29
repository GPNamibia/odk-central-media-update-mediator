const stag_plist = require('./stag_plist/stag_plist');
const stag_ulist = require('./stag_ulist/stag_ulist');


async function getPtrackerData() {
    try {
        stag_plist.getStagPlistData(),
            stag_ulist.getStagUlistData()

    } catch (error) {
        reject(`Error while retrieving data:${error} :🚫\n`)
    }
}

module.exports = {
    getPtrackerData
};