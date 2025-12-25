import mongoose from "mongoose";

const { Schema } = mongoose;

const ForgotPassSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  resetPasswordToken: {
    type: String,
    trim: true,
    default: null,
  },

  resetPasswordExpiresAt: {
    type: Date,
    default: null,
    index: { expireAfterSeconds: 0 },
  },
});

const ForgotPass = mongoose.model("forgotPassword", ForgotPassSchema);
export default  ForgotPass;
