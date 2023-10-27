import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const EditStudent = () => {

  let navigate = useNavigate();

  // const host = process.env.REACT_APP_BACKEND_URL;

// eslint-disable-next-line
  const [rows, setRows] = useState([]);

  const [subjects, setSubjects] = useState([]);

  // const [myFullMarks, setMyFullMarks] = useState(0);
  // const [myMarksObtained, setMyMarksObtained] = useState(0);
  let obj = JSON.parse(localStorage.getItem('obj'));
  const [myData, setMyData] = useState(JSON.parse(localStorage.getItem('obj')));

  useEffect(() => {
    if (!localStorage.getItem('auth-token') || !localStorage.getItem('obj')) {
      navigate('/', { replace: true });
    }


    // console.log()
    setMyData(obj);

    // console.log(handleRows(obj.subjects))
    const rows = handleRows(obj.subjects);
    setRows(rows);

    setSubjects(obj.subjects);
    console.log(subjects)


// eslint-disable-next-line
  }, [obj.subjects]);





  const handleRows = () => {
    const arr = []
    console.log(arr)
    for (let i = 0; i < subjects?.length; i++) {

      const handleChange = (event, i, propertyName) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[i][propertyName] = event.target.value;
        setSubjects(updatedSubjects);
        console.log( event.target.value, subjects)

      };

      arr.push(
        <div className='my_tr w-full ' key={i}>
          <div className="fields w-full flex justify-cente r gap-1">
            <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="text" name="subject" readOnly value={subjects[i]?.subjectName} placeholder='Subject' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input 
                type="number" 
                name="fullMarks" 
                value={subjects[i]?.fullMarks} 
                onChange={(event)=>{ handleChange(event, i, 'fullMarks') }} 
                id="full_marks" 
                placeholder='Full Marks' 
                className='border text-center border-slate-800 w-full py-2 rounded-md' 
              />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="year1" value={subjects[i]?.year1}  placeholder='Year' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="internalMarks" value={subjects[i]?.internalMarks}  placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="internalMarks" value={subjects[i]?.practicalMarks}  placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="year2" value={subjects[i]?.year2}  placeholder='Year2' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="theoryMarks" value={subjects[i]?.theoryMarks}  placeholder='Theory Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="total" value={subjects[i]?.total}  placeholder='Total' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="text" name="letterGrade" value={subjects[i]?.letterGrade}  placeholder='Grade' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="ngp"  value={subjects[i]?.ngp}  placeholder='NGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="credit" value={subjects[i]?.credit}  placeholder='Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
              <input type="number" name="tgp" id="tgp" value={subjects[i]?.tgp}  placeholder='TGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
            </div>
          </div>
        </div>
      );
    }

    // setRows(arr);
    console.log(rows)
    return arr;

    // arr = subjects;
    // console.log(arr)

    // let tmpRowsArr = [];
    // for (let i = 0; i < arr.length; i++) {

    //   const updateSubjectInArr = (updatedObj) => {
    //     const updatedArr = subjects.map((subject) => {
    //       if (subject.subjectName === updatedObj.subjectName) {
    //         return updatedObj; // Update the specific object
    //       }
    //       return subject;
    //     });
    
    //     arr = updatedArr;
    //   };


    //   tmpRowsArr.push(
    //     <EditSubjectRow obj={arr[i]} updateSubject={updateSubjectInArr} />
    //   );
    // }

    // console.log("arr: ", arr)

    // setRows(tmpRowsArr)


    // return arr;

  }


  


  return (
    <div className='m-3 py-5'>
      <div id='heading'>
        <h1 className='text-3xl font-semibold border-b-2 border-b-blue-600 py-2 '>Edit Students</h1>
      </div>
      <div className='w-full  my-5 '>
        <div className="rows w-full p-3 my-3 mt-9">
          <div className="row flex gap-7 ">
            <div id="name-field" className='flex gap-3 items-center  my-1 w-1/2'>
              <div className='w-[15%]'>
                <label htmlFor="name">Name</label>
              </div>
              <div>
                <input type="text" name="name" value={myData?.name} id="name" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="rollno-field" className='flex gap-3 items-center border my-1 invisible'>
              <div className=''>
                <label htmlFor="name">Registration No.</label>
              </div>
              <div>
                <input type="text" name="rollNo" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div>
          <div className="row flex gap-7 ">
            <div id="rollno-field" className='flex gap-3 items-center  my-1 w-1/2'>
              <div className='w-[15%]'>
                <label htmlFor="roll_no">Roll No.</label>
              </div>
              <div>
                <input type="text" name="rollNo" value={myData?.rollNo} id="roll_no" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="registrationno-field" className='flex gap-3 items-center  my-1 '>
              <div className=''>
                <label htmlFor="name">Registration No.</label>
              </div>
              <div>
                <input type="text" name="registration_no" value={myData?.registrationNo} id="registration_no" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div>

          <hr className='my-9 border-slate-300' />
          <div className="row flex gap-7  ">
            <div id="stream-field" className='flex gap-3 items-center  my-1 w-1/4'>
              <div className=''>
                <label htmlFor="stream">Stream</label>
              </div>
              <div className='w-full'>
                <input type="text" name="stream" value={myData?.stream} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="course-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="course">Course</label>
              </div>
              <div className='w-full'>
                <input type="text" name="course" value={myData?.course} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="semester-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="semester">Semester</label>
              </div>
              <div>
                <input type="number" name="semester" value={myData?.semester} id="semester" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
            <div id="year-field" className='flex gap-3 items-center my-1 w-1/4'>
              <div className=''>
                <label htmlFor="year">Year</label>
              </div>
              <div>
                <input type="number" name="year" id="year" value={myData?.year} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
              </div>
            </div>
          </div>
          {/* <hr className='my-9 border-slate-300' />
          <div className='row my-3 '>
            <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 '>Search Student if exist</button>
            <p>* (w.r.t Name, Roll No., Registration No., Stream, or Course)</p>
          </div> */}
          <hr className='my-9 border-slate-300' />
          {/* Current Semester */}
          <div className="row w-full">
            <h3 className='text-xl font-medium my-2'>Semester {myData?.semester}</h3>
            <div className="my_table  w-full">
              <div className="my_thead border-2 w-full flex gap-1 border-black ">
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Subject</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Full Marks</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year1</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Internal M</span></div>

                
                  <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Practical M</span></div>
                
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year2</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Theory M</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Total</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Grade</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>NGP</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Credit</span></div>
                <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>TGP</span></div>
                {/* <div className='w-[8%] py-2 flex justify-center items-center '><span className='font-bold'>Status</span></div> */}
              </div>
              <div id='my_tbody' className="my_tbody border border-slate-400 my-5 w-full flex flex-col justify-center  text-xs ">
                {rows}

              </div>
            </div>
          </div>
          <hr className='my-9 border-slate-300' />


        </div>
      </div>
    </div>
  )
}

export default EditStudent
