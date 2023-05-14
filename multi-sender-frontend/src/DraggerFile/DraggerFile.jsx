import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useMemo } from "react";
const { Dragger } = Upload;

const DraggerFile = ({ fileList, setFileList, setTextarea }) => {
  const validateFileType = ({ type, name }, allowedTypes) => {
    if (!allowedTypes) {
      return true;
    }

    if (type) {
      return allowedTypes.includes(type);
    }
  };

  const uploadProps = useMemo(
    () => ({
      beforeUpload: (file) => {
        const isAllowedType = validateFileType(file, [
          "text/csv",
          "text/plain",
        ]);
        if (!isAllowedType) {
          setFileList((state) => [...state]);
          message.error(`Invalid file input. Only accept csv and text file`);
          return false;
        }
        setFileList((state) => [...state, file]);
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (oFREvent) {
          setTextarea(oFREvent.target.result.replaceAll("\r\n", "\n"));
        };

        return false;
      },
      onRemove: (file) => {
        if (fileList.some((item) => item.uid === file.uid)) {
          setFileList((fileList) =>
            fileList.filter((item) => item.uid !== file.uid)
          );
          return true;
        }
        return false;
      },
    }),
    [fileList]
  );

  return (
    <Dragger {...uploadProps} accept=".csv,text/plain" fileList={fileList}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};
export default DraggerFile;
