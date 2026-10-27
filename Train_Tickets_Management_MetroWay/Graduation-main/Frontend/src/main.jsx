import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import viVN from 'antd/locale/vi_VN'

createRoot(document.getElementById('root')).render(
  <ConfigProvider
    locale={viVN}
    theme={{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 8,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      },
      algorithm: theme.defaultAlgorithm,
    }}
  >
    <AntdApp>
      <App />
    </AntdApp>
  </ConfigProvider>
)
