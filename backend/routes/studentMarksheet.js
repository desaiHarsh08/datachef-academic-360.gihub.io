import express from 'express';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js'
import StudentMarksheet from '../models/StudentMarksheet.js'
import { ObjectId } from 'mongoose';


const router = express.Router();




async function handleStudentMarksheet({
    name, rollNo, registrationNo, stream, course, semester, sgpa, remarks, classification, cgpa, status, totalCredit, subjects
}) {



    const studentMarksheet = new StudentMarksheet({
        name, rollNo, registrationNo, stream, course, semester, sgpa, remarks, classification, cgpa, status, totalCredit, subjects
    });







    // Set "total"(for every subject), "ngp", "letterGrade", "sgpa", "cgpa", "classification", "status"
    let ngp_credit = 0, creditSum = 0, fullMarksSum = 0, totalMarksObtained = 0;
    let isPreviousSemesterCleared = false;
    for (let i = 0; i < studentMarksheet.subjects.length; i++) {
        // Add "total" field to the marksheet
        let im = isNaN(studentMarksheet.subjects[i].internalMarks) ? 0 : Number(studentMarksheet.subjects[i].internalMarks);
        let tm = isNaN(studentMarksheet.subjects[i].theoryMarks) ? 0 : Number(studentMarksheet.subjects[i].theoryMarks);


        if (studentMarksheet.stream.toUpperCase() !== "BCOM") { // For "BA" and "BSC"
            let pm = isNaN(studentMarksheet.subjects[i].practicalMarks) ? 0 : Number(studentMarksheet.subjects[i].practicalMarks);
            if (pm > 100) {
                pm = 0;
            }
            studentMarksheet.subjects[i]["total"] = im + pm + tm;
        }
        else { //For "BCOM"
            studentMarksheet.subjects[i]["total"] = im + tm;
        }

        totalMarksObtained += studentMarksheet.subjects[i]["total"]
        fullMarksSum += studentMarksheet.subjects[i].fullMarks;

        // Calculate NGP as % marks / 10 for each subject
        let percent = (studentMarksheet.subjects[i]["total"] * 100) / studentMarksheet.subjects[i].fullMarks;
        studentMarksheet.subjects[i]["ngp"] = (percent / 10);

        // Calculate product of NGP and Credit
        ngp_credit += studentMarksheet.subjects[i].ngp * studentMarksheet.subjects[i].credit;
        creditSum += studentMarksheet.subjects[i].credit;


        // Mark letterGrade for "BCOM"
        if (studentMarksheet.stream.toUpperCase() === "BCOM") {
            if (percent >= 90 && percent <= 100) { studentMarksheet.subjects[i]["letterGrade"] = "A++" }
            if (percent >= 80 && percent < 90) { studentMarksheet.subjects[i]["letterGrade"] = "A+" }
            if (percent >= 70 && percent < 80) { studentMarksheet.subjects[i]["letterGrade"] = "A" }
            if (percent >= 60 && percent < 70) { studentMarksheet.subjects[i]["letterGrade"] = "B+" }
            if (percent >= 50 && percent < 60) { studentMarksheet.subjects[i]["letterGrade"] = "B" }
            if (percent >= 40 && percent < 50) { studentMarksheet.subjects[i]["letterGrade"] = "C+" }
            if (percent >= 30 && percent < 40) { studentMarksheet.subjects[i]["letterGrade"] = "C" }
            if (percent >= 0 && percent < 30) { studentMarksheet.subjects[i]["letterGrade"] = "F" }
        }

    }

    let studentPercent = (totalMarksObtained * 100) / fullMarksSum;

    // Set status for stream "BA" and "BSC"
    if (studentPercent < 30) {
        studentMarksheet["status"] = "F";
    }
    else {
        studentMarksheet["status"] = "P";
    }


    // Set SGPA
    if (studentPercent > 30) { // For student got pass
        studentMarksheet.sgpa = ngp_credit / creditSum;
        studentMarksheet["totalCredit"] = creditSum;

    }
    else { // For student got failed
        studentMarksheet.sgpa = '';
    }

    // Calculate CGPA, if semester is 6th
    if (studentMarksheet.semester === 6) {
        let sgpa_credit = 0, creditSumAllSem = 0;
        for (let i = 1; i <= 6; i++) {
            let marksheet = await StudentMarksheet.findOne({ rollNo, registrationNo, semester: i });

            if (!marksheet) {
                // return res.status(500).json({ error: `Student marksheet data for roll no. "${rollNo}", semester-${i} doesn't exist!` })
                continue;
            }
            let temp_sgpa = isNaN(parseFloat(marksheet.sgpa)) ? 0 : parseFloat(marksheet.sgpa);
            let temp_totalCrdit = isNaN(parseFloat(marksheet.totalCredit)) ? 0 : parseFloat(marksheet.totalCredit);
            sgpa_credit += temp_sgpa + temp_totalCrdit;
            creditSumAllSem += Number(marksheet.totalCredit);
        }
        studentMarksheet.cgpa = sgpa_credit / creditSumAllSem;

        // Mark classification
        if (studentMarksheet.cgpa >= 9 && studentMarksheet.cgpa <= 10) {
            studentMarksheet.classification = "Outstanding";
        }
        else if (studentMarksheet.cgpa >= 8 && studentMarksheet.cgpa < 9) {
            studentMarksheet.classification = "Excellent";
        }
        else if (studentMarksheet.cgpa >= 7 && studentMarksheet.cgpa < 8) {
            studentMarksheet.classification = "Very Good";
        }
        else if (studentMarksheet.cgpa >= 6 && studentMarksheet.cgpa < 7) {
            studentMarksheet.classification = "Good";
        }
        else if (studentMarksheet.cgpa >= 5 && studentMarksheet.cgpa < 6) {
            studentMarksheet.classification = "Average";
        }
        else if (studentMarksheet.cgpa >= 4 && studentMarksheet.cgpa < 5) {
            studentMarksheet.classification = "Fair";
        }
        else if (studentMarksheet.cgpa >= 3 && studentMarksheet.cgpa < 4) {
            studentMarksheet.classification = "Satisfactory";
        }
        else if (studentMarksheet.cgpa >= 0 && studentMarksheet.cgpa < 3) {
            studentMarksheet.classification = "Fail";
        }



    }
    else {
        studentMarksheet.cgpa = '';
    }



    // Set remarks for current semester
    if (studentPercent > 30) {
        if (course === 'honours' && semester === 6) { // For BCOM (H), semester-6
            studentMarksheet.remarks = "Semester cleared with honours.";
        }
        else if (course === 'general' && semester === 6) { // For BCOM (G), semester-6
            studentMarksheet.remarks = "Semester cleared with General.";
        }
        else if (stream.toUpperCase() !== 'BCOM' && semester === 6) { // For "BA" and "BSC", semester-6
            studentMarksheet.remarks = "Qualified with Honours.";
        }
        else if (stream.toUpperCase() !== 'BCOM') {
            studentMarksheet.remarks = "Semester cleared.";
        }
        else { // For semesters: 1, 2, 3, 4, 5, 6
            studentMarksheet.remarks = "Semester cleared.";
        }
    }
    else {
        studentMarksheet.remarks = 'Semester not cleared.';
    }

    // Set classification for student marksheet for semester 6th
    if (semester > 1 && semester === 6) {
        // Check all semester marsheets
        for (let i = 1; i <= studentMarksheet.semester - 1; i++) {
            let marksheet = await StudentMarksheet.findOne({ rollNo, registrationNo, semester: i });
            if (!marksheet) {
                return res.status(500).json({ error: `Student marksheet for roll no. "${rollNo}" semester-${i} not exist!` });
            }

            if (studentPercent > 30) {
                isPreviousSemesterCleared = true;
            }
            else {
                isPreviousSemesterCleared = false;
            }
        }
        // console.log(isPreviousSemesterCleared)
        if (isPreviousSemesterCleared) {
            studentMarksheet.classification = "";
        }
        else {
            studentMarksheet.classification = "Previous Semester not cleared";
        }
    }
    else {
        studentMarksheet.remarks = '';
    }


    // console.log(studentMarksheet)
    return studentMarksheet;
}


