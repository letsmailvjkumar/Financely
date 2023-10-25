import React, { useState } from 'react';
import { toast} from 'react-toastify';
import { auth, db} from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import NavBar from './NavBar';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
const Signup = () => {

  const[name,setName] = useState('')
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[confirmPassword, setConfirmPassword] = useState('')
  const[loading, setLoading] = useState(false)
  const[login, setLogin] = useState(false)
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate()
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Sign up with email
  const handleSubmit =  (e) => {
    e.preventDefault()
    console.log("email button clicked")
    setLoading(true);

    if (name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User ->", user);
            toast.success('User Created!');
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            createDoc(user)
            navigate('/dashboard')
          })
          .catch((error) => {
            //const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password doesn't match");
        setLoading(false);
      }
    } else {
      toast.error('All fields are mandatory');
      setLoading(false);
    }
  };

  //Switching between Signup and Login
  const toggleLogin=()=>{
    setLogin(!login)
  }

  const googleAuth = (e)=>{
    e.preventDefault()
    setLoading(true)
    console.log("google button clicked")
    try{
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log('user->',user)
      createDoc(user)
      setLoading(false)
      navigate('/dashboard')
      toast.success('User authenticated!');
    }).catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.customData.email;
      // The AuthCredential type that was used.
     // const credential = GoogleAuthProvider.credentialFromError(error);
      toast.error(errorMessage)
    });
    }catch (e){
      toast.error(e)
    }
  
  }
  
  async function createDoc(user){
    // Make sure that the doc with the uid doesn't exist
    // Create a Doc
    if(!user) return;

    const userRef = doc(db, "users",user.uid)
    const userData = await getDoc(userRef)

    if(!userData.exists()){
      try{
        await setDoc(doc(db, 'users', user.uid), {
          name:user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL:"",
          createAt: new Date()
        })
        toast.success('Doc created')
      }catch(e){
        toast.error(e.message)
      }
    }else{
      toast.error('Doc already exists')
    }
  }
  
  return (
    <div className='w-100 h-screen overflow-hidden'>
    <NavBar/>
    <div className='flex justify-center items-center h-full'>
    <div className='w-80 shadow-3xl p-5 rounded-lg mb-10'>
      <h4 className='text-center mb-3'>Sign Up On <span className='text-primary'>Financely.</span></h4>
      <form>
      <label htmlFor='name' className='text-[12px]'>Full Name</label><br/>
      <input 
        type='text'
        id='name' 
        placeholder='John Doe' 
        value={name}
        onChange={handleNameChange} 
        className='text-[12px] w-full outline-none' />
      <hr/>
      <label htmlFor='email' className='text-[12px]'>Email</label><br/>
      <input 
        type='email'
        id='email' 
        placeholder='JohnDoe@gmail.com' 
        value={email} 
        onChange={handleEmailChange} 
        className='text-[12px] w-full outline-none'/>
      <hr/>
      <label htmlFor='password' className='text-[12px]' >Password</label><br/>
      <input 
        type='password'
        id='password' 
        placeholder='JohnDoe@gmail.com' 
        value={password} 
        onChange={handlePasswordChange} 
        className='text-[12px] w-full outline-none'/>
      <hr/>
      <label htmlFor='confirmPassword' className='text-[12px]' >Confirm Password</label><br/>
      <input 
        type='password'
        id='confirmPassword' 
        placeholder='JohnDoe@gmail.com' 
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        className='text-[12px] w-full outline-none'/>
      <hr/>
      <div className='text-center mt-3'>
      <button 
        disabled={loading}
        className='text-[10px] border-primary border-[1px] w-72 p-1 '
        onClick={handleSubmit}
      >
          { 
          loading ?
          'loading...':
          'Signup with Email'
          }
      </button>
      <br/>
      <span className='text-[12px]'>or</span>
      <br/>
      <button className='text-[10px] w-72 bg-primary border-none p-1 text-white' onClick={googleAuth}>Signup with Google</button>
      </div>
      <p className='text-center text-[11px] mt-3' onClick={toggleLogin}><Link to='/login'>Or Have An Account Already? Click Here</Link></p>
      </form>
    </div>
    </div>
    </div>
    
    

  )
}

export default Signup