// import mongoose, { Schema } from 'mongoose';

// class Task {
//   initSchema() {
//     this.schema = new Schema({
//       title: {
//         type: String,
//         trim: true,
//         required: true,
//       },
//       desc: {
//         type: String,
//         trim: false,
//         required: false,
//       },
//       duration: {
//         type: Number,
//         required: true,
//         default: 10,
//       },
//       startTime: {
//         type: String,
//         default: new Date().toISOString(),
//         required: false,
//       },
//       priority: {
//         type: Number,
//         default: 3,
//         required: true,
//       },
//       url_link: {
//         type: String,
//         required: false,
//       },
//       dayOfSchedule: {
//         type: Number,
//         default: 0, // the current day
//         required: false,
//       },
//       project: {
//         type: { _id: mongoose.Schema.Types.ObjectId, title: String },
//         required: false,
//       },
//     });
//     mongoose.model('Task', this.schema);
//   }

//   getInstance() {
//     this.initSchema();
//     return mongoose.model('Task');
//   }
// }

// export default Task;
