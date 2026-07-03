import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) => {
    try{

        if(!localFilePath){
            console.log("please provide image path");
            return null;
        }
        console.log("local Path here : ", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file is uploaded on cloudinary ", response);
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);
        console.log("Error while uploading the file", error);j
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        
        // destroys/wipes the asset instantly from the cloud storage bucket
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Critical: Failed to remove orphaned asset from Cloudinary:", error);
        return null;
    }
};

export {uploadOnCloudinary, deleteFromCloudinary};