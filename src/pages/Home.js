import { useState, useEffect, useRef } from 'react';
import { Layout, Input, Space, Tag, Divider, Form, Table } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

const { Search } = Input;

const serverAPI = '';

function CustomizedForm({ onChange }) {
  return (
    <Form
      layout="inline"
      onFieldsChange={(_, allFields) => {
        onChange(allFields);
      }}
    >
      <Form.Item data-testid='search' name="search" style={{width: '50%'}}>
        <Search
          placeholder="Search by keyword or product ID."
          size="middle"
          allowClear
        />
      </Form.Item>
    </Form>
  );
};

function HomeForm() {
  const isInit = useRef(true);
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Product ID', dataIndex: 'id' },
    { title: 'TW price', dataIndex: 'priceTW' },
    { title: 'JP price', dataIndex: 'priceJP' },
    { title: 'URL', dataIndex: 'url' }
  ];

  useEffect(() => {
    // skip first run
    if (isInit.current) {
      isInit.current = false;
      return;
    }
    // fetch api and set data
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': token
      },
      body: JSON.stringify(fields)
    };
    fetch(serverAPI, requestOptions)
      .then((res) => res.json())
      .then((data) => { setData(data);});
  }, [fields]);

  return (
    <Space direction='vertical'>
      <CustomizedForm
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          y: '190px',
          scrollToFirstRowOnChange: true
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
  const hint = "Search for the product difference by typing the keyword or the product ID."
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
