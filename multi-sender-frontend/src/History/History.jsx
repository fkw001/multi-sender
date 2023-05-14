import React from "react";
import { Collapse, List } from "antd";

const { Panel } = Collapse;

export const getTime = (time) => {
  return `${new Date(Number(time)).toLocaleDateString()} ${new Date(
    Number(time)
  ).toLocaleTimeString()}`;
};

const renderHeader = (address, time) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>
        <strong>Wallet</strong>: {address || ""}
      </div>
      <div>
        <strong>Time</strong>: {getTime(time || new Date().getTime())}
      </div>
      <div style={{ color: "" }}>
        <strong>Status</strong>: Success
      </div>
    </div>
  );
};

export const History = ({ history }) => {
  return history?.length > 0 ? (
    <Collapse defaultActiveKey={["1"]}>
      {history.map((itemHistory, index) => {
        return (
          <Panel
            header={renderHeader(itemHistory?.address, itemHistory?.time)}
            key={index}
          >
            <div>
              <strong>Transaction Hash</strong>: {itemHistory.hash}
            </div>
            Detail:
          </Panel>
        );
      })}
    </Collapse>
  ) : (
    <div style={{ textAlign: "center" }}>No found transaction</div>
  );
};
