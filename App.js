import express from "express";
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express()
const port = parseInt(process.env.PORT) || 9000;

app.use(express.json());
app.use(cors());

const {TURSO_DATABASE_URL,TURSO_AUTH_TOKEN} = process.env;

const turso = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});

app.get("/apartments", async(req, res) => {
    const ans = await turso.execute(`SELECT * FROM apartments`);
    console.log(ans);
    res.json( ans.rows )
});

app.post("/apartments_post", async(req, res) => {
  const {title, description, value, images} = req.body;
  
  try {
    const ans = await turso.execute({
      sql: `INSERT INTO apartments ( title, description, value, images) VALUES (?, ?, ?, ?)`,
      args: [title, description, value, images]
    });
    res.json({
        mensaje: "New Apartment",
        usuario: ans
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      mensaje: "Error"
    });
  }
})

app.delete("/apartment_delete/:id", async (req, res) => {
  const Apartid = req.params.id;

  try {
      const query = `DELETE FROM apartments WHERE id = ?`;
      const result = await turso.execute(query, [Apartid]);

      if (result.affectedRows > 0) {
          res.json({
              mensaje: "Apartment deleted"
          });
      } else {
          res.status(404).json({
              mensaje: "No found"
          });
      }
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
          mensaje: "Error",
          error: error.message
      });
  }
});


app.get("/users/:id", async (req, res) => {
  const contact_id = req.params.id; 

  try {
      const query = `SELECT * FROM contacts WHERE contact_id = ?`; 
      const result = await turso.execute(query, [contact_id]);

      if (result.rows.length > 0) {
          res.json(result.rows[0]); 
      } else {
          res.status(404).json({
              mensaje: "Usuario no encontrado"
          });
      }
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
          mensaje: "Error obteniendo el usuario",
          error: error.message
        });
  }
});

app.patch("/apartment_update/:id", async (req, res) => {
  const Apartid1 = req.params.id;
  const { title, description, value, images } = req.body;

  try {
      const query = `
          UPDATE apartments 
          SET title = ?, description = ?, value = ?, images = ? 
          WHERE id = ?`;

      const result = await turso.execute(query, [title, description, value, images, Apartid1]);

      if (result.affectedRows > 0) {
          res.json({
              mensaje: "Apartment updated"
          });
      } else {
          res.status(404).json({
              mensaje: "No found"
          });
      }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
          mensaje: "Error updating",
          error: error.message
      });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})