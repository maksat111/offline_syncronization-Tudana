const database = require('../db/index');


const getStatusName = async (guid) => {
    var value = '';
    text = `SELECT status_name_ru from tbl_assembly_order_status where status_guid=$1`;
        try{
            const {rows} =  await database.query(text, [guid]);
            if(rows.length != 0){
                value = rows[0]['status_name_ru'];
            } else console.log('Status_name ID is empty!');
        } catch(err){
            console.log(err)
        }
    return value;
}

module.exports = getStatusName;
