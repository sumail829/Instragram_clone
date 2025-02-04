import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cloudinary from "cloudinary";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })




//1.Server setup
const app = express();

//2.Middleware setup
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: 'dnhun2a8m',
  api_key: '418397955729357',
  api_secret: '-4W76HpN8R9DU03vEabY9BgfuMM'
});

//3.Database configuration

try {
  mongoose.connect("mongodb+srv://samirpanjiyar4:kDjLIMNBqE5OBuW6@cluster0.ymh08.mongodb.net/instagram?retryWrites=true&w=majority&appName=Cluster0")
  console.log("MongoDb connected succesfully");
} catch (error) {
  console.log("mongoDb connection failed", error);

}

//4.Schema Configuration

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  comments: [
    {
      commentMessage: { type: String, required: true },
    }
  ]
})
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profilePicture: { type: String, required: true },
});

//5.Model configuration

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);
//Route configuration

app.get("/posts", async (req, res) => {
  try {
    const allPost = await Post.find()
    console.log(allPost) // for developer
    return res.status(200).json(allPost); //for frontend user to display post
  } catch (error) {
    console.log(error) //for developer
    return res.status(500).json({ message: error }); //for frontend user
  }
})

//create route 

app.post("/posts", upload.single('image'), async (req, res) => {
  try {
    console.log(req.file, "file")
    const response = await cloudinary.uploader.upload(req.file.path)
    console.log(response,"response")
      

    const newPost = await new Post({...req.body,image:response.secure_url}).save();
    return res.status(201).json(newPost);

  } catch (error) {
    console.log("something went wrong", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
})

//get one by id

app.get("/posts/:id", async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id);
    return res.status(200).json(singlePost);
  } catch (error) {
    console.log("something went wrong", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });

  }
})

//we use put and patch for update
//put is used to update all the records and it create the object if it doesnot exist
//patch is used to update all the records and it doesnot create the object if it doesnot exist
//update onew by id

app.patch("/posts/:id", async (req, res) => {
  try {

    const singlePost = await Post.findById(req.params.id);
    if (!singlePost) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    //if post exist then update the post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }); //new:true send updated post
    return res.status(200).json(updatedPost);


  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });

  }
})

//Delete by id

app.delete("/posts/:id", async (req, res) => {
  try {

    const singlePost = await Post.findById(req.params.id);
    if (!singlePost) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    //if post exist then Delete the post
    const deletedPost = await Post.findByIdAndDelete(req.params.id); //new:true send updated post
    return res.status(200).json(deletedPost);


  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });

  }
})



//User ROute

app.post("/users", async (req, res) => {
  try {
    const newUser = await new User(req.body).save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    return res.status(200).json(singleUser);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    if (!singleUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If user exist then update the user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    if (!singleUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If user exist then delete the user
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

//Listen to the server
app.listen(4000, () => {
  console.log("server running on port 4000");
})
