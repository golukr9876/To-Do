import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ProfilePic } from '../components';

export default function ImagePage() {
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const ppurl = userData?.avatar;
  return (
    <ProfilePic ppurl={ppurl} />
  )
}
