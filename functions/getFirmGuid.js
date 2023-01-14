const database = require('../db/index');


const getFirmGuid = async (row_id) => {
    var value = -1;
    text = `SELECT firm_guid from tbl_firms where row_id=$1`;
        try{
            const {rows} =  await database.query(text, [row_id]);
            if(rows.length != 0){
                value = rows[0]['firm_guid'];
            } else console.log(`There is no firm_guid with row_id=${row_id}`);
        } catch(err){
            console.log(err)
        }
    return value;
}

module.exports = getFirmGuid;
