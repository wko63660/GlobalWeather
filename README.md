# Global Weather(Group project)
An Web Application to view weather information  
A MERN Stack application
![Map](https://github.com/user-attachments/assets/c6653911-1e17-47ed-b0b1-7eeecc907233)


## :wave: To start the web  
under root:  
sudo systemctl start mongod  
sudo node server.js  

## :newspaper: API  
Rootpath: /api

POST /login (body: username, password)  
POST /logout  

GET /favloc  
POST /favloc/:locid  

GET /location  
GET /location/:id  
POST /location (body: name, lat, long)  
PUT /location (body: locId, name, lat, long  *only locId is required*)  
DELETE /location/:locId

GET /comment/:locId  
POST /comment/:locId (body: username, content)  

GET /users 
GET /users/:username  
POST /users  (body: newname, newpw)  
PUT /users/:username (body: newname, newpw, newfavlocs *either of them / all of them*)  
DELETE /users/:username  


***Remark: Please do not use form-data to submit data for POST API***  


## 	:elf: Accounts
User Account: user user (ac, pw)  
Admin Account: admin admin (ac, pw)
