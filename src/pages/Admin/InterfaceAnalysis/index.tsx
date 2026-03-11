import { PageContainer } from '@ant-design/pro-components';
import { Card, Spin, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { listTopInvokeInterfaceInfoUsingGet } from '@/services/api-backend/analysisController';

const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      listTopInvokeInterfaceInfoUsingGet().then((res) => {
        if (res.data) {
          setData(res.data);
        }
        setLoading(false);
      });
    } catch (e: any) {
      setLoading(false);
    }
  }, []);

  // 【修复点】映射逻辑：后端返回的是 interfaceName
  const chartData = data.map((item) => {
    return {
      value: item.totalNum,
      name: item.interfaceName, // 注意这里要改用 interfaceName
    };
  });

  const option = {
  title: {
    text: '接口调用 Top 3 统计',
    subtext: '实时数据分析',
    left: 'center',
    top: '20', // 距离容器顶部 20px
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle', // 图例居中对齐，不跟顶部标题挤在一起
  },
  series: [
    {
      name: '接口调用次数',
      type: 'pie',
      // center 调整：[水平, 垂直]。把垂直中心下移到 60%，给标题腾位置
      center: ['50%', '60%'], 
      // radius 调整：稍微缩小一点，增加外部留白
      radius: ['40%', '65%'], 
      avoidLabelOverlap: true, // 核心：开启防重叠
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        // 使用 formatter 让标签显示更丰富，且不容易挤在一起
        formatter: '{b}\n{c}次 ({d}%)', 
      },
      data: chartData,
    },
  ],
};

  return (
    <PageContainer title="接口统计分析">
      <Card 
        style={{ marginTop: 20, borderRadius: 8 }} 
        bodyStyle={{ padding: '40px' }}
      >
        <Spin spinning={loading}>
          {data.length > 0 ? (
            <ReactECharts 
              option={option} 
              style={{ height: '400px', width: '100%' }} 
              lazyUpdate={true}
            />
          ) : (
            <Empty description="暂无分析数据" />
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default InterfaceAnalysis;