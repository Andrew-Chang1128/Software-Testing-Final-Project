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
const { Header, Footer, Sider } = Layout;

function AppSider() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider data-testid='sider' theme='light' collapsed={collapsed} >
      <Button data-testid='button' onClick={toggleCollapsed} style={{ margin: 10, width: "-webkit-fill-available" }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu items={[
        {label: "Home", icon: <HomeOutlined />},
        {label: "Favorite", icon: <StarOutlined />},
        {label: "Account", icon: <UserOutlined />}
      ]}>
      </Menu>
    </Sider>
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
      </Layout>
      <Footer className='Content'>
        Software Testing Final Project @ 2023
      </Footer>
    </Layout>
  );
}


export default App;
