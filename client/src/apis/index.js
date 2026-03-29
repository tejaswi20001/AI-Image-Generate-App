import axios from "axios";

const API = axios.create({
  baseURL: "http://35.153.216.42:8000/api",
});

export const GetPosts = async () => await API.get("/post");
export const CreatePost = async (data) => await API.post("/post", data);
export const GenerateAIImage = async (data) =>
  await API.post("/generateImage", data);
