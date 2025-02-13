import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        min: [6, "Password must be a minimum of 6 characters long"],
    },
    isActive: { type: Boolean, default: true },
    organizationId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: Date,
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
