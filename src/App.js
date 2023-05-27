import logo from "./logo.svg"
import './App.css';
import { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;

function AppSider() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider data-testid='sider' theme='light' collapsed={collapsed} >
      <Button data-testid='button' onClick={toggleCollapsed} style={{ margin: 10, width: "-webkit-fill-available" }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        onClick={({key}) => {navigate(key);}}
        selectedKeys={[location.pathname]}
        items={[
          {label: "Home", key: "/", icon: <HomeOutlined />},
          {label: "Favorite", key: "/favorite", icon: <StarOutlined />},
          {label: "Account", key:"/account", icon: <UserOutlined />}
        ]}
      ></Menu>
    </Sider>
  );
};

function AppContent() {
  return (
    <Content>
      <Routes>
        <Route path="/" element={<div>home</div>}></Route>
        <Route path="/favorite" element={<div>fav</div>}></Route>
        <Route path="/account" element={<div>acc</div>}></Route>
      </Routes>
    </Content>
  );
};

function App() {
  return (
    <Layout className='App'>
      <Header className="Header">
        <img src={logo} className="App-logo" alt="logo" />
      </Header>
      <Layout className='Content'>
        <AppSider />
        <AppContent />
      </Layout>
      <Footer className='Content'>
        Software Testing Final Project @ 2023
      </Footer>
    </Layout>
  );
}


export default App;
