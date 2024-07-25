import { CustomError } from "../utils/index.js";
import { Role } from "../models/index.js";

export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Please provide role name", 400);
  }

  const role = await Role.create({ name });

  res.status(201).json({
    success: true,
    role,
    message: "Role created successfully",
  });
};

export const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.status(200).json({
    success: true,
    data: roles,
  });
};

export const deleteRole = async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError("Role does not exist ", 400);
  }

  const result = await Role.findByIdAndDelete(roleId);
};