async function handleSemester6(rollNo) {
    try {
        const marksheetArr = await StudentMarksheet.find({ rollNo });
        if (marksheetArr.length === 0) {
            return;
        }

        // Fetch semester-6 marksheet
        let tmpArr = marksheetArr.filter((marksheet) => (marksheet.semester === 6 && !marksheet.backlog));
        if (tmpArr.length === 0) {
            return;
        }

        let marksheetSem6 = tmpArr[0];

        for (let i = 0; i < marksheetArr.length; i++) {
            // For no backlog
            if (!marksheetArr[i].backlog) {
                marksheetArr[i] = await handleStudentMarksheet(marksheetArr[i]);
                marksheetArr[i].save();
            }
        }

    } catch (error) {

    }
}




// ROUTE 1: Get all the marksheets using: GET "/api/student". Login required
router.get('/fetch-all-sem-marksheets', fetchuser, async (req, res) => {
    const studentMarksheets = await StudentMarksheet.find()
    res.json(studentMarksheets);
})




// ROUTE 2: Add a marksheet using: POST "/api/student". Login required
router.post('/add-marksheet', fetchuser, async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            year, name, rollNo, registrationNo, stream, course, semester, sgpa, remarks, classification, cgpa, status, totalCredit, subjects
        } = req.body;

        const studentMarksheet = new StudentMarksheet({
            year, name, rollNo, registrationNo, stream, course, semester, sgpa, remarks, classification, cgpa, status, totalCredit, subjects, user: req.user.id,
        });

        // Check for student's marksheet already exist, return if exist
        const isMarksheetExist = await StudentMarksheet.findOne({ rollNo, registrationNo, semester, year })
        // console.log("is marksheet already exist: ", isMarksheetExist)
        if (isMarksheetExist !== null) {
            return res.status(400).json({ error: "Student's marksheet already exist. Do edit the marksheet if you want to change some data." })
        }

        // Set "total"(for every subject), "ngp", "letterGrade", "sgpa", "cgpa", "classification", "status"
        let ngp_credit = 0, creditSum = 0, fullMarksSum = 0, totalMarksObtained = 0;
        let isPreviousSemesterCleared = false;
        for (let i = 0; i < studentMarksheet.subjects.length; i++) {

            // Add "total" field to the marksheet
            let im = isNaN(studentMarksheet.subjects[i].internalMarks) ? 0 : Number(studentMarksheet.subjects[i].internalMarks);
            let tm = isNaN(studentMarksheet.subjects[i].theoryMarks) ? 0 : Number(studentMarksheet.subjects[i].theoryMarks);

            if (studentMarksheet.stream.toUpperCase() !== "BCOM") { // For "BA" and "BSC"
                let pm = isNaN(studentMarksheet.subjects[i].practicalMarks) ? 0 : Number(studentMarksheet.subjects[i].practicalMarks);
                if (pm > 100) {
                    pm = 0;
                }
                studentMarksheet.subjects[i]["total"] = im + pm + tm;
            }
            else { //For "BCOM"
                studentMarksheet.subjects[i]["total"] = im + tm;
            }



            totalMarksObtained += studentMarksheet.subjects[i]["total"]
            fullMarksSum += studentMarksheet.subjects[i].fullMarks;

            // Calculate NGP as % marks / 10 for each subject
            let percent = (studentMarksheet.subjects[i]["total"] * 100) / studentMarksheet.subjects[i].fullMarks;
            studentMarksheet.subjects[i]["ngp"] = (percent / 10);

            // Calculate product of NGP and Credit
            ngp_credit += studentMarksheet.subjects[i].ngp * studentMarksheet.subjects[i].credit;
            creditSum += studentMarksheet.subjects[i].credit;


            // Mark letterGrade for "BCOM"
            // if (studentMarksheet.stream.toUpperCase() === "BCOM") {
            if (percent >= 90 && percent <= 100) { studentMarksheet.subjects[i]["letterGrade"] = "A++" }
            if (percent >= 80 && percent < 90) { studentMarksheet.subjects[i]["letterGrade"] = "A+" }
            if (percent >= 70 && percent < 80) { studentMarksheet.subjects[i]["letterGrade"] = "A" }
            if (percent >= 60 && percent < 70) { studentMarksheet.subjects[i]["letterGrade"] = "B+" }
            if (percent >= 50 && percent < 60) { studentMarksheet.subjects[i]["letterGrade"] = "B" }
            if (percent >= 40 && percent < 50) { studentMarksheet.subjects[i]["letterGrade"] = "C+" }
            if (percent >= 30 && percent < 40) { studentMarksheet.subjects[i]["letterGrade"] = "C" }
            if (percent >= 0 && percent < 30) { studentMarksheet.subjects[i]["letterGrade"] = "F" }
            // }

        }

        let studentPercent = (totalMarksObtained * 100) / fullMarksSum;

        // Set status for stream "BA" and "BSC"
        if (studentPercent < 30) {
            studentMarksheet["status"] = "F";
        }
        else {
            studentMarksheet["status"] = "P";
        }

        studentMarksheet["totalCredit"] = creditSum;

        console.log(rollNo, studentPercent)
        // Set SGPA
        if (studentPercent >= 30) { // For student got pass
            studentMarksheet.sgpa = ngp_credit / creditSum;


        }
        else { // For student got failed
            studentMarksheet.sgpa = 0;
            studentMarksheet["backlog"] = true;
        }

        // Calculate CGPA, if semester is 6th
        if (studentMarksheet.semester === 6) {
            let sgpa_credit = 0, creditSumAllSem = 0;
            for (let i = 1; i < 6; i++) {
                let marksheet = await StudentMarksheet.findOne({ rollNo, registrationNo, semester: i });

                if (!marksheet) {
                    // return res.status(404).json({ error: `Student marksheet data for roll no. "${rollNo}", semester-${i} doesn't exist!` })
                    continue;
                }
                let temp_sgpa = isNaN(parseFloat(marksheet.sgpa)) ? 0 : parseFloat(marksheet.sgpa);
                let temp_totalCrdit = isNaN(parseFloat(marksheet.totalCredit)) ? 0 : parseFloat(marksheet.totalCredit);
                sgpa_credit += temp_sgpa + temp_totalCrdit;
                creditSumAllSem += Number(marksheet.totalCredit);
            }
            studentMarksheet.cgpa = (sgpa_credit / creditSumAllSem).toFixed(3);
            console.log("semester is:", semester)
            // Mark classification
            if (studentMarksheet.cgpa >= 9 && studentMarksheet.cgpa <= 10) {
                studentMarksheet.classification = "Outstanding";
            }
            else if (studentMarksheet.cgpa >= 8 && studentMarksheet.cgpa < 9) {
                studentMarksheet.classification = "Excellent";
            }
            else if (studentMarksheet.cgpa >= 7 && studentMarksheet.cgpa < 8) {
                studentMarksheet.classification = "Very Good";
            }
            else if (studentMarksheet.cgpa >= 6 && studentMarksheet.cgpa < 7) {
                studentMarksheet.classification = "Good";
            }
            else if (studentMarksheet.cgpa >= 5 && studentMarksheet.cgpa < 6) {
                studentMarksheet.classification = "Average";
            }
            else if (studentMarksheet.cgpa >= 4 && studentMarksheet.cgpa < 5) {
                studentMarksheet.classification = "Fair";
            }
            else if (studentMarksheet.cgpa >= 3 && studentMarksheet.cgpa < 4) {
                studentMarksheet.classification = "Satisfactory";
            }
            else if (studentMarksheet.cgpa >= 0 && studentMarksheet.cgpa < 3) {
                studentMarksheet.classification = "Fail";
            }



        }
        else {
            studentMarksheet.cgpa = '';
        }



        // Set remarks for current semester
        if (studentPercent > 30) {
            if (course === 'honours' && semester === 6) { // For BCOM (H), semester-6
                studentMarksheet.remarks = "Semester cleared with honours.";
            }
            else if (course === 'general' && semester === 6) { // For BCOM (G), semester-6
                studentMarksheet.remarks = "Semester cleared with General.";
            }
            else if (stream.toUpperCase() !== 'BCOM' && semester === 6) { // For "BA" and "BSC", semester-6
                studentMarksheet.remarks = "Qualified with Honours.";
            }
            else if (stream.toUpperCase() !== 'BCOM') {
                studentMarksheet.remarks = "Semester cleared.";
            }
            else { // For semesters: 1, 2, 3, 4, 5, 6
                studentMarksheet.remarks = "Semester cleared.";
            }
        }
        else {
            studentMarksheet.remarks = 'Semester not cleared.';
        }

        // Set classification for student marksheet for semester 6th

        if (semester > 1 && semester === 6) {
            // Check all semester marsheets
            for (let i = 1; i <= studentMarksheet.semester - 1; i++) {
                let marksheet = await StudentMarksheet.findOne({ rollNo, registrationNo, semester: i });
                if (!marksheet) {
                    // return res.status(500).json({ error: `Student marksheet for roll no. "${rollNo}" semester-${i} not exist!` });
                    continue;
                }

                if (studentPercent > 30) {
                    isPreviousSemesterCleared = true;
                }
                else {
                    isPreviousSemesterCleared = false;
                }

                let mycgpa = isNaN(parseFloat(studentMarksheet.cgpa)) ? 0 : parseFloat(studentMarksheet.cgpa);
                if (studentPercent > 30 && semester === 6 && mycgpa >= 3) {
                    isPreviousSemesterCleared = true;
                }
                else {
                    isPreviousSemesterCleared = false;
                }
            }
            // console.log(isPreviousSemesterCleared)
            if (isPreviousSemesterCleared) {
                studentMarksheet.classification = "";
            }
            else {
                studentMarksheet.classification = "Previous Semester not cleared";
            }
        }
        else {
            studentMarksheet.remarks = '';
        }


        // console.log(studentMarksheet)

        // Save the student's marksheet to the database
        const savedMarksheet = await studentMarksheet.save();

        await handleSemester6(studentMarksheet.rollNo);
        // Return status code 200
        return res.status(200).json(savedMarksheet);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }

})


