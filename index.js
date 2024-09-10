import express from "express"
import bodyParser from "body-parser"
import pg from "pg";

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
})

db.connect();
 
const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


let products = [];
let category = [];

let categoryId;

app.get("/", async(req,res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE category_id = 1");
    products = result.rows;

    const data = await db.query("SELECT category_name FROM category WHERE id = 1");
    category = data.rows;

    res.render("menu.ejs",{products: products,category: category});
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

app.post("/", async (req,res) => {
    
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
  
});

app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
  });