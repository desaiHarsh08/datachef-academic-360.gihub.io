import React, { useEffect, useState } from 'react'
import { BsFillClipboardDataFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import md5 from 'md5';


const Home = () => {

  const host = process.env.REACT_APP_BACKEND_URL;


  let navigate = useNavigate();

  const [cred, setCred] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    console.log(cred);

  }, [cred])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCred((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('fired');

    const emailHash = md5(cred.email);
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
    localStorage.setItem('picture', avatarUrl);

    const res = await fetch(`${host}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cred)
    })

    const data = await res.json();
    console.log(data);

    if (data) {
      localStorage.setItem('auth-token', data.authToken);
      localStorage.setItem('name', data.name);
      navigate('/dashboard', { replace: true });
    }
  }

  const handleSuccess = async (credentialResponse) => {
    console.log(credentialResponse)
    const userObject = jwt_decode(credentialResponse.credential);
    console.log(userObject);

    // localStorage.setItem('auth-token', credentialResponse.credential);
    localStorage.setItem('email', userObject.email);
    localStorage.setItem('name', userObject.name);
    localStorage.setItem('picture', userObject.picture);

    const res = await fetch(`${host}/api/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userObject.email })
    });
    const data = await res.json();
    // console.log(data.)
    if (data.authToken) {
      localStorage.setItem('auth-token', data.authToken);
      localStorage.setItem('email', userObject.email);
      localStorage.setItem('name', userObject.name);
      localStorage.setItem('picture', userObject.picture);
      navigate('/dashboard', { replace: true });
    }
    else {
      alert('Invalid credentials');
    }

  }


  return (
    <>
      <div className='w-full h-screen bg-[#5c405c] flex flex-col justify-center items-center '>
        <div className="rows w-full px-2 sm:w-[90%] md:w-[75%] lg:w-[50%] flex flex-col justify-center items-center">
          <div id="row1" className='text-white flex gap-2 flex-col justify-center items-center w-3/4' >
            <h1 className='text-3xl font-semibold flex gap-3  items-center '>
              <BsFillClipboardDataFill />
              <span>
                Academic 360
              </span>
            </h1>
            <h2 className='flex gap-7 items-center text-center'>Fast & Easy Student-Data Management</h2>
          </div>
          <div id="row2" className='my-7'>
            <h3 className='text-2xl font-medium text-white'>Welcome Back!</h3>
          </div>
          <div id="row3" className='w-full flex flex-col gap-4 '>
            <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className="email w-full ">
                <label htmlFor="email" className='text-white my-2'>Email</label>
                <input type="email" name='email' id='email' onChange={handleChange} placeholder='Enter your email...!' className='w-full my-2 px-4 py-2 rounded-md' />
              </div>
              <div className="password w-full ">
                <label htmlFor="password" className='text-white my-2'>Password</label>
                <input type="password" name='password' id='password' onChange={handleChange} placeholder='Enter your password...!' className='w-full my-2 px-4 py-2 rounded-md' />
              </div>
              <div className="btn w-full flex justify-center items-center ">
                <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium '>Login</button>
              </div>
            </form>
          </div>
          <div id="row4" className='my-7 mt-10'>
            <h3 className='text-white font-medium text-xl my-3 text-center'>Or continue with</h3>
            <div className='flex justify-center items-center'>
              <GoogleLogin

                onSuccess={(credentialResponse) => {
                  handleSuccess(credentialResponse)
                }}
                onError={() => {
                  alert('Login Failed');
                }}
              />;
            </div>


            {/* <LoginB */}
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className='absolute w-full bottom-0 flex justify-center items-center ' >
        <p className='text-white p-3 '>This is sample footer text. All Rigths Reserved</p>
      </div>
    </>
  )
}

export default Home
