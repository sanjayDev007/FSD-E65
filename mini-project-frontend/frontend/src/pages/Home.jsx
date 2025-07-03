import React, { useEffect } from 'react'
import UseProtected from '../api/UseProtected';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  useEffect(()=>{
      async function checkProtected() {
          let isProtected = await UseProtected();
          if (!isProtected) {
              navigate("/login");
          }
      }
      checkProtected();
  },[]);
  return (
    <div>Home</div>
  )
}

export default Home