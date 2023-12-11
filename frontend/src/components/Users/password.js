import React from 'react';
import {  Input, Space } from 'antd';

export const Password = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  return (
    
      <Space direction="horizontal">
        <Input.Password
          placeholder="input password"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          style={{ width: '300px', maxWidth: '100%' }} 
        />
      </Space>
  );
};
