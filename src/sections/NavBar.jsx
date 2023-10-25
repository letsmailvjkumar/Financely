import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

const NavBar = () => {
  const [user, loading] = useAuthState(auth)
  const navigate= useNavigate()

  useEffect(()=>{
    if(user){
      navigate('/dashboard')
    }
  }, [user, loading])

  function logout() {
    try {
      signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success('Logged Out Successfully!')
        navigate('/')
      }).catch((error) => {
        // An error happened.
        toast.success(error.message)
      });
    } catch (error) {
      toast.error(error.message)
    }
    
  }
  return (
    <div>
      <div className='navbar flex justify-between bg-primary text-white sticky top-0'>
      <div className='ms-5 p-1.5'><h3>Financely</h3></div>
      { user && (
        <div className='me-5 p-1.5'><button onClick={logout}>Logout</button></div>
      )}
      
    </div>
    </div>
  )
}

export default NavBar