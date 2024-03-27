var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");
var nodemailer = require("nodemailer");

var app = express();

app.listen(20204, function () {
    console.log("server started.........");
})

app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileuploader());

app.get("/admin",function(req,resp){
    resp.sendFile(process.cwd()+"/public/dash-admin.html");
})
app.get("/", function (req, resp) {

    resp.sendFile(process.cwd() + "/public/index.html");
})

app.get("/db-signup", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/db-signup.html");
})

app.get("/db-login", function (req, resp) {
    resp.send("do later......");
})

var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "J#3433@SRji",
    database: "dbcust",
    dateStrings: true

}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("Connected Successfulllyyy...");
    else
        console.log(jasoos);
})

app.post("/db-save-process", function (req, resp) {
    // resp.send("xszzjxckgvjhbj");
    var fileName = "nopic.jpg";
    if (req.files != null) {
        //console.log(process.cwd());
        fileName = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.pPic.mv(path);
    }
    console.log(req.body);
    //   resp.send("filename ="+fileName);

    var email = req.body.txtEmail;
    var address = req.body.txtAddress;
    var name = req.body.txtName;
    var contact = req.body.txtContact;
    var city = req.body.chooseCity;
    var state = req.body.chooseState;
    var dob = req.body.txtdob;
    var gender = req.body.chooseGender;
    var idproof = req.body.chooseIdProof;

    dbCon.query("insert into tbcust values(?,?,?,?,?,?,?,?,?,?)", [email, name, contact, dob, gender, idproof, fileName, address, state, city], function (err) {
        if (err == null)
            resp.send("record saved sucessfully.....");
        else
            resp.send(err);
    })
})

app.post("/db-update-process", function (req, resp) {

    var fileName;
    if (req.files != null) {
        //console.log(process.cwd());
        fileName = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.pPic.mv(path);
    }
    else {
        fileName = req.body.hdn;
    }
    console.log(req.body);


    var email = req.body.txtEmail;
    var address = req.body.txtAddress;
    var name = req.body.txtName;
    var contact = req.body.txtContact;
    var city = req.body.chooseCity;
    var state = req.body.chooseState;
    var dob = req.body.txtDob;
    var gender = req.body.chooseGender;
    var idproof = req.body.chooseIdProof;


    dbCon.query("update tbcust set  name=?,contact=?,dob=?,gender=?,idproof=?,idpic=?,address=?,state=?,city=? where email=?", [name, contact, dob, gender, idproof, fileName, address, state, city, email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("account updated successefullyyy..........");
            else
                resp.send("invaid email id");

        }
        else
            resp.send(err);
    })

})

app.post("/db-delete-process", function (req, resp) {

    var email = req.body.txtEmail;
    dbCon.query("delete from tbcust where email=?", [email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
                resp.send("Inavlid Email id");
        }
        else
            resp.send(err);
    })
})

app.get("/chk-email", function (req, resp) {

    var email = req.query.kuchEmail;

    dbCon.query("select *from users where email=?", [email], function (err, resultTable) {

        if (err == null) {
            if (resultTable.length == 1)
                resp.send("already taken....");
            else
                resp.send("avaiable....!!!!");
        }
        else
            resp.send(err);
    })
})

