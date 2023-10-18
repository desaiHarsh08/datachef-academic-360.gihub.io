import express from 'express';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js'
import Subjects from '../models/Subjects.js'
import { ObjectId } from 'mongoose';


const router = express.Router();


// Default subjects
(async () => {
    const mysubjects = {
        "bcom": {
            "sem1": {
                "common": [
                    "AECC1.1CHG",
                    "GE1.1CHG",
                    "CC1.1CHG",
                    "CC1.2CHG"
                ],
                "honours": [
                    "CC1.1CH"
                ],
                "general": [
                    "CC1.1CG"
                ],
                "elective": []
            },
            "sem2": {
                "common": [
                    "AECC2.1CHG",
                    "GE2.1CHG",
                    "CC2.1CHG",
                    "CC2.2CHG"
                ],
                "honours": [
                    "CC2.1CH"
                ],
                "general": [
                    "CC2.1CG"
                ],
                "elective": []
            },
            "sem3": {
                "common": [
                    "SEC3.1CHG",
                    "GE3.1CHG"
                ],
                "honours": [
                    "CC3.1CH",
                    "CC3.2CH"
                ],
                "general": [
                    "CC3.1CG"
                ],
                "elective": []
            },
            "sem4": {
                "common": [
                    "GE4.1CHG",
                    "CC4.1CHG"
                ],
                "honours": [
                    "CC4.1CH",
                    "CC4.2CH"
                ],
                "general": [
                    "CC4.1CG",
                    "CC4.2CG"
                ],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [
                    "CC5.1CH",
                    "CC5.2CH",
                    "DSE5.1AH",
                    "DSE5.2AH",
                    "DSE5.1MH",
                    "DSE5.2MH",
                    "DSE5.1TH",
                    "DSE5.2TH",
                    "DSE5.1EBH",
                    "DSE5.2EBH"
                ],
                "general": [
                    "CC5.1CG",
                    "DSE5.1AG",
                    "DSE5.2AG",
                    "DSE5.1MG",
                    "DSE5.2MG",
                    "DSE5.1TG",
                    "DSE5.2TG",
                    "DSE5.1EBG",
                    "DSE5.2EBG"
                ],
                "elective": []
            },
            "sem6": {
                "common": [
                    "SEC6.1CHG",
                    "CC6.1CH"
                ],
                "honours": [],
                "general": [],
                "elective": [
                    "DSE6.1AH",
                    "DSE6.1AG",
                    "DSE6.2AH",
                    "DSE6.2Ag",
                    "DSE6.1MH",
                    "DSE6.1MG",
                    "DSE6.2MH",
                    "DSE6.2MG",
                    "DSE6.1TH",
                    "DSE6.1TG",
                    "DSE6.2TH",
                    "DSE6.2TG",
                    "DSE6.1EBH",
                    "DSE6.1EBG",
                    "DSE6.2EBH",
                    "DSE6.2EBG"
                ]
            }
        },
        "ba": {
            "sem1": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            }
        },
        "bsc": {
            "sem1": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            }
        },
        "mcom": {
            "sem1": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            }
        },
        "ma": {
            "sem1": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            }
        },
        "msc": {
            "sem1": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [],
                "general": [],
                "elective": []
            }
        }
    }
    
    // Add Subject
    const subjectsArr = await Subjects.find();
    if (subjectsArr.length === 0) {
        // Create a new Subjects document if none exists
        const subjects = new Subjects(mysubjects);
        const savedSubjects = await subjects.save();
        console.log(savedSubjects)
    }

})();




// ROUTE 1: Get all the subjects using: GET "/api/subjects/fetch-all". Login required
router.get('/fetch-all', fetchuser, async (req, res) => {
    const studentMarksheets = await Subjects.find()
    res.json(studentMarksheets);
});


// ROUTE 2: Add or update the subjects using: POST "/api/subjects/add_update". Login required
router.post('/add_update', fetchuser, async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Bad request!" });
        }
        console.log(req.body.bcom.sem1.common[0]);

        const subjectsArr = await Subjects.find();

        if (subjectsArr.length < 1) {
            // Create a new Subjects document if none exists
            const subjects = new Subjects(req.body);
            const savedSubjects = await subjects.save();
            return res.status(200).json(savedSubjects);
        } else {
            // Update the existing Subjects document with the new data
            const existingSubjects = subjectsArr[0];
            existingSubjects.set(req.body);
            const updatedSubjects = await existingSubjects.save();
            return res.status(200).json(updatedSubjects);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error!" });
    }




})






export default router;