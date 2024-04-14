const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(db){
    this.db = db;
  }
  
  async register(username,email,password) {
    const existingUser = await this.db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',[username, email]
    );

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error('Username already exists');
      } else {
        throw new Error('Email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',[username,email, hashedPassword]
    );
    return 'User registered successfully'
  }

  async login(usernameOrEmail, password) {
    const user = await this.db.get('SELECT * FROM users WHERE username = ? OR email = ?',[usernameOrEmail,usernameOrEmail]);
    if (!user) {
      throw new Error('Invalid username or email');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }
    const payload = {
      userId: user.id,
      username: user.username,
    };
    const jwtToken = await jwt.sign(payload, 'USER_JWT_TOKEN');
    return jwtToken;
  }

  async getByUsernameOrEmail(username, email) {
    const selectQuery = `
      SELECT * FROM users
      WHERE username = ? OR email = ?
    `;

    try {
      const data = await this.db.get(selectQuery, [username, email]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId, username, email) {
    const updateQuery = `
      UPDATE users
      SET username = ?, email = ?
      WHERE id = ?
    `;

    try {
      await this.db.run(updateQuery, [username, email, userId]);
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId) {
    const selectQuery = `SELECT * FROM users WHERE id = ?`;
    try {
      const user = await this.db.get(selectQuery, userId);
      if (!user) {
        return null;
      }
      return {
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      throw error; 
    }
  }

  async updateProfile(userId, username, email) {
    const updateQuery = `
      UPDATE users
      SET username = ?, email = ?
      WHERE id = ?
    `;

    try {
      await this.db.run(updateQuery, [username, email, userId]);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(password,userId){
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatePasswordQuery = `
      UPDATE users
      SET password = ?
      WHERE id = ?
    `;
    try {
      await this.db.run(updatePasswordQuery, [hashedPassword, userId]);
      return "password update successfully"
    } catch (error) {
      throw error;
    }
  }

}

class Travel extends User {
   constructor(db){
    super(db)
   }

   async create(title,description,date,location,photosurl,userId){
      try{
          const insertQuery = `INSERT INTO travel_details (title, description, date, location, photosUrl, userId) VALUES (?, ?, ?, ?, ?, ?)`
          await this.db.run(insertQuery, [title, description, date, location, photosurl, userId]);
          return { message: 'Travel entry created successfully' };
      }catch(err){
          throw err;
      }
   }

async getAllByUserId(userId) {
    const selectQuery = `SELECT * FROM travel_details WHERE userId = ?`;
    try {
      const data = await this.db.all(selectQuery, userId);
      if (data.length == 0){
        return 'No travel details found for this user'
      }else{
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  async getById(travelId){
    try{
      const selectQuery = `SELECT * FROM travel_details WHERE id = ?`;
      const data = await this.db.get(selectQuery, travelId);
      return data
    }catch(err){
      throw err
      
    }
  }

  async update(travelId, title, description, date, location, photosUrl) {
    const updateQuery = `
      UPDATE travel_details
      SET title = ?, description = ?, date = ?, location = ?, photosUrl = ?
      WHERE id = ?
    `;

    try {
      await this.db.run(updateQuery, [title, description, date, location, photosUrl, travelId]);
      return { message: 'Data updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async delete(travelId, userId) {
    const deleteQuery = `DELETE FROM travel_details WHERE id = ? AND userId = ?`;

    try {
      await this.db.run(deleteQuery, [travelId, userId]);
      return { message: 'Entry deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
   
}

module.exports = { User, Travel };
