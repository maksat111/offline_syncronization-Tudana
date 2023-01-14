const database = require('../db/index');

const getGuidOfMtrlAttrUnit = async (id) => {
    try{
        var value = -1;
            text = `select mtrl_guid, unit_det_guid, attr_guid  from tbl_mtrl_attr_unit where row_id=$1`;
        const {rows} = await database.query(text, [id]);
        if(rows.length != 0) value = rows[0];
        else console.log(`tbl_mtrl_attr_unit => There is no guid with row_id=${id}`);
    } catch (error){
        console.log(error)
    }
    return value;
}

module.exports = getGuidOfMtrlAttrUnit;

