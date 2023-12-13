// LoadingOverlay.js
import React from 'react';
import styled from 'styled-components';
import { Space, Spin } from 'antd';

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingOverlay = () => {
  return (
    <OverlayContainer>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </OverlayContainer>
  );
};

export default LoadingOverlay;
