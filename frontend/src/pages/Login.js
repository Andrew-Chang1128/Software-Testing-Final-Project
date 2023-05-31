import { Row, Col, Input, Form, Button, message, Modal, Divider, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUnAuth } from '../utils';
import { useState } from 'react';

function CMField({ fieldName, type, Icon }) {
  return (
    <Form.Item
      name={fieldName}
      label={fieldName}
      rules={[
        {
          required: true,
          message: `Please input your ${fieldName}!`,
        },
      ]}
    >
      <Input
        prefix={Icon}
        autoComplete="off"
        type={type}
      />
    </Form.Item>
  );
};

function CMForm({ formName, onFinish }) {
  return (
    <Form
      name={formName}
      onFinish={onFinish}
      preserve={false}
      requiredMark={false}
    >
      <CMField fieldName={"username"} type="text" Icon={<UserOutlined />}/>
      <CMField fieldName={"password"} type="password" Icon={<LockOutlined />}/>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: '100%'}}>
          {formName}
        </Button>
      </Form.Item>
    </Form>
  );
};

function RegisterForm({ open, hideModal }) {
  const [msg, msgHolder] = message.useMessage();
  const displayError = () => {
    msg.open({
      type: 'error',
      content: 'Failed to register!',
    });
  };
  const displaySuccess = () => {
    msg.open({
      type: 'success',
      content: 'Success!',
    });
  };
  const onFinish = (values) => {
      fetchUnAuth('/user/createUser', values)
        .then((res) => {displaySuccess()})
        .catch((error) => {displayError()});
  };

  return (
    <Modal
      title="Register"
      open={open}
      onCancel={hideModal}
      footer={null}
      destroyOnClose
    >
      {msgHolder}
      <CMForm
        formName="Register"
        onFinish={onFinish}
      />
    </Modal>
  );
};

function LoginForm({ setToken }) {
  const [msg, msgHolder] = message.useMessage();
  const displayError = () => {
    msg.open({
      type: 'error',
      content: 'Failed to login!',
    });
  };
  const onFinish = (values) => {
      fetchUnAuth('/user/login', values)
        .then((res) => {setToken(res);})
        .catch((error) => {displayError()});
  };

  return (
    <>
      <Typography.Title level={3} style={{padding: '10px'}}>Login</Typography.Title>
      {msgHolder}
      <CMForm
        formName="Login"
        onFinish={onFinish}
      />
    </>
  );
}

function Auth({ setToken }) {
  const [open, setOpen] = useState(false);
  const openModal = () => {setOpen(true)};
  const hideModal = () => {setOpen(false)};
  return(
    <Row align={'middle'} justify={'center'} style={{minHeight: '100vh'}}>
      <Col align={'center'}>
        <LoginForm setToken={setToken}/>
        <Divider plain>or</Divider>
        <Button onClick={openModal} style={{width: '100%'}}>Create Account</Button>
        <RegisterForm open={open} hideModal={hideModal} />
      </Col>
    </Row>
  );
};

export default Auth;
export { LoginForm, RegisterForm, CMForm };