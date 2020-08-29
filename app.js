const mongoose = require('mongoose');
const bodyparser=require("body-parser");
const methodOverride=require("method-override");
const expressSanitizer=require("express-sanitizer");
const express=require("express");
const app=express();


//App config
mongoose.connect('mongodb://localhost:27017/blogapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());   //it should be after bodyparser
app.use(methodOverride("_method"));

//Model 
var blogSchema=mongoose.Schema({
	name:String,
	image:String,
	post:String
});

var Blog=mongoose.model("Blog",blogSchema);


//Routes
app.get("/",function(req,res){
	
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	
	Blog.find({},function(err,blogs){
		if(err)
			{
				console.log("error")
				
			}
	  else
		{
			res.render("index",{blog:blogs});
		}
	});
});

// NEW Routes
app.get("/blogs/new",function(req,res){
	res.render("new")
})

//Create Routes
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
	data=req.body.blog;
	Blog.create(data,function(err,newBlog){
		if(err)
			{
				res.render("new");
			}
		else
			{
				res.redirect("/blogs")
			}
	});
});

//Show Routes
app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				res.send(err);
			}
		else
			{
				res.render("show",{blog:foundBlog});
			}
		
	});
	
});

//Edit Routes
app.get("/blogs/:id/edit", function(req,res){
	
	Blog.findById(req.params.id,function(err,foundBlog){
		
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.render("edit",{blog:foundBlog});
			}
	});	
});


// Update Routes

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.redirect("/blogs/"+req.params.id);
			}
		
	});
	
});

// Delete routes

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,req.body.blog,function(err,removeBlog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.redirect("/blogs");
			}
	});
});






app.listen(3000,function(){
	console.log("server started")
})
