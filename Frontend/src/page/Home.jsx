import React from 'react'
import { useSelector } from 'react-redux'
import {Dashboard, LandingPage} from '../components/index';

function Home() {

    const authStatus = useSelector(state => state.auth.status);

  return !authStatus? ( <LandingPage />) : ( <Dashboard />)
}

export default Home
