import express from "express";
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = parseInt(process.env.PORT) || 9000;

app.use(express.json());

const {TURSO_DATABASE_URL,TURSO_AUTH_TOKEN} = process.env;

const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

app.get('/', async(req, res) => {
  const ans2 = await turso.execute(`SELECT * FROM contacts`);
    console.log(ans2);
    res.json({ ans2 })
})


app.get("/users", async(req, res) => {
    //"Select * from users"
    const ans = await turso.execute(`SELECT * FROM contacts`);
    console.log(ans);
    res.json( ans.rows )
});

app.post("/users", async(req, res) => {
  const {first_name, last_name, email, phone} = req.body;

  try {
    const ans = await turso.execute({
      sql: `INSERT INTO contacts ( first_name, last_name, email, phone) VALUES (?, ?, ?, ?)`,
      args: [first_name, last_name, email, phone]
    });
    res.json({
        mensaje: "Usuario creado",
        usuario: ans
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      mensaje: "Error al crear el usuario"
    });
  }
})

app.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
      // SQL query to delete the user by ID
      const query = `DELETE FROM contacts WHERE contact_id = ?`; // Adjust the table and column names as necessary
      const result = await turso.execute(query, [userId]);
      // Check if any rows were affected
      if (result.affectedRows > 0) {
          res.json({
              mensaje: "Usuario eliminado"
          });
      } else {
          res.status(404).json({
              mensaje: "Usuario no encontrado"
          });
      }
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
          mensaje: "Error eliminando el usuario",
          error: error.message
      });
  }
});

// //todo: obtener un usuario por id

app.get("/users/:id", async (req, res) => {
  const contact_id = req.params.id; // Get the user ID from the request parameters

  try {
      // SQL query to select the user by ID
      const query = `SELECT * FROM contacts WHERE contact_id = ?`; // Adjust the table and column names as necessary
      const result = await turso.execute(query, [contact_id]);
      // Check if the user was found
      if (result.rows.length > 0) {
          res.json(result.rows[0]); // Return the first user found
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

// // todo: Actualizar un usuario por id

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  const { first_name, last_name, email, phone } = req.body; // Get the updated user data from the request body

  try {
      // SQL query to update the user by ID
      const query = `
          UPDATE contacts 
          SET first_name = ?, last_name = ?, email = ?, phone = ? 
          WHERE contact_id = ?`;

      const result = await turso.execute(query, [first_name, last_name, email, phone, userId]);

      // Check if any rows were affected
      if (result.affectedRows > 0) {
          res.json({
              mensaje: "Usuario actualizado"
          });
      } else {
          res.status(404).json({
              mensaje: "Usuario no encontrado"
          });
      }
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
          mensaje: "Error actualizando el usuario",
          error: error.message
      });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})