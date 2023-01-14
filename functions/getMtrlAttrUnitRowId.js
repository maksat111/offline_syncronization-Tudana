const database = require('../db/index');

const getMtrlAttrUnitRowId = async (mtrl_id, attr_id, unit_det_id) => {
    try{
        var value = -1;
            if(!unit_det_id){
                text = `select row_id from tbl_mtrl_attr_unit where mtrl_guid=$1 and attr_guid=$2`;
                values = [mtrl_id, attr_id];
            } else {
                text = `select row_id from tbl_mtrl_attr_unit where mtrl_guid=$1 and attr_guid=$2 and unit_det_guid=$3`;
                values = [mtrl_id, attr_id, unit_det_id];
            }
        const {rows} = await database.query(text, values);
        if(rows.length != 0) value = rows[0]['row_id'];
        else console.log('tbl_mtrl_attr_unit => Empty row_id');
    } catch (error){
        console.log(error)
    }
    return value;
}

module.exports = getMtrlAttrUnitRowId;
