import "@styles/image-input.css";
import { motion } from "framer-motion";
import { useState, ChangeEvent, useEffect } from "react";

interface ProcessedImages {
  image: File;
  operation: string;
}

interface AddImageProps {
  onImageUpload: (
    data: { image: File; operation: string },
    index: number
  ) => void;
  processedImages: ProcessedImages[];
  predictions: Record<string, []>;
  index: number;
}

const AddImageAdvanced = ({
  onImageUpload,
  processedImages,
  predictions,
  index,
}: AddImageProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedOperation, setSelectedOperation] =
    useState<string>("classification");

  const [ImageBeforeSrc, setImageBeforeSrc] = useState<string>(
    "/assets/placeholder.png"
  );
  const [ImageAfterSrc, setImageAfterSrc] = useState<string>(
    "/assets/placeholder.png"
  );


  
  useEffect(() => {
    if (imageFile) {
      const sanitizedFilename = sanitizeFilename(imageFile.name);
      const matchingProcessedImage = processedImages.find(
        (processedImage) => processedImage.image.name === sanitizedFilename
      );
  
      if (matchingProcessedImage) {
        setImageAfterSrc(URL.createObjectURL(matchingProcessedImage.image));
      }
      
  
      if (predictions.hasOwnProperty(sanitizedFilename)) {
        const imagePredictions = predictions[sanitizedFilename];
        const predsUl = document.querySelector(".predictions");
  
        while (predsUl?.firstChild) {
          predsUl.removeChild(predsUl.firstChild);
        }
  
        imagePredictions.forEach((prediction, index) => {
          const li = document.createElement("li");
          const confidence = parseFloat(prediction[1]);
          const confidencePercentage = (confidence * 100).toFixed(0);
  
          li.innerHTML = `${index + 1}. ${prediction[0]} - ${confidencePercentage}%`;
          predsUl?.appendChild(li);
        });
      }
    }
  }, [imageFile, processedImages, predictions]);


  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, "");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageBeforeSrc(URL.createObjectURL(file));
      onImageUpload({ image: file, operation: selectedOperation }, index);
    }
  };

  const handleOperationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperation(event.target.value);
    if (imageFile != null) {
      onImageUpload({ image: imageFile, operation: event.target.value }, index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className='flex justify-center items-center gap-12 mt-6 bg-white p-5 rounded-xl shadow-lg'
    >
      <div className='flex flex-col w-full gap-4 max-w-sm'>
        <input
          type='file'
          accept='image/*'
          required
          onChange={handleFileChange}
        />

        <select
          className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          value={selectedOperation}
          onChange={handleOperationChange}
        >
          <option value='classification'>Classification</option>
        </select>
      </div>

      <label className='text-center text-xl font-semibold w-full'>
        Before
        <img
          src={ImageBeforeSrc}
          alt='image'
          className='rounded-lg shadow-lg object-cover w-96 img-before'
        />
      </label>

      <div className='mt-6 w-full self-start bg-gray-100 p-3 rounded-lg'>
        <p className='font-semibold text-2xl'>Our Top 3 Predictions</p>
        <ul className='predictions italic text-lg'>
          <li>See Predictions Here</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AddImageAdvanced;
