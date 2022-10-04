const User = require("../model/User");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exits",
      });
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "publicid", url: "sample_url" },
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
    
      

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(email,password);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User does not exits",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(404).json({
        success: false,
        message: "Incorrect Credentials",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });




  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const usertoFollow = await User.findById(req.params.id)
    const loggedInUser = await User.findById(req.user._id)

    if (!usertoFollow) {
      res.status(404).json({
        success: false,
        message: "User doex not exist",
      });
    }

    if (loggedInUser.following.includes(usertoFollow._id)) {

      const indexFollowing = loggedInUser.following.indexOf(usertoFollow._id)
      loggedInUser.following.splice(indexFollowing,1)

      const indexFollower = usertoFollow.following.indexOf(loggedInUser._id)
      usertoFollow.following.splice(indexFollower,1)


      await loggedInUser.save()
      await usertoFollow.save()

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    }

    loggedInUser.following.push(usertoFollow._id)
    usertoFollow.followers.push(loggedInUser._id)

    await loggedInUser.save()
    await usertoFollow.save()

    res.status(200).json({
      success: true,
      message: "User followed",
    });
  

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


