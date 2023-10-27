import React, { useState } from 'react'
import SemesterRow from './SemesterRow';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const SearchStudent = () => {


  let navigate = useNavigate();
  const host = process.env.REACT_APP_BACKEND_URL;

  if (!localStorage.getItem('auth-token')) {
    // Navigate to home
    navigate('/', { replace: true });
  }

  const [semesterRows, setSemesterRows] = useState([]);
  const [fdata, setFdata] = useState({
    all_sem: [],
    cleared: [],
    not_cleared: [],
  });
  const [notClearedRow, setNotClearedRow] = useState([]);
  const [search, setSearch] = useState({
    rollNo: '171017-22-0013'
    // registrationNo: '017-1111-3622-17'
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  }

  const handleSearch = async () => {
    const res = await fetch(`${host}/api/student/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token')
      },
      body: JSON.stringify(search)
    });
    const data = await res.json();
    console.log(data);
    
    if (data.error) {
      alert('Student data not found!');
      return;
    }
    setFdata(data)
    // Get all cleared semesters
    let clearedSem = [];
    for (let i = 1; i <= 6; i++) {
      // Check for marksheet exist 
      if (isExistMarksheet(data.cleared, i)) {
        clearedSem.push(i);
      }
    }

    console.log(clearedSem);


    // Get remaining semesters
    let remainingSem = [];
    for (let i = 1; i <= 6; i++) {
      if (!clearedSem.includes(i)) {
        if (isExistMarksheet(data.all_sem, i)) {
          remainingSem.push(i);
        }
      }
    }

    let allSem = clearedSem.concat(remainingSem);
    allSem.sort()
    console.log(allSem)


    let tmpArr = [];
    for (let i = 0; i < allSem.length; i++) {
      let sem = '';
      // if (allSem[i] === 1) { sem = 'I'; }
      // if (allSem[i] === 2) { sem = 'II'; }
      // if (allSem[i] === 3) { sem = 'III'; }
      // if (allSem[i] === 4) { sem = 'IV'; }
      // if (allSem[i] === 5) { sem = 'V'; }
      // if (allSem[i] === 6) { sem = 'VI'; }

      // Fetch semester wise object from data
      let obj = fetchBySem(data.all_sem, allSem[i]);
      console.log(obj)
      // if (obj.semester === 1) { sem = 'I'; }
      // if (obj.semester === 2) { sem = 'II'; }
      // if (obj.semester === 3) { sem = 'III'; }
      // if (obj.semester === 4) { sem = 'IV'; }
      // if (obj.semester === 5) { sem = 'V'; }
      // if (obj.semester === 6) { sem = 'VI'; }
      
      tmpArr.push(
        <SemesterRow sem={obj.semester} key={i} obj={obj} />
      );
      setSemesterRows(tmpArr);
    }



    console.log(data.not_cleared);
    if (data.not_cleared.length === 0) {
      return;
    }
    else {
      tmpArr = [];
      for (let i = 0; i < data.not_cleared.length; i++) {
        let sem = '';
        if (data.not_cleared[i] === 1) { sem = 'I'; }
        if (data.not_cleared[i] === 2) { sem = 'II'; }
        if (data.not_cleared[i] === 3) { sem = 'III'; }
        if (data.not_cleared[i] === 4) { sem = 'IV'; }
        if (data.not_cleared[i] === 5) { sem = 'V'; }
        if (data.not_cleared[i] === 6) { sem = 'VI'; }

        // Fetch semester wise object from data
        let obj = fetchBySem(data.not_cleared, data.not_cleared[i]);
        if(obj === null || obj === undefined) { continue; }
        tmpArr.push(
          <SemesterRow sem={sem} key={i} obj={obj} />
        )
        setNotClearedRow(tmpArr);
      }
    }

  }

  const isExistMarksheet = (arr, sem) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].semester === sem) {
        return true;
      }
    }
    return false;
  }

  const fetchBySem = (arr, sem) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].semester === sem) {
        return arr[i];
      }
    }
    return null;
  }


  function downloadExcel(data, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    downloadExcel(fdata.all_sem, `${fdata.all_sem[0].rollNo}.xlsx`);
    // downloadExcel(data, 'exportedData.xlsx');
  };

  return (
    <>

      <div className='m-3 py-5'>
        <div id='heading'>
          <h1 className='text-3xl font-semibold border-b-2 border-b-blue-600 py-2 '>Search Students</h1>
        </div>
        <div className='w-full  my-5 '>
          <div className="rows w-full p-3 my-3 mt-9">

            <div className="row flex gap-7 flex-col sm:flex-row ">
              <div id="rollno-field" className='flex gap-3 flex-col sm:flex-row w-full sm:items-center  my-1 sm:w-1/2'>
                <div className='sm:w-[15%]'>
                  <label htmlFor="roll_no">Roll No.</label>
                </div>
                <div>
                  <input type="text" name="rollNo" value={search.rollNo} onChange={handleChange} id="roll_no" className='w-full border-2 border-slate-700 px-4 py-1 rounded-md' />
                </div>
              </div>
              {/* <div id="registrationno-field" className='flex gap-3 flex-col sm:flex-row w-full sm:items-center  sm:my-1 '>
                <div className=''>
                  <label htmlFor="name">Registration No.</label>
                </div>
                <div>
                  <input type="text" name="registrationNo" value={search.registrationNo} onChange={handleChange} id="registration_no" className='w-full border-2 border-slate-700 px-4 py-1 rounded-md' />
                </div>
              </div> */}
            </div>

            <hr className='my-9 border-slate-300' />
            {/* <div className="row flex gap-7  ">
            <div id="stream-field" className='flex gap-3 items-center  my-1 w-1/4'>
              <div className=''>
                <label htmlFor="stream">Stream</label>
              </div>
              <div className='w-full'>
                <select name="streams" id="stream" className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
                  <option value="BCOM">BCOM</option>
                  <option value="BA">BA</option>
                  <option value="BSC">BSC</option>
                </select>
              </div>
            </div>
            <div id="course-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="course">Course</label>
              </div>
              <div className='w-full'>
                <select name="courses" id="course" className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
                  <option value="honours">honours</option>
                  <option value="general">general</option>
                </select>
              </div>
            </div>
            <div id="semester-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="semester">Semester</label>
              </div>
              <div>
                <input type="number" name="semester" id="semester" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="year-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="year">Year</label>
              </div>
              <div>
                <input type="number" name="year" id="year" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div>
          <hr className='my-9 border-slate-300' /> */}
            <div className='row my-3 '>
              <button onClick={handleSearch} className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 '>Search Student</button>
              {/* <p>* (w.r.t Name, Roll No., Registration No., Stream, or Course)</p> */}
            </div>
            <hr className='my-9 border-slate-300' />

            {/* Student Data */}
            <div className="w-full overflow-scroll">

              <div className="row  w-[1215.2px]">
                <h3 className='text-xl font-medium my-2'>Student Data</h3>
                <div className="my_table  w-full">
                  <div className="my_thead border-2 w-full flex justify-around border-black ">
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Semester</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Full Marks</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Marks <br /> Obtained</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Semester <br /> Credit</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>SGPA</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Cummulative <br /> Credit</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>CGPA</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Letter Grade</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Remarks</span></div>
                    <div className='w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Actions</span></div>
                  </div>
                  <div id='p_my_tbody' className="my_tbody my-14 border w-full flex  flex-col justify-center  text-xs border-slate-400">
                    {semesterRows}
                  </div>
                </div>
              </div>

              <div>
                <button onClick={handleDownload} disabled={fdata.all_sem.length===0} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'>Download</button>
              </div>

              {/* Not cleared */}
              {/* {fdata?.not_cleared.length !== 0 ? <div className="row w-full">
                <h3 className='text-xl font-medium my-2'>Backlogs</h3>
                <div className="my_table  w-full">
                  <div className="my_thead border-2 w-full flex justify-around border-black ">
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Semester</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Full Marks</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Marks <br /> Obtained</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Semester <br /> Credit</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>SGPA</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Cummulative <br /> Credit</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>CGPA</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Letter Grade</span></div>
                    <div className='border-r-2 w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Remarks</span></div>
                    <div className='w-[10%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Actions</span></div>
                  </div>
                  <div id='p_my_tbody' className="my_tbody my-14 border w-full flex  flex-col justify-center  text-xs border-slate-400">
                    {notClearedRow}
                  </div>
                </div>
              </div> : ''} */}

            </div>




          </div>
        </div>
      </div>







    </>
  )
}

export default SearchStudent
