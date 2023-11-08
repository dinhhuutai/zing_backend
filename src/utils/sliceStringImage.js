require('dotenv').config();


handleSliceStringImage = (str) => {
    return str.slice(str.indexOf(`${process.env.FOLDER_CLOUD}`)).slice(0, str.slice(str.indexOf(`${process.env.FOLDER_CLOUD}`)).lastIndexOf('.'));
}


module.exports = handleSliceStringImage;