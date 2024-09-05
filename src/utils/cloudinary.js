// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary=async (localFilePath)=>{
//     try {
//         if(!localFilePath) return null;
//         // upload file
//         const response=await cloudinary.v2.uploader.upload(localFilePath,{
//             resource_type: "auto",
//         })
//         // file uploaded successfully
//         console.log("file uploaded successfully",response.url);
//         return response;
        
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed

//         return null;
//     }
// }

// export {uploadOnCloudinary}

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        // Log successful upload
        console.log("File uploaded successfully:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Log and handle the error
        console.error("Error uploading file to Cloudinary:", error.message);

        // Ensure the file exists before attempting to delete it
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log("Local file deleted successfully.");
            } catch (unlinkError) {
                console.error("Error deleting local file:", unlinkError.message);
            }
        }

        return null;
    }
};

export { uploadOnCloudinary };
