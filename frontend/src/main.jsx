import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Listings from './pages/Listings.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Admin from './pages/Admin.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='listings' element={<Listings />} />
        <Route path='listings/:id' element={<ListingDetail />} />
        <Route path='admin' element={<Admin />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
