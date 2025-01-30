import multer from 'multer';
import { extname } from 'path';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Temporary storage for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + extname(file.originalname)); // Rename file to avoid conflicts
  }
});

// Create the multer instance and set up fields for both drivers and admins
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
}).fields([
  { name: 'driverProfilePicture', maxCount: 1 }, // For driver profile pictures
  { name: 'vehicleImage', maxCount: 1 },   // For driver vehicle images
  { name: 'vehiclePlatePicture', maxCount: 1 }, // For driver vehicle plate pictures
  { name: 'vehicleRegistrationCard', maxCount: 1 }, // For driver vehicle_registration_card
  { name: 'vehiclePollutionCertificate', maxCount: 1 }, // For driver vehicle_pollution_certificate
  { name: 'vehicleInsurancePicture', maxCount: 1 }, // For driver vehicle_inssurance_picture
  { name: 'adharCardPicture', maxCount: 1 }, // For driver adhar_card_picture
  { name: 'panCardPicture', maxCount: 1 }, // For driver pan_card_picture
  { name: 'adminProfilePicture', maxCount: 1 }, // admin dashboard

  { name: 'userProfilePicture', maxCount: 1 }, // user profile picture

  { name: 'kitchenProfilePhoto', maxCount: 1 }, // kitchen profile picture

  { name: 'kitchenImages', maxCount: 20 }, // user profile picture


]);

export default upload;


