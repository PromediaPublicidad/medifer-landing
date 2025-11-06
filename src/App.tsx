import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MediferLanding from './components/MediferLanding'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MediferLanding />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
