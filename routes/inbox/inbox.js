import express from "express";
import fs from "fs/promises";
import { tokenVerifier } from "../../middleware/tokenVerifier.js";
import { query } from "express-validator";
import User from "../../modals/User.js";
const InboxRouter = express.Router();

InboxRouter.get(
  "/fetch-all",
  tokenVerifier,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user_id).select("-password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Employee Dose Not Exist",
        });
      }
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const start = (page - 1) * limit;
      const end = start + limit;

      const rowData = await fs.readFile("data/emails.json", "utf-8");
      const allEmails = JSON.parse(rowData);

      const total = allEmails.length;

      const filteredEmail = allEmails.filter((item) => !item.isDeleted);

      const data = filteredEmail.slice(start, end);
      
      return res.status(200).json({
        success: true,
        message: "Mails Fetched SuccessFully",
        data: data,
        meta_data: {
          total: total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error While Fetching Mails",
        success: true,
        error: String(error),
      });
    }
  }
);

InboxRouter.get("/fetch/counts", tokenVerifier, async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Employee Dose Not Exist",
      });
    }

    const rowData = await fs.readFile("data/emails.json", "utf-8");
    const allEmails = JSON.parse(rowData);
    const totalMails = allEmails?.length;
    const deletedMails = allEmails.filter((item) => item?.isDeleted)?.length;
    const starredMails = allEmails.filter((item) => item?.isStarred)?.length;
    const importantMails = allEmails.filter(
      (item) => item?.isImportant
    )?.length;

    return res.status(200).json({
      message: "Counts Fetched SuccessFully",
      success: true,
      data: {
        mails: totalMails,
        starred: starredMails,
        sent: 0,
        draft: 0,
        spam: 0,
        important: importantMails,
        bin: deletedMails,
      },
    });
  } catch (error) {
    
    return res.status(500).json({
      message: "Error While Fetching Mails",
      success: true,
      error: String(error),
    });
  }
});

export default InboxRouter;
