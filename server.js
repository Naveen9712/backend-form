const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dbConfig = require('./dbConfig'); // Import the database configuration

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection(dbConfig); // Use the imported database configuration

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Fetch all users
app.get('/users-list', (req, res) => {
    const sql = "SELECT id, name, email FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

// Fetch a single user by ID
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, name, email FROM users WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.json("Error");
        }
        return res.json(data[0]);
    });
});

// Update a user by ID
app.put('/update-user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [name, email, id], (err, data) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

// Delete a user by ID
app.delete('/delete-user/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users(`name`,`email`,`password`) VALUES (?)";
    const values = [name, email, hashedPassword];
    console.log('Executing query:', sql, values);
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.json("Error");
        }
        console.log('Data inserted successfully:', data);
        return res.json(data);
    });
});

app.post('/users', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE `email` = ?";
    console.log('Executing query:', sql, [email]);
    db.query(sql, [email], async (err, data) => {
        if (err) {
            console.error('Error selecting data:', err);
            return res.json("Error");
        }
        console.log('Query result:', data);
        if (data.length > 0) {
            const user = data[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                console.log('Password match for user:', email);
                return res.json("Success");
            } else {
                console.log('Password mismatch for user:', email);
                return res.json("fail");
            }
        } else {
            console.log('No user found with email:', email);
            return res.json("fail");
        }
    });
});

app.post('/submit-lead', (req, res) => {
    const sql = "INSERT INTO leads(`name`, `email`, `phone`, `message`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.message
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error inserting lead:', err);
            return res.json("Error");
        }
        console.log('Lead inserted successfully:', data);
        return res.json(data);
    });
});

app.get('/leads', (req, res) => {
    const sql = "SELECT * FROM leads";
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Error fetching leads:', err);
        return res.json("Error");
      }
      return res.json(data);
    });
  });

  app.get('/lead/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, name, email, phone, message FROM leads WHERE id = ?";
    db.query(sql, [id], (err, data) => {
      if (err) {
        console.error('Error fetching lead:', err);
        return res.json("Error");
      }
      return res.json(data[0]);
    });
  });
  
  // Update a lead by ID
  app.put('/update-lead/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;
    const sql = "UPDATE leads SET name = ?, email = ?, phone = ?, message = ? WHERE id = ?";
    const values = [name, email, phone, message, id];
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error updating lead:', err);
        return res.json("Error");
      }
      return res.json("Success");
    });
  });
  
  // Delete a lead by ID
  app.delete('/delete-lead/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM leads WHERE id = ?";
    db.query(sql, [id], (err, data) => {
      if (err) {
        console.error('Error deleting lead:', err);
        return res.json("Error");
      }
      return res.json("Success");
    });
  });
  
// Fetch all channels
app.get('/channels', (req, res) => {
    const sql = "SELECT * FROM channels";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching channels:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

// Fetch a single channel by ID
app.get('/channels/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM channels WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error fetching channel:', err);
            return res.json("Error");
        }
        return res.json(data[0]);
    });
});


// Add a new channel
app.post('/channels', (req, res) => {
    const { name, display_name } = req.body;
    const sql = "INSERT INTO channels(`name`, `display_name`) VALUES (?, ?)";
    db.query(sql, [name, display_name], (err, data) => {
        if (err) {
            console.error('Error inserting channel:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

// Update a channel
app.put('/channels/:id', (req, res) => {
    const { id } = req.params;
    const { name, display_name } = req.body;
    const sql = "UPDATE channels SET name = ?, display_name = ? WHERE id = ?";
    db.query(sql, [name, display_name, id], (err, data) => {
        if (err) {
            console.error('Error updating channel:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

// Delete a channel
app.delete('/channels/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM channels WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error deleting channel:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.get('/posts', (req, res) => {
    const sql = "SELECT * FROM posts";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.post('/posts', (req, res) => {
    const { facebook_id, title } = req.body;
    const sql = "INSERT INTO posts(`facebook_id`, `title`) VALUES (?, ?)";
    db.query(sql, [facebook_id, title], (err, data) => {
        if (err) {
            console.error('Error inserting post:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { facebook_id, title } = req.body;
    const sql = "UPDATE posts SET facebook_id = ?, title = ? WHERE id = ?";
    db.query(sql, [facebook_id, title, id], (err, data) => {
        if (err) {
            console.error('Error updating post:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM posts WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error deleting post:', err);
            return res.json("Error");
        }
        return res.json("Success");
    });
});

// Fetch all profiles
app.get('/profiles', (req, res) => {
    const sql = "SELECT * FROM profile";
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Error fetching profiles:', err);
        return res.status(500).json("Error");
      }
      return res.json(data);
    });
  });
  
  // Fetch a single profile by ID
  app.get('/profiles/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM profile WHERE id = ?";
    db.query(sql, [id], (err, data) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json("Error");
      }
      return res.json(data[0]);
    });
  });
  
  // Add a new profile
  app.post('/profiles', (req, res) => {
    const { id, name, phone, email } = req.body;
    const sql = "INSERT INTO profile (id, name, phone, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [id, name, phone, email], (err, data) => {
      if (err) {
        console.error('Error adding profile:', err);
        return res.status(500).json("Error");
      }
      return res.json("Profile added successfully!");
    });
  });
  
  // Update a profile by ID
  app.put('/profiles/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    const sql = "UPDATE profile SET name = ?, phone = ?, email = ? WHERE id = ?";
    db.query(sql, [name, phone, email, id], (err, data) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json("Error");
      }
      return res.json("Profile updated successfully!");
    });
  });
  
  // Delete a profile by ID
  app.delete('/profiles/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM profile WHERE id = ?";
    db.query(sql, [id], (err, data) => {
      if (err) {
        console.error('Error deleting profile:', err);
        return res.status(500).json("Error");
      }
      return res.json("Profile deleted successfully!");
    });
  });

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