// ROUTE 3: Update the existing marksheet  using: PUT "/api/student". Login required
router.put('/update', fetchuser, async (req, res) => {

    try {
        const givenMarksheet = req.body;

        let existingMarksheet = await StudentMarksheet.findOne({ rollNo: givenMarksheet.rollNo, registrationNo: givenMarksheet.registrationNo, semester: givenMarksheet.semester })

        if (!existingMarksheet) {
            return res.status(404).json({ message: "The given student marksheet doesn't exist!" });
        }


        const updatedMarksheet = await handleStudentMarksheet(req.body)

        // console.log(updatedMarksheet)
        existingMarksheet.sgpa = updatedMarksheet.sgpa;
        existingMarksheet.remarks = updatedMarksheet.remarks;
        existingMarksheet.classification = updatedMarksheet.classification;
        existingMarksheet.cgpa = updatedMarksheet.cgpa;
        existingMarksheet.status = updatedMarksheet.status;
        existingMarksheet.totalCredit = updatedMarksheet.totalCredit;
        existingMarksheet.subjects = updatedMarksheet.subjects;

        await existingMarksheet.save();


        await handleSemester6(givenMarksheet.rollNo);

        res.json({ message: "Student data got updated!" });



    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error!" });
    }




})


// ROUTE 4: Delete the existing marksheet  using: DELETE "/api/student/delete". Login required
router.delete('/delete', fetchuser, async (req, res) => {
    const { rollNo, registrationNo, semester, year } = req.body;
    let marksheet = await StudentMarksheet.findOne({ rollNo, registrationNo, semester, year });
    if (!marksheet) {
        return res.status(404).json({ error: "The marksheet for given data not exist!" });
    }

    marksheet = await StudentMarksheet.deleteOne({ rollNo, registrationNo, semester, year });

    await handleSemester6(rollNo);

    return res.status(200).json({ message: "Student marksheet deleted!" });
})


