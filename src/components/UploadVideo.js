import React ,{useState, useCallback} from 'react';
import AWS from 'aws-sdk';
import "./UploadVideo.css";
import { useDropzone } from 'react-dropzone';
const S3_BUCKET ='chhavivideobucket2';
const REGION ='ap-southeast-2';

AWS.config.update({
    accessKeyId: 'AKIAV4Z4LD6JZV6EWCCN',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const UploadVideo = () => {
    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRunning, setIsRunning]= useState(false);
    
    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
      
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                console.log(file)
            // Do whatever you want with the file contents
              const binaryStr = reader.result
              console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
          })
          
        }, [])
    

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const uploadFile = (file) => {
    console.log(file)
    setIsRunning(true)
        const params = {
            ACL: "public-read",
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }

    return <div >
        <div className='progressbar'><p>You can Upload video here</p>
        <p style={{fontSize:"20px"}}>Click on Button to upload video</p>
        <div style ={{height:"70%",width:`${progress}%`, backgroundColor:"blue", transition:"width 0.4s"}}>
        <span style={{textAlign:"center"}}>{progress}%</span>
        </div>
        
        <input type="file" onChange={handleFileInput}/>
        <button className='upload-btn' onClick={() => uploadFile(selectedFile)}> Upload Video</button>
        <div {...getRootProps()}>
        <input  {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
            }
      </div>

        </div>
        
    </div>
}

export default UploadVideo;