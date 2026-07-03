import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';

import { getCurrentUser } from './api/auth.api';
import { Header, Container } from './components/index';
import {Home}from './page/index';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData: userData.data}))
      } else {
        dispatch(logout())
      }
    })
    .finally(()=> setLoading(false));
    
  }, [])

  return !loading? (
      <Container>
        <Header/>
        <Outlet />
      </Container>

  ) : (
    <h2>Loading...</h2>
  )
}

export default App
