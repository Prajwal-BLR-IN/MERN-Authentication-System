import { Request, Response } from "express";
import userModel from "../models/userModel.js";

const getUserData = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerfied,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getUserData };
