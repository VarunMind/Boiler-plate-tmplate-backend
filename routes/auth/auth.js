import express from "express";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../modals/User.js";
import { EnvConfig } from "../../config/EnvConfig.js";
import { tokenVerifier } from "../../middleware/tokenVerifier.js";
import { RandomTokenGenerator } from "../../utils/helper/helper.js";
import ForgotPass from "../../modals/ForgotPassword.js";
const authRouter = express.Router();

const saltRound = 10;
const JWT_SECRETE = EnvConfig.JWT_SECRETE;

authRouter.post(
  "/register",
  [
    body("name").trim(),
    body("email").trim().isEmail(),
    body("password").trim(),
  ],
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }

      const findUser = await User.findOne({ email: email });

      if (findUser) {
        return res.status(400).json({
          success: false,
          message: "Employee With This email AllReady Exist",
        });
      }

      const salt = bcrypt.genSaltSync(saltRound);

      const hashPassword = bcrypt.hashSync(password, salt);

      const user = await User.create({
        name: name,
        email: email,
        password: hashPassword,
        employee_role: "user",
      });

      var token = jwt.sign(
        {
          foo: user._id,
        },
        JWT_SECRETE
      );

      return res.status(200).json({
        success: true,
        message: "user registered successfully",
        data: {
          authToken: token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something Went Wrong",
        error: String(error),
      });
    }
  }
);

authRouter.post(
  "/login",
  [body("email").trim().isEmail(), body("password").trim()],
  async (req, res) => {
    try {
      const { name, email, employeeCode, password } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Password Or Email",
        });
      }
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({
          success: false,
          message: "Invalid Password Or Email",
        });
      }
      var token = jwt.sign(
        {
          foo: user._id,
        },
        JWT_SECRETE
      );

      return res.status(200).json({
        success: true,
        message: "user Lodged In successfully",
        data: {
          authToken: token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something Went Wrong",
        error: String(error),
      });
    }
  }
);

authRouter.get("/verify", tokenVerifier, async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Employee Dose Not Exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user registered successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something Went Wrong",
      error: String(error),
    });
  }
});

authRouter.post(
  "/forgot-password",
  [body("email").trim().isEmail()],
  async (req, res) => {
    try {
      const { email } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Pls Enter Registered Email",
        });
      }

      const resetToken = RandomTokenGenerator(50);
      const salt = bcrypt.genSaltSync(saltRound);

      const hashToken = bcrypt.hashSync(resetToken, salt);

      await ForgotPass.create({
        owner: user._id,
        resetPasswordToken: hashToken,
        resetPasswordExpiresAt: new Date(Date.now() + 100 * 1000),
      });

      const redirectUrl = `http://localhost:5173/auth/reset-password?token=${resetToken}&email=${user.email}`;

      return res.status(200).json({
        success: true,
        message: "Resend Token Mail Send Successfully",
        data: {
          redirectUrl: redirectUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something Went Wrong",
        error: String(error),
      });
    }
  }
);

authRouter.post(
  "/reset-password",
  [body("password").trim(), query("token").trim(), query("email").trim()],
  async (req, res) => {
    try {
      const { password } = req.body;
      const { token, email } = req.query;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Pls Enter Registered Email",
        });
      }

      const resetToken = await ForgotPass.findOne({ owner: user._id });

      console.log(resetToken);

      if (!resetToken) {
        return res.status(400).json({
          success: false,
          message: "The Link Is Invalid",
        });
      }

      const compareToken = await bcrypt.compare(
        token,
        resetToken.resetPasswordToken
      );

      if (!compareToken) {
        return res.status(400).json({
          success: false,
          message: "The Link Is Invalid",
        });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (comparePassword) {
        return res.status(400).json({
          success: false,
          message: "please choose a different password then the last one",
        });
      }
      const salt = bcrypt.genSaltSync(saltRound);
      const hashPassword = bcrypt.hashSync(password, salt);

      user.password = hashPassword;

      user.save();

      await ForgotPass.findOneAndDelete({ _id: resetToken._id });

      return res.status(200).json({
        success: true,
        message: "Password Updated Successfully",
      });
    } catch (error) {
      
      return res.status(500).json({
        success: false,
        message: "something Went Wrong",
        error: String(error),
      });
    }
  }
);

export default authRouter;
