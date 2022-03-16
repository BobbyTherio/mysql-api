const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./Models/Student');

app.use(express.urlencoded({extended: false}));

//custom middleware

var getAllCounter = 0
var getByIdCounter = 0
var getBySectionCounter = 0
var postCounter = 0
var patchCounter = 0
var deleteCounter = 0

function customMiddleware(req, res, next) {
    var method = req.method;
    var query = req.url;
    var id = req.params.section;
    if (query == '/' && method =='GET'){
        getAllCounter ++
    }
    if (query == `/by_id/${id}` && method == 'GET') {
        getByIdCounter ++
    }
    if (query == `/by_section/${section}` && method == 'GET') {
        getBySectionCounter ++
    }
    if (method == 'POST') {
        postCounter ++
    }
    if (method == 'PATCH') {
        patchCounter ++
    }
    if (method == 'DELETE') {
        deleteCounter ++
    }
    console.log(`Most recent route call: ${query}
    GET (all students) count: ${getAllCounter}
    GET (by student ID) count: ${getByIdCounter}
    GET (by section) count: ${getBySectionCounter}
    POST count: ${postCounter}
    PATCH count: ${patchCounter}
    DELETE count: ${deleteCounter}`);
    next();
}

//This is the connection to the MySQL Database
config.authenticate().then(function(){
    console.log('Database is Running and Connected...');
}).catch(function(err){
    console.log(err);
});

//This get the list of all "students"
app.get('/', function(req, res){
    Student.findAll().then(function(result){
        res.status(200).send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Retrieving specific student
app.get('/', function(req, res){
    let data = {
        where: {}
    }
    if(req.query.name !== undefined){
        data.where.name = req.query.name;
    }
    if(req.query.section !== undefined){
        data.where.section = req.query.section;
    }
    if(req.query.gpa !== undefined){
        data.where.gpa = req.query.gpa;
    }
    if(req.query.nationality !== undefined){
        data.where.nationality = req.query.nationality;
    }
    Student.findAll(data).then(function(result){
        res.status(200).send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Create a new student
app.post('/', function(req, res){
    Student.create(req.body).then(function(result){
        res.redirect('/'); //Redirect to the get route to display all students
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Update first name of a student
app.patch('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student 
    Student.findByPk(studentId).then(function(result){
        //Check if student was found
        if(result){
            //Update student record
            result.name = req.body.name;
            result.section = req.body.section;
            result.gpa = req.body.gpa;
            result.nationality = req.body.nationality;
            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Delete a student record
app.delete('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student
    Student.findByPk(studentId).then(function(result){

        if(result){
            //Delete student from database
            result.destroy().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});




app.listen(3000, function(){
    console.log('Server running on port 3000...');
});






/* 
200 - OK
400 - Bad request (data validation)
422 - validation error
404 - not found
500 - server error
*/