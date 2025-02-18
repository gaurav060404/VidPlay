import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOnCloudinary = async (previousImagePath) => {
  try {
    // Consider a more robust method to extract the public id.
    const imagePath = previousImagePath.split("").reverse().join("");
    const sliced = imagePath.slice(4);
    const splited = sliced.split("/")[0];
    const resultedPublicId = splited.split("").reverse().join("");
    console.log(resultedPublicId);

    const result = await cloudinary.uploader.destroy(resultedPublicId);
    if(result.result !== "ok") {
      throw new ApiError(400, "Error occurred while deleting the old avatar on cloudinary");
    }
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { deleteOnCloudinary };
