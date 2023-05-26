import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import { MigrationContextProvider } from './contexts/context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ConnectionPage from './pages/ConnectionPage'
import MigrationPage from './pages/MigrationPage'
import TransformationPage from './pages/TransformationPage'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MigrationContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ConnectionPage />} path="/" />
          <Route element={<TransformationPage />} path="/transformation" />
          <Route element={<MigrationPage />} path="/migration" />
        </Routes>
      </BrowserRouter>
    </MigrationContextProvider>
)
