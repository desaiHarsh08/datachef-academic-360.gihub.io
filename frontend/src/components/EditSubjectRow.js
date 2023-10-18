import React, { useEffect, useState } from 'react'

const EditSubjectRow = ({ obj, updateSubject  }) => {

    const [myData, setMyData] = useState(obj);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setMyData((prev) => ({ ...prev, [name]: value }));
        // console.log(myData)

        updateSubject({ ...myData, [name]: value });
    }


    return (
        <div className='my_tr w-full ' >
            <div className="fields w-full flex justify-cente r gap-1">
                <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="text" name="subject" readOnly value={obj?.subjectName} placeholder='Subject' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r  w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input
                        type="number"
                        name="fullMarks"
                        value={obj?.fullMarks}
                        onChange={handleChange}
                        placeholder='Full Marks'
                        className='border text-center border-slate-800 w-full py-2 rounded-md'
                    />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="year1" value={obj?.year1} placeholder='Year' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="internalMarks" value={obj?.internalMarks} placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                {obj?.practicalMarks && <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="internalMarks" value={obj?.practicalMarks} placeholder='Internal Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>}
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="year2" value={obj?.year2} placeholder='Year2' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="theoryMarks" value={obj?.theoryMarks} placeholder='Theory Marks' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="total" value={obj?.total} placeholder='Total' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="text" name="letterGrade" value={obj?.letterGrade} placeholder='Grade' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="ngp" value={obj?.ngp} placeholder='NGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="credit" value={obj?.credit} placeholder='Credit' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
                <div className='border-r w-[8%] pr-1 py-2 flex justify-center items-center border-slate-400'>
                    <input type="number" name="tgp" id="tgp" value={obj?.tgp} placeholder='TGP' className='border text-center border-slate-800 w-full py-2 rounded-md' />
                </div>
            </div>
        </div>
    )
}

export default EditSubjectRow
