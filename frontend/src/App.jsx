import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'

export default function App(){
  const { pathname } = useLocation()
  return (
    <>
      <Nav />
      <div className="container">
        <Outlet key={pathname} />
      </div>
      <div className="footer">© Moon Lounge Resort — mėnulio šviesos ir pirties dūmų alchemija</div>
    </>
  )
}