// ROUTE 5: Add the marksheet using file using: POST "/api/student". Login required
router.post('/add-multiple-marksheet', fetchuser, async (req, res) => {

    try {
        const marksheetArr = req.body;




        // console.log(marksheetArr.length)
        let count = 0;
        for (let i = 0; i < marksheetArr.length; i++) {
            // Check for marksheet already exist
            let existingMarksheet = await StudentMarksheet.findOne({ rollNo: marksheetArr[i].rollNo, registrationNo: marksheetArr[i].registrationNo, semester: marksheetArr[i].semester })

            if (existingMarksheet) {
                return res.status(404).json({ message: `The student marksheet for Roll No.: ${marksheetArr[i].rollNo} \Registration No.: ${marksheetArr[i].registrationNo} already exist exist!` });
            }



            // console.log(marksheetArr[i]);
            // name, rollNo, registrationNo, stream, course, semester,

            let studentMarksheet = new StudentMarksheet(marksheetArr[i]);

            studentMarksheet.name = marksheetArr[i].name;
            studentMarksheet.rollNo = marksheetArr[i].rollNo;
            studentMarksheet.registrationNo = marksheetArr[i].registrationNo;
            studentMarksheet.stream = marksheetArr[i].stream;
            studentMarksheet.course = marksheetArr[i].course;
            studentMarksheet.semester = marksheetArr[i].semester;



            let marksheetToStore = await handleStudentMarksheet(studentMarksheet);
            // console.log(await studentMarksheet.save(marksheetToStore));

            if (await StudentMarksheet.findOne({ rollNo: marksheetArr[i].rollNo, registrationNo: marksheetArr[i].registrationNo, semester: marksheetArr[i].semester })) {
                count++;
            }
        }
        // console.log(count)
        res.json({ message: "Student data got stored!" });



    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error!" });
    }




})


