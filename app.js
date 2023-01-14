const express = require('express');
const database = require('./db/index');
require('dotenv').config();

const getFunction = require('./functions/getFunction');
const getObject = require('./functions/getObject');
const getImageData = require('./functions/get_image_data');
const getWithMtrlAttr = require('./functions/mtrlAttr');
const getWithMtrlAttrUnit = require('./functions/mtrlAttrUnit');

const app = express();

const port = 8090
app.listen(port);


//---------------------------------------FETCHING FROM 1C TO PostgreSQL-------------------------------------//
const sync = async () => {
    await getFunction('get_currency', 'tbl_currency', 'currency_guid');
    await getFunction('get_firm_data', 'tbl_firms', 'firm_guid');
    await getFunction('get_attribute_type', 'tbl_attribute_type', 'attr_type_name');
    await getFunction('get_contact_type', 'tbl_contact_type', 'contact_type_guid');
    await getFunction('get_contact_info', 'tbl_contact_info', 'parent_guid, contact_type_guid, contact_value');
    await getFunction('get_warehouses', 'tbl_warehouses', 'warehouse_guid');
    await getFunction('get_clients', 'tbl_clients', 'client_guid');
    await getFunction('get_attributes', 'tbl_attributes', 'attribute_guid');
    await getFunction('get_group', 'tbl_group', 'group_guid');
    await getFunction('get_price_type', 'tbl_price_type', 'price_type_guid')
    await getObject('get_units', 'tbl_units', 'unit_guid')
    await getObject('get_units', 'tbl_unit_details', 'unit_det_guid')
    await getObject('get_recept', 'tbl_recept_head', 'recept_guid')
    await getObject('get_recept', 'tbl_recept_line', 'recept_line_guid')
    await getFunction('get_materials', 'tbl_materials', 'mtrl_guid')
    await getFunction('get_mtrl_attr_type', 'tbl_material_type', 'mtrl_type_name')
    await getFunction('get_mtrl_attr_unit_group', 'tbl_mtrl_attr_unit', 'mtrl_guid, attr_guid, group_guid, unit_det_guid')
    await getObject('get_assembly_orders', 'tbl_assembly_orders', 'a_order_guid')
    await getObject('get_assembly_orders', 'tbl_assembly_orders_line', 'a_order_line_guid')
    await getFunction('get_users', 'tbl_users', 'user_guid')
    await getWithMtrlAttrUnit('get_prices', 'tbl_prices', 'price_doc_guid, mtrl_attr_unit_row_id');
    await getWithMtrlAttrUnit('get_barcode', 'tbl_barcode', 'barcode_guid');
    await getWithMtrlAttr('get_stock_by_whouse', 'tbl_stock_by_warehouse', 'stock_by_warehouse_guid')
    await getImageData('get_image_id', 'image_guid')
    console.log('Syncronization will Start 10 seconds after again ...');
}

setTimeout(sync(), 10000);

app.get('/test', (req, res) => {
    res.send('test')
})
