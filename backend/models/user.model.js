
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: [true, "A user must have a phone number"]
    },

    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 6
    },

    userRole: {
      type: String,
      enum: ["Agent", "Normal User"],
      default: "Normal User"
    },

    image: {
      type: String
    },

    socialLinks: {
      type: [String]
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String
    },

    avgRating: { // Agent only
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.statics.register = async function ({
  userName,
  email,
  phone,
  password,
  userRole = "Normal User",
  image = "",
  socialLinks = [],
  address = {}
}) {
  // Check if email already exists
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Prepare user data
  const userData = {
    userName,
    email,
    phone,
    password: hashedPassword,
    userRole,
    image,
    socialLinks,
    address
  };

  // 👉 Agent-only logic goes HERE
  if (userRole === "Agent") {
    userData.avgRating = 0; // optional, default already 0
  }

  // Create user
  const user = await this.create(userData);

  return user;
};

const User = mongoose.model("User", userSchema);

// ✅ THIS LINE FIXES EVERYTHING
export default User;
