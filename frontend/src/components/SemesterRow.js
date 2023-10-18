import React, { useEffect, useState } from 'react'
// import { BiSolidEdit } from 'react-icons/bi'
// import { Link } from 'react-router-dom';

const SemesterRow = (props) => {
    const [myData, setMyData] = useState({});
    const [myFullMarks, setMyFullMarks] = useState(0);
    const [myMarksObtained, setMyMarksObtained] = useState(0);

console.log(props.obj.year)



// console.log(props.obj.subjects)
    // useEffect(() => {

        
        
    //     let tmpObj = {};
    //     tmpObj["name"] = props.obj.name;
    //     tmpObj["year"] = props.obj.year;
    //     tmpObj["rollNo"] = props.obj.rollNo;
    //     tmpObj["registrationNo"] = props.obj.registrationNo;
    //     tmpObj["stream"] = props.obj.stream;
    //     tmpObj["course"] = props.obj.course;
    //     tmpObj["semester"] = props.obj.semester;
    //     tmpObj["sgpa"] = props.obj.sgpa;
    //     tmpObj["remarks"] = props.obj.remarks;
    //     tmpObj["classification"] = props.obj.classification;
    //     tmpObj["cgpa"] = props.obj.cgpa;
    //     tmpObj["status"] = props.obj.status;
    //     tmpObj["totalCredit"] = props.obj.totalCredit;
    //     tmpObj["subjects"] = props.obj.subjects;
    //     setMyData(tmpObj);
        
    //     let fullMarksSum = 0;
    //     let marksObtained = 0;

    //     for (let i = 0; i < myData.subjects?.length; i++) {
    //         // Calculate full marks
    //         fullMarksSum += myData.subjects[i]?.fullMarks;

    //         // Calculate marks obtained

    //         let prc = isNaN(myData.subjects[i]?.practicalMarks)?0: myData.subjects[i]?.practicalMarks;
    //         marksObtained += myData.subjects[i]?.internalMarks + myData.subjects[i]?.theoryMarks + prc;
    //     }

    //     // console.log(marksObtained)
    //     // Check if the values are different before updating state
    //     if (fullMarksSum !== myFullMarks || marksObtained !== myMarksObtained) {
    //         setMyFullMarks(fullMarksSum);
    //         setMyMarksObtained(marksObtained);
    //     }
    // }, [props.obj, myFullMarks, myMarksObtained, myData]);


    
    useEffect(() => {
        // Calculate fullMarksSum and marksObtained here
        let fullMarksSum = 0;
        let marksObtained = 0;
    
        for (let i = 0; i < props.obj.subjects?.length; i++) {
            // Calculate full marks
            fullMarksSum += props.obj.subjects[i]?.fullMarks;
    
            // Calculate marks obtained
            let prc = isNaN(props.obj.subjects[i]?.practicalMarks) ? 0 : props.obj.subjects[i]?.practicalMarks;
            marksObtained += props.obj.subjects[i]?.internalMarks + props.obj.subjects[i]?.theoryMarks + prc;
        }
    
        // Check if the values are different before updating state
        if (fullMarksSum !== myFullMarks || marksObtained !== myMarksObtained) {
            setMyFullMarks(fullMarksSum);
            setMyMarksObtained(marksObtained);
        }
    
        // Update myData
        setMyData({
            name: props.obj.name,
            year: props.obj.year,
            rollNo: props.obj.rollNo,
            registrationNo: props.obj.registrationNo,
            stream: props.obj.stream,
            course: props.obj.course,
            semester: props.obj.semester,
            sgpa: props.obj.sgpa,
            remarks: props.obj.remarks,
            classification: props.obj.classification,
            cgpa: props.obj.cgpa,
            status: props.obj.status,
            totalCredit: props.obj.totalCredit,
            subjects: props.obj.subjects,
        });
    }, [props.obj, myFullMarks, myMarksObtained]);
    

    const handleEdit =()=> {
        localStorage.setItem('obj', JSON.stringify(myData));
        window.open('/edit', '_blank');
    }


    return (
        <div className='my_tr  border-slate-400 w-full '>
            <div className="fields w-full flex   border-slate-400 justify-center gap-1">
                <div className='border-r   w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="text" name="sem1" defaultValue={props.obj.semester} id="sem1" placeholder='Semester' className='bg-slate-200 border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="p_year" id="p_year" value={props.obj.year} placeholder='Year' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r  w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="p_full_marks" id="p_full_marks" value={myFullMarks} placeholder='Full Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>

                <div className='border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="p_marks_obtained" id="p_marks_obtained" value={myMarksObtained} placeholder='Marks Obtained' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="text" name="p_semester_credit" id="p_semester_credit" readOnly defaultValue={myData.totalCredit} placeholder='Semester Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="text" name="p_sgpa" id="p_sgpa" placeholder='SGPA' readOnly defaultValue={myData.sgpa} className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                {/* {console.log(props.sem)} */}

                <div className={`border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400  `}>
                    <div className={`w-full ${props.sem !== 'VI' ? 'invisible' : ''} `} >

                        <input type="text" name="cummulative_credit" id="cummulative_credit" readOnly defaultValue={myData.totalCredit} placeholder='Cummulative Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                    </div>
                </div>
                <div className={`border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400 `}>
                    <div className={`w-full ${props.sem !== 'VI' ? 'invisible' : ''} `} >
                        <input type="text" name="p_cgpa" id="p_cgpa" placeholder='CGPA' readOnly defaultValue={isNaN(myData.cgpa)?' ':myData.cgpa} className='border text-center border-slate-800 w-full py-2 rounded-md' />
                    </div>
                </div>
                <div className={`border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400  `}>
                    <div className={`w-full ${props.sem !== 'VI' ? 'invisible' : ''} `} >
                        <input type="text" name="p_letter_grade" id="p_letter_grade" readOnly defaultValue={''} placeholder='Letter Grade' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                    </div>
                </div>
                <div className={`border-r w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400  `}>
                    <div className={`w-full ${props.sem !== 'VI' ? 'invisible' : ''} `} >
                        <input type="text" name="remarks" id="remarks" placeholder='Remarks' readOnly defaultValue={props.obj.remarks.toString()} className='border text-center border-slate-800 w-full py-2 rounded-md' />
                    </div>
                </div>



                <div className='w-[10%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <button onClick={handleEdit} className='flex gap-1 items-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md'>
                        {/* <BiSolidEdit /> */}
                        <span>View</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SemesterRow
