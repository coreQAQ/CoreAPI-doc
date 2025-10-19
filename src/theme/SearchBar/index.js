import React, { useState, useCallback } from 'react';
import { AutoComplete, Input, Spin, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

const { Text } = Typography;

// 模拟搜索接口
function mockSearchApi(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) return resolve([]);
      const data = [
        {
          value: '/docs/intro',
          label: {
            title: `关于 <em>${query}</em> 的介绍`,
            content: `这是文档的 <em>${query}</em> 章节，包含基础内容。`,
          },
        },
        {
          value: '/docs/api',
          label: {
            title: `<em>${query}</em> 接口文档`,
            content: `详细说明系统的 <em>${query}</em> API 参数与返回值。`,
          },
        },
        {
          value: '/docs/design',
          label: {
            title: `<em>${query}</em> 设计规范`,
            content: `讲解 <em>${query}</em> 的设计理念与原则。`,
          },
        },
      ];
      resolve(data);
    }, 600);
  });
}

export default function ExpandingSearchBox() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // 高亮渲染
  const renderHighlighted = (html) => (
    <span
      dangerouslySetInnerHTML={{
        __html: html.replace(/<em>/g, '<mark>').replace(/<\/em>/g, '</mark>'),
      }}
    />
  );

  // 防抖搜索
  const handleSearch = useCallback(
    debounce(async (value) => {
      if (!value) return setOptions([]);
      setLoading(true);
      const results = await mockSearchApi(value);
      setOptions(results);
      setLoading(false);
    }, 300),
    []
  );

  const handleSelect = (value) => {
    window.location.href = value;
  };

  const formattedOptions = options.map((opt) => ({
    value: opt.value,
    label: (
      <Space direction="vertical" size="small">
        <Text strong>{renderHighlighted(opt.label.title)}</Text>
        <Text type="secondary">{renderHighlighted(opt.label.content)}</Text>
      </Space>
    ),
  }));

  return (
    <AutoComplete
      popupMatchSelectWidth={420}
      style={{
        width: focused ? 420 : 180,
        transition: 'width 0.3s ease',
      }}
      options={formattedOptions}
      onSearch={handleSearch}
      onSelect={handleSelect}
      notFoundContent={loading ? <Spin size="small" /> : '无结果'}
      filterOption={false}
    >
      <Input
        size="middle"
        placeholder="搜索文档..."
        prefix={<SearchOutlined />}
        allowClear
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </AutoComplete>
  );
}
