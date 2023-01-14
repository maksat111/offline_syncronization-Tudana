const FetchData = require("../functions/fetchData");
const database = require("../db/index");
const getFirmRowID = require("../../OfflineSynс2/functions/getFirmRowId");
const getAttrTypeId = require("../../OfflineSynс2/functions/getAttrTypeId");
const getMtrlTypeId = require("./getMtrlTypeId");
const { all } = require("express/lib/application");
require('dotenv').config();

const getFunction = async (url, tbl_name, conflict_column) => {
  const allData = await FetchData(url);
  const lengthOfData = allData.length;
  var columnArray = Object.keys(allData[0])

  
  //eger  object-in key lerinde firm_guid bar bolsa shony firm_row_id geciryar 
  const rowCheck = columnArray.filter(item => item=='firm_guid' || item=='attr_type_name' || item == 'mtrl_type');

  if(rowCheck=='firm_guid' && tbl_name!=='tbl_firms'){
    for(let i=0; i<lengthOfData; i++){
      allData[i].firm_row_id = await getFirmRowID(allData[i].firm_guid);
      delete allData[i].firm_guid
    }
  }

  if(rowCheck == 'mtrl_type'){
    for (let i = 0; i < lengthOfData; i++) {
      allData[i].mtrl_type_row_id = await getMtrlTypeId(allData[i].mtrl_type)
      delete allData[i].mtrl_type
    }
  }

    if(rowCheck=='attr_type_name' && tbl_name!=='tbl_attribute_type'){
    for(let i=0; i<lengthOfData; i++){
      allData[i].attr_type_row_id = await getAttrTypeId(allData[i].attr_type_name)
      delete allData[i].attr_type_name
    }
  }

  if(tbl_name=='tbl_firms'){
    for(let i=0; i<lengthOfData; i++){
      allData[i].name_for_print = allData[i].firm_full_name;
    }
  }
  
  columnArray = Object.keys(allData[0]); //update columnArray
  const numberOfColumns = columnArray.length; // nace sany column baryny saklayar
  const numberOfParams = lengthOfData*numberOfColumns; // parametrlerin sany
  let columnText = '';
  let valueText = '';
  let updateText = '';
  let values = [];

  for (let i = 0; i < numberOfColumns; i++){
    if(i>0 && i<columnArray.length){
      columnText += ',';
      updateText += ',';
    }
    updateText = updateText + columnArray[i] + '=excluded.' + columnArray[i]; 
    columnText += columnArray[i];
  }

  for (let i = 1; i <= numberOfParams; i++) {
    if((i-1)%numberOfColumns==0){
      valueText+='(';
    }

    valueText+=`$${i}`;

    if(i%numberOfColumns==0){
      valueText+=')';
    }

    if(i!=numberOfParams){
      valueText+=','
    }
  }

  for(let i = 0; i< lengthOfData; i++){
    if(allData[i])
    values = [...values, ...Object.values(allData[i])]
  }

  queryText = `INSERT INTO ${tbl_name} (${columnText}) 
                  VALUES ${valueText}
                  ON CONFLICT (${conflict_column}) DO UPDATE 
                  SET ${updateText}; `

  try{
    await database.query(queryText,values);
    console.log(tbl_name)
  } catch (err){
    console.log(`There is error in ${tbl_name} =>`);
    console.log(err);
  }

}

module.exports = getFunction;