app.get("/get-json-record", function (req, resp) {
    dbCon.query("select * from users where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
        if (err == null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

app.get("/save-data", function (req, resp) {
    var email = req.query.kuchEmail;
    var password = req.query.kuchPwd;
    var type = req.query.kuchType;

    console.log(req.query);
    dbCon.query("insert into users values(?,?,?,current_date(),1)", [email, password, type], function (err) {
        if (err == null) {
            resp.send("signed-in..");

              //send nodemailer mail
    var mailoptions = {
        from :'goyalj916@gmail.com',
        to : email,
        subject :'hello this is my learning',
        text :'hey ,   '+email+'\nyou signed-in... and your password id '+password+'of my website'
    }
    
    transport.sendMail(mailoptions,function(error,info){
    
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("email sent"+info.response);
        }
    })
        }
        else {
            resp.send(err);
        }
    })
    

    
    // //send nodemailer mail
    // var mailoptions = {
    //     from :'goyalj916@gmail.com',
    //     to : email,
    //     subject :'hello this is my learning',
    //     text :'hey ,   '+email+'\nyou signed-in... and your password id '+password+'of my website'
    // }
    
    // transport.sendMail(mailoptions,function(error,info){
    
    //     if(error)
    //     {
    //         console.log(error);
    //     }
    //     else
    //     {
    //         console.log("email sent"+info.response)
    //     }
    // })
    

})
//=============================nodemailer==================
var transport =nodemailer.createTransport(
    {
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        service :'gmail',
        auth : {
            user : 'goyalj916@gmail.com',
            pass : 'vswcmfdjiikmavdv'
        }
    }
)
//====================================
app.get("/chk-proemail", function (req, resp) {

    var email = req.query.kuchEmail;

    dbCon.query("select *from tbcust where email=?", [email], function (err, resultTable) {

        if (err == null) {
            if (resultTable.length == 1)
                resp.send("already taken....");
            else
                resp.send("avaiable....!!!!");
        }
        else
            resp.send(err);
    })
})
app.get("/get-json-prorecord", function (req, resp) {
    dbCon.query("select * from tbprofile where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
        if (err == null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

app.get("/chk-details", function (req, resp) {

    var email = req.query.kuchEmail;
    var pwd = req.query.kuchPwd;

    dbCon.query("select type,status from users where email=? and pwd=?", [email, pwd], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length == 1) {
                if (resultTable[0].status == 1)
                    resp.send(resultTable[0].type);
                else
                    resp.send("U R Blocked");
            }
            else
                resp.send("Invalid User Id/Password");

        }
        else {
            resp.send(err.toString());
        }
    })
})

app.get("/profile-needy",function(req,resp){
    resp.sendFile(process.cwd()+"/public/profile-needy.html")
})

app.get("/profile-donar", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/profile-donar.html");
})

// /save-profile-data
app.post("/save-profile-data", function (req, resp) {

    // resp.send("xszzjxckgvjhbj");
    var fileName = "nopic.jpg";
    if (req.files != null) {
        //console.log(process.cwd());
        fileName = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.pPic.mv(path);
    }

    //   resp.send("filename ="+fileName);

    var email = req.body.txtEmail;
    var address = req.body.txtAdd;
    var name = req.body.txtName;
    var mob = req.body.txtMob;
    var city = req.body.txtCty;
    var idproof = req.body.selId;
    var ahours = req.body.nhdn;
    var gender = req.body.ngender;

    console.log(req.body);

    dbCon.query("insert into tbprofile (email ,name , mob  ,address ,city ,idproof , idpic , ahours,gender ) values(?,?,?,?,?,?,?,?,?)", [email, name, mob, address, city, idproof, fileName, ahours, gender], function (err) {
        if (err == null)
            resp.send("saved..");
        else
            resp.send(err);
    })
})

app.get("/availmed", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/avail-med.html");
})

app.get("/save-avail-data", function (req, resp) {

    var email = req.query.kuchEmail;
    var medname = req.query.kuchMed;
    var expdate = req.query.kuchExp;
    var packing = req.query.kuchPack;
    var qty = req.query.kuchQty;


    console.log(req.query);

    dbCon.query("insert into availmed(email,med,expdate,packing,qty) values(?,?,?,?,?)", [email, medname, expdate, packing, qty], function (err) {
        if (err == null) {
            resp.send("saved");

        }
        else {
            resp.send(err);
            console.log(err);
        }
    })
})


app.post("/update-profile-data", function (req, resp) {

    var fileName;
    if (req.files != null) {
        //console.log(process.cwd());
        fileName = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.pPic.mv(path);
    }
    else {
        fileName = req.body.phdn;
    }

    var email = req.body.txtEmail;
    var address = req.body.txtAdd;
    var name = req.body.txtName;
    var mob = req.body.txtMob;
    var city = req.body.txtCty;
    var idproof = req.body.selId;
    var ahours = req.body.nhdn;
    var gender = req.body.ngender;



    dbCon.query("update tbprofile set  name= ? , mob=? ,address=? ,city=? ,idproof=?, idpic=? ,ahours=?,gender=?  where email=?", [name, mob, address, city, idproof, fileName, ahours, gender, email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("account updated successefullyyy..........");
            else {
                resp.send("invaid email id");
                console.log(err);
            }

        }
        else
            resp.send(err);
    })
})

app.get("/change-needy-pass", function (req, resp) {

    var email = req.query.chkemail;
    var oldpass = req.query.oldpass;
     var newpass = req.query.newpass;
    var conpass = req.query.conpass;
    if (oldpass==newpass) {
      resp.send("Old and new password are same");
    }
    if(newpass!=conpass) {
      resp.send("new and confirm password are different");
    }
    
    dbCon.query("update users set pwd=? where email=? and pwd=? ",[newpass,email,oldpass],function(err,result){
      if(err)
      // resp.send("updated successfully")
   
    {    resp.send(err)}
   
   
      if(result.affectedRows==0)
              
      { 
          resp.send("Incorrect old password or email");
     
    }
     else
     resp.send("password updated successfully");
     
    });
   });
app.get("/change-donor-pass", function (req, resp) {

    var email = req.query.chkemail;
    var oldpass = req.query.oldpass;
     var newpass = req.query.newpass;
    var conpass = req.query.conpass;
    if (oldpass==newpass) {
      resp.send("Old and new password are same");
    }
    if(newpass!=conpass) {
      resp.send("new and confirm password are different");
    }
    
    dbCon.query("update users set pwd=? where email=? and pwd=? ",[newpass,email,oldpass],function(err,result){
      if(err)
      // resp.send("updated successfully")
   
    {    resp.send(err)}
   
   
      if(result.affectedRows==0)
              
      { 
          resp.send("Incorrect old password or email");
     
    }
     else
     resp.send("password updated successfully");
     
    });
   });

app.post("/update-needy-profile-data",function(req,resp){
    var fileName;
    if(req.files!=null)
     {
       //console.log(process.cwd());
        fileName=req.files.idpic.name;
       var path=process.cwd()+"/public/uploads/"+fileName;
       req.files.idpic.mv(path);
     }
     else
   {
    fileName=req.body.hdn;
   }
      console.log(req.body);
      var email=req.body.txtEmail;
      var name=req.body.txtName;
      var mobile=req.body.txtMob;
      var address=req.body.txtAdd;
      var city=req.body.txtCty;
      var dob=req.body.txtDob;
      var gender=req.body.igender;
      var ahours =req.body.nhdn;
  
  
      dbCon.query("update tbneedyprofile set name=?,mob=?,address=?,city=?,dob=?,gender=?,idpic=?,ahours=? where email=?",[name,mobile,address,city,dob,gender,fileName,ahours,email],function(err){
        if(err==null)
        resp.send("Profile Updated!!");
      else
        resp.send(err);
      })
  })

  app.post("/save-needy-profile-data",function(req,resp){
    console.log("hi");
    var fileName="nopic.jpg";
    if(req.files!=null)
     {
       //console.log(process.cwd());
        fileName=req.files.pPic.name;
       var path=process.cwd()+"/public/uploads/"+fileName;
       req.files.pPic.mv(path);
     }
   
    //   console.log(req.body);
      var email=req.body.txtEmail;
      var name=req.body.txtName;
      var mobile=req.body.txtMob;
      var address=req.body.txtAdd;
      var city=req.body.txtCty;
      var dob=req.body.txtDob;
      var gender=req.body.igender;
      
      


      dbCon.query("insert into tbneedyprofile(email,name,mob,address,city,dob,gender,idpic) values(?,?,?,?,?,?,?,?)",[email,name,mobile,address,city,dob,gender,fileName],function(err){
        if(err==null)
        resp.send("Profile Sumbitted!!");
      else
        resp.send(err);
      })
})

app.get("/get-needy-record",function(req,resp){
  dbCon.query("select * from tbneedyprofile where email=?",[req.query.kuchEmail],function(err,resultTable){
    if(err==null){
        resp.send(resultTable);
    }
    else
    resp.send(err);
  })
})

app.get("/needy-panel",function(req,resp){
    resp.sendFile(process.cwd()+"/public/needy-panal.html");
})
// /get-aungular-all-records

app.get("/get-angular-all-records",function(req,resp){

    dbCon.query("select * from tbneedyprofile",function(err,resultTableJSON){

        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})

app.get("/do-angular-delete",function(req,resp){

    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from tbneedyprofile where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/donar-panel",function(req,resp){
    resp.sendFile(process.cwd()+"/public/donar-panal.html");
})

// /get-angular-donar-all-records

app.get("/get-angular-donar-all-records",function(req,resp){

    dbCon.query("select * from tbprofile",function(err,resultTableJSON){

        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
// /do-angular-donar-delete

app.get("/do-angular-donar-delete",function(req,resp){

    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from tbprofile where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

app.get("/signup-table",function(req,resp){
   
    resp.sendFile(process.cwd()+"/public/users-panel.html")
})

app.get("/get-angular-users-all-records",function(req,resp){

    dbCon.query("select * from users",function(err,resultTableJSON){

        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})

app.get("/do-angular-users-block",function(req,resp){

    var email=req.query.emailkuch;
    

    //fixed                             //same seq. as in table
dbCon.query("update users set status=0 where email=? and status=1",[email],function(err,result)
{
     if(err==null)
     {
       if(result.affectedRows==1)
         resp.send("blocked");
       else
         resp.send("already blocked");
       }
         else
       resp.send(err);
})
})

app.get("/do-angular-users-unblock",function(req,resp){

    var email=req.query.emailkuch;
    

    //fixed                             //same seq. as in table
dbCon.query("update users set status=1 where email=? and status=0",[email],function(err,result)
{
     if(err==null)
     {
       if(result.affectedRows==1)
         resp.send("unblocked");
       else
         resp.send("not blocked");
       }
         else
       resp.send(err);
})
})

app.get("/do-angular-users-delete",function(req,resp){

    var email=req.query.emailkuch;
    

    //fixed                             //same seq. as in table
dbCon.query("delete from users where email=?",[email],function(err,result)
{
     if(err==null)
     {
       if(result.affectedRows==1)
         resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
       else
         resp.send("Inavlid Email id");
       }
         else
       resp.send(err);
})
})

// /med-manager
app.get("/med-manager",function(req,resp){
  
    resp.sendFile(process.cwd()+"/public/med-manager.html");

})

// app.get("/get-angular-avail-all-records",function(req,resp){

//     var email=req.query.emailkuch;
//     dbCon.query("select * from availmed where email=?",[email],function(err,resultTableJSON){

//         if(err==null)
//         resp.send(resultTableJSON);
//         else
//         resp.send(err);
//     })
// })

// app.get("/get-cities",function(req,resp)
// {
//          //fixed                             //same seq. as in table
//     dbCon.query("select distinct city from tbprofile",function(err,resultTableJSON)
//     {
//           if(err==null)
//             resp.send(resultTableJSON);
//               else
//             resp.send(err);
//     })
// })
app.get("/find-med",function(req,resp){
    resp.sendFile(process.cwd()+"/public/find-med.html");
})

app.get("/get-cities",function(req,resp){
    dbCon.query("select distinct city from tbprofile",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        

app.get("/get-med",function(req,resp){
    dbCon.query("select distinct med from availmed",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})

app.get("/get-angular-dmed-records",function(req,resp)
{
    console.log(req.query);
      var email= req.query.kuchemail;
    dbCon.query("select * from availmed where email=?",[email] ,function(err,resultTableJSON)
    {
          if(err==null)
          {
          console.log(resultTableJSON+err);

            resp.send(resultTableJSON);}
            else
            resp.send(err);
    })
})

app.get("/do-angular-donor-delete",function(req,resp)
{
    var srno= req.query.srno;

    dbCon.query("delete from availmed where srno=?",[srno] ,function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
            else
            resp.send(err);
    })
})

app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select tbprofile.*,availmed.med from tbprofile  inner join availmed on tbprofile.email= availmed.email where availmed.med=? and tbprofile.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})