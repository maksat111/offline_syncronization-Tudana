const database = require('../db/index');


const getMtrlTypeId = async (name) => {
    var value = -1;
    text = `SELECT row_id from tbl_material_type where mtrl_type_name=$1`;
    try{
        const {rows} =  await database.query(text, [name]);
        if(rows.length != 0){
            value = rows[0]['row_id'];
        } else console.log('mtrl_type_row_id is empty!');
    }
    catch(err){
        console.log(err)
    }
    return value;
}

module.exports = getMtrlTypeId;


