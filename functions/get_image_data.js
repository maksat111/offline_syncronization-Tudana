const fetch = require('node-fetch-commonjs');
const database = require("../db/index");
const FetchData = require('./fetchData');

const getImageData = async (url,conflict_column) => {
  const imageId = await FetchData(url);
  console.log(imageId)

  let text = `INSERT INTO tbl_images(image_guid, parent_guid, image_blob) 
            VALUES ($1,$2,$3) ON CONFLICT (${conflict_column}) DO UPDATE
            SET parent_guid=excluded.parent_guid,
                image_blob=excluded.image_blob`
  
  imageId.forEach(async res => {
    let data = await fetch(`${process.env.BASE_URL}${process.env.FOLDER_PATH}get_image?image_id=${res.image_guid}`)
    let str = await data.text()
    let dataToInsert = new Buffer.from(str).toString('hex');
    
    let params = [res.image_guid, res.parent_guid, dataToInsert]
    try{
      await database.query(text, params);
    } catch(err){
      console.log(err);
    }

  })
  
  
}

module.exports = getImageData;