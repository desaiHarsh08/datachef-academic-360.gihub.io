import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SubjectDisplay from './SubjectDisplay';
import Loading from './Loading';
import * as XLSX from 'xlsx';

const DashboardHome = () => {

  const host = process.env.REACT_APP_BACKEND_URL;

  let navigate = useNavigate();
  const [element, setElement] = useState([]);

  const [filterStudents, setFilterStudents] = useState({
    stream: 'bcom',
    course: 'honours',
    semester: 1
  });


  const [loadingFlag, setLoadingFlag] = useState(false);

  const [elementRow, setElementRow] = useState([]);

  const [marksheetArr, setMarksheetArr] = useState([]);

  const [stats, setStats] = useState();

  useEffect(() => {

    if (!localStorage.getItem('auth-token')) {
      // Navigate to home
      navigate('/', { replace: true });
    }


    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${host}/api/subjects/fetch-all`, {
          method: 'GET',
          headers: { // It should be "headers," not "header"
            'auth-token': localStorage.getItem('auth-token'),
            'accept': 'application/json'
          }
        });
        if (!res.ok) {
          // Handle the response error here if needed
          console.error('Error fetching data:', res.status, res.statusText);
          return;
        }
        const data = await res.json();
        // console.log(data);
        return data;
      } catch (error) {
        // Handle any other errors that might occur during the fetch or parsing JSON
        console.error('Error:', error);
      }
    };

    const element = [];
    fetchSubjects()
      .then((subjectsObj) => {
        // console.log(subjectsObj);
        localStorage.setItem('subjectObj', JSON.stringify(subjectsObj));

        for (let course in subjectsObj[0]) {
          let i = 0;
          if (course === 'bcom' || course === 'ba' || course === 'bsc') {
            for (let sem in subjectsObj[0][course]) {

              if (i > 0) {
                element.push(
                  <SubjectDisplay
                    course={''}
                    sem={sem}
                    common={subjectsObj[0][course][sem].common}
                    honours={subjectsObj[0][course][sem].honours}
                    general={subjectsObj[0][course][sem].general}
                    elective={subjectsObj[0][course][sem].elective}
                  />
                )
              }
              else {
                element.push(
                  <SubjectDisplay
                    i={i}
                    course={course}
                    sem={sem}
                    common={subjectsObj[0][course][sem].common}
                    honours={subjectsObj[0][course][sem].honours}
                    general={subjectsObj[0][course][sem].general}
                    elective={subjectsObj[0][course][sem].elective}
                  />
                )
              }

              // console.log(element)
              i += 1;
            }
          }


        }
        // console.log(element)
        setElement(element);

      })
      .catch((error) => {
        console.log("Error: ", error);
      })
      // eslint-disable-next-line
  }, [element]);

  useEffect(() => {
    const fetchStats = async ()=> {
      const res  = await fetch(`${host}/api/student/stats`, {
        method: 'GET',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        }
      });
      const data = await res.json();
      console.log("Stats: ", data);
      setStats(data);
    }

    fetchStats();
// eslint-disable-next-line
  }, [stats])

  const handleClick = () => {
    document.getElementById('list-container').classList.toggle('hidden');
  }


  function downloadExcel(data, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  }

  const handleDownload = () => {
    downloadExcel(marksheetArr, 'exportedData.xlsx');
  };

  const handleStudentFilter = async () => {

    setLoadingFlag(true);
    console.log('requested')
    console.log(filterStudents)
    setElementRow([]);
    setMarksheetArr([]);


    const res = await fetch(`${host}/api/student/filter`, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filterStudents)
    })
    const data = await res.json()
    console.log(data)
    setLoadingFlag(false);
    if (data.length < 0) {
      alert('No result');
      return;
    }
    let count = 0;
    let tmpArr = [];
    let mymarksheetArr = [];
    for (let i = 0; i < data.length; i++) {
      const student = data[i];
      count +=1;
      console.log(count)
      for (let j = 0; j < student.subjects.length; j++) {
        let obj = {
          uniqueIdentifier: student.registrationNo + student.subjects[j].subjectName,
          "Registration No.": student.registrationNo,
          Stream: student.stream,
          Course: student.course,
          Semester: student.semester,
          Name: student.name,
          SGPA: student.sgpa,
          Remarks: student.remarks,
          Subject: student.subjects[j].subjectName,
          Year1: student.subjects[j].year1,
          "Full Marks": student.subjects[j].fullMarks,
          Year2: student.subjects[j].year2,
          "Practical Marks": student.subjects[j].practicalMarks,
          NGP: student.subjects[j].ngp,
          Credit: student.subjects[j].credit,
          TGP: student.subjects[j].tgp,
          "Internal Marks": student.subjects[j].internalMarks,
          "Theory Marks": student.subjects[j].theoryMarks,
          Total: student.subjects[j].total,
          Status: student.status,
          "Roll No.": student.rollNo,
        };

        const isDuplicate = mymarksheetArr.some((item) => item.uniqueIdentifier === obj.uniqueIdentifier);

        if(!isDuplicate) {
          mymarksheetArr.push(obj);
          tmpArr.push(
            <div className='my_tr w-full flex border ' >
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.registrationNo}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.stream}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.course}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.semester}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.name}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.sgpa}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.remarks}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].fullMarks}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].year1}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].practicalMarks}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].ngp}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].credit}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].tgp}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].subjectName}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].internalMarks}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].theoryMarks}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].total}</span>
              </div>
              <div className='border-r-2 font-medium py-3 flex justify-center items-center w-[500px]'>
                <span>{student.status.toUpperCase()}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.subjects[j].letterGrade}</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>{student.rollNo}</span>
              </div>
            </div>
          );
        }
        else {
          continue;
        }

        

      }

      
    }
    
    setElementRow(tmpArr);
    setMarksheetArr(mymarksheetArr);

    console.log('Displaying List')



  }

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    // Update filterStudents based on the input field's name
    setFilterStudents((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
    filterStudents.semester = Number(document.getElementById('semester').value)
    console.log(filterStudents);


  };

  return (
    <div className='w-full h-full flex flex-col gap-3 px-2 py-7'>


      {loadingFlag ? <Loading /> : ''}
      <div id="row-1" className='w-full flex flex-col md:flex-row gap-3 md:flex-wra p   '>
        <div className="card w-full md:w-1/4  h-[125px] flex flex-col gap-3 justify-center items-center bg-red-500 text-white ">
          <h3 className='font-semibold text-4xl '>Total</h3>
          <span className='text-2xl' >{stats?.totalMarksheetCount}</span>
        </div>
        <div className="card w-full md:w-1/4  h-[125px] flex flex-col justify-evenly p-2  bg-blue-500 text-white ">
          <h3 className='font-semibold text-2xl text-center '>BCOM</h3>
          <div className='flex'>
            <div className='border w-1/2 h-full flex flex-col items-center'>
              <h4 className='font-semibold text-xl  '>BCOM (H)</h4>
              <span className='' >{stats?.bcom_honoursCount}</span>
            </div>
            <div className='border w-1/2 h-full flex flex-col items-center'>
              <h4 className='font-semibold text-xl  '>BCOM (G)</h4>
              <span className='' >{stats?.bcom_generalCount}</span>
            </div>
          </div>
        </div>
        <div className="card w-full md:w-1/4 border h-[125px] flex flex-col gap-3 justify-center items-center bg-green-500 text-white ">
          <h3 className='font-semibold text-4xl '>BA</h3>
          <span className='text-2xl' >{stats?.baCount}</span>
        </div>
        <div className="card w-full md:w-1/4 border h-[125px] flex flex-col gap-3 justify-center items-center bg-yellow-400 text-white ">
          <h3 className='font-semibold text-4xl '>BSC</h3>
          <span className='text-2xl' >{stats?.bscCount}</span>
        </div>
      </div>
      {/* <div id="row-2" className='w-full flex flex-col md:flex-row items-center  gap-10 md:gap-20 justify-center mt-20 md:mt-9 '>
        <div>
          <h3 className='text-3xl font-semibold'>Passing Status</h3>
        </div>
        <div className=' flex flex-wrap justify-center gap-7'>
          <div className="circle w-[95px] h-[95px] rounded-full border-2 border-blue-500 flex flex-col justify-center items-center ">
            <span className='font-semibold'>BCOM (H)</span>
            <span className='text-blue-500 font-semibold'>57.89%</span>
          </div>
          <div className="circle w-[95px] h-[95px] rounded-full border-2 border-orange-500 flex flex-col justify-center items-center ">
            <span className='font-semibold'>BCOM (G)</span>
            <span className='text-orange-500 font-semibold'>57.89%</span>
          </div>
          <div className="circle w-[95px] h-[95px] rounded-full border-2 border-green-500 flex flex-col justify-center items-center ">
            <span className='font-semibold'>BA</span>
            <span className='text-green-500 font-semibold'>57.89%</span>
          </div>
          <div className="circle w-[95px] h-[95px] rounded-full border-2 border-yellow-500 flex flex-col justify-center items-center ">
            <span className='font-semibold'>BSC</span>
            <span className='text-yellow-500 font-semibold'>57.89%</span>
          </div>
        </div>

      </div> */}

      {/* Subject List Displayed */}
      <div id="row-3" className='w-full px-2 py-7'>
        <div className='w-full flex justify-between border p-2 items-center'>
          <h3 className='text-2xl font-semibold '>Subject List</h3>
          <div>
            <button onClick={handleClick} className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>View</button>
          </div>
        </div>

        <div className='w-full hidden transition-all' id='list-container' >
          {element}
        </div>
      </div>

      {/* Student List */}
      <div id="row-4" className='w-full px-5 py-2'>
        <div>
          <h3 className='text-2xl font-semibold '>All Students List</h3>
        </div>

        {/* Filter */}
        <div className='w-full  my-1 '>
          <div className="rows w-full p-3 my-3 ">
            

            <hr className='my-9 border-slate-300' />
            <div className="row flex flex-col sm:flex-row gap-1 md:gap-7  ">
              <div id="stream-field" className='flex gap-3 items-center  my-1 sm:w-1/4'>
                <div className=''>
                  <label htmlFor="stream">Stream</label>
                </div>
                <div className='w-full'>
                  <select name="stream" onChange={handleOnChange} value={filterStudents.stream.toLowerCase()} id="stream" className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
                    <option value="bcom">BCOM</option>
                    <option value="ba">BA</option>
                    <option value="bsc">BSC</option>
                  </select>
                </div>
              </div>
              <div id="course-field" className='flex gap-3 items-center my-1 sm:w-1/4'>
                <div className=''>
                  <label htmlFor="course">Course</label>
                </div>
                <div className='w-full'>
                  <select name="course" onChange={handleOnChange} value={filterStudents.stream.toLowerCase() !== 'bcom' ? 'honours' : filterStudents.course} id="course" className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
                    <option value="honours">honours</option>
                    <option value="general">general</option>
                  </select>
                </div>
              </div>
              <div id="semester-field" className='flex gap-3 items-center my-1 sm:w-1/4'>
                <div className=''>
                  <label htmlFor="semester">Semester</label>
                </div>
                <div className='w-full'>
                  <input type="number" name="semester" id="semester" value={filterStudents.semester} onChange={handleOnChange} className='w-full border-2 border-slate-700 px-4 py-1 rounded-md' />
                </div>
              </div>
            </div>
            <hr className='my-9 border-slate-300' />
            <div className='row my-3 '>
              <button onClick={handleStudentFilter} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 '>Filter</button>
              {/* <p>* (w.r.t Name, Roll No., Registration No., Stream, or Course)</p> */}
            </div>
            <hr className='my-9 border-slate-300' />
          </div>
        </div>


        <div className='my-7'>
          <button disabled={elementRow.length === 0} onClick={handleDownload} className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md '>Download</button>
        </div>
        {/* List of Student */}
        <div className="my_table overflow-x-scroll">
          <div className="my_thead w-[4000px] border-2 flex  border-black  ">
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Registration No.</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Stream</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Course</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Semester</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Name</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>SGPA</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Remarks</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Full Marks</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Year1</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Practical</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>NGP</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Credit</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>TGP</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Subjects</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Internal Marks</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Theory Marks</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Total</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Status</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Grade</span>
            </div>
            <div className='border-r-2 font-medium border-black py-3 flex justify-center items-center w-[500px]'>
              <span>Roll No.</span>
            </div>
          </div>


          <div id='my_tbody' className="my_tbody  border-slate-400 my-5  w-[4000px]  flex flex-col justify-center  text-xs  ">
            {/* <div className='my_tr w-full flex border '>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Registration No.</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Stream</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Course</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Semester</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Name</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>SGPA</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Remarks</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Full Marks</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Year1</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Practical</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>NGP</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Credit</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>TGP</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Subjects</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Internal Marks</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Theory Marks</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Total</span>
              </div>
              <div className='border-r-2 font-medium py-3 flex justify-center items-center w-[500px]'>
                <span>Status</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Grade</span>
              </div>
              <div className='border-r-2 font-medium  py-3 flex justify-center items-center w-[500px]'>
                <span>Roll No.</span>
              </div>
            </div> */}
            {elementRow}
          </div>
        </div>



      </div>


    </div>
  )
}

export default DashboardHome
