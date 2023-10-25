import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from 'react-toastify';
import {auth} from '../firebase';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate()

    const handleEmailChange = (e)=>{
        setEmail(e.target.value)
    }
    const handlePasswordChange= (e)=>{
        setPassword(e.target.value)
    }
    const display=(e)=>{
        e.preventDefault();
        console.log(email)
        console.log(password)
        if(email!='' && password!=''){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            toast.success("User Logged In!")
            console.log("User Logged", user)
            navigate('/dashboard')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
        });
        }else{
            toast.error("All fields are mandatoray!")
        }

        
    }

    const googleAuth = (e)=>{
        e.preventDefault()
        console.log("google button clicked")
        try{
          
          signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate('/dashboard')
        console.log('user->',user)
        toast.success('User authenticated!');
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(errorMessage)
      });
        }catch (e){
          toast.error(e)
        }
      
      }
    
  return (
    <>
    <NavBar/>
    <div className='flex justify-center items-center h-screen'>
        <div className='shadow-3xl p-5 rounded-lg'>
        <h3 className='text-center'>Log In on <span className='text-primary'>Financely.</span></h3>
        <form className='mt-7'>
            <label htmlFor='email' className='text-[14px]'>Email</label><br/>
            <input
             type='email'
             id='email'
             onChange={handleEmailChange} 
             placeholder='JohnDoe@gmail.com'
             className='text-[12px] w-full outline-none'
            />
            <hr className=' border-black h-1'/>
            <label htmlFor='password' className='text-[14px]'>Password</label><br/>
            <input
             type='password'
             id='password'
             onChange={handlePasswordChange} 
             placeholder='Example123'
             className='text-[12px] w-full outline-none'
            />
            <hr className=' border-black h-1'/>
            <button 
            className='text-[10px] border-primary border-[1px] w-72 p-1 text-primary mt-5' onClick={display}>
            Log In with Email and Password
            </button>
            
            <p className='text-center text-[12px] pt-3'>or</p>
            <button className='text-[10px] w-72 bg-primary border-none p-1 outline-none text-white mb-1' onClick={googleAuth}>
            Log In with Google
            </button>
            <p className='p-3 text-[12px] text-center'><Link to='/'>Or Don't have An Account? Click Here</Link></p>
        </form>
        </div>
    </div>
    </>
  )
}

export default Login