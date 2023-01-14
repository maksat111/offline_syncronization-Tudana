const database = require('../db/index');

const getAttrTypeId = async (name) => {
    var value = -1;
    text=`select row_id from tbl_attribute_type where attr_type_name=$1`;
    try{
        const {rows} =  await database.query(text, [name]);
        if(rows.length != 0){
            value = rows[0]['row_id'];
        } else console.log('Attr_row ID is empty!');
    }
    catch(err){
        console.log(err)
    }
    return value;
}

module.exports = getAttrTypeId;