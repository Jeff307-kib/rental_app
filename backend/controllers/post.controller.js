import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Post from "../models/post.model.js";

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  return res.status(200).json({
    message: "Post Fetched Successfully!",
    result: posts.length,
    posts
  });
});

export const createPost = catchAsync(async (req, res, next) => {
  //  userId comes from auth middleware
  // const userId = req.user?.id;

  // if (!userId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  //  }

  const {
    userId,
    type,
    price,
    locationName,
    location,
    photos,
    video,
    contact,
    areaSize,
    description,
    facilities,
    roomType,
    houseType,
    genderType,
    toiletType,
    rules
  } = req.body;

  // 🛑 Basic required validation
  if (
    !type ||
    price === undefined ||
    !locationName ||
    !location ||
    !areaSize
  ) {
    return next(new AppError("Missing required fields", 400));
    // return res.status(400).json({
    //   message: "Missing required fields"
    // });
  }

  // 📍 GeoJSON validation
  if (
    !location.coordinates ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return next(new AppError("Location coordinates must be [longitude, latitude]", 400));
  }

  // 🧱 Create post
  const post = await Post.create({
    //userId: new mongoose.Types.ObjectId(userId),
    userId,
    type,
    price,
    locationName,
    location,
    photos,
    video,
    contact,
    areaSize,
    description,
    facilities,
    roomType,
    houseType,
    genderType,
    toiletType,
    rules
    //  DO NOT set status or lastStatusChangedAt here
    // status defaults to "Available"
    // lastStatusChangedAt handled by middleware when status becomes "Rented"
  });

  return res.status(201).json({
    message: "Post created successfully",
    post
  });
});


export const updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = "659a1b2c3d4e5f6a7b8c9d0e";

  // 1. Fetch post and check ownership
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found.", 404));
  }

  if (post.userId.toString() !== userId) {
    return next(new AppError("You are not allowed to update this post.", 403));
  }

  // 2. Filter allowed fields
  const allowedFields = [
    "type", "price", "locationName", "location", "photos",
    "video", "contact", "areaSize", "description",
    "facilities", "roomType", "houseType", "genderType",
    "toiletType", "rules"
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  // 3. Check if body is empty AFTER filtering
  if (Object.keys(updates).length === 0) {
    return next(new AppError("No valid fields provided for update.", 400));
  }

  // 4. Safe GeoJSON Validation
  // Added a check to ensure updates.location exists before destructuring
  if (updates.location) {
    const { coordinates, type } = updates.location;

    if (
      type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return next(new AppError("Location coordinates must be [longitude, latitude]", 400));
    }
  }

  // 5. Perform Update
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    message: "Post updated successfully",
    post: updatedPost
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = "659a1b2c3d4e5f6a7b8c9d0e";

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found.", 404));
  }

  if (post.userId.toString() !== userId) {
    return next(new AppError("You are not allowed to delete this post.", 403));
  }

  await Post.findByIdAndDelete(postId);

  return res.status(200).json({
    message: "Post deleted Successfully.",
  });
});
