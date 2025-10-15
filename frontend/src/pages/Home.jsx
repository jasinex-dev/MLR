import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="hero">
      <div style={{textAlign:'center'}}>
        <span className="badge">Sodybos nuoma</span>
        <h1><i class="fa-solid fa-moon"></i>Moon Lounge Resort<i class="fa-solid fa-moon"></i></h1>
        <p><i class="fa-regular fa-star"></i>Du miegamieji nameliai, atskiras pirties namelis, kubilas,
           šviečiančios baidarės ir valtis — visiškai prie ežero.
           Rezervuok mėnulio šviesoje. <i class="fa-regular fa-star"></i></p>
        <Link to="/listings" className="btn">Peržiūrėti pasiūlymus</Link>
      </div>
    </div>
  )
}
