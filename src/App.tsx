import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/nav'
import { HomePage } from '@/pages/home'
import { PreviewPage } from '@/pages/preview'
import { isTenantHost } from '@/lib/env'

function App() {
  const tenantHost = isTenantHost()

  return (
    <BrowserRouter>
      {!tenantHost && <Nav />}
      <main>
        <Routes>
          <Route
            path="/"
            element={tenantHost ? <Navigate to="/preview" replace /> : <HomePage />}
          />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
