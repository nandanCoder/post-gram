import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  // get the file url
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  // that use state to store filr and multiple files
  const [file, setFile] = useState<File[]>([]);

  // use a pakage help to get drag and drop funcation call dropzone
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "img/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3  rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer " />
      {fileUrl ? (
        <>
          <div className="flex flex-1 w-full justify-center p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploder-png" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file uploder"
            height={77}
            width={96}
          />
          <h3 className="base-medium text-light-2 mt-6 mb-2">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
