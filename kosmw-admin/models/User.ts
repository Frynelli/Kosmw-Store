// // models/User.ts

// import mongoose, { Schema, Document } from 'mongoose';

// interface IUser extends Document {
//   name: string;
//   email: string;
//   image: string;

// }
// const userSchema: Schema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   image: { type: String },
// });

// export default mongoose.models.User || (mongoose.model('User', userSchema) as mongoose.Model<IUser>);


