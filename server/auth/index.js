const router = require("express").Router();

const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} = process.env;

const axios = require("axios");

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  try {
    const { username, password,github_user } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const instructor = await prisma.instructor.create({
      data: {
        username,
        password:hashedPassword,
        
      },
    });

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/account",async(req,res,next) =>{
  const accessToken = req.query.access_token;
  console.log(accessToken)
  const headers = {
    Authorization:`Bearer ${accessToken}`
  }
  const user = await axios.get(
    `https://api.github.com/user`,{headers}
  )



  if(user){
    try{
      const instructor = await prisma.instructor.findUnique({
        where:{
          username:user.data.name
        }
      })
      if(instructor){
        const token = jwt.sign({ id: instructor.id }, process.env.JWT);
        res.send(`
        <h1>Successfully Logged In Via GitHub!!!</h1>
        <p>${token}</p>
        `)
      }else{
        next({
          name:""
        })
      }

    }catch{
      const instructor = await prisma.instructor.create({
        data:{
          username: user.data.name,
          password: "password",
          github_user: accessToken
        }
          
        })
        if(instructor){
          const token = jwt.sign({ id: instructor.id }, process.env.JWT);
          res.send(`
          <h1>Successfully Logged In Via GitHub!!!</h1>
          <p>${token}</p>
          `)
        }else{
          next({
            name:""
          })
        }
      

    }
  
  }

 
}) 

//GET auth/github/login
router.get("/github/login", (req, res,next) => {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;
  res.status(302).redirect(githubUrl);
});

//GET auth/github/login/callback
router.get("/github/login/callback", async(req, res,next) =>{
  const body = {
    client_id:GITHUB_CLIENT_ID,
    client_secret:GITHUB_CLIENT_SECRET,
    code:req.query.code
  }
  const headers = {
    accept:'application/json',
  }

  const response = await axios.post(
    `https://github.com/login/oauth/access_token`,
    body,
    {headers}
    );
    const result = await response.data;
    console.log(result);
    const accessToken = response.data.access_token;
    if(accessToken){
      
      res.redirect("/auth/account?access_token="+accessToken);
    }
    else{
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });

    }
   
})

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

 // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const instructor = await prisma.instructor.findUnique({
      where: {
        username: username,
      },
    });
    console.log(instructor)
    if (!instructor) {
      return res.status(401).send("Invalid login credentials.");
    }

    const hashedPassword = instructor.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    console.log(passwordMatch);

    // Create a token with the instructor id
    if (passwordMatch) {
      const token = jwt.sign({ id: instructor.id }, process.env.JWT);
      res.send({ token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });}

   
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
 // console.log(req.user.id);
  try {
    const instructor = await prisma.instructor.findUnique({
      where: {
        id: req.user.id,
      },
    });
    delete instructor.password;
    res.send(instructor);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
