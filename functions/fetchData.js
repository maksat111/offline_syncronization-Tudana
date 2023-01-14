const fetch = require('node-fetch-commonjs');

const FetchData = async (url) => {
    const response = await fetch(`${process.env.BASE_URL}${process.env.FOLDER_PATH}${url}`);
    const data = await response.json();
    return data;
}
module.exports = FetchData;