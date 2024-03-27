create database dbcust;
use dbcust;
create table tbcust ( email varchar(30) primary key, name varchar(30) ,
 contact varchar(12) , dob date , gender varchar(12) ,idproof varchar(30) , 
 idpic varchar(100) , address varchar(100) ,
 state varchar(15) , city varchar(15) ); 
 select * from tbcust;
 
 select * from tbcust;
 
 select * from users;
 
 create table tbprofile(email varchar(30) primary key,name varchar(30), mob varchar(12) ,address varchar(100),city varchar(30),idproof varchar(30), idpic varchar(30), ahours varchar(30));
 
 select * from tbprofile;
 
 alter table tbprofile add gender varchar(10);-- 
 
 alter table tbprofile add totym time ;
 
 
 select * from availmed;
 
 select * from tbneedyprofile;
 