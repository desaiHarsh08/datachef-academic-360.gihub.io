import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentMarksheetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    // required: true
  },
  year: {
    type: Number
  },
  rollNo: {
    type: String,
    // required: true
  },
  registrationNo: {
    type: String,
    // required: true
  },
  stream: {
    type: String,
    // required: true
  },
  course: {
    type: String,
    // required: true
  },
  semester: {
    type: Number,
    // required: true
  },
  sgpa: {
    type: String,
    // required: true
  },
  remarks: {
    type: String,
    // required: true
  },
  classification: {
    type: String,
    // required: true
  },
  cgpa: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    // required: true
  },
  totalCredit: {
    type: String,
    // required: true
  },
  subjects: {
    type: Array,
    // required: true
  }
});

const StudentMarksheet = mongoose.model('student_marksheet', StudentMarksheetSchema);

export default StudentMarksheet;