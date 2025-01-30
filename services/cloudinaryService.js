import cloudinary from "../db/cloudinary.js";
import fs from "fs"

export const uploadToCloudinary = async (file, folder) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg"],
    });
    fs.unlinkSync(file.path); // Clean up local file
    return result.secure_url;
  };