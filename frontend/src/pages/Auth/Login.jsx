import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const {updateUser}= useContext(UserContext)

  const navigate=useNavigate();

  const handleLogin= async(e)=>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError('Please enter a valid email address');
      return;
    }
    if(!password){
      setError('Please enter your password');
      return;
    }
    if(password.length<8){
      setError('Password must be at least 8 characters long');
      return;
    }
    setError("");

    //Login API call 
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      })
      const {token, user}= response.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Something went wrong. Please try again")
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='tx-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your details</p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({target})=>setEmail(target.value)}
            type="text"
            label="Email Address"
            placeholder='john@gmail.com' 
          />
          <Input
            value={password}
            onChange={({target})=>setPassword(target.value)}
            type="password"   
            label="Password"
            placeholder='Min. 8 characters' 
          />
          <button type='submit' className='btn-primary'>LOGIN</button>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? {""}
            <Link className='text-primary font-medium underline' to='/signup'>Signup</Link>

          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
