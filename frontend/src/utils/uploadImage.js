import { API_PATHS } from './apiPaths';
import axiosInstance from "./axiosInstance";

const uploadImage = async (file) => {

  const formData = new FormData();

  formData.append("image", file);   // field name must match backend

  try {

    const response = await axiosInstance.post(
      "/api/auth/upload-image",
      formData,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return response.data;

  } catch(error){
    console.error(error);
    return null;
  }
};

export default uploadImage;