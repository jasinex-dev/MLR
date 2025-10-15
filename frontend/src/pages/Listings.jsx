import React, { useEffect, useState } from 'react'
import { api } from '../api'
import ListingCard from '../components/ListingCard.jsx'

export default function Listings(){
  const [items,setItems] = useState([])
  const [type,setType] = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(() => { load() }, [type])

  async function load(){
    setLoading(true)
    const qs = type ? `?type=${type}` : ''
    const data = await api(`/api/listings${qs}`)
    setItems(data); setLoading(false)
  }

  return (
    <div style={{display:'grid', gap:16}}>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <select className="select" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Visi</option>
          <option value="cabin">Nameliai</option>
          <option value="sauna">Pirtis</option>
          <option value="activity">Veiklos</option>
        </select>
      </div>
      {loading ? <p>Kraunama...</p> : <div className="grid">
        {items.map(item => <ListingCard key={item._id} item={item} />)}
      </div>}
    </div>
  )
}
