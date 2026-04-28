import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/nav'
import { HomePage } from '@/pages/home'
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
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
