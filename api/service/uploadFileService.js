const path = require("path");

const uploadFileService = async (fileObject) => {

    let uploadPath = path.resolve(__dirname, "../../src/assets/fileUpload");
    // Take extension name of file
    let extName = path.extname(fileObject.name);
    // Take basename of file
    let baseName = path.basename(fileObject.name, extName);

    //create final name for file upload (add date upload)
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;
    try {
        await fileObject.mv(finalPath);
        return ({
            status: 'success',
            path: finalPath,
            error: null,
            message: 'Upload file successfully!'
        })
    } catch (error) {
        console.log(">>> Error upload file = ", error);
        return ({
            status: "false",
            path: null,
            error: JSON.stringify(error),
            message: "Upload file fail!"
        })
    }
}
module.exports = { uploadFileService };