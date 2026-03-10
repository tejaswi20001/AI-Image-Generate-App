import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { createError } from "../error.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.Cloudflare_Account_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.Cloudflare_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          seed: Math.floor(Math.random() * 1000000),
        }),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return res.status(response.status || 500).json({
        success: false,
        message: result?.errors?.[0]?.message || "Image generation failed",
      });
    }

    const base64Image = result.result.image;
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const uploadedImage = await cloudinary.uploader.upload(dataUri, {
      folder: "image-generator",
    });

    return res.status(200).json({
      success: true,
      photo: uploadedImage.secure_url,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
