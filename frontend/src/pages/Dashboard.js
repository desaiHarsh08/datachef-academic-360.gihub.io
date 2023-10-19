import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { VscAdd } from 'react-icons/vsc'
// import { BiSolidEdit } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'
import { RiLogoutBoxLine } from 'react-icons/ri'

const Dashboard = () => {
  let location = useLocation();
  // console.log(location)

  let navigate = useNavigate();



  useEffect(()=> {
    if(!localStorage.getItem('auth-token')) {
      localStorage.clear();
      navigate('/', {replace: true});
    }
    // eslint-disable-next-line
  }, []);

  const handleLogout = ()=> {
    localStorage.clear();
    navigate('/', {replace: true});
  }


  return (
    <div className='w-full h-screen flex flex-col md:flex-row overflow-hidden '>
      <div id="side-navbar" className='w-full md:w-[20%] bg-slate-700 h-[45%] py-2 text-white md:h-screen ' >
        <div id='part1' className='flex flex-col md:h-[30%]  gap-2 md:my-3 justify-center items-center '>
          <h1 className='text-3xl md:mt-7 font-bold text-center'>Welcome!</h1>
          <div className='w-full p-2 m-3 flex flex-col gap-3 justify-center items-center '>
            <div className='w-full h-full flex justify-center items-center'>

              <img src={localStorage.getItem('picture')} alt="user-img" className=' h-[30%] w-[30%] rounded-full p-3 mx-4  border md:min-h-[100px] md:min-w-[100px]' />
            </div>
            <h2 className='text-xl font-semibold text-center'>{localStorage.getItem('name')}</h2>
          </div>
        </div>
        <div id="part2" className='md:h-[70%] flex justify-center md:py-7 ' >
          <ul className='flex justify-center gap-8 w-full md:w-auto md:flex-col md:gap-2' >
            <li className="hover:text-[#00ffff]">
              <Link to={""} className={`flex items-center gap-2 ${location.pathname.endsWith('/dashboard')? 'active': ''}`} >
                <RxDashboard className='font-medium' /> 
                <span className='font-medium hidden md:block'>Dashboard</span>
              </Link>
            </li>
            <li className="hover:text-[#00ffff]">
              <Link to={"add"} className={`flex items-center gap-2 ${location.pathname.endsWith('/add')? 'active': ''}`} >
                <VscAdd  className='font-medium text-white' style={{color: 'white'}} /> 
                <span className='font-medium hidden md:block'>Add Student</span>
              </Link>
            </li>
            <li className="hover:text-[#00ffff]">
              <Link to={"search"} className={`flex items-center gap-2 ${location.pathname.endsWith('/search')? 'active': ''}`} >
                <AiOutlineSearch  className='font-medium text-white' style={{color: 'white'}} /> 
                <span className='font-medium hidden md:block'>Search Student</span>
              </Link>
            </li>
            <li className="hover:text-[#00ffff]">
              <Link to={"delete"} className={`flex items-center gap-2 ${location.pathname.endsWith('/delete')? 'active': ''}`} >
                <RiDeleteBinLine  className='font-medium text-white' style={{color: 'white'}} /> 
                <span className='font-medium hidden md:block'>Delete Student</span>
              </Link>
            </li>
            <li className="hover:text-[#00ffff]">
              <Link to={"settings"} className={`flex items-center gap-2 ${location.pathname.endsWith('/settings')? 'active': ''}`} >
                <FiSettings  className='font-medium text-white' style={{color: 'white'}} /> 
                <span className='font-medium hidden md:block'>Settings</span>
              </Link>
            </li>
            <li className="hover:text-[#00ffff] md:my-7">
              <p onClick={handleLogout} className={`flex items-center gap-2 cursor-pointer `} >
                <RiLogoutBoxLine  className='font-medium text-white' style={{color: 'white'}} /> 
                <span className='font-medium hidden md:block'>Logout</span>
              </p>
            </li>
          </ul>
        </div>

      </div>
      <div id="main-container" className='w-full overflow-y-scroll  '>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard


