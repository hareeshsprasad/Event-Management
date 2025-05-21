const User = require("./user.model");

const getUsers = async (req, res) => {
  try {
    const {
      search = "", // search keyword (for name/email)
      sortBy = "firstName", // default sort field changed to firstName
      order = "asc", // default ascending order
      page = 1, // page number (default 1)
      limit = 10, // items per page (default 10)
    } = req.query;

    const searchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const total = await User.countDocuments(searchFilter);
    const users = await User.find(searchFilter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      message: "Users fetched successfully",
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { userData } = req.body;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "address",
      "city",
      "state",
      "country",
      "zipCode",
      "dateOfBirth",
    ];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail.test(userData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      return res
        .status(400)
        .json({ error: "Please enter the password in the required format" });
    }
    if (userData.password !== userData.confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password do not match" });
    }
    const onlyLettersRegex = /^[A-Za-z\s]+$/;
    const nameFields = ["firstName", "lastName", "city", "state", "country"];
    for (const field of nameFields) {
      if (!onlyLettersRegex.test(userData[field])) {
        return res.status(400).json({
          error: `${field} should contain only letters and spaces`,
        });
      }
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userData.phone)) {
      return res
        .status(400)
        .json({ error: "Phone number must be exactly 10 digits" });
    }
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const { confirmPassword, ...finalData } = userData;
    const newUser = new User(finalData);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, createUser };
