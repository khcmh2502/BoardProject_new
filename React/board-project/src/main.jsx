import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './component/common/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* StrictMode :  React에서 개발 모드에서만 동작하는 도구.
    잠재적인 문제를 미리 알려주고 코드의 품질을 높이는 데 도움을 줌 */}
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
)
