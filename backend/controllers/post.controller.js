
import Post from "../models/post.model.js";

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
