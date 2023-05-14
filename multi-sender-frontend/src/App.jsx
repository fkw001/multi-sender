import React, { useState } from "react";
import "./App.scss";
import { NavbarHeader } from "./NavbarHeader/NavbarHeader";
import { MultiSender } from "./MultiSender/MultiSender";
import { History } from "./History/History";
import { Tabs } from "antd";
import { getLocalStorageHistory } from "./utils/saveStorage";

const keyStorage = "history-key";

function App() {
  const [history, setHistory] = useState(
    () => getLocalStorageHistory(keyStorage) || []
  );

  const tabApp = [
    {
      id: "1",
      label: "MultiSender",
      component: <MultiSender setHistory={setHistory} />,
    },
    { id: "2", label: "History", component: <History history={history} /> },
  ];

  return (
    <div className="App">
      <NavbarHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 1200,
            paddingTop: 100,
          }}
        >
          <h1 style={{ textAlign: "center", color: "#ff7875" }}>Multisender</h1>
          <Tabs
            defaultActiveKey="1"
            centered
            items={tabApp.map((item) => ({
              label: item.label,
              key: item.id,
              children: item.component,
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
