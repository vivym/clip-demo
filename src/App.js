import { useState } from 'react';
import { Layout, Row, Col, Card, Input, Button, Empty, Upload, Image, Spin, List, Avatar, message } from 'antd';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons';
import { searchImagesByText} from './api';

import './App.less';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Dragger } = Upload;

const tabList = [
  { key: 'text2image', tab: '文本->图像' },
  { key: 'image2text', tab: '图像->文本' },
];

const defaultText = 'A man is in a kitchen making a pizza.';

function ImageResultsGallery({results}) {
  return (
    <Image.PreviewGroup>
      {results.map(({ image_url, image_id }) => (
        <Image
          width={200}
          src={image_url}
          key={image_id}
          fallback="data:image/png;base64,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"
        ></Image>
      ))}
    </Image.PreviewGroup>
  );
}

function TextResultsGallery({ results }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={results}
      renderItem={({ entity, _similarity }, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{index + 1}</Avatar>}
            title={entity}
            description={_similarity.toFixed(4)}
          />
        </List.Item>
      )}
    />
  );
}

function Text2ImageTab() {
  const [inputText, setInputText] = useState(defaultText);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const results = await searchImagesByText(inputText);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
        setSearchResults(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Card title="输入文本" bordered={false}>
        <TextArea rows={4} showCount maxLength={1000} value={inputText} onChange={e => setInputText(e.target.value)} />
        <br />
        <div className="search-btn-wrapper">
          <Button
            type="primary"
            shape="round"
            icon={<SearchOutlined />}
            onClick={onClick}
          >
            查询
          </Button>
        </div>
      </Card>

      <Card title="结果" loading={loading}>
        {searchResults === null ? <Empty /> : <ImageResultsGallery results={searchResults} />}
      </Card>
    </div>
  );
}

function Image2TextTab() {
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const beforeUpload = file => {
    if (file.type.indexOf("image") === -1) {
      message.error(`只支持图片文件: ${file.name}`);
      return Upload.LIST_IGNORE;
    }
    setPreviewImageURL(window.URL.createObjectURL(file));
    return true;
  };

  const onChange = ({ file }) => {
    if (file.status === "uploading") {
      setUploading(true);
    } else if (file.status === "done") {
      setUploading(false);
      const rsp = file.response;
      if (rsp.code === 0) {
        const sorted_sentences = rsp.data.sort((a, b) => b._similarity - a._similarity);
        setSearchResults(sorted_sentences);
      } else {
        console.error(rsp);
      }
    }
  };

  return (
    <div>
      <Dragger
        name="image"
        multiple={false}
        action="https://api.kg.sota.wiki/v1/entities"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onChange}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">查询文本实体</p>
        <p className="ant-upload-hint">点击上传图片文件</p>
      </Dragger>

      {
        previewImageURL && (
          <div className="preview-image-wrapper">
            <Spin spinning={uploading}>
              <Image width={200} src={previewImageURL} />
            </Spin>
          </div>
        )
      }

      <br />

      <Card title="结果" loading={uploading}>
        {searchResults === null ? <Empty /> : <TextResultsGallery results={searchResults} />}
      </Card>
    </div>
  );
}

function App() {
  const [activeTabKey, setActiveTabKey] = useState('text2image');
  // const [tabLoading, setTabLoading] = useState(false);

  const onTabChange = async (key) => {
    setActiveTabKey(key);
  };

  return (
    <Layout>
      <Header></Header>
      <Content>
        <Row justify="center">
          <Col span={22}>
            <Card
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={onTabChange}
              // loading={tabLoading}
            >
              {activeTabKey === 'text2image' ? <Text2ImageTab /> : <Image2TextTab />}
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>demo</Footer>
    </Layout>
  );
}

export default App;
