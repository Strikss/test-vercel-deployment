import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/nav'
import { HomePage } from '@/pages/home'
import { DeployButtonPage } from '@/pages/deploy-button'
import { DeployApiPage } from '@/pages/deploy-api'
import { PreviewPage } from '@/pages/preview'
import { readInstanceConfig } from '@/lib/env'

function App() {
  const instance = readInstanceConfig()
  const isInstanceMode = instance !== null

  return (
    <BrowserRouter>
      {!isInstanceMode && <Nav />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              isInstanceMode ? <Navigate to="/preview" replace /> : <HomePage />
            }
          />
          <Route path="/deploy-button" element={<DeployButtonPage />} />
          <Route path="/deploy-api" element={<DeployApiPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
