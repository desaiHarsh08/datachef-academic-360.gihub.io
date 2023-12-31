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
                "general": [],
                "elective": [],
                "honours": [
                    "ENGA-CC1",
                    "ENGA-CC2",
                    "PLSG-GE1",
                    "ENGM-AECC1",
                    "EDCG-GE1",
                    "SOCG-GE1",
                    "BNGM-AECC1",
                    "HINM-AECC1",
                    "HISG-GE1",
                    "FMSG-GE1",
                    "BNGG-GE1",
                    "HISA-CC1",
                    "HISA-CC2",
                    "GEOG-GE1",
                    "ENGG-GE1",
                    "JORA-CC1",
                    "JORA-CC2",
                    "PLSA-CC1",
                    "PLSA-CC2",
                    "SOCA-CC1",
                    "SOCA-CC2",
                    "JORG-GE1",
                    "PSYG-GE1",
                    "HING-GE1"
                ]
            },
            "sem2": {
                "common": [],
                "general": [],
                "elective": [],
                "honours": [
                    "BNGA-CC3",
                    "BNGA-CC4",
                    "BNGG-GE2",
                    "CEMA-CC3",
                    "CEMA-CC4",
                    "CEMG-GE2",
                    "CMSA-CC3",
                    "CMSA-CC4",
                    "CMSG-GE2",
                    "ECOA-CC3",
                    "ECOA-CC4",
                    "EDCG-GE2",
                    "ELTA-CC3",
                    "ELTA-CC4",
                    "ELTG-GE2",
                    "ENGA-CC3",
                    "ENGA-CC4",
                    "ENGG-GE2",
                    "ENVS-AECC2",
                    "FMSG-GE2",
                    "GEOG-GE2",
                    "HING-GE2",
                    "HISA-CC3",
                    "HISA-CC4",
                    "HISG-GE2",
                    "JORA-CC3",
                    "JORA-CC4",
                    "JORG-GE2",
                    "MTMA-CC3",
                    "MTMA-CC4",
                    "MTMG-GE2",
                    "PHSA-CC3",
                    "PHSA-CC4",
                    "PHSG-GE2",
                    "PLSA-CC3",
                    "PLSA-CC4",
                    "PLSG-GE2",
                    "PSYG-GE2",
                    "SOCA-CC3",
                    "SOCA-CC4",
                    "SOCG-GE2",
                    "STSG-GE2"
                ]
            },
            "sem3": {
                "common": [],
                "general": [],
                "elective": [],
                "honours": [
                    "ENGA-CC5",
                    "ENGA-CC6",
                    "ENGA-CC7",
                    "ENGA-SEC-A2",
                    "EDCG-GE3",
                    "GEOG-GE3",
                    "ENGA-SEC-A1",
                    "HING-GE3",
                    "HISA-CC5",
                    "HISA-CC6",
                    "HISA-CC7",
                    "HISA-SEC-A1",
                    "PLSG-GE3",
                    "ENGG-GE3",
                    "PLSA-CC5",
                    "PLSA-CC6",
                    "PLSA-CC7",
                    "PLSA-SEC-A1",
                    "ENGG-GE3",
                    "PSYG-GE3",
                    "JORG-GE3",
                    "SOCA-CC5",
                    "SOCA-CC6",
                    "SOCA-CC7",
                    "SOCA-SEC-A2",
                    "JORA-CC5",
                    "JORA-CC6",
                    "JORA-CC7",
                    "JORA-SEC-A1",
                    "FMSG-GE3",
                    "HISG-GE3",
                    "BNGG-GE3",
                    "SOCG-GE3",
                    "SOCA-SEC-A1",
                    "HISA-SEC-A2"
                ]
            },
            "sem4": {
                "common": [],
                "general": [],
                "elective": [],
                "honours": [
                    "SOCA-SEC-B2",
                    "PLSA-SEC-B2",
                    "PLSA-SEC-B1",
                    "CMSA-CC8",
                    "MTMG-GE4",
                    "CMSA-CC9",
                    "CEMA-CC9",
                    "PHSA-CC9",
                    "JORA-CC8",
                    "BNGA-CC8",
                    "PHSG-GE4",
                    "PHSA-CC8",
                    "ENGA-CC8",
                    "ECOA-CC10",
                    "JORA-CC9",
                    "PHSA-SEC-B2",
                    "STSG-GE4",
                    "MTMA-CC8",
                    "HISA-CC8",
                    "ELTA-SEC-B2",
                    "HING-GE4",
                    "HISA-SEC-B2",
                    "HISA-SEC-B1",
                    "PLSA-CC8",
                    "ELTG-GE4",
                    "BNGA-CC10",
                    "GEOG-GE4",
                    "PLSA-CC10",
                    "HISA-CC9",
                    "BNGG-GE4",
                    "JORG-GE4",
                    "ECOA-SEC-B2",
                    "ENGG-GE4",
                    "HISG-GE4",
                    "PLSA-CC9",
                    "BNGA-SEC-B1",
                    "PHSA-CC10",
                    "JORA-SEC-B2",
                    "MTMA-SEC-B1",
                    "SOCA-CC8",
                    "SOCA-CC9",
                    "CMSG-GE4",
                    "CMSA-CC10",
                    "MTMA-CC9",
                    "CEMA-CC10",
                    "ELTA-CC10",
                    "ENGA-CC9",
                    "ECOA-CC8",
                    "PLSG-GE4",
                    "SOCA-CC10",
                    "SOCA-SEC-B2",
                    "FMSG-GE4",
                    "JORA-CC10",
                    "CEMA-SEC-B1",
                    "ELTA-CC8",
                    "EDCG-GE4",
                    "CEMG-GE4",
                    "PSYG-GE4",
                    "ELTA-CC9",
                    "BNGA-CC9",
                    "SOCG-GE4",
                    "ENGA-SEC-B1",
                    "ENGA-CC10",
                    "HISA-CC10",
                    "ECOA-CC9",
                    "CMSA-SEC-B2",
                    "CMSA-SEC-B1",
                    "CEMA-CC8",
                    "MTMA-CC10",
                    "ENGA-SEC-B2"
                ]
            },
            "sem5": {
                "common": [],
                "general": [],
                "elective": [],
                "honours": [
                    "ENGA-CC11",
                    "ENGA-CC12",
                    "ENGA-DSE-A1",
                    "ENGA-DSE-B1",
                    "HISA-DSE-A1",
                    "ELTA-DSE-A2",
                    "HISA-CC11",
                    "HISA-CC12",
                    "HISA-DSE-B1",
                    "PLSA-CC11",
                    "PLSA-CC12",
                    "PLSA-DSE-A1",
                    "PLSA-DSE-B1",
                    "SOCA-CC11",
                    "SOCA-CC12",
                    "SOCA-DSE-A2",
                    "SOCA-DSE-B1",
                    "JORA-CC11",
                    "JORA-CC12",
                    "JORA-DSE-A2",
                    "JORA-DSE-B2",
                    "ENGA-DSE-B2"
                ]
            },
            "sem6": {
                "common": [],
                "general": [],
                "elective": [],
                "honours": [
                    "ENGA-CC13",
                    "ENGA-CC14",
                    "ENGA-DSE-A3",
                    "ENGA-DSE-B3",
                    "BNGA-CC13",
                    "BNGA-CC14",
                    "BNGA-DSE-A3",
                    "BNGA-DSE-B3",
                    "HISA-CC13",
                    "HISA-CC14",
                    "HISA-DSE-A3",
                    "HISA-DSE-B3",
                    "JORA-CC13",
                    "JORA-CC14",
                    "JORA-DSE-A3",
                    "JORA-DSE-B3",
                    "PLSA-CC13",
                    "PLSA-CC14",
                    "PLSA-DSE-A4",
                    "PLSA-DSE-B4",
                    "SOCA-CC13",
                    "SOCA-CC14",
                    "SOCA-DSE-A3",
                    "SOCA-DSE-A4",
                    "SOCA-DSE-B4"
                ]
            }
        },
        "bsc": {
            "sem1": {
                "common": [],
                "honours": [
                    "CEMA-CC1",
                    "CEMA-CC2",
                    "PHSG-GE1",
                    "ENGM-AECC1",
                    "CMSG-GE1",
                    "CMSA-CC1",
                    "CMSA-CC2",
                    "MTMG-GE1",
                    "ECOA-CC1",
                    "ECOA-CC2",
                    "STSG-GE1",
                    "BNGM-AECC1",
                    "ELTA-CC1",
                    "ELTA-CC2",
                    "MTMA-CC1",
                    "MTMA-CC2",
                    "ELTG-GE1",
                    "PHSA-CC1",
                    "PHSA-CC2",
                    "HINM-AECC1",
                    "CEMG-GE1"
                ],
                "general": [],
                "elective": []
            },
            "sem2": {
                "common": [],
                "honours": [
                    "PHSA-CC4",
                    "MTMG-GE2",
                    "ECOA-CC4",
                    "ELTA-CC4",
                    "CEMA-CC3",
                    "ECOA-CC3",
                    "ELTA-CC3",
                    "PHSA-CC3",
                    "CEMG-GE2",
                    "STSG-GE2",
                    "CMSA-CC3",
                    "PHSG-GE2",
                    "MTMA-CC4",
                    "CEMA-CC4",
                    "CMSG-GE2",
                    "ENVS-AECC2",
                    "ELTG-GE2",
                    "CMSA-CC4",
                    "MTMA-CC3"
                ],
                "general": [],
                "elective": []
            },
            "sem3": {
                "common": [],
                "honours": [
                    "CEMA-CC5",
                    "CEMA-CC6",
                    "CEMA-CC7",
                    "CEMA-SEC-A1",
                    "CEMA-SEC-A2",
                    "ELTG-GE3",
                    "ELTA-CC5",
                    "ELTA-CC6",
                    "ELTA-CC7",
                    "ELTA-SEC-A1",
                    "ELTA-SEC-A2",
                    "MTMG-GE3",
                    "PHSG-GE3",
                    "PHSA-CC5",
                    "PHSA-CC6",
                    "PHSA-CC7",
                    "PHSA-SEC-A1",
                    "MTMG-GE3",
                    "MTMA-CC5",
                    "MTMA-CC6",
                    "MTMA-CC7",
                    "MTMA-SEC-A1",
                    "MTMA-SEC-A2",
                    "CEMG-GE3",
                    "CMSA-CC5",
                    "CMSA-CC6",
                    "CMSA-CC7",
                    "CMSA-SEC-A1",
                    "CMSA-SEC-A2",
                    "MTMG-GE3",
                    "ECOA-CC5",
                    "ECOA-CC6",
                    "ECOA-CC7",
                    "ECOA-SEC-A2",
                    "ECOA-SEC-A1",
                    "STSG-GE3",
                    "CMSG-GE3"
                ],
                "general": [],
                "elective": []
            },
            "sem4": {
                "common": [],
                "honours": [
                    "MTMA-CC9",
                    "CEMG-GE4",
                    "CMSA-CC10",
                    "ELTA-SEC-B2",
                    "MTMA-SEC-B1",
                    "CEMA-CC8",
                    "ELTA-CC9",
                    "ECOA-CC8",
                    "CMSA-SEC-B2",
                    "ELTA-CC10",
                    "STSG-GE4",
                    "MTMA-CC8",
                    "PHSA-CC8",
                    "PHSA-SEC-B2",
                    "ELTG-GE4",
                    "CMSA-CC8",
                    "CEMA-CC9",
                    "PHSG-GE4",
                    "PHSA-CC9",
                    "ECOA-SEC-B2",
                    "CEMA-SEC-B1",
                    "ELTA-CC8",
                    "ECOA-CC9",
                    "PHSA-CC10",
                    "MTMA-CC10",
                    "CMSG-GE4",
                    "MTMG-GE4",
                    "CMSA-CC9",
                    "ECOA-CC10",
                    "CEMA-CC10",
                    "ELTA-SEC-B1",
                    "ECOA-SEC-B1",
                    "CMSA-SEC-B1",
                    "ECOA-SEC-B2",
                    "PHSA-SEC-B2",
                    "MTMA-CC9"
                ],
                "general": [],
                "elective": []
            },
            "sem5": {
                "common": [],
                "honours": [
                    "CEMA-CC11",
                    "CEMA-CC12",
                    "CEMA-DSE-A2",
                    "CEMA-DSE-B1",
                    "CMSA-CC11",
                    "CMSA-CC12",
                    "CMSA-DSE-A2",
                    "CMSA-DSE-B2",
                    "ECOA-CC11",
                    "ECOA-CC12",
                    "ECOA-DSE-A1",
                    "ECOA-DSE-A2",
                    "ECOA-DSE-B1",
                    "ECOA-DSE-B2",
                    "ELTA-CC11",
                    "ELTA-CC12",
                    "ELTA-DSE-A2",
                    "ELTA-DSE-B1",
                    "ELTA-DSE-B2",
                    "MTMA-CC11",
                    "MTMA-CC12",
                    "MTMA-DSE-A1.1",
                    "MTMA-DSE-B1.2",
                    "PHSA-CC11",
                    "PHSA-CC 12",
                    "PHSA-DSE-A2",
                    "PHSA-DSE-B2"
                ],
                "general": [],
                "elective": []
            },
            "sem6": {
                "common": [],
                "honours": [
                    "MTMA-CC13",
                    "MTMA-CC14",
                    "MTMA-DSE-A2.2",
                    "MTMA-DSE-A2.1",
                    "MTMA-DSE-B2.1",
                    "PHSA-CC13",
                    "PHSA-CC14",
                    "PHSA-DSE-A2.1",
                    "PHSA-DSE-B2.1",
                    "CEMA-CC13",
                    "CEMA-CC14",
                    "CEMA-DSE-A3",
                    "CEMA-DSE-B4",
                    "CMSA-CC13",
                    "CMSA-CC14",
                    "CMSA-DSE-A4",
                    "CMSA-DSE-B3",
                    "CMSA-DSE-B4",
                    "ECOA-CC13",
                    "ECOA-CC14",
                    "ECOA-DSE-12.1",
                    "ECOA-DSE-A2.2",
                    "ECOA-DSE-B2.1",
                    "ECOA-DSE-B2.2",
                    "ELTA-CC13",
                    "ELTA-CC14",
                    "ELTA-DSE-A3",
                    "ELTA-DSE-B3",
                    "ELTA-DSE-B4",
                    "ECOA-DSE-A2.1"
                ],
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