import React from "react";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Header, Content, Footer } = Layout;

export const NavbarHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          padding: "0 200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        theme="light"
      >
        <h3 style={{ color: "#fafafa" }}>Celestia | MultiSender</h3>
        {/* <Button>Connect Wallet</Button>
         */}
         <ConnectButton />
      </Header>
    </Layout>
  );
};
