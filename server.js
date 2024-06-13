const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const newStudent = require('./model/studentSchema');
const newTeacher = require('./model/teacherSchema');
const newResult = require('./model/resultSchema');
const session = require('express-session');
const flash = require('connect-flash');
const mongodbsession = require('connect-mongodb-session')(session);
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));

const connectDB = require('./utils/connectDB');


    connectDB();
    const MongodbStore = new mongodbsession({
        uri:process.env.dbLink,
        collection: 'liveSession'
    });
    app.use(session({
        secret: 'Keep Your Secret',
        saveUninitialized: false,
        resave:false,
        store:MongodbStore,
        cookie: {
            maxAge: 1000 *30 * 30 *1 * 1
        }
    }));
    app.use(flash());

    const authenticate = (req, res, next) => {
        if (req.session.authenticate) {
            req.user = req.session.user; // Assuming user information is stored in req.session.user
            next();
        } else {
            res.redirect('/Home');
        }
    };
    
    
    const PORT = 7000;
    app.listen(PORT,()=>{
        console.log(`Server on ${PORT}`)
    });
   
    // pages
app.get('/Home',(req,res)=>{
    res.render('index.ejs')
})
app.get('/student', async (req, res) => {
    try {
        const instructors = await newTeacher.find();
        const teachersFullnames = instructors.map(instructor => instructor.fullname);

        res.render('studentReg.ejs', { teachers: teachersFullnames, messages:req.flash('info')});
    } catch (error) {
        console.error("Error fetching instructors:", error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/some-error-route');
    }
});


app.get('/teacher',(req,res)=>{
    res.render('teacherReg.ejs',{messages:req.flash('info')})
})
app.get('/registration',(req,res)=>{
    res.render('regpath.ejs',{messages:req.flash('info')})
})
app.get('/result', authenticate, (req,res)=>{
    res.render('result.ejs', {messages:req.flash('info')})
})
app.get('/login',(req,res)=>{
    res.render('login.ejs',{messages:req.flash('info')})
})


app.get('/forgetpassword',(req,res)=>{
    res.render('forgotpassword.ejs',{messages:req.flash('info')})
})
//////// Registerartion for student

app.post('/studentRegistration', upload.single('Image'), async (req, res) => {
    try {
        const{username, password, fullname, phone, DOB,Instructor, email} = req.body
 console.log(req.body)
        const newStuednt = await newStudent.findOne({username:username})
        console.log(newStuednt)
        if(newStuednt){
          req.flash('info', 'Username Already Exist!')
          res.redirect('/student')
        }
         const hashedPassword = await bcrypt.hash(password, 10) 

        const student= new newStudent ({
            Fullname:fullname,
            DOB:DOB,
            Username:username,
            Password:hashedPassword,
            Email:email,
            Role: 'Student',
            Active: true,
            Image:{
                data: req.file.buffer,
            contentType: req.file.mimetype
            },
            Phone:phone,
            Instructor:Instructor
 
        })
        console.log({username, hashedPassword}) ;

        await student.save()

       await newTeacher.findOneAndUpdate(
            {fullname:Instructor},
            {$push:{students:student}},
            {new:true,upsert:true},
        );
        req.flash('info', 'Registration Successful !..')
        res.redirect('/login');
 
    } catch (error) {
        console.log(error);
    }

    })

//////////////////////// Registeration for teachers
app.post('/teacherRegistration', upload.single('image'), async (req, res) => {
    try {
        const{username, password, fullname, phone,email} = req.body;

 console.log(req.body);

        const instructor = await newTeacher.findOne({username:username})
        console.log(instructor)
        if(instructor){
          req.flash('info', 'Username Already Exist!')
          res.redirect('/teacher')
        }

         const hashedPassword = await bcrypt.hash(password, 10) 
 
        const teacher= new newTeacher({
            fullname:fullname,
            username:username,
            password:hashedPassword,
            email:email,
            role: 'Instructor',
            active: true,
            image:{
                data: req.file.buffer,
            contentType: req.file.mimetype
            },
            phone:phone,
 
        })
        console.log({username, hashedPassword}) ;

        await teacher.save()
 
        res.redirect('/login')
 
    } catch (error) {
        console.log(error);
    }
 
    
 })
 /////////////////////login/////////////////////////
 let foundStudent;
    
 let foundTeacher;

 app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log({ username, password });

   

    try {
        foundStudent = await newStudent.findOne({ Username: username });
        foundTeacher = await newTeacher.findOne({ username: username });
    } catch (error) {
        console.error("Error finding user:", error);
        req.flash('info', 'Internal server error');
        return res.redirect('/login');
    }

    if (foundStudent) {
        const validPassword = await bcrypt.compare(password, foundStudent.Password);

        if (validPassword) {
            req.session.authenticate = true;
            res.redirect('/studentdashboard');
        } else {
            req.flash('info', 'Incorrect username or password!');
            res.redirect('/login');
        }
    } else if (foundTeacher) {
        const validPassword = await bcrypt.compare(password, foundTeacher.password);

        if (validPassword) {
            req.session.authenticate = true
            res.redirect('/teacherdashboard');
        } else {
            req.flash('info', 'Incorrect username or password!');
            res.redirect('/login');
        }
    } else {
        req.flash('info', 'User not found!');
        res.redirect('/login');
    }
});
///////////////////////////////////////////////////////////////////

