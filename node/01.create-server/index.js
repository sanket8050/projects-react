//localhost://2000/sum?a=2&b=4

// const express = require("express");
// const app = express();

// app.get("/sum" , function(req,res){
//     const a = parseInt(req.query.a);
//     const b = parseInt(req.query.b);
   
//     res.json({
//         ans : a+b
//     })
// })

// app.listen(2000);

// localhost://2000/1/2
// const express = require("express");
// const app = express();

// app.use("/sum/:a/:b",function(req,res){
//     const a = parseInt(req.params.a);
//     const b = parseInt(req.params.b);

//     res.json({
//         ans : a+b
//     })

// })
// app.listen(2000)


// const express = require("express")
// const app = express();

// app.use("/",function(req,res){
//     res.send("welcome to my api")
// })

// app.use("/about",function(req,res){
//     res.send("This is Sankets first backend project")
// })
// app.listen(3000)

// const express = require("express")
// const app = express();
// app.use(express.json());

// app.post("/signup",function(req,res){
//     const {username,pass} = req.body;   
   

//     res.json({
//         username : username,
//         pass : pass
//     })
// }
// )

// app.listen(2000)

const express = require("express");
const app = express();

// Middleware to read JSON body
app.use(express.json());

// POST /signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body; // extracting from body

  res.json({
    message: "Signup data received",
    user: username,
    pass: password
  });
});

app.listen(2000, () => {
  console.log("Server running on http://localhost:2000");
});
