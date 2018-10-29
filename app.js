var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;

var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var methodOverride = require("method-override");
var formidable = require("express-formidable");
var RedisStore = require("connect-redis")(session);
var realtime = require("./realtime");

var http = require("http");

var app = express();
var server = http.Server(app);

app.use("/public",express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sessionMiddleware = session({
	store: new RedisStore({}),
	secret:"super ultra secret word",
	resave: true,
    saveUninitialized: true
})

realtime(server,sessionMiddleware);

app.use(sessionMiddleware);

app.use(methodOverride("_method"));
app.use(formidable({ keepExtension: true }));


app.set("view engine","jade");

app.get("/", function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});

app.get("/signup", function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("signup");
	})
	
});

app.get("/login", function(req,res){
		res.render("login");
});

app.post("/users", function(req,res){
	var user = new User({
						email : req.fields.email,
						password: req.fields.password,
						password_confirmation: req.fields.password_confirmation,
						username: req.fields.username
					});
	console.log(user.password_confirmation);

	user.save().then(function(us){
		res.send("guaramos el usuario existosamente");
	},function(error){
		if(error){
			console.log(String(error));
			res.send("no pudimos guardar la información.")
		}
	});

});

app.post("/sessions", function(req,res){
	User.findOne({email : req.fields.email,password: req.fields.password},function(err,user){
		console.log(user);
		req.session.user_id = user._id;
		console.log("paso" + req.session.user_id);
		res.send("hola mundo");
	});

});

app.use("/app", session_middleware);
app.use("/app", router_app);
server.listen(8080);