const User = require("../models/user");
const Submission = require("../models/submission")

// Create a new submission
exports.createSubmission = async (req, res) => {
  // Extract submission data from the request body
  const { name, audioFile, genre, artist, description, releaseDate, duration, private, userId } =
    req.body;
  try {
    // Find the authenticated user by their ID
    let user = await User.find({_id: userId});
    user=user[0];

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(user);

    // Create a new submission object
    const newSubmission = await Submission.create({
      name,
      audioFile,
      genre,
      artist,
      description,
      releaseDate,
      duration,
      userId,
      private,
    });

    // Add the new submission to the user's submissions array
    if(!user.submissions) user.submissions=[];
    user.submissions.push(newSubmission._id);

    // Save the user document with the new submission
    await user.save();

    res.json(newSubmission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all submissions for the authenticated user
exports.getAllSubmissions = async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findOne({_id: req.params.userId}).populate("submissions");
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get a single submission by ID
exports.getSubmissionById = async (req, res) => {
  const { userId, submissionId } = req.params;
  console.log(req.params);
  try {
    const user = await User.findById(userId);
    const submission = await Submission.findById(submissionId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!submission || (submission.private && submission.userId.toString()!==user._id.toString())) {
      return res.status(404).json({ msg: "Submission not found" });
    }

    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a submission by ID
exports.updateSubmission = async (req, res) => {
  const { userId, submissionId } = req.params;

  try {
    const user = await User.findById(userId);
    let submission = await Submission.findById(submissionId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!submission || submission.userId.toString()!==user._id.toString()) {
      return res.status(404).json({ msg: "Submission not found" });
    }

    submission=await Submission.findByIdAndUpdate(submissionId, req.body);
    
    await user.save();

    res.json(user.submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a submission by ID
exports.deleteSubmission = async (req, res) => {
  const { userId, submissionId } = req.params;

  try {
    const user = await User.findById(userId).populate("submissions");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.submissions.pull(submissionId); // Remove the submission by its ID

    await user.save();

    res.json(user.submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
