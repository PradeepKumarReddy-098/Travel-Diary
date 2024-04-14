const express = require("express");
const path = require("path");
const cors = require('cors');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const {User,Travel} = require("./user");
const app = express();

app.use(express.json());
app.use(cors());
const jwt = require('jsonwebtoken');

const dbPath = path.join(__dirname, "travel_diary.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3004, () => {
      console.log("Server Running at http://localhost:3004/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const authentication = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await jwt.verify(token, 'USER_JWT_TOKEN');
    const userId = decoded.userId;
    req.userId = userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid JWT token' });
    } else {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

app.get('/',async(req,res)=>{
  const description = "register to the app and login. Then perform the CURD operations"
  res.send({message:description})
})



app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password){
    res.send({message: 'Some data is missing. Enter username, email, password'})
  }else{
    try {
      const createUser = new User(db);
      const user = await createUser.register(username, email, password)
      res.json({ message: user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
 }
});

app.post('/login', async(req,res) => {
  const {usernameOrEmail,password} = req.body;
  if (!usernameOrEmail || !password){
    res.status(401);
    res.send({ message: 'Enter username or email and password' });
    }
  else{
    try{
      const userLogin = new User(db)
      const login = await userLogin.login(usernameOrEmail,password)
      res.send({jwt_token:login})
    }catch(error){
      res.status(401).json({ message: error.message });
    }
  }
  }
)

app.get('/profile', authentication, async (req, res) => {
  const userId = req.userId;
  try {
    const user = new User(db);
    const userDetails = await user.getProfile(userId);
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    res.json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/profile/update', authentication, async (req, res) => {
  const userId = req.userId;
  const { username,email } = req.body;

  if (!username || !email){
    return res.status(400).json({ message: `provide username,email.` });
  }
  
  try {
    const user = new User(db);
    const existingUser = await user.getByUsernameOrEmail(username, email);

    if (existingUser) {
      if (existingUser.username === username ) {
        return res.status(400).json({ message: 'Username already exists' });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    await user.updateProfile(userId, username, email);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/profile/password', authentication, async (req, res) => {
  const userId = req.userId;
  const {password} = req.body;
  if (!password){
    return res.status(400).json({ message: 'Please provide new Password' });
  }
  try{
    const user = new User(db);
    const changePassword = await user.changePassword(password,userId)
    res.send({ message: changePassword })
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.post('/travel/create', authentication, async(req,res)=>{
  const {title,description,date,location,photosurl=""} = req.body
  const userId = req.userId
  if (!title || !description || !date ||!location){
    res.status(400);
    res.send("Enter title,description,date and location");
  }else{
    try{
      const createEntity = new Travel(db);
      const create = await createEntity.create(title,description,date,location,photosurl,userId);
      res.send({message: create})
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
});

app.get('/travel', authentication, async (req, res) => {
  const userId = req.userId; 
  try {
    const travel = new Travel(db);
    const travelDetails = await travel.getAllByUserId(userId);
    res.json({ travelDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/travel/update/:travelId', authentication, async (req, res) => {
  const travelId = req.params.travelId;
  const userId = req.userId;
  const { title, description, date, location, photosUrl } = req.body;

  if (!title || !description || !date || !location){
    return res.status(404).json({ message: 'Enter title,description,date and location' });
  }

  try {
    const travel = new Travel(db);
    const existingEntry = await travel.getById(travelId);

    if (!existingEntry) {
      return res.status(404).json({ message: 'data not found' });
    }

    if (existingEntry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own entries' });
    }

    await travel.update(travelId, title, description, date, location, photosUrl);
    res.json({ message: 'Travel entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/travel/:travelId', authentication, async (req, res) => {
  const travelId = req.params.travelId;
  const userId = req.userId;

  try {
    const travel = new Travel(db);
    const existingEntry = await travel.getById(travelId);

    if (!existingEntry) {
      return res.status(404).json({ message: 'Data not found' });
    }

    if (existingEntry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own entries' });
    }

    await travel.delete(travelId,userId);
    res.json({ message: 'Travel entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

