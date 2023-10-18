import React from 'react'
import { useNavigate } from 'react-router-dom';

const DeleteStudent = () => {
  let navigate = useNavigate();
  const host = process.env.REACT_APP_BACKEND_URL;
  if (!localStorage.getItem('auth-token')) {
    // Navigate to home
    navigate('/', { replace: true });
  }

  const handleDelete = async ()=> {
    let obj = {
      rollNo: document.getElementById('rollNo').value,
      registrationNo: document.getElementById('registrationNo').value,
      semester: Number(document.getElementById('semester').value),
      year: document.getElementById('year').value,
    }
    console.log(obj);


    const res = await fetch(`${host}/api/student/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token')
      },
      body: JSON.stringify(obj)
    });
    const data = await res.json();
    console.log(data);
    if(data?.message) {
      alert('Successfully Deleted...!');
    }
    else {
      alert('Given marksheet not found!');
    }

  }

  return (
    <div className='m-3 py-5'>
      <div id='heading'>
        <h1 className='text-3xl font-semibold border-b-2 border-b-blue-600 py-2 '>Delete Student</h1>
      </div>
      <div className='w-full  my-5 '>
        <div className="rows w-full p-3 my-3 mt-9">
          {/* <div className="row flex gap-7 ">
            <div id="name-field" className='flex gap-3 items-center  my-1 w-1/2'>
              <div className='w-[15%]'>
                <label htmlFor="name">Name</label>
              </div>
              <div>
                <input type="text" name="name" id="name" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="rollno-field" className='flex gap-3 items-center border my-1 invisible'>
              <div className=''>
                <label htmlFor="name">Registration No.</label>
              </div>
              <div>
                <input type="text" name="roll_no" id="roll_no" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div> */}
          <div className="row flex flex-col lg:flex-row gap-7 ">
            <div id="rollno-field" className='flex gap-3 w-full lg:w-auto my-1 flex-col'>
              <div className=''>
                <label htmlFor="roll_no">Roll No.</label>
              </div>
              <div>
                <input type="text" name="rollNo" id="rollNo" className='border-2 w-full lg:w-auto border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="registrationno-field" className='flex gap-3 flex-col w-full lg:w-auto my-1 '>
              <div className=''>
                <label htmlFor="name">Registration No.</label>
              </div>
              <div>
                <input type="text" name="registrationNo" id="registrationNo" className='border-2 w-full lg:w-auto border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="semester-field" className='flex gap-3 flex-col my-1 w-full lg:w-auto '>
              <div className=''>
                <label htmlFor="semester">Semester</label>
              </div>
              <div>
                <input type="number" name="semester" id="semester" className='border-2 w-full lg:w-auto border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="year-field" className='flex gap-3 flex-col my-1  w-full lg:w-auto'>
              <div className=''>
                <label htmlFor="year">Year</label>
              </div>
              <div>
                <input type="number" name="year" id="year" className='border-2 w-full lg:w-auto border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div>

          
          <hr className='my-9 border-slate-300' />
          <div className='row my-3 '>
            <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 '>Delete</button>
       
          </div>
         
        </div>
      </div>
    </div>
  )
}

export default DeleteStudent
