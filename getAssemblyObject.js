const database = require('./db/index');
const getFirmGuid = require('./functions/getFirmGuid');
const getGuidOfMtrlAttrUnit = require('./functions/getGuidOfMtrlAttrUnit');
const getStatusName = require('./functions/getStatusName');

const getAssemblyObject = async () => {
  const obj = {};
  const tblAssemblyOrders = await database.query(`SELECT a_order_guid,client_guid, COALESCE(recept_head_guid, uuid_nil()),
                            user_guid,warehouse_guid,firm_row_id,mtrl_attr_unit_row_id,a_order_code,a_order_created_date,
                            a_order_start_date,a_order_end_date,desired_delivery_date,mtrl_amount,a_order_total,a_order_comment,
                            pre_order,a_order_status_guid,a_order_duration FROM tbl_assembly_orders`);
  const orders = tblAssemblyOrders.rows;
  const tblAssemblyOrdersLine = await database.query('SELECT * FROM tbl_assembly_orders_line');
  const orders_line = tblAssemblyOrdersLine.rows;

  for (let i = 0; i < orders.length; i++) {
    var mtrlArrtUnitGuids = await getGuidOfMtrlAttrUnit(orders[i].mtrl_attr_unit_row_id)
    
    orders[i].firm_guid = await getFirmGuid(orders[i].firm_row_id)
    orders[i].a_order_status = await getStatusName(orders[i].a_order_status_guid);
    orders[i].mtrl_amount = parseFloat(orders[i].mtrl_amount);
    orders[i].a_order_total = parseFloat(orders[i].a_order_total);
    orders[i].mtrl_guid = mtrlArrtUnitGuids.mtrl_guid;
    orders[i].attr_guid = mtrlArrtUnitGuids.attr_guid;
    orders[i].unit_det_guid = mtrlArrtUnitGuids.unit_det_guid;

    delete orders[i].firm_row_id;
    delete orders[i].mtrl_attr_unit_row_id;
    delete orders[i].a_order_status_guid;
  }

  for (let i = 0; i < orders_line.length; i++) {
    var mtrlArrtUnitGuids = await getGuidOfMtrlAttrUnit(orders_line[i].mtrl_attr_unit_row_id);
    orders_line[i].mtrl_guid = mtrlArrtUnitGuids.mtrl_guid;
    orders_line[i].attr_guid = mtrlArrtUnitGuids.attr_guid;
    orders_line[i].unit_det_guid = mtrlArrtUnitGuids.unit_det_guid;

    orders_line[i].mtrl_price = parseFloat(orders_line[i].mtrl_price);
    orders_line[i].a_order_line_subtotal = parseFloat(orders_line[i].a_order_line_subtotal);

    delete orders_line[i].mtrl_attr_unit_row_id;
    
  }

  obj.tbl_assembly_orders = orders;
  obj.tbl_assembly_orders_line = orders_line;

  console.log(obj)

  return JSON.stringify(obj);
}

getAssemblyObject()

module.exports = getAssemblyObject;
