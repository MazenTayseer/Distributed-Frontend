"use client";

import AddImage from "@components/AddImage";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "@styles/loader.css";
import config from "@config";

interface ImageData {
  image: File;
  operation: string;
}

interface ProcessedImages {
  image: File;
  operation: string;
}

const NODES = ["master001", "node001"];

const BasicPage = () => {
  const [imageCount, setImageCount] = useState(1);
  const [imagesData, setImagesData] = useState<ImageData[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImages[]>([]);
  const [machineLogs, setMachineLogs] = useState([]);

  const addImageRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const animateLoaderOut = () => {
    const loader = document.querySelector(".loader-container");
    loader?.classList.remove("animate-in");
    loader?.classList.add("animate-out");

    setTimeout(() => {
      setIsLoading(false);
    }, 320);
  };

  const [showImage, setShowImage] = useState(Array(imageCount).fill(true));
  const [imageOperations, setImageOperations] = useState<string[]>(Array(imageCount).fill("N/A"));


  const removeImage = (index: number) => {
    setImagesData((prevImagesData) => prevImagesData.filter((_, idx) => idx !== index));
    setShowImage((prevShowImage) => prevShowImage.map((item, idx) => idx === index ? false : item));
    setImageOperations((prevImageOperations) => prevImageOperations.filter((_, idx) => idx !== index));
  };
  
  
  


  const addImage = () => {
    setImageCount((prevCount) => prevCount + 1);
    setShowImage((prevShowImage) => [...prevShowImage, true]);
    setProcessedImages([]); // Clear processed images when adding new image
    if (addImageRef.current) {
      setTimeout(() => {
        addImageRef.current!.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };

  


  
  const sanitizeFilename = (filename:string) => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, "");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      imagesData.forEach(({ image }, index) => {
        const operation = imageOperations[index]; // Get current operation for this image
        const sanitizedFilename = sanitizeFilename(image.name);
        // Extract file extension
        const fileExtension = sanitizedFilename.split('.').pop();
        // Generate unique filename with index
        const indexedFilename = `${sanitizedFilename.split('.')[0]}_${index}.${fileExtension}`;
        const sanitizedFile = new File([image], indexedFilename, { type: image.type });
        formData.append("images", sanitizedFile);
        formData.append("operations", operation);
      // Print filename and information sent to the server
      console.log("Sending file to server:", indexedFilename);
      console.log("Operation:", operation);
      });



      config.apiUrl + "upload";
      const response = await axios.post(`${config.apiUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      });

      console.log("Response:", response.data);
      const finalImages = response.data.images.map(
        async (imageUrl: string, index: number) => {
          // Fetch each image
          const url = `${config.apiUrl}/results/${imageUrl}`;
          const imageResponse = await axios.get(url, {
            responseType: "blob", // Ensure binary response
          });

          const originalImageName = imageUrl;
          const imageFile = new File([imageResponse.data], originalImageName, {
            type: "image/png",
          });

          return { image: imageFile, operation: "N/A" };
        }
      );

      const processedImages = await Promise.all(finalImages);

      setProcessedImages(processedImages);
      const machineLogs = response.data.machine_logs;
      setMachineLogs(machineLogs);

      // processedImages.forEach(async (processedImage) => {
      //   await axios.delete(
      //     `http://40.71.40.201/delete/${processedImage.image.name}`
      //   );
      // });

      setIsLoading(false);
      NODES.forEach(async (node) => {
        await axios.delete(
          `${config.apiUrl}/delete_files_from_nodes/${node}`
        );
      });

      //animateLoaderOut();
      // setImagesData([]);
      // setProcessedImages([]);
    } catch (error) {
      //animateLoaderOut();
      console.error("Error uploading images:", error);
    }
      // Fetch logs after handleSubmit completes
      //fetchLogs();
  };

//   const fetchLogs = async () => {
//   try {
//     const response = await axios.get(`${config.apiUrl}/logs`);
//     setMachineLogs(response.data.logs);
//   } catch (error) {
//     console.error('Error fetching logs:', error);
//   }
// };

// useEffect(() => {
//   // Fetch logs immediately when the component mounts
//   fetchLogs();
// }, []);

  const handleImageUpload = (data: ImageData, index: number) => {
    setImagesData((prevImagesData) => {
      const existingIndex = prevImagesData.findIndex(
        (imageData, idx) => idx === index
      );
      if (existingIndex !== -1) {
        const updatedImagesData = [...prevImagesData];
        updatedImagesData[existingIndex] = data;
        return updatedImagesData;
      } else {
        return [...prevImagesData, data];
      }
    });
  
    setImageOperations((prevImageOperations) => {
      const updatedOperations = [...prevImageOperations];
      updatedOperations[index] = data.operation;
      return updatedOperations;
    });
  };
  

  return (
    <>
      <section className='site-padding py-20'>
        <div className='container flex gap-4'>
          <div className=' w-9/12'>
            <h2 className='text-4xl font-bold'>Basic Image Processing</h2>

            <div onSubmit={handleSubmit}>
              {[...Array(imageCount)].map((_, index) => (
                showImage[index] && (
                <div key={index} className='image-upload-container'>
                <AddImage
                  index={index}
                  onImageUpload={(data) => handleImageUpload(data, index)}
                  processedImages={processedImages}
                />
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='text-red-500 font-semibold'
                   disabled = {isLoading}
                >
                  Remove Image
                </button>
              </div>
              )
              ))}
              <div ref={addImageRef}></div>

              <div className='flex justify-between items-center gap-6 mt-6'>
                <button
                  type='button'
                  onClick={addImage}
                  disabled = {isLoading}
                  className='text-black font-semibold bg-white rounded-lg shadow-lg p-3 w-full'
                >
                  Add Image
                </button>
                <button
                  onClick={handleSubmit}
                  type='button'
                  className='text-white font-semibold bg-black rounded-lg shadow-lg p-3 w-full'
                  disabled = {isLoading}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div className='w-3/12'>
            <h2 className='text-4xl font-bold'>Logs</h2>
            <div className='bg-white p-4 rounded-lg shadow-lg mt-6'>
              {machineLogs.length > 0 ? (
                <ul>
                  {machineLogs.map((log, idx) => (
                     <li key={idx} className='text-green-500 font-semibold'>{log}</li>
                  ))}
                </ul>
              ) : (
                <p>Logs will appear here</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BasicPage;