// ROUTE 6: Get all semester marksheet for the particular student using: POST "/api/student/search". Login required
router.post('/search', fetchuser, async (req, res) => {
    const { rollNo } = req.body;

    if (rollNo === null) {
        return res.status(400).json({ error: "Please provide rollNo!" });
    }

    let marksheetsObj = {
        cleared: [],
        not_cleared: []
    };


    let studentMarksheetArr = await StudentMarksheet.find({ rollNo });

    if (studentMarksheetArr.length === 0) {
        return res.status(404).json({ error: "Student data not found!" });
    }

    for (let i = 0; i < studentMarksheetArr.length; i++) {
        if (studentMarksheetArr[i]["status"] !== 'F') {
            marksheetsObj.cleared.push(studentMarksheetArr[i]);
        }
        else {
            marksheetsObj.not_cleared.push(studentMarksheetArr[i]);
        }
    }

    marksheetsObj["all_sem"] = studentMarksheetArr;




    return res.status(200).json(marksheetsObj);
})



// ROUTE 7: Get all the filter marksheets using: POST "/api/student/filter". Login required
router.post('/filter', fetchuser, async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { stream, course, semester } = req.body;
    console.log(stream, course, semester)

    try {


        let marksheetList;
        if (stream.toLowerCase() === 'bcom') {
            marksheetList = await StudentMarksheet.find({ stream, course, semester });
        }
        else {
            marksheetList = await StudentMarksheet.find({ stream: stream.toUpperCase(), semester });
        }

        // console.log(marksheetList)

        // let filterArr = [];

        // if (stream != null) {
        //     let tmp = [];
        //     for (let i = 0; i < marksheetList.length; i++) {
        //         if (marksheetList[i].stream.toLowerCase() === stream.toLowerCase()) {
        //             tmp.push(marksheetList[i]);
        //         }
        //     }
        //     filterArr = tmp;
        // }
        // if (course != null && stream.toLowerCase()==='bcom') {
        //     let tmp = [];
        //     for (let i = 0; i < filterArr.length; i++) {
        //         if (marksheetList[i].course.toLowerCase() === course.toLowerCase()) {
        //             tmp.push(marksheetList[i]);
        //         }
        //     }
        //     filterArr = tmp;
        // }
        // if (semester != 0) {
        //     let tmp = [];
        //     for (let i = 0; i < filterArr.length; i++) {
        //         if (Number(marksheetList[i].semester) === Number(semester)) {
        //             tmp.push(marksheetList[i]);
        //         }
        //     }
        //     filterArr = tmp;
        // }

        console.log('filterd results', marksheetList.length)


        return res.status(200).json(marksheetList);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


// ROUTE 8: Get all stats. using: GET "/api/student/stats". Login required
router.get('/stats', fetchuser, async (req, res) => {

    try {
        let marksheetArr = await StudentMarksheet.find();

        let totalMarksheetCount = marksheetArr.length;
        let bcom_honoursCount = 0;
        let bcom_honoursPass = 0;
        let bcom_honoursPercent = 0;

        let bcom_generalCount = 0;
        let bcom_generalPass = 0;
        let bcom_generalPercent = 0;

        let baCount = 0;
        let baPass = 0;
        let baPercent = 0;

        let bscCount = 0;
        let bscPass = 0;
        let bscPercent = 0;


        // for (let i = 0; i < marksheetArr.length; i++) {
        //     if (marksheetArr[i].stream.toLowerCase() === 'bcom') {
        //         if (marksheetArr[i].course.toLowerCase() === 'honours') {
        //             bcom_honoursCount += 1;
        //         }
        //         else {
        //             bcom_generalCount += 1;
        //         }
        //     }
        //     else if (marksheetArr[i].stream.toLowerCase() === 'ba') {
        //         baCount += 1;
        //     }
        //     else {
        //         bscCount += 1;
        //     }


        //     if (marksheetArr[i].sgpa !== '' || marksheetArr[i].sgpa !== 0) {
        //         if (marksheetArr[i].stream.toLowerCase() === 'bcom') {
        //             if (marksheetArr[i].course.toLowerCase() === 'honours') {
        //                 bcom_honoursPass += 1;
        //             }
        //             else {
        //                 bcom_generalPass += 1;
        //             }
        //         }
        //         else if (marksheetArr[i].stream.toLowerCase() === 'ba') {
        //             baPass += 1;
        //         }
        //         else {
        //             bscPass += 1;
        //         }
        //     }
        // }

        // bcom_honoursPercent = (bcom_honoursPass * 100) / bcom_honoursCount;
        // bcom_generalPercent = (bcom_generalPass * 100) / bcom_generalCount;

        // baPercent = (baPass * 100) / baCount;

        // bscPercent = (bscPass * 100) / bscCount;

        const obj = {
            totalMarksheetCount: 0,
            bcom_honoursCount: 0,
            bcom_honoursPercent: 0,
            bcom_generalCount: 0,
            bcom_generalPercent: 0,
            baCount: 0,
            baPercent: 0,
            bscCount: 0,
            bscPercent: 0
        }

        // let marksheetArr = await StudentMarksheet.find();
        obj.totalMarksheetCount = marksheetArr.length;

        // obj.bcom_honoursCount = await StudentMarksheet.find({stream: 'bcom', course: 'honours'});
        // obj.bcom_honoursCount = obj.bcom_honoursCount.length;

        // obj.bcom_generalCount = await StudentMarksheet.find({stream: 'bcom', course: 'general'});
        // obj.bcom_generalCount = obj.bcom_generalCount.length;

        // obj.baCount = await StudentMarksheet.find({stream: 'BA'});
        // obj.baCount = obj.baCount.length;

        // obj.bscCount = await StudentMarksheet.find({stream: 'BSC'});
        // obj.bscCount = obj.bscCount.length;

        
        for(let i = 0; i < marksheetArr.length; i++) {
            if(marksheetArr[i].stream.toLowerCase()==='bcom' && marksheetArr[i].course.toLowerCase()==='honours') {
                obj.bcom_honoursCount += 1;
            } 
            else if(marksheetArr[i].stream.toLowerCase()==='bcom' && marksheetArr[i].course.toLowerCase()==='general') {
                obj.bcom_generalCount += 1;
            } 
            else if(marksheetArr[i].stream.toLowerCase()==='bsc') {
                obj.bscCount += 1;
            } 
            else if(marksheetArr[i].stream.toLowerCase()==='ba') {
                obj.baCount += 1;
            } 
        }


        console.log(obj)


        return res.status(200).json(obj);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


})

export default router;