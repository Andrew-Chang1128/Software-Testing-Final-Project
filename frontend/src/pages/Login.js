import { Row, Col, Input, Form, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUnAuth } from '../utils';

function LoginForm({ setToken }) {
  const [msg, msgHolder] = message.useMessage();
  const displayError = () => {
    msg.open({
      type: 'error',
      content: 'Failed to login!',
    });
  };

  return (
    <Form
      name="login"
      requiredMark={false}
      onFinish={(values) => {
        fetchUnAuth('/user/login', values)
          .then((res) => {setToken(res);})
          .catch((error) => {displayError()});
      }}
    >
      {msgHolder}
      <Form.Item
        name="username"
        label="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: '100%'}}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}

function Auth({ setToken }) {
  return(
    <Row align={'middle'} justify={'center'} style={{minHeight: '100vh'}}>
      <Col>
        <LoginForm setToken={setToken}/>
      </Col>
    </Row>
  );
};

export default Auth;
export { LoginForm };