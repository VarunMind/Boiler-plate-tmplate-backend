import express from "express";
import fs from "fs/promises";
import { tokenVerifier } from "../../middleware/tokenVerifier.js";
import { body, query, validationResult } from "express-validator";
import User from "../../modals/User.js";
const InboxRouter = express.Router();

InboxRouter.get(
  "/inbox/fetch-all",
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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const start = (page - 1) * limit;
      const end = start + limit;

      const rowData = await fs.readFile("data/emails.json", "utf-8");
      const allEmails = JSON.parse(rowData);

      const filteredEmail = allEmails.filter((item) => !item.isDeleted);

      const total = filteredEmail.length;

      const data = filteredEmail.slice(start, end);

      return res
        .status(200)
        .set({
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        })
        .json({
          success: true,
          message: "Mails Fetched SuccessFully",
          data: data,
          metadata: {
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

InboxRouter.get(
  "/inbox/starred/fetch-all",
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

      const filteredEmail = allEmails.filter(
        (item) => item.isStarred && !item.isDeleted
      );

      const total = filteredEmail.length;

      const data = filteredEmail.slice(start, end);

      return res.status(200).json({
        success: true,
        message: "Mails Fetched SuccessFully",
        data: data,
        metadata: {
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

InboxRouter.get(
  "/inbox/important/fetch-all",
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

      const filteredEmail = allEmails.filter(
        (item) => item.isImportant && !item.isDeleted
      );

      const total = filteredEmail.length;

      const data = filteredEmail.slice(start, end);

      return res.status(200).json({
        success: true,
        message: "Mails Fetched SuccessFully",
        data: data,
        metadata: {
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
InboxRouter.get(
  "/inbox/delete/fetch-all",
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

      const filteredEmail = allEmails.filter((item) => item.isDeleted);

      const total = filteredEmail.length;

      const data = filteredEmail.slice(start, end);

      return res.status(200).json({
        success: true,
        message: "Mails Fetched SuccessFully",
        data: data,
        metadata: {
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

InboxRouter.get("/inbox/fetch/counts", tokenVerifier, async (req, res) => {
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
    const starredMails = allEmails.filter(
      (item) => item?.isStarred && !item.isDeleted
    )?.length;
    const importantMails = allEmails.filter(
      (item) => item?.isImportant && !item.isDeleted
    )?.length;

    return res.status(200).json({
      message: "Counts Fetched SuccessFully",
      success: true,
      data: {
        mails: totalMails - deletedMails,
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
InboxRouter.put(
  "/inbox/delete",
  [body("selectedIds")?.isArray()],
  tokenVerifier,
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }
      const { selectedIds } = req.body;

      const user = await User.findById(req.user_id).select("-password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Employee Dose Not Exist",
        });
      }

      const rowData = await fs.readFile("data/emails.json", "utf-8");
      const allEmails = JSON.parse(rowData);

      const updatedMails = allEmails?.map((email) => {
        if (selectedIds?.includes(email?.id)) {
          return {
            ...email,
            isDeleted: true,
          };
        }

        return email;
      });

      await fs.writeFile(
        "data/emails.json",
        JSON.stringify(updatedMails, null, 2),
        "utf-8"
      );

      const totalMails = updatedMails?.length;
      const deletedMails = updatedMails.filter(
        (item) => item?.isDeleted
      )?.length;
      const starredMails = updatedMails.filter(
        (item) => item?.isStarred && !item.isDeleted
      )?.length;
      const importantMails = updatedMails.filter(
        (item) => item?.isImportant && !item.isDeleted
      )?.length;

      return res.status(200).json({
        message: "Emails Deleted Successfully",
        success: true,
        data: {
          mails: totalMails - deletedMails,
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
  }
);

InboxRouter.put(
  "/inbox/favourite",
  [query("id")],
  tokenVerifier,
  async (req, res) => {
    try {
      const id = req.query.id;

      const user = await User.findById(req.user_id).select("-password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Employee Dose Not Exist",
        });
      }

      const rowData = await fs.readFile("data/emails.json", "utf-8");
      const allEmails = JSON.parse(rowData);

      const updatedMails = allEmails?.map((email) => {
        if (email?.id === id) {
          return {
            ...email,
            isStarred: !email?.isStarred,
          };
        }

        return email;
      });

      await fs.writeFile(
        "data/emails.json",
        JSON.stringify(updatedMails, null, 2),
        "utf-8"
      );

      const starredMails = updatedMails.filter(
        (item) => item?.isStarred
      )?.length;

      return res.status(200).json({
        message: "Emails Favorite Successfully",
        success: true,
        data: {
          starred: starredMails,
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

InboxRouter.put(
  "/inbox/restore",
  [body("selectedIds")?.isArray()],
  tokenVerifier,
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ result });
      }
      const { selectedIds } = req.body;

      const user = await User.findById(req.user_id).select("-password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Employee Dose Not Exist",
        });
      }

      const rowData = await fs.readFile("data/emails.json", "utf-8");
      const allEmails = JSON.parse(rowData);

      const updatedMails = allEmails?.map((email) => {
        if (selectedIds?.includes(email?.id)) {
          return {
            ...email,
            isDeleted: false,
          };
        }

        return email;
      });

      await fs.writeFile(
        "data/emails.json",
        JSON.stringify(updatedMails, null, 2),
        "utf-8"
      );

      const totalMails = updatedMails?.length;
      const deletedMails = updatedMails.filter(
        (item) => item?.isDeleted
      )?.length;
      const starredMails = updatedMails.filter(
        (item) => item?.isStarred && !item.isDeleted
      )?.length;
      const importantMails = updatedMails.filter(
        (item) => item?.isImportant && !item.isDeleted
      )?.length;

      return res.status(200).json({
        message: "Emails Restored Successfully",
        success: true,
        data: {
          mails: totalMails - deletedMails,
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
  }
);

InboxRouter.get(
  "/inbox/message/fetch",
  tokenVerifier,
  [
    query("id"),
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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const start = (page - 1) * limit;
      const end = start + limit;

      const rowData = await fs.readFile("data/message.json", "utf-8");
      const allMessage = JSON.parse(rowData);

      const filteredEmail = allMessage.filter(
        (item) => item?.mailId === req.query.id
      );

      const total = filteredEmail.length;

      const data = filteredEmail.slice(start, end);

      return res
        .status(200)
        .set({
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        })
        .json({
          success: true,
          message: "Mails Fetched SuccessFully",
          data: data,
          metadata: {
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

export default InboxRouter;
