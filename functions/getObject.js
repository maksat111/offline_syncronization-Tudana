const FetchData = require("../functions/fetchData");
const database = require("../db/index");
const getFirmRowID = require("./getFirmRowId");

const getObject = async (url, tbl_name, conflict_column) => {
  const fetchedObject = await FetchData(url);
  var allData = fetchedObject[tbl_name];
  
  // switch(tbl_name){
  //   case 'tbl_units':
  //     allData = fetchedObject.tbl_units;
  //     break;
  //   case 'tbl_unit_details':
  //     allData = fetchedObject.tbl_unit_details;
  //     break;
  //   case 'tbl_recept_head':
  //     allData = fetchedObject.tbl_recept_head;
  //     break;
  //   case 'tbl_recept_line':
  //     allData = fetchedObject.tbl_recept_line;
  //     break;
  //   case 'tbl_assembly_orders':
  //     allData = fetchedObject.tbl_assembly_orders;
  //     break;
  //   case 'tbl_assembly_orders_line':
  //     allData = fetchedObject.tbl_assembly_orders_line;
  //     break;
  // }

  if(allData.length==0){
    console.log(`${tbl_name} is empty`)
    return
  }

  const lengthOfData = allData.length;
  let columnArray = Object.keys(allData[0]); // column laryn adyny massiw edip saklayar
  const numberOfColumns = columnArray.length; // nace sany column baryny saklayar
  const numberOfParams = lengthOfData*numberOfColumns; // parametrlerin sany
  let columnText = '';
  let valueText = '';
  let updateText = '';
  let values = [];

  //eger  object in key lerinde firm_guid bar bolsa shony firm_row_id geciryar 
  const rowCheck = columnArray.filter(item => item=='firm_guid');

  if(rowCheck=='firm_guid' && tbl_name!=='tbl_firms'){
    for(let i=0; i<lengthOfData; i++){
      allData[i].firm_row_id = await getFirmRowID(allData[i].firm_guid);
      delete allData[i].firm_guid
    }
  }

  columnArray = Object.keys(allData[0]); //update columnArray

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
  
  //creating value Text for pasting in params field
  for(let i = 0; i< lengthOfData; i++){
    if(allData[i]){
      values = [...values, ...Object.values(allData[i])]
    }
  }

  queryText = `INSERT INTO ${tbl_name} (${columnText}) 
              VALUES ${valueText}
              ON CONFLICT (${conflict_column}) DO UPDATE 
              SET ${updateText}; `
  
  try{
    await database.query(queryText,values);
    console.log(tbl_name)
  } catch (err){
    console.log(tbl_name);
    console.log(err);
  }
}

module.exports = getObject;