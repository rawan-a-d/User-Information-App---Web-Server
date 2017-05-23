const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.set('views', 'src/views');
app.set('view engine', 'pug');

app.use('/',bodyParser()); //creats key-value pairs request.body in app.post, e.g. request.body.username

// Create one route:
// - route 1: renders a page that displays all your users.
app.get('/', function (req, res) {
	fs.readFile('./resources/users.json', function (error, data) {
		if (error) {
			console.log("error");
		}
		var parsedData = JSON.parse(data);
		console.log('users read: ' + parsedData.length + " users loaded.");
		res.render('index', {users: parsedData});
	});
});

// /*Create two more routes:
// - route 2: renders a page that displays a form which is your search bar.
app.get('/search', function (req, res) {
		res.render('search');
});

// - route 3: takes in the post request from your form, 
// then displays matching users on a new page.
// Users should be matched based on whether either
// their first or last name contains the input string.
app.post('/search', function (req, res) {
	console.log('req.body.username in app.post("/search")')// to explain what I did next
	console.log(req.body.username);

	//how to process the data
	fs.readFile('./resources/users.json', function (error, data) {
		if (error) {
			console.log("error");
		}
		var parsedData = JSON.parse(data);
		
		var fullName = "";
		for (var i = 0; i < parsedData.length; i++) {
			if(req.body.username === parsedData[i].firstname + " " + parsedData[i].lastname || req.body.username === parsedData[i].lastname || req.body.username === parsedData[i].firstname){
				fullName = parsedData[i].firstname + " " + parsedData[i].lastname;
			}
		}
		if(fullName === ""){
			fullName = "The name you're searching for doesn't match any of our users.";
		}
		console.log(fullName);
		res.render('resultOfSearch', {result: fullName});
	});
});

//live search
// Part 1: Autocomplete
// Modify your form so that every time the user enters a key, it makes an AJAX call that populates the search results.
app.post('/suggestionFinder', function(req,res){
	var suggest = ''
	fs.readFile('./resources/users.json', function (error, data) {
		if (error) {
			console.log("error");
		}
		var parsedData = JSON.parse(data);
		var typedIn= req.body.typedIn;
		for (var i = 0; i < parsedData.length; i++) {
			if(parsedData[i].firstname.slice(0, typedIn.length) === typedIn || parsedData[i].lastname.slice(0, typedIn.length) === typedIn){
				console.log('suggestion found');
				suggest = parsedData[i].firstname + " " + parsedData[i].lastname;
			}
		}
		if(typedIn === ''){
			suggest = ''
		}
		console.log(suggest);
		res.send(suggest);
	});
});


// Create two more routes:
// - route 4: renders a page with three forms on it (first name, last name, and email) 
// that allows you to add new users to the users.json file.
app.get('/form', function(req,res){
	res.render('form')
});


// - route 5: takes in the post request from the 'create user' form, 
// then adds the user to the users.json file. 
// Once that is complete, redirects to the route that displays all your users (from part 0).

app.post('/form', function(req,res){
	var newUser = {
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
	};
	fs.readFile('./resources/users.json', function (error, data) {
		if (error) {
			console.log("error");
		}
		var parsedData = JSON.parse(data);
		parsedData.push(newUser);
		var stringifiedData = JSON.stringify(parsedData);
		console.log(stringifiedData);
		fs.writeFile('./resources/users.json', stringifiedData , function (error, data){
			if (error) {
				console.log("error");
			}
		});
	});
	res.redirect('/');
});


// server listens to clients (people with their browsers) who want to connect
var listener = app.listen(3000, function () {
	console.log('Example app listening on port: ' + listener.address().port);
});
