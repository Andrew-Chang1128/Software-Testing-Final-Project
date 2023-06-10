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
import Home from './pages/Home';
import Fav from './pages/Fav';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { useToken } from './utils';

const { Header, Footer, Sider, Content } = Layout;

function AppSider() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider data-testid='sider' theme='light' collapsed={collapsed} style={{textAlign: 'center'}}>
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
        <Route path="/" element={<Home />}></Route>
        <Route path="/favorite" element={<Fav />}></Route>
        <Route path="/account" element={<Logout />}></Route>
      </Routes>
    </Content>
  );
};

function AppAuth() {
  return (
    <>
      <Header className="Header">
        <img src={logo} className="App-logo" alt="logo" />
      </Header>
      <Layout>
        <AppSider />
        <AppContent />
      </Layout>
      <Footer style={{textAlign: 'center'}}>
        Software Testing Final Project @ 2023
      </Footer>
    </>
  );
}

function App() {
  const [token, setToken] = useToken();
  if (!token) {
    return (
      <Layout className="App">
        <Login setToken={setToken} />
      </Layout>
    );
  }

  return (
    <Layout className='App'>
      <AppAuth />
    </Layout>
  );
}


export default App;
export { AppAuth };