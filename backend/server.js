import express, { response } from "express";
import mongoose, { trusted } from "mongoose";
import cors from "cors";
import cloudinary from "cloudinary";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
const upload = multer({ dest: 'uploads/' })




//1.Server setup
const app = express();

//2.Middleware setup
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

//3.Database configuration

try {
  mongoose.connect(process.env.MONGODB_URL)
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
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
});

const personSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String, required: true }

})

//5.Model configuration

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);
const Person = mongoose.model("Person", personSchema);

//token verification
const verifyToken = (req, res, next) => {
  const authToken = req.headers["authorization"]; // access token

  if (!authToken) {
    return res.status(401).json({ message: "No token provided" })
  }


  // Bearer daijdsaoikjd123

  const pureToken = authToken.split(" ")[1]
  console.log(pureToken, "this is pure token")
  
  jwt.verify(pureToken,"1234567890",(err,decoded)=>{
    if(err){
      return res.status(403).json({message:"Token dosenot match"})
    }
    console.log(decoded,"This is decoded user data");
    next();
  });
  


}
//Route configuration

app.get("/posts",verifyToken, async (req, res) => {
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
    console.log(response, "response")


    const newPost = await new Post({ ...req.body, image: response.secure_url }).save();
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

app.post("/users", upload.single('profilePicture'), async (req, res) => {
  try {

    const yesUserExist = await User.findOne({ username: req.body.username });
    console.log(yesUserExist, "yesUserExist");

    if (yesUserExist) {
      return res.status(409).json({
        message: "User already exit,please talke another username"
      })


    }

    const saltRounds = 10;// const facotr for hashing algorithm
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    console.log(hashedPassword, "hashedpassword");



    ///save profilepicture to cloudinary before saving to database and secure url
    const response = await cloudinary.uploader.upload(req.file.path)
    console.log(response, "response")

    const newUser = await new User({ ...req.body, password: hashedPassword, profilePicture: response.secure_url }).save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});


app.post("/users/login", async (req, res) => {
  try {

    // Check if username exist or not
    const yesUserNameExist = await User.findOne({ username: req.body.username });
    console.log(yesUserNameExist, "yesUserNameExist");

    if (!yesUserNameExist) {
      return res.status(404).json({ message: "Username does not exist." });
    }

    // if exist then proceed to login


    const passwordMatch = await bcrypt.compare(req.body.password, yesUserNameExist.password);
    console.log(passwordMatch, "passwordMatch");

    if (!passwordMatch) {
      res.status(401).json({ message: "password does not match" })
    }




    const jwtToken = jwt.sign({ username: req.body.username }, "1234567890", { expiresIn: "24h" });
    console.log(jwtToken, "asdasasdas")
    return res.status(200).json({
      message: "Login successful",
      jwtToken: jwtToken,
      user: yesUserNameExist,

    });




    // // Compare password if username exist
    // const passwordMatch = await bcrypt.compare(req.body.password, yesUserNameExist.password); // (12345, $2b$10$3)

    // if (!passwordMatch) {
    //   return res.status(401).json({ message: "Password does not match." });
    // }
    // // Generate token
    // // var token = jwt.sign({ foo: "bar" }, "shhhhh");
    // const jwtToken = jwt.sign({ username: req.body.username }, "74xzjhasf@#@#%532854@#@!$25328535345", { expiresIn: "24h" });

    // return res.status(200).json({
    //   message: "Login successful",
    //   jwtToken: jwtToken,
    //   user: yesUserNameExist,
    // });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});


//person route------------------------------------------------------------------------------->
app.post("/users/signin", async (req, res) => {
  const newUser = await new Person(req.body).save();
  return res.status(200).json({
    message: "user logged in",
    newuser: newUser
  })
})








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
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
})
