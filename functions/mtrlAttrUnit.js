const FetchData = require("../functions/fetchData");
const database = require("../db/index");
const getMtrlAttrUnitRowId = require("./getMtrlAttrUnitRowId");
require('dotenv').config();

const getWithMtrlAttrUnit = async (url, tbl_name, conflict_column) => {
  const allData = await FetchData(url);
  if(allData.length==0){
      console.log(`${tbl_name} is empty`)
      return
    }
  const lengthOfData = allData.length;
  
  for(let i=0; i<lengthOfData; i++){
    allData[i].mtrl_attr_unit_row_id = await getMtrlAttrUnitRowId(allData[i].mtrl_guid, allData[i].attr_guid, allData[i].unit_det_guid);
    delete allData[i].mtrl_guid;
    delete allData[i].attr_guid;
    delete allData[i].unit_det_guid;
  }

  let columnArray = Object.keys(allData[0]); // column laryn adyny massiw edip saklayar
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
    console.log(err);
  }

}

module.exports = getWithMtrlAttrUnit;