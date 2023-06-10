import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Space, Tag, Divider, Table, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { fetchGet, strToNum } from '../utils';

const rate = 0.21980643 // should fetch

function FavList() {
  const [data, setData] = useState([]);

  const onLoad = () => {
    fetchGet('/item/userItem', true,  {})
      .then((resdata) => {setData(resdata);})
      .catch((error) => {console.log('failed to fetch userItem api.');});
  };

  useEffect(() => {
    onLoad();
  }, []) // run once load


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
            console.log('remove');
        }
        return (
          <Button onClick={onClick} danger>
            Remove
          </Button>
        );
      }
    }
  ];

  return (
    <Space direction='vertical'>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          y: '250px',
        }}
      />
    </Space>
  );

};

function Fav() {
  const hint = "Remove items from list by clicking on the remove button."
  return (
    <Layout style={{ padding: '24px 24px 0'}}>
      <PageHeader
        title="Favorite list"
        subTitle="UNIQLO product price difference"
      >
        {hint}
      </PageHeader>
      <Divider style={{margin: '10px 0'}}></Divider>
      <FavList />
    </Layout>
  );
};


export default Fav;
