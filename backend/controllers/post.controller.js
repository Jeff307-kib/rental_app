
import Post from "../models/post.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json({
      message: "Post Fetched Successfully!",
      posts
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot fetch posts",
      error: error.message
    });
  }
}

export const createPost = async (req, res) => {
  try {
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
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 📍 GeoJSON validation
    if (
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: "Location coordinates must be [longitude, latitude]"
      });
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

  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      message: "Failed to create post",
      error: error.message
    });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = "659a1b2c3d4e5f6a7b8c9d0e";

    // 1. Fetch post and check ownership
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to update this post" });
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
      return res.status(400).json({ message: "No valid fields provided for update" });
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
        return res.status(400).json({
          message: "Invalid location format. Expected { type: 'Point', coordinates: [lng, lat] }"
        });
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

  } catch (error) {
    console.error("Update Post Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = "659a1b2c3d4e5f6a7b8c9d0e";

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this post."
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted Successfully.",
    });
  } catch (error) {
    console.error("Delete Post Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
