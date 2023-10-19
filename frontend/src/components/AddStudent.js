import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Loading from './Loading'


const AddStudent = () => {

    let navigate = useNavigate();

    if (!localStorage.getItem('auth-token')) {
        // Navigate to home
        navigate('/', { replace: true });
    }

    const host = process.env.REACT_APP_BACKEND_URL;
    const [fdata, setFdata] = useState();
    // eslint-disable-next-line
    const [subjectObjSave, setSubjectObjSave] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [studentMarksheet, setStudentMarksheet] = useState({
        name: '',
        rollNo: '',
        registrationNo: '',
        stream: 'bcom',
        course: 'honours',
        semester: 4,
        year: Date.now

    });

    const [rowDisplay, setRowDisplay] = useState([]);
    const [studentData, setStudentData] = useState({
        name: studentMarksheet.name,
        rollNo: studentMarksheet.rollNo,
        registrationNo: studentMarksheet.registrationNo,
        stream: studentMarksheet.stream,
        course: studentMarksheet.course,
        semester: studentMarksheet.semester,
        sgpa: '',
        remarks: '',
        year: studentMarksheet.year,
        classification: '',
        cgpa: '',
        status: '',
        totalCredit: '',
        subjects: []
    });

    // eslint-disable-next-line
    const [fetchsubject, setFetchSubject] = useState();


    let subjectArr = [];

    // const [subjectState, setSubjectState] = useState([]);

    // const [mySubjects, setMySubjects] = useState([]);

    // let element = [];
    // const [subjectRow, setSubjectRow] = useState([]);

    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState(0);
    useEffect(() => {
        console.log('studentData', studentData)
    }, [studentData])

    useEffect(() => {


        // const handleDeleteSubject = (i, subjectName) => {
        //   subjectArr.splice(i, 1);
        //   element = [];
        //   for (let i = 0; i < subjectArr.length; i++) {
        //     element.push(
        //       <div className='my_tr w-full space-y-1 my-2  py-2 '>
        //         <div className="fields w-full flex justify-center border border-slate-400 gap-1">
        //           <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="text" name="subjectName" placeholder='Subject' value={subjectArr[i]} className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="fullMarks" placeholder='Full Marks' value={100}  className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="year" value={studentMarksheet.year}  placeholder='Year' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="internalMarks" value={0}  placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           {studentMarksheet.stream === 'bcom' ? <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="year2"  placeholder='Year2' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div> :

        //             <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //               <input type="number" name="practicalMarks"  placeholder='Practical Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //             </div>
        //           }
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="theoryMarks" value={0}  placeholder='Theory Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="total" placeholder='Total' value={0}  className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="text" name="grade" placeholder='Grade' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="ngp" placeholder='NGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="credit" placeholder='Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="number" name="tgp" placeholder='TGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //           <div className='w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
        //             <input type="text" name="status" value={'todo'} placeholder='Status' className='border text-center border-slate-800 w-full py-2 rounded-md' />
        //           </div>
        //         </div>
        //         <div>
        //           <button onClick={() => { handleDeleteSubject(i, subjectArr[i]) }} className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md '>Delete Subject</button>
        //         </div>
        //       </div>
        //     );
        //   }


        //   setSubjectRow(element);

        // }

        const fetchData = async () => {
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
                setFetchSubject(data);
                return data;
            } catch (error) {
                // Handle any other errors that might occur during the fetch or parsing JSON
                console.error('Error:', error);
            }
        };

        // Fetch subjects
        fetchData().then((data) => {
            if (data !== undefined) {
                setFdata(data);
                if (studentMarksheet.stream.toLowerCase() === 'bcom') {
                    // Display "BCOM" subjects
                    // eslint-disable-next-line
                    subjectArr = extractSubjects(data[0], studentMarksheet.stream, studentMarksheet.semester, studentMarksheet.course);
                }
                else if (studentMarksheet.stream.toLowerCase() === 'ba') {
                    // Display "BA" subjects
                    subjectArr = extractSubjects(data[0], studentMarksheet.stream, studentMarksheet.semester, studentMarksheet.course);
                }
                else if (studentMarksheet.stream.toLowerCase() === 'bsc') {
                    // Display "BSC" subjects
                    subjectArr = extractSubjects(data[0], studentMarksheet.stream, studentMarksheet.semester, studentMarksheet.course);
                }
            }



        })

        const extractSubjects = (data, stream, semester, course) => {
            // Loop through the keys of the data object
            for (let key in data) {
                if (key === stream) {
                    // console.log(key);
                    for (let key2 in data[key]) {
                        // console.log(key2, `sem{semester}`)
                        if (key2 === `sem${semester}`) {
                            for (let key3 in data[key][key2]) {
                                if (key3 === course) {
                                    // Add common subjects
                                    for (let i = 0; i < data[key][key2]["common"].length; i++) {
                                        if (!subjectArr.includes(data[key][key2]["common"][i]))
                                            subjectArr.push(data[key][key2]["common"][i]);

                                    }

                                    // Add subject based on course
                                    // console.log(data[key][key2][key3].length)
                                    for (let i = 0; i < data[key][key2][key3].length; i++) {
                                        if (!subjectArr.includes(data[key][key2][key3][i]))
                                            subjectArr.push(data[key][key2][key3][i]);
                                    }

                                    // Add elective subjects
                                    for (let i = 0; i < data[key][key2]["elective"].length; i++) {
                                        if (!subjectArr.includes(data[key][key2]["elective"][i]))
                                            subjectArr.push(data[key][key2]["elective"][i]);
                                    }


                                }
                            }

                        }
                    }
                }
            }
            // console.log(subjectArr);
            return subjectArr;
        }
    }, [studentMarksheet, fdata]);


    const extractSubjects = (data, stream, semester, course) => {
        // Loop through the keys of the data object
        for (let key in data) {
            if (key === stream) {
                // console.log(key);
                for (let key2 in data[key]) {
                    // console.log(key2, `sem{semester}`)
                    if (key2 === `sem${semester}`) {
                        for (let key3 in data[key][key2]) {
                            if (key3 === course) {
                                // Add common subjects
                                for (let i = 0; i < data[key][key2]["common"].length; i++) {
                                    if (!subjectArr.includes(data[key][key2]["common"][i]))
                                        subjectArr.push(data[key][key2]["common"][i]);

                                }

                                // Add subject based on course
                                // console.log(data[key][key2][key3].length)
                                for (let i = 0; i < data[key][key2][key3].length; i++) {
                                    if (!subjectArr.includes(data[key][key2][key3][i]))
                                        subjectArr.push(data[key][key2][key3][i]);
                                }

                                // Add elective subjects
                                for (let i = 0; i < data[key][key2]["elective"].length; i++) {
                                    if (!subjectArr.includes(data[key][key2]["elective"][i]))
                                        subjectArr.push(data[key][key2]["elective"][i]);
                                }


                            }
                        }

                    }
                }
            }
        }
        // console.log(subjectArr);
        return subjectArr;
    }

    const handleFileUpload = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                setExcelData(data);
                console.log(data)
            };
            reader.readAsArrayBuffer(file);
        }
        setLoading(false);
    };


    const fetchSemRows = (arr, sem) => {
        let semArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].semester === sem) {
                semArr.push(arr[i]);
            }
        }
        // console.log(sem, semArr)
        return semArr;
    }

    const fetchAllStudentRows = (roll_no) => {
        let allRows = [];
        let tmpArr = [];
        tmpArr = excelData;
        for (let i = 0; i < tmpArr.length; i++) {
            // Check if student row already exist
            if (tmpArr[i].roll_no === roll_no) {
                allRows.push(tmpArr[i]);
                tmpArr[i]["used"] = true;
            }
        }
        setExcelData(tmpArr);
        // console.log(allRows);
        return allRows;
    }


    const handleLogData = () => {
        // console.log('Excel Data:', excelData);
        setLoading(true);
        let allMarksheets = [];
        let count = 0;
        for (let i = 0; i < excelData.length; i++) {
            if (excelData[i]["used"]) {
                continue; // Skip already processed data
            }
            // eslint-disable-next-line
            count += 1;

            let roll_no = excelData[i].roll_no;
            console.log(roll_no)

            // Fetch all rows based on roll_no
            let allStudentRows = fetchAllStudentRows(roll_no);

            // Fetch all rows based on semester
            for (let j = 1; j <= 6; j++) {
                let semArr = fetchSemRows(allStudentRows, j);

                if (semArr.length === 0) {
                    continue; // Skip iteration for no rows for jth semester
                }

                let obj = {
                    name: semArr[0].name,
                    rollNo: roll_no,
                    registrationNo: semArr[0].registration_no,
                    stream: semArr[0].stream,
                    course: semArr[0].course,
                    year: semArr[0].year,
                    semester: j,
                    sgpa: '',
                    remarks: '',
                    classification: '',
                    cgpa: '',
                    status: '',
                    totalCredit: '',
                    subjects: []
                }

                let uniqueSubjects = new Set();

                for (let k = 0; k < semArr.length; k++) {

                    let subjectName = semArr[k].subject;

                    if (!uniqueSubjects.has(subjectName)) {
                        let prc = isNaN(semArr[k].practical_marks) ? 0 : semArr[k].practical_marks

                        obj.subjects.push({
                            subjectName: semArr[k].subject,
                            year1: semArr[k].year1,
                            fullMarks: isNaN(semArr[k].full_marks) ? 100 : semArr[k].full_marks,
                            year2: semArr[k].year2,
                            internalMarks: semArr[k].internal_marks,
                            practicalMarks: prc > 100 ? 0 : prc,
                            theoryMarks: semArr[k].theory_marks,
                            letterGrade: semArr[k].letter_grade,
                            credit: semArr[k].credit,
                            tgp: semArr[k].tgp
                        });

                        uniqueSubjects.add(subjectName);

                        excelData[excelData.indexOf(semArr[k])]["used"] = true;

                    }

                }

                allMarksheets.push(obj);
            }
        }
        console.log("allMarksheets: ", allMarksheets);

        handleAddMultipleStudent(allMarksheets);

    }

    const handleAdd = async () => {
        if (studentData.rollNo === '' || studentData.registrationNo === '') {
            alert('Please provide complete details!');
            return;
        }
        console.log(studentData)
        const res = await fetch(`${host}/api/student/add-marksheet`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        // const data = await res.json();
        if (res.status === 200) {
            alert('Student marksheet data added!');
        }
    }

    const handleAddMultipleStudent = async (allMarksheets) => {
        console.log(allMarksheets)
        document.getElementById('progress').classList.toggle('hidden');
        document.getElementById('progress').classList.toggle('flex');

        for (let i = 0; i < allMarksheets.length; i++) {
            // eslint-disable-next-line
            const res = await fetch(`${host}/api/student/add-marksheet`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(allMarksheets[i])
            });
            // const data = await res.json();
            // console.log(data);
            console.log("progress: ", (i + 1) * 100 / allMarksheets.length);
            setProgress((i + 1) * 100 / allMarksheets.length);
        }
        setLoading(false);
        document.getElementById('progress').classList.toggle('hidden');
        document.getElementById('progress').classList.toggle('flex');

    }


    const handleChange = (event) => {
        const { name, value } = event.target;

        setStudentMarksheet((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));



    }



    const handleSubject = () => {

        // subjectArr = extractSubjects(fdata[0], studentMarksheet.stream, studentMarksheet.semester, studentMarksheet.course);
        // const subjectSelect = document.getElementById('my_subject')
        console.log(subjectObjSave)
        if (subjectObjSave.some(item => item.subjectName === document.getElementById('my_subject').value)) {
            alert('Subject already entered');
            return;
        }

        let subobj = {
            subjectName: document.getElementById('my_subject').value,
            year1: document.getElementById('my_year1').value,
            fullMarks: Number(document.getElementById('my_fullMarks').value),
            year2: document.getElementById('my_year2').value,
            internalMarks: Number(document.getElementById('my_internalMarks').value),
            theoryMarks: Number(document.getElementById('my_theoryMarks').value),
            practicalMarks: studentMarksheet.stream.toLowerCase() === 'bcom' ? 0 : Number(document.getElementById('my_practicalMarks').value),
            credit: Number(document.getElementById('my_credit').value),
            tgp: Number(document.getElementById('my_tgp').value)
        }


        let total = subobj.internalMarks + subobj.practicalMarks + subobj.theoryMarks;
        console.log(total)
        let percent = ((total * 100) / subobj.fullMarks);
        subobj["ngp"] = percent / 10;


        if (percent >= 90 && percent <= 100) { subobj["letterGrade"] = "A++" }
        if (percent >= 80 && percent < 90) { subobj["letterGrade"] = "A+" }
        if (percent >= 70 && percent < 80) { subobj["letterGrade"] = "A" }
        if (percent >= 60 && percent < 70) { subobj["letterGrade"] = "B+" }
        if (percent >= 50 && percent < 60) { subobj["letterGrade"] = "B" }
        if (percent >= 40 && percent < 50) { subobj["letterGrade"] = "C+" }
        if (percent >= 30 && percent < 40) { subobj["letterGrade"] = "C" }
        if (percent >= 0 && percent < 30) { subobj["letterGrade"] = "F" }





        console.log(subobj)
        // console.log(subjectArr)

        let tmpObj = {
            name: studentMarksheet.name,
            rollNo: studentMarksheet.rollNo,
            registrationNo: studentMarksheet.registrationNo,
            stream: studentMarksheet.stream,
            course: studentMarksheet.course,
            semester: studentMarksheet.semester,
            sgpa: '',
            remarks: '',
            year: studentMarksheet.year,
            classification: '',
            cgpa: '',
            status: '',
            totalCredit: '',
            subjects: []
        }
        subjectObjSave.push(subobj);
        tmpObj.subjects.push(subobj);
        console.log(tmpObj)

        setStudentData(tmpObj);
        console.log(studentData)
        for (let i = 0; i < tmpObj?.subjects.length; i++) {
            console.log(tmpObj.subjects[i], tmpObj.subjects[i].subjectName)
            rowDisplay.push(
                <div className='my_tr w-full space-y-1 my-2  py-2 ' key={i}>
                    <div className="fields w-full flex justify-center border border-slate-400 gap-1">
                        <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="text" name="subjectName" placeholder='Subject' value={tmpObj.subjects[i]?.subjectName} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].subjectName}
                        </div>
                        <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="fullMarks" placeholder='Full Marks' value={tmpObj.subjects[i].fullMarks} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].fullMarks}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="year" value={tmpObj.subjects[i].year1} placeholder='Year' className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].year1}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="internalMarks" value={tmpObj.subjects[i].internalMarks} placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].internalMarks}
                        </div>
                        {studentMarksheet.stream === 'bcom' ? <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="year2" placeholder='Year2' value={tmpObj.subjects[i].year2} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].year2}
                        </div> :

                            <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                                {/* <input type="number" name="practicalMarks" placeholder='Practical Marks' value={tmpObj.subjects[i].practicalMarks} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                                {tmpObj.subjects[i].practicalMarks}
                            </div>
                        }
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="theoryMarks" value={tmpObj.subjects[i].theoryMarks} placeholder='Theory Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].theoryMarks}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="total" placeholder='Total' value={tmpObj.subjects[i].internalMarks + tmpObj.subjects[i].theoryMarks + tmpObj.subjects[i].practicalMarks} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].internalMarks + tmpObj.subjects[i].theoryMarks + tmpObj.subjects[i].practicalMarks}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="text" name="grade" placeholder='Grade' value={tmpObj.subjects[i].letterGrade} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].letterGrade}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="ngp" placeholder='NGP' value={tmpObj.subjects[i].ngp} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            {tmpObj.subjects[i].ngp}
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="credit" value={0} placeholder='Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            todo
                        </div>
                        <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="number" name="tgp" placeholder='TGP' value={0} className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            todo
                        </div>
                        <div className='w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                            {/* <input type="text" name="status" value={'todo'} placeholder='Status' className='border text-center border-slate-800 w-full py-2 rounded-md' /> */}
                            todo
                        </div>
                    </div>
                    <div>
                        <button onClick={() => { handleDeleteSubject(i, tmpObj.subjects[i].subjectName, tmpObj) }} className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md '>Delete Subject</button>
                    </div>
                </div>
            );
        }

    }

    const handleDeleteSubject = (rowDisplayIndex, subjectName, tmpObj) => {
        setStudentData(tmpObj)
        // Remove the subject from subjectObjSave
        const index = subjectObjSave.findIndex(item => item.subjectName === subjectName);
        if (index !== -1) {
            subjectObjSave.splice(index, 1);
        }

        // Update studentData
        if (studentData) {
            studentData.subjects = studentData.subjects.filter(item => item.subjectName !== subjectName);
        }

        // Remove the rowDisplay item

        setRowDisplay(rowDisplay.splice(rowDisplayIndex, 1))
        console.log(studentData, subjectObjSave, rowDisplay)

    }


    const handleAddBox = () => {
        console.log('fired')
        document.getElementById('add-box').classList.toggle('translate-y-[1000px]');

        subjectArr = extractSubjects(fdata[0], studentMarksheet.stream, studentMarksheet.semester, studentMarksheet.course);
        const subjectSelect = document.getElementById('my_subject');

        subjectSelect.innerHTML = '';
        for (let i = 0; i < subjectArr.length; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', subjectArr[i]);
            option.textContent = subjectArr[i];
            subjectSelect.append(option);
        }


    }

    return (
        <>
            {loading ? <Loading /> : ''}
            <div className='m-3 py-5 '>
                <div id='heading'>
                    <h1 className='text-3xl font-semibold border-b-2 border-b-blue-600 py-2 '>Add Students</h1>
                </div>
                <div className='mt-7 my-3'>
                    <p>To efficiently add multiple students to the database in one go, please upload an Excel file containing the student records.</p>
                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} className='my-2' />
                    <button className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md' onClick={handleLogData}>Upload</button>
                    <p className='text-center my-7'>---------- Or ----------</p>
                    <p>Add a student data</p>
                </div>

                {/* Marksheet Card */}
                <div className="w-full overflow-scroll">
                <div className='w-full border-2 border-blue-500 min-w-[1240px] overflow-x-scroll '>
                    <span className='mx-2'>#student-marksheet</span>
                    <div className='rows w-full p-3 my-3 mt-9  '>
                        <div className="row flex gap-7 ">
                            <div id="name-field" className='flex gap-3 items-center  my-1 w-1/2'>
                                <div className='w-[15%]'>
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div>
                                    <input type="text" name="name" value={studentMarksheet.name} onChange={handleChange} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
                                </div>
                            </div>
                            <div className='flex gap-3 items-center border my-1 invisible'>
                                <div className=''>
                                    <label htmlFor="name">Registration No.</label>
                                </div>
                                <div>
                                    <input type="text" className='border-2 border-slate-700 px-4 py-1 rounded-md' />
                                </div>
                            </div>
                        </div>
                        <div className="row flex gap-7 ">
                            <div id="rollno-field" className='flex gap-3 items-center  my-1 w-1/2'>
                                <div className='w-[15%]'>
                                    <label htmlFor="roll_no">Roll No.</label>
                                </div>
                                <div>
                                    <input type="text" name="rollNo" onChange={handleChange} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
                                </div>
                            </div>
                            <div id="registrationno-field" className='flex gap-3 items-center  my-1 '>
                                <div className=''>
                                    <label htmlFor="name">Registration No.</label>
                                </div>
                                <div>
                                    <input type="text" name="registrationNo" value={studentMarksheet.registrationNo} onChange={handleChange} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
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
                                    <select name="stream" id="stream" value={studentMarksheet.stream} onChange={handleChange} className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
                                        <option value="bcom">BCOM</option>
                                        <option value="ba">BA</option>
                                        <option value="bsc">BSC</option>
                                    </select>
                                </div>
                            </div>
                            <div id="course-field" className='flex gap-3 items-center my-1 w-1/4'>
                                <div className=''>
                                    <label htmlFor="course">Course</label>
                                </div>
                                <div className='w-full'>
                                    <select name="course" id="course" value={studentMarksheet.course} onChange={handleChange} className='border-2 border-slate-700 w-full px-4 py-1 rounded-md'>
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
                                    <input type="number" name="semester" value={studentMarksheet.semester} onChange={handleChange} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
                                </div>
                            </div>
                            <div id="year-field" className='flex gap-3 items-center my-1 w-1/4'>
                                <div className=''>
                                    <label htmlFor="year">Year</label>
                                </div>
                                <div>
                                    <input type="number" name="year" value={studentMarksheet.year} onChange={handleChange} className='border-2 border-slate-700 px-4 py-1 rounded-md' />
                                </div>
                            </div>
                        </div>
                        <hr className='my-9 border-slate-300' />



                        {/* Current Semester */}
                        <div className="row w-full">
                            <div className="w-full flex justify-between items-center ">
                                <div>

                                    <h3 className='text-xl font-medium my-2'>Current Semesters</h3>
                                </div>
                                <div>
                                    <button onClick={handleAddBox} className='bg-purple-500 text-white px-4 py-1 font-medium rounded-md'>Add Subject</button>
                                </div>
                            </div>
                            <div className="my_table  w-full">
                                <div className="my_thead border-2 w-full flex justify-around border-black ">
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Subject</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Full Marks</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Internal M</span></div>

                                    {studentMarksheet.stream === 'bcom' ? <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Year</span></div> : ''}
                                    {
                                        studentMarksheet.stream !== 'bcom' ?
                                            <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Practical Marks</span></div> : ''
                                    }
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Theory M</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Total</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Grade</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>NGP</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>Credit</span></div>
                                    <div className='border-r-2 w-[8%] py-2 flex justify-center items-center border-black'><span className='font-bold'>TGP</span></div>
                                    <div className='w-[8%] py-2 flex justify-center items-center '><span className='font-bold'>Status</span></div>
                                </div>
                                <div id='my_tbody' className="my_tbody  my-5 w-full flex flex-col justify-center  text-xs ">

                                    {/* {subjectRow} */}
                                    {rowDisplay}
                                </div>
                            </div>
                        </div>

                        <hr className='my-9 border-slate-300' />



                        <div>
                            <button onClick={handleAdd} className='bg-green-500 hover:bg-green-600 text-white font-medium rounded-md px-4 py-2'>Add</button>
                        </div>
                    </div>
                </div>
                </div>

                
            </div>


            <div id='add-box' className='transition-all duration-150 translate-y-[1000px] w-full absolute top-0 bottom-0 right-0 left-0  flex justify-center items-center  shadow-xl ' >
                <div className='bg-white text-black border-2 z-30 p-7 border-black w-[85%] h-[89vh] overflow-y-auto  '>
                    <div id="close-container" onClick={handleAddBox} className='flex justify-end w-full cursor-pointer' >
                        <div>
                            <div className='w-7 translate-y-1 h-1 bg-black -rotate-45 rounded-md'></div>
                            <div className='w-7  h-1 bg-black rotate-45 rounded-md '></div>
                        </div>
                    </div>
                    <div className='my-2'>
                        <h3 className='text-2xl font-medium my-7'>Add Subject</h3>
                        <div className='w-full '>
                            <div className='my-fields  '>
                                <div className="my_subjects flex my-2 space-x-2 ">
                                    <div className='w-1/5'>
                                        <label htmlFor="subject">Subject</label>
                                    </div>
                                    <div className='w-[80%]'>
                                        <select name="subject" id='my_subject' className='border-2 border-black px-4 py-2 rounded-md'  >
                                            <option value="s1" >s1</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="my_fullmarks my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="fullMarks">Full Marks</label>
                                    </div>
                                    <input type="number" name='fullMarks' id='my_fullMarks' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_year1 my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="year1">Year1</label>
                                    </div>
                                    <input type="number" name='year1' id='my_year1' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_year2 my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="year2">Year2</label>
                                    </div>
                                    <input type="number" name='year2' id='my_year2' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_internal my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="internalMarks">Internal Marks</label>
                                    </div>
                                    <input type="number" name='internalMarks' id='my_internalMarks' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_practical my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="practicalMarks">Practical Marks</label>
                                    </div>
                                    <input type="number" name='practicalMarks' id='my_practicalMarks' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_practical my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="theoryMarks">Theory Marks</label>
                                    </div>
                                    <input type="number" name='theoryMarks' id='my_theoryMarks' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_credit my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="credit">Credit</label>
                                    </div>
                                    <input type="number" name='credit' id='my_credit' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                                <div className="my_tgp my-2 sm:space-x-2 flex flex-col md:flex-row">
                                    <div className='sm:w-1/5'>
                                        <label htmlFor="tgp">TGP</label>
                                    </div>
                                    <input type="number" name='tgp' id='my_tgp' className='border-2 border-black px-4 py-2 rounded-md' />
                                </div>
                            </div>

                            <div className='my-7'>
                                <button onClick={handleSubject} className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium'>Add Subject</button>
                            </div>
                        </div>


                    </div>
                </div>

            </div>


            <div id="progress" className='hidden absolute right-0 bg-slate-500 border-2 border-transparent border-rounded-xl bottom-0 w-[15%] h-[15%] text-white font-medium  justify-center items-center '>
                <div className='flex gap-3 text-xl justify-center items-center'>
                    <span>Completed:</span>
                    <span>{progress.toFixed(2)}%</span>
                </div>
            </div>


        </>
    )
}

export default AddStudent
