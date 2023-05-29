import { useState, useEffect, useRef } from 'react';
import { Layout, Input, Space, Tag, Divider, Form, Table } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { fetchAuth } from '../utils';
const { Search } = Input;

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Product ID', dataIndex: 'id' },
  { title: 'TW price', dataIndex: 'priceTW' },
  { title: 'JP price', dataIndex: 'priceJP' },
  { title: 'URL', dataIndex: 'url' }
];

function HomeForm() {
  const isInit = useRef(true);
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // skip first run
    if (isInit.current) {
      isInit.current = false;
      return;
    }
    // fetch api and set data
    fetchAuth('/allRoutes/search', fields)
      .then((resdata) => {setData(resdata);})
      .catch((error) => {console.log('failed to fetch search api.');});
  }, [fields]);

  return (
    <Space direction='vertical'>
      <Form
        name="search"
        layout="inline"
        onFieldsChange={(_, allFields) => {
          setFields({name: allFields[0].value});
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
