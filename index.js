var express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  port = 3030



// App Config
mongoose.connect("mongodb://blog:blog@ds127892.mlab.com:27892/jasonblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(expressSanitizer())



// Mongoose/Model
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  create: { type: Date, default: Date.now }
})
var Blog = mongoose.model("Blog", blogSchema);




// Restful Routes
app.get("/", function (req, res) {
  res.redirect("/blogs")
})

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, req) {
    if (err) {
      console.log(err)
    } else {
      res.render("index", { blogs: req })
    }
  })
})

app.post("/blogs", function (req, res) {
  req.body.body = req.sanitize(req.body.body)
  Blog.create({ title: req.body.title, image: req.body.image, body: req.body.body }, function (err, req) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs")
    }
  })
})

app.get("/blogs/new", function (req, res) {
  res.render("new")
})

app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, req) {
    if (err) {
      console.log(err)
    } else {
      res.render("show", { blog: req })
    }
  })
})


app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, req) {
    if (err) {
      console.log(err)
    } else {
      res.render("edit", { blog: req })
    }
  })
})

app.put("/blogs/:id", function (req, res) {
  req.body.body = req.sanitize(req.body.body)  
  Blog.findByIdAndUpdate(req.params.id, req.body, function (err, req) {
    if (err) {
      res.redirect("/blogs")
    } else {
    }
  })
  res.redirect("/blogs/" + req.params.id)
})

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, req){
    if(err){
      console.log(err)
    }else{
      res.redirect("/blogs")
    }
  })
})

app.listen(port, function () {
  console.log("Listening on : " + port)
})