app.get('/teacherdashboard', authenticate, async(req, res) => {
    const user = await foundTeacher;

     res.render('teacherDashboard.ejs', {user:foundTeacher, messages:req.flash('info')});

});

app.get('/studentdashboard', authenticate, async(req,res)=>{
    const LoggedStudent = await foundStudent; 
    
    res.render('studentDashboard.ejs', {LoggedStudent, messages:req.flash('info')})
});

///////////////////////////////////////////////////////////////////
    


   /////////////////////// FORGET PASSWORD ////////////////////

   app.post('/forgotpassword', async (req, res) => {
    const {username, newpassword} = req.body;
    console.log({username, newpassword});

    if (username.length < 5 || newpassword.length < 5) {
        req.flash('info', 'Username and Password must be greater than 5 characters!')
         res.redirect('/forgetpassword');
    }

    let TeacherModel;
    let StudentModel;

    try {
        TeacherModel = newTeacher;
        StudentModel = newStudent; 
    } catch (error) {
        console.error("Error loading models:", error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/forgetpassword');
    }

    try {
        const teacher = await TeacherModel.findOne({ username });

        if (teacher) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await TeacherModel.findOneAndUpdate({ username: username }, { $set: {password: hashedPassword} });
            req.flash('info', 'Password Changed!');
           return res.redirect('/login');
        }

        const student = await StudentModel.findOne({ Username: username });

        if (student) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await StudentModel.findOneAndUpdate({ Username: username }, { $set: { Password: hashedPassword } });
            req.flash('info', 'Password Changed!');
           return res.redirect('/login');
        }

        req.flash('info', 'Username not found');
        res.redirect('/forgetpassword');

    } catch (error) {
        console.error("Error updating password:", error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/forgetpassword');
    }
});

/////////////////////Logout////////////////////////
app.post('/logout', (req,res)=>{
    req.session.destroy((err)=>{
       if(err) throw err;
       res.redirect('/login')
    })
 })

 ////////////////////////////Result////////////

 app.post('/result', async (req, res) => {
    
    try {
        const { studentName, maths, bio, eng, phy, chem, attendance } = req.body;

        console.log(req.body);

        const result = new newResult({
            studentName: studentName,
            maths: maths,
            bio: bio,
            eng: eng,
            phy: phy,
            chem: chem,
            attendance: attendance,
        });

        await result.save();

        await newStudent.findOneAndUpdate(
            { Fullname: studentName },
            { $push: { myresult: result } }, // Assuming 'myresult' is an array field for storing results
            { new: true, upsert: true }
        );
        req.flash('info', 'Result Uploaded!.');
        res.redirect('/teacherdashboard');

    } catch (error) {
        console.log(error);
    }
});
//////////////////Teacher delete student///////////

app.get('/deleteStudent', authenticate, async (req, res) => {
    const { teacherId, studentId } = req.query;
    console.log('teacherID', teacherId);
    console.log('studentID', studentId);

    try {
        // Delete student from newStudent
        const deletedStudent = await newStudent.findByIdAndRemove(studentId);
        console.log('Deleted Student:', deletedStudent);
       

        // Find teacher
        let teacher = await newTeacher.findOne({ _id: teacherId });

        if (teacher) {
            // Remove student from teacher's list
            teacher.students = teacher.students.filter((item) => item._id.toString() !== studentId);
            
            
            // Save updated teacher
            const updatedTeacher = await teacher.save();
            console.log('Teacher with students cleared:', updatedTeacher);
            req.flash('info', 'Student deleted!');
            res.redirect('/teacherdashboard');
            
        } else {
            console.log('Teacher not found');
        }

    } catch (error) {
        console.error(error);
        req.flash('info', 'Internal Server Error');
        res.redirect('/teacherdashboard');
    }
});
//////////// To view student profile///////////
app.get('/View_profile/:_id', authenticate, async (req, res) => {
    try {
      const { _id } = req.params;
  
      const userInfo = await newStudent.find({ _id });
  
      if (userInfo.length > 0) {
        res.render('profile.ejs', { userInfo: userInfo[0] }); // Pass userInfo as an object
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  
  
