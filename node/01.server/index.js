// const express = require("express");
// const app = express();

// app.get("/sum/a/b",function(req,res){

//     const a = req.parama.a
//     const b = req.parama.b
//     console.log("hello")
//     res.json({
//         a : a,
//         b : b
//     })
//     // res.send("sanket")
// })

// app.listen(2000)


//----------------------------------------------------------------

// const express = require("express")
// const app = express();

// app.use(express.json());

// app.use((req,res,next)=>{
//     next();
// })

// app.get("/search",(req,res)=>{
//     const {q}=req.query

//     res.send( `query is : ${q}`)
// })

// app.get("/hello/:category/:price",(req,res)=>{
//    const {category,price} = req.body;

//     res.json({
//         category : category,
//         price : price
//     })
// })

// app.listen(3000);


//**************************************************** */
// const express = require("express");
// const app = express();

// app.use(express.json());

// // Middleware - log API call with timestamp
// app.use((req, res, next) => {
//   console.log(`API called at: ${new Date().toLocaleTimeString()} | ${req.method} ${req.url}`);
//   next();
// });

// // Query Param Example
// app.get("/products", (req, res) => {
//   const { category, price } = req.query;
//   res.send(`Showing products in category ${category} under price ${price}`);
// });

// // Route Param Example (bonus)
// app.get("/hello/:category/:price", (req, res) => {
//   const { category, price } = req.params;
//   res.send(`Price and category: ${category}, ${price}`);
// }); 

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });



const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

function addmidleware(req,res,next){
    console.log(req.method);
    console.log(req.hostname);
    console.log(req.url);
    
    
    next();
}
app.use(addmidleware);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/product', (req, res) => {
  res.send('xxx World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
