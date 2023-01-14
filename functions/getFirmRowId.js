const database = require('../db/index');


const getFirmRowID = async (firm_guid) => {
    var value = -1;
    if(firm_guid.length > 35){
        text = `SELECT row_id from tbl_firms where firm_guid=$1`;
        try{
            const {rows} =  await database.query(text, [firm_guid]);
            if(rows.length != 0){
                value = rows[0]['row_id'];
            } else console.log('Firm Row ID is empty!');
        }
        catch(err){
            console.log(err)
        }
    } else console.log('Firm_guid is not real');
    return value;
}

module.exports = getFirmRowID;