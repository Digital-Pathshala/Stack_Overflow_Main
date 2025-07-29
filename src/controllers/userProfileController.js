import userProfileServices from "../services/userProfileServices.js";
const createProfile = async (req, res) => {
  try {
    const profile = req.body;

    if (!profile) {
      return res.status(400).send("Profile data is required");
    }

    const data = await userProfileServices.createProfile(profile);

    res.status(200).json({
      message: "Profile created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(501).send("error occurred to create profile");
  }
};

const getAllProfile = async (req, res) => {
  try {
    console.log(req.query);

    const data = await userProfileServices.getAllProfile(req.query);

    res.status(200).json({
      message: "All Profile fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occurred while fetching Profile");
  }
};

const getProfileById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await userProfileServices.getProfileById(id);
    res.status(200).json({
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occurred while fetching profile");
  }
};

const updateProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = req.body;

    const data = await userProfileServices.updateProfileById(
      profile,
      profileId
    );
    res.status(200).json({
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occurred while updating profile");
  }
};

export { createProfile, getAllProfile, getProfileById, updateProfileById };
