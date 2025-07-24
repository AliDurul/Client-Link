import { Request, Response, NextFunction } from 'express';
import User, { IUser } from "../models/user.model";

import { CustomError } from "../utils/common";


export const getUsers = async (req: Request, res: Response): Promise<void> => {

  const result = await res.getModelList(User)

  res.send({
    success: true,
    details: await res.getModelListDetails(User),
    result,
  });
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await User.findById(id);

  if (!result) throw new CustomError("User not found", 404);

  res.status(200).send({
    success: true,
    result,
  });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email } = req.body;

  const result = await User.findByIdAndUpdate<IUser>(
    id,
    { name, email },
    { new: true }
  );

  if (!result) throw new CustomError("User not found", 404);

  res.status(201).send({
    success: true,
    result
  });

};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const data = await User.deleteOne({ _id: id })

  if (!data.deletedCount) throw new CustomError("User not found or already deleted.", 404, true);

  res.status(data.deletedCount ? 204 : 404).send({
    success: data.deletedCount,
    data
  })

};

