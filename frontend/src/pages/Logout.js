import { Layout, Divider, Button, Space } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

function Logout() {
	const onClick = () => {
		
	};

	return (
		<Layout style={{ padding: '24px 24px 0' }}>
			<PageHeader
				title="Account"
			>
			</PageHeader>
			<Divider style={{ margin: '10px 0' }}></Divider>
			<Space direction='vertical' style={{ padding: '14px 14px 0' }}>
				<Button danger type="primary" onClick={onClick}>
					Logout
				</Button>
			</Space>
		</Layout>
	)
};


export default Logout;