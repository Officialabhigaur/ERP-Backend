import bcrypt from "bcryptjs";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Permission, Department } from "../models/index.js";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createAdmin = async (email, password) => {
  // a) Role create -> Admin,
  const role = await Role.create({ name: "admin" });
  // b) Management dept create
  const dept = await Department.create({ name: "Management" });
  // c) Hash the password
  const hashedPassword = await hashPassword(password);
  // d) Fetch Admin permission
  const permissions = await Permission.find({
    name: "Administrator Access",
  }).select("_id");
  // e) Admin User Create,
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role._id,
    deptId: dept._id,
    userPermission: permissions,
  });
  return user;
};

const checkEmail = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    return true;
  }
  return false;
};

const passwordGenerator = () => {
  return generate({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilarCharacters: true,
  });
};

//for login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }

  // 1) check whether any user exists or not
  const existingUser = await User.find();

  if (existingUser.length === 0) {
    const user = await createAdmin(email, password);

    if (user) {
      return res
        .status(201)
        .json({ success: true, message: "Admin Created Successfully" });
    }
  }

  // 2) Check whether the email exists or not
};

//for adding user/employee
export const registerUser = async (req, res, next) => {
  const { email, role, deptId } = req.body;

  if (!email || !role || !deptId) {
    throw new CustomError("Please fill all the fields.", 400);
  }

  // 1) check whether the email already exists or not
  const isUserExist = await checkEmail(email);

  if (isUserExist) {
    throw new CustomError("User with this email already exists", 409);
  }

  //2) Password generate
  const password = passwordGenerator();
  console.log(password);
  //3)Password Hash
  const hashedPassword = await hashPassword(password);
  //4) Db Insert
  const user = new User();
  user.email = email;
  user.password = hashedPassword;
  user.role = role;
  user.deptId = deptId;
  const result = await user.save();

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: result,
  });

  // negi16111@gmail.com - !gX%<&"$c/xP
  //agaur0136@gmail.com - Abhishek@123

  //5)Mail -> email,password
};
