//user Schema
import mongoose from "mongoose";

import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      //'     john'  =>  'John'(after trim:true)
      trim: true,
      maxlength: [50, "Name should not exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password should be greater than 6 characters"],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        //This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords does not match!"
      }
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    avatar: {
      url: { type: String },
      public_id: { type: String }
    },
    passwordChangedAt: {
      type: Date
    },
    passwordResetToken: {
      type: String,
      select: false,
      index: true
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

  },
  { timestamps: true }

)
//settings to not pass inn response from server
userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  }
})

//password logic:password encryption for security 
//hasing password before saving user
userSchema.pre("save", async function () {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
})

//login check
//for example test123=efbufh3rwfohohvv
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

//token stealing case handling 
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // Password not changed
}

//forgot password case heandling

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex"); //sha=secure hash algorithm
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}


const User = mongoose.model("User", userSchema);
//in mongodb:users(automatically pluralized by the model)
export {User};