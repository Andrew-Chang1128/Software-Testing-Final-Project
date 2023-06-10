import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Layout, Input, Space, Tag, Divider, Form, Table, message, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { fetchGet, strToNum } from '../utils';
const { Search } = Input;

const rate = 0.21980643 // should fetch

function HomeForm() {
  const [data, setData] = useState([]);
  const [msg, msgHolder] = message.useMessage();

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'TW Name',
      dataIndex: 'tw_name',
      key: 'tw_name',
      render: (e, d) => <Link to={d.tw_url}>{e}</Link>
    },
    {
      title: 'JP Name',
      dataIndex: 'jp_name',
      key: 'jp_name',
      render: (e, d) => <Link to={d.jp_url}>{e}</Link>
    },
    {
      title: 'ERD (TW-JP)',
      key: 'erd',
      render: (_, d) => {
        let diff = (strToNum(d.tw_price) - strToNum(d.jp_price)*rate).toFixed(2);
        let color = diff >= 0 ? 'green' : 'red';
        return (
          <Tag color={color}>
            {`NT$${diff}`}
          </Tag>
        );
      }
    },
    {
      title: 'TW Price',
      dataIndex: 'tw_price',
      key: 'tw_price'
    },
    {
      title: 'JP Price',
      dataIndex: 'jp_price',
      key: 'jp_price'
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (e) => {
        const onClick = () => {
          fetchGet('/item/addItem', true, {itemID: e})
            .then((res) => {msg.open({type: 'success', content: 'Success!'})})
            .catch((error) => {msg.open({type: 'error', content: 'Error!'})});
        }
        return (
          <Button onClick={onClick}>
            Add
          </Button>
        );
      }
    }
  ];
  
  const onLoad = () => {
    fetchGet('/item/all', false,  {})
      .then((resdata) => {setData(resdata);})
      .catch((error) => {msg.open({type: 'error', content: 'failed to fetch all api.'});});
  };

  const onFinish = (values) => {
    fetchGet('/item/search', false, values)
      .then((resdata) => {setData(resdata);})
      .catch((error) => {msg.open({type: 'error', content: 'failed to fetch search api.'});});
  };

  useEffect(() => {
    onLoad();
  }, []) // run once load

  return (
    <Space direction='vertical'>
      {msgHolder}
      <Form
        name="search"
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item data-testid='search' name="name" style={{width: '50%'}}>
          <Search
            placeholder="Search by product name."
            size="middle"
            allowClear
            autoComplete='false'
          />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          y: '190px',
        }}
      />
    </Space>
  );

};

function HomeTags() {
  return (
    <Space size={[0, 2]}>
      <Tag color="blue">TW</Tag>
      <Tag color="blue">JP</Tag>
    </Space>
  );
}

function Home() {
  const description = "Exchange Rate Difference (ERD) app is a tool for finding the ERD between TWD & JPY of the given UNIQLO products.";
  const hint = "Search for the product difference by typing the product name."
  return (
    <Layout style={{ padding: '24px 24px 0'}}>
      <PageHeader
        title="Search the item!"
        subTitle="UNIQLO product price difference"
        tags={<HomeTags />}
      >
        {description}
        <br></br>
        {hint}
      </PageHeader>
      <Divider style={{margin: '10px 0'}}></Divider>
      <HomeForm />
    </Layout>
  );
};


export default Home;
