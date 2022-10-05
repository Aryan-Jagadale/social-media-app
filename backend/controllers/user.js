const User = require("../model/User");
const Post = require("../model/Post")
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

exports.logoutUser = async (req,res) => {
  try {

    res.status(200).cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true
    }).json({
      success: true,
      message: "User logouted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

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


exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password")
    const {oldPassword,newPassword} = req.body

    //console.log(oldPassword,newPassword);
    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Please provide old && new password",
      });
    }

    const isMatch =await user.matchPassword(oldPassword)

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }
    user.password =  newPassword
    await user.save()
    

    res.status(200).json({
      success: true,
      message: "User's Password Updated",
    });
  

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const {name,email} = req.body

    if (name) {
      user.name = name
    }
    if (email) {
      user.email = email
    }
    
    //USer Avatar to do
    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    await user.remove()

    //Logout user
    res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true
    })

    //Delet all posts of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await post.remove()
      
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted",
    });
  

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req,res) =>  {

  try {
    const user = await User.findById(req.user._id).populate("posts")

    res.status(200).json({
      success: true,
      user
    });
  

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }



}

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};