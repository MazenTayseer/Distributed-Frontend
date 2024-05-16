"use client";

import AddImageAdvanced from "@components/AddImageAdvanced";
import { useRef, useState } from "react";
import axios from "axios";
import "@styles/loader.css";

interface ImageData {
  image: File;
  operation: string;
}

interface ProcessedImages {
  image: File;
  operation: string;
}

const NODES = ["master001", "node001"];

const AdvanvedPage = () => {
  const [imageCount, setImageCount] = useState(1);
  const [imagesData, setImagesData] = useState<ImageData[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImages[]>([]);
  const [predictions, setPredictions] = useState<Record<string, []>>({});
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

  const addImage = () => {
    setImageCount((prevCount) => prevCount + 1);
    if (addImageRef.current) {
      setTimeout(() => {
        addImageRef.current!.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      imagesData.forEach(({ image, operation }) => {
        formData.append("images", image);
        formData.append("operations", operation);
      });

      const response = await axios.post(
        "http://40.71.40.201/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      console.log("Response:", response.data);
      const finalImages = response.data.images.map(
        async (imageUrl: string, index: number) => {
          // Fetch each image
          const url = `http://40.71.40.201/results/${imageUrl}`;
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

      const preds = response.data.predictions;
      setPredictions(preds);

      // processedImages.forEach(async (processedImage) => {
      //   await axios.delete(
      //     `http://40.71.40.201/delete/${processedImage.image.name}`
      //   );
      // });

      NODES.forEach(async (node) => {
        await axios.delete(
          `http://40.71.40.201/delete_files_from_nodes/${node}`
        );
      });

      animateLoaderOut();
      // setImagesData([]);
      // setProcessedImages([]);
    } catch (error) {
      animateLoaderOut();
      console.error("Error uploading images:", error);
    }
  };

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
  };

  return (
    <>
      {isLoading && (
        <div className='loader-container animate-in'>
          <div className='loader'></div>
        </div>
      )}

      <section className='site-padding py-20'>
        <div className='container flex gap-4'>
          <div className='w-9/12'>
            <h2 className='text-4xl font-bold'>Advanced Image Processing</h2>
            <div onSubmit={handleSubmit}>
              {[...Array(imageCount)].map((_, index) => (
                <AddImageAdvanced
                  key={index}
                  index={index}
                  onImageUpload={handleImageUpload}
                  processedImages={processedImages}
                  predictions={predictions}
                />
              ))}
              <div ref={addImageRef}></div>

              <div className='flex justify-between items-center gap-6 mt-6'>
                {/* <button
                type='button'
                onClick={addImage}
                className='text-black font-semibold bg-white rounded-lg shadow-lg p-3 w-full'
              >
                Add Image
              </button> */}
                <button
                  onClick={handleSubmit}
                  type='button'
                  className='text-white font-semibold bg-black rounded-lg shadow-lg p-3 w-full'
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
                    <li key={idx} className=' text-green-500 font-semibold'>{log}</li>
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

export default AdvanvedPage;
