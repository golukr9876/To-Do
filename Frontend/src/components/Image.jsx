import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

export default function Image() {
   const navigate = useNavigate();
   const userData = useSelector(state => state.auth.userData);
   const ppurl = userData?.avatar;

  return (
    <div>
      <img src={ppurl} alt="cannot loading" />
    </div>
  )
}
