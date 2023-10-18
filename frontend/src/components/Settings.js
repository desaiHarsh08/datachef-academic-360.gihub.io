import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Settings = () => {

  let navigate = useNavigate();

  const host = process.env.REACT_APP_BACKEND_URL;

  if (!localStorage.getItem('auth-token')) {
    // Navigate to home
    navigate('/', { replace: true });
  }

 const [addSubject, setAddSubject] = useState({
  stream: 'bcom',
  course: 'honours',
  semester: 1,
  subjectName: ''
 }); 

 const [deleteSubject, setDeleteSubject] = useState({
  stream: 'bcom',
  course: 'honours',
  semester: 1,
  subjectName: ''
 }); 

 const [loading, setLoading] = useState(false);


 const updateSubject = async (obj)=> {
  
  
  // console.log('updated', subjectObj[0][obj?.stream.toLowerCase()][`sem${obj?.semester}`][obj?.course])
  
setLoading(true);
  const res =  await fetch(`${host}/api/subjects/add_update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('auth-token')
    },
    body: JSON.stringify(obj)
  });
  setLoading(false);
  const data =  await res.json();
  console.log(data);
  alert('Updated!');


 }


 const prepareAddSubject = ()=> {
  const subjectObj = JSON.parse(localStorage.getItem('subjectObj'));
  
  if(!subjectObj[0][addSubject?.stream.toLowerCase()][`sem${addSubject?.semester}`][addSubject?.course].includes(addSubject?.subjectName)) {
    subjectObj[0][addSubject?.stream.toLowerCase()][`sem${addSubject?.semester}`][addSubject?.course].push(addSubject?.subjectName)
    updateSubject(subjectObj[0]);
  }
  else {
    alert('Subject is already present');
  }
  
 }

 const prepareDeleteSubject = ()=> {
  const subjectObj = JSON.parse(localStorage.getItem('subjectObj'));
  
  if(!subjectObj[0][deleteSubject?.stream.toLowerCase()][`sem${deleteSubject?.semester}`][deleteSubject?.course].includes(deleteSubject?.subjectName)) {
    // subjectObj[0][obj?.stream.toLowerCase()][`sem${obj?.semester}`][obj?.course].push(obj?.subjectName)
    // updateSubject(subjectObj[0]);
    alert('Subject does not exist!');
  }
  else {
    const index = subjectObj[0][deleteSubject?.stream.toLowerCase()][`sem${deleteSubject?.semester}`][deleteSubject?.course].indexOf(deleteSubject?.subjectName);
    subjectObj[0][deleteSubject?.stream.toLowerCase()][`sem${deleteSubject?.semester}`][deleteSubject?.course].splice(index, 1);
    console.log(subjectObj[0])
    updateSubject(subjectObj[0]);
  }
 }


  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setAddSubject((prev) => ({ ...prev, [name]: value }));
    console.log(addSubject)
  }

  const handleDeleteChange = (event) => {
    const { name, value } = event.target;
    setDeleteSubject((prev) => ({ ...prev, [name]: value }));
    console.log(deleteSubject)
  }

  const handleChangePassword = async ()=> {
    const email = localStorage.getItem('email');
    const newPassword = document.getElementById('newpassword').value;
    const cPassword = document.getElementById('cpassword').value;

    if(newPassword==='') {
      alert('Password cannot be blank');
      return;
    }

    if(newPassword !== cPassword) {
      alert("New Password and confirm password doesn't match");
      return;
    }

    setLoading(true);

    const res = await fetch(`${host}/api/auth/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token')
      },
      body: JSON.stringify({
        email: email,
        pasword: newPassword
      })
    });

    setLoading(false);
    const data = await res.json();
    console.log(data);
    if(data.message) {
      alert('Password Updated!');
    }

  }

  return (
    <>
    {loading? <Loading />: ''}
    <div className='m-3 py-5'>
      <div id='heading'>
        <h1 className='text-3xl font-semibold border-b-2 border-b-blue-600 py-2 '>Settings</h1>
      </div>
      {/* Add Subject */}
      <div id="row1">
        <h1 className='text-2xl font-medium mt-7 my-3 '>Add Subjects</h1>

        <div className='flex gap-3 md:items-center flex-col md:flex-row  '>
          <div className='stream'>
            <label htmlFor="stream">Stream</label>
            <select name="stream" value={addSubject.stream} onChange={handleAddChange} className='border-2 px-4 py-2 rounded-md border-slate-700 w-full '>
              <option value="bcom">BCOM</option>
              <option value="ba">BA</option>
              <option value="bsc">BSC</option>
            </select>
          </div>
          <div className='course'>
            <label htmlFor="course">Course</label>
            <select name="course" value={addSubject.stream.toLowerCase()!=='bcom'?'honours':addSubject.course} onChange={handleAddChange} className='border-2 border-slate-700 w-full px-4 py-2 rounded-md'>
              <option value="honours">honours</option>
              <option value="general">general</option>
            </select>
          </div>
          <div className='semester flex flex-col'>
            <label htmlFor="semester">Semester</label>
            <input type="number" name="semester" value={addSubject.semester} onChange={handleAddChange}  className='border-2 px-4 py-2 rounded-md' />
          </div>
          <div className='subject flex flex-col'>
            <label htmlFor="subject">Subject</label>
            <input type="text" name="subjectName" value={addSubject.subjectName} onChange={handleAddChange} className='border-2 px-4 py-2 rounded-md' />
          </div>
          <div className='button flex flex-col '>
            <button onClick={prepareAddSubject} className='px-4 py-2 w-1/4 md:w-auto bg-blue-500 text-white rounded-md font-semibold'>Add</button>
          </div>
        </div>
      </div>
      {/* Delete Subject */}
      <div id="row2" className='my-7 py-7'>
        <h1 className='text-2xl font-medium mt-7 my-3 '>Delete Subjects</h1>

        <div className='flex gap-3 md:items-center flex-col md:flex-row  '>
          <div className='stream'>
            <label htmlFor="stream">Stream</label>
            <select name="stream" value={deleteSubject.stream} onChange={handleDeleteChange} className='border-2 px-4 py-2 rounded-md border-slate-700 w-full '>
              <option value="bcom">BCOM</option>
              <option value="ba">BA</option>
              <option value="bsc">BSC</option>
            </select>
          </div>
          <div className='course'>
            <label htmlFor="course">Course</label>
            <select name="course" value={deleteSubject.stream.toLowerCase()!=='bcom'?'honours':deleteSubject.course} onChange={handleDeleteChange} className='border-2 border-slate-700 w-full px-4 py-2 rounded-md'>
              <option value="honours">honours</option>
              <option value="general">general</option>
            </select>
          </div>
          <div className='semester flex flex-col'>
            <label htmlFor="semester">Semester</label>
            <input type="number" name="semester" value={deleteSubject.semester} onChange={handleDeleteChange} className='border-2 px-4 py-2 rounded-md' />
          </div>
          <div className='subject flex flex-col'>
            <label htmlFor="subject">Subject</label>
            <input type="text" name="subjectName" value={deleteSubject.subjectName} onChange={handleDeleteChange} className='border-2 px-4 py-2 rounded-md' />
          </div>
          <div className='button flex flex-col'>
            <button onClick={prepareDeleteSubject} className='px-4 w-1/4 md:w-auto py-2 bg-blue-500 text-white rounded-md font-semibold'>Delete</button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div id="row3" className='my-14'>
        <h1 className='text-2xl font-medium mt-7 my-3 '>Change Password</h1>
        <div className="email flex flex-col w-full">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={localStorage.getItem('email')} id="email" className=' outline-none px-4 py-2 border-2 bg-slate-100  rounded-md md:w-1/2' />
        </div>
        <div className="newpassword flex flex-col my-4">
          <label htmlFor="newpassword">New Password</label>
          <input type="password" name="newpassword" id="newpassword" className='px-4 py-2 border-2 border-black rounded-md md:w-1/2' />
        </div>
        <div className="cpassword flex flex-col my-4">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" name="cpassword" id="cpassword" className='px-4 py-2 border-2 border-black rounded-md md:w-1/2' />
        </div>
        <div className="cpassword flex flex-col my-4">
          <div>

          <button onClick={handleChangePassword} className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md'>Save</button>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}

export default Settings
