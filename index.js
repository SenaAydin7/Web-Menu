import express from "express"
//import bodyParser from "body-parser"
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();



const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

 
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


let products = [];
let category = [];

let categoryId;

app.get("/", async(req,res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE category_id = 1");
    products = result.rows;

    const data = await db.query("SELECT category_name FROM category WHERE id = 1");
    category = data.rows;

    res.render("menu1.ejs",{products: products,category: category});
  }catch (err) {
    console.log(err);
  }
})


app.get("/about",(req,res) => {
  res.render("about.ejs")
})

app.get("/order",(req,res) => {
  res.render("order.ejs")
})

app.get("/contact",(req,res) => {
  res.render("contact.ejs")
})



/*app.post("/", (req,res) => {

  categoryId = parseInt(req.body.choice);

  db.query("SELECT * FROM products WHERE category_id = $1",
  [categoryId], (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      products = res.rows;
      console.log(products)
    }
  })

  db.query("SELECT category_name FROM category WHERE id = $1",
  [categoryId], (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      category = res.rows;
      console.log(category)
    }
  })
  res.render("menu.ejs",{products: products, category: category});

})*/

//calisan kod
/*app.post("/", async (req,res) => {
    
  categoryId = parseInt(req.body.choice);

  try {
    const result = await db.query(
      "SELECT * FROM products WHERE category_id = $1",[categoryId]
    );
    products = result.rows;

    const data = await db.query(
      "SELECT category_name FROM category WHERE id = $1",[categoryId]
    );
    category = data.rows;
    console.log(products);
    res.render("menu.ejs",{products: products,category: category});
  
    
  }catch (err) {
    console.log(err);
  }
  
});*/

app.get("/api/products/:categoryId", async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
      const productsQuery = await db.query(
          "SELECT * FROM products WHERE category_id = $1", 
          [categoryId]
      );

      const categoryQuery = await db.query(
          "SELECT category_name FROM category WHERE id = $1", 
          [categoryId]
      );

      res.json({
          category_name: categoryQuery.rows.length ? categoryQuery.rows[0].category_name : "Kategori Bulunamadı",
          products: productsQuery.rows
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
  }
});

app.post("/selectCategory", async (req, res) => {
  //console.log("Gelen Veri:", req.body); // POST isteğinden gelen veriyi kontrol et
  const categoryId = parseInt(req.body.choice);

  if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Geçersiz kategori ID" });
  }

  try {
      const productsQuery = await db.query(
          "SELECT * FROM products WHERE category_id = $1",
          [categoryId]
      );

      const categoryQuery = await db.query(
          "SELECT category_name FROM category WHERE id = $1",
          [categoryId]
      );

      res.render("menu1.ejs", {
          category: categoryQuery.rows,
          products: productsQuery.rows
      });
  } catch (err) {
      console.error("Veritabanı hatası:", err);
      res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
  });