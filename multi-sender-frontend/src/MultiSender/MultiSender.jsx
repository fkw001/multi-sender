import React, { useState } from "react";
import { Button, Form, Input, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea";
import { senderMulti } from "../utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DraggerFile from "../DraggerFile/DraggerFile";
import {
  getLocalStorageHistory,
  setLocalStorageHistory,
} from "../utils/saveStorage";

//const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/BesuMrfyScqR0XjZMezVgr2c_f5DSWXl')

const MyFormItemContext = React.createContext([]);
function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const keyStorage = "history-key";

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} {...props} />;
};

const TextAreaWallet = () => (
  <MyFormItem name="wallet" style={{ margin: 0 }}>
    <TextArea
      rows={10}
      placeholder="Example:&#10;0x7871b5E24Aa2348969DF8af4dacCF77C3cd5D37E,0.9&#10;0x643BC9Ce08f1E40E8E607Af0743B10C27d1A4aCB,0.008&#10;0x786bC3C12014760A5c3BcDAF471FbEF64061dc96,1.23"
    />
  </MyFormItem>
);

export const MultiSender = ({ setHistory }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [err, setSrr] = useState([]);

  const setTextarea = (value) => {
    const oldValue = form.getFieldValue("wallet");
    if (!oldValue) {
      form.setFieldsValue({ wallet: value });
    } else {
      form.setFieldsValue({ wallet: `${oldValue}\n${value}` });
    }
  };

  const feature = [
    {
      id: "112",
      label: "Addresses with amounts, separated with comma",
      component: <TextAreaWallet />,
    },
    {
      id: "213",
      label: "Upload file",
      component: (
        <DraggerFile
          fileList={fileList}
          setFileList={setFileList}
          setTextarea={setTextarea}
        />
      ),
    },
  ];

  const onFinish = async (value) => {
    const dataSender = await senderMulti(value.wallet.split("\n"));
    if (!dataSender.isValid) {
      setSrr(dataSender.data);
    } else {
      setHistory((prev) => {
        const newHistory = [...prev, dataSender.data];
        setLocalStorageHistory(keyStorage, newHistory);
        return newHistory;
      });
      setSrr([]);
    }
  };

  return (
    <Form
      form={form}
      name="form_item_path"
      layout="vertical"
      onFinish={onFinish}
      className="form-sender"
    >
      <Tabs
        style={{ marginBottom: 24 }}
        defaultActiveKey="1"
        centered
        items={feature.map((item) => ({
          label: item.label,
          key: item.id,
          children: item.component,
        }))}
      />

      {err.length > 0 && (
        <div style={{ paddingBottom: 20 }}>
          <h3 style={{ color: "#DC355B", paddingBottom: 10, margin: 0 }}>
            Line error:
          </h3>
          <div style={{ background: "#FFE5E3", padding: 20, borderRadius: 10 }}>
            {err.map((item) => (
              <div
                style={{ color: "#DC355B" }}
              >{`Line ${item.line}: ${item.message}`}</div>
            ))}
          </div>
        </div>
      )}

      <Button type="primary" htmlType="submit">
        Send
      </Button>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Form>
  );
};
