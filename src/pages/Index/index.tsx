import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { List, message, Card } from 'antd';
import { listInterfaceInfoByPageUsingGet } from '@/services/api-backend/interfaceInfoController';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGet({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="在线接口开放平台">
      <List
        className="my-list"
        loading={loading}
        // 1. 移除 itemLayout="horizontal"
        // 2. 添加 grid 属性，让它根据屏幕宽度自动排列卡片
        grid={{
          gutter: 16, // 卡片之间的间距
          xs: 1,      // 手机屏幕一行 1 个
          sm: 2,      // 平板一行 2 个
          md: 3,      // 桌面显示器一行 3 个
          lg: 3,
          xl: 4,      // 大显示器一行 4 个
          xxl: 4,
        }}
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item>
              {/* 用 Card 包裹每一项，效果会产生质的飞跃 */}
              <Card 
                hoverable // 鼠标悬浮时产生阴影
                title={<a href={apiLink}>{item.name}</a>}
                extra={<a href={apiLink}>查看</a>}
              >
                {/* 限制描述文本的高度和超出隐藏，保证卡片高度一致 */}
                <div style={{ height: 45, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.description || '暂无描述'}
                </div>
              </Card>
            </List.Item>
          );
        }}
        pagination={{
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
