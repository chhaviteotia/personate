import React, { useState } from 'react';
import AWS from 'aws-sdk';

const UploadVideo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    const s3 = new AWS.S3({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'YOUR_S3_REGION',
    });
    
    const params = {
      Bucket: 'YOUR_BUCKET_NAME',
      Key: selectedFile.name,
      Body: selectedFile,
    };
    
    const options = {
      partSize: 10 * 1024 * 1024, // 10 MB per part
      queueSize: 5, // 5 concurrent parts
    };
    
    const uploader = s3.upload(params, options);
    
    uploader.on('httpUploadProgress', (progress) => {
      setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
    });
    
    try {
      await uploader.promise();
      console.log('Upload complete!');
    } catch (err) {
      console.error('Upload error:', err);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && <p>{uploadProgress}% complete</p>}
    </div>
  );
};

export default UploadVideo;

In this example, you'll need to replace the placeholders YOUR_ACCESS_KEY_ID, YOUR_SECRET_ACCESS_KEY, YOUR_S3_REGION, 
and YOUR_BUCKET_NAME with your own values. You'll also need to make sure that you have the AWS SDK for JavaScript installed
 in your project and properly configured.