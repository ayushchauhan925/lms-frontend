const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a file to Cloudinary.
 *
 * @param {File} file               - The file to upload (image or video)
 * @param {"image" | "video"} type  - Resource type (default: "image")
 * @param {(progress: number) => void} onProgress - Optional progress callback (0–100)
 * @returns {Promise<{ url: string, publicId: string, duration?: number }>}
 */
export const uploadToCloudinary = (file, type = "image", onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", type);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          ...(data.duration && { duration: Math.round(data.duration) }),
        });
      } else {
        reject(new Error("Cloudinary upload failed."));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload."));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`
    );

    xhr.send(formData);
  });
};