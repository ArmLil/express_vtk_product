### Project with node.js, JWT, authentication, sequelize

#### Useful links

https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465

https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize

https://learning.getpostman.com/docs/postman/sending-api-requests/authorization/#bearer-token

https://medium.com/@tonyangelo9707/many-to-many-associations-using-sequelize-941f0b6ac102

### Hints

    to initialize sequelize
     $ sequelize init

    to generate models and migrations
     $ sequelize model:create --name User --attributes username:string,email:string,password:text
    then update the js files if you need it

    another example
    $ sequelize model:create --name UsersChats --attributes id:uuid,user_id:uuid,chat_id:uuid


    create tables in db via migrations
       $ sequelize db:migrate

#### setup datasource

    1.install postgres if do not have then follow the steps bellow
      $ sudo -u postgres psql
      postgres=# create database auth_jwt_sequelize;
      postgres=# create user auth_jwt_sequelize_user with encrypted password '111111';
      postgres=# grant all privileges on database auth_jwt_sequelize to auth_jwt_sequelize_user;
    2.$ sequelize db:migrate

### to run the Project

    $ git clone https://github.com/ArmLil/my-auth-sequelize-jwt.git
    $ cd my-auth-sequelize-jwt.git
    $ npm install
    $ npm start

### API - description

    All the endpoints start with /api/v1, for example /register is implemented as /api/v1/register.
    Locally listening on http://localhost:3000
    Example endpoint
    http://localhost:3000/api/v1/register

    All the requests have headers with  “Content-Type: application/json”

    After registration for all other requests token is required in headers

    Registration implemented according to JWT https://jwt.io/

    In headers we need to add
    Authorization : Bearer token


    1. Registration

       1) method - post
          endpoint - /register

          request body example (email and username are unique )
           {
            	"password": "111111",
          	  "email": "armlilhov@mail.ru",
          	  "username": "username3"
           }


          expected response body example
          {
              "data": {
                  "user": [
                      {
                          "id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                          "email": "armlilhov@mail.ru",
                          "username": "username3",
                          "updatedAt": "2019-12-18T13:13:27.608Z",
                          "createdAt": "2019-12-18T13:13:27.608Z",
                          "email_confirmed": false,
                          "deletedAt": null
                      },
                      true
                  ],
                  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOWQ2ZjI3YWMtMzM2Ny00NDk2LWJkNTctYzU0YTk4NmU2OGU0IiwidXNlcm5hbWUiOiJ1c2VybmFtZTMiLCJlbWFpbCI6ImFybWxpbGhvdkBtYWlsLnJ1IiwiZW1haWxfY29uZmlybWVkIjpmYWxzZX0sImlhdCI6MTU3NjY3NDgwOCwiZXhwIjoxNTc2NzYxMjA4fQ.BoCFPlppYEv5HREEbbzKD9X1DrM46yIzBV9IbJroP9A",
                  "message": "Check armlilhov@mail.ru for confirmation "
              }
          }

          then the mentioned email should be checked for email confirmation or use the request described in the 2) point



          2) method - get
             endpoint - /confirmation/:token
            (token can be taken from the response of   /register request described in 2) point)

          3) method - post
             endpoint - /login

             request body example

              {
                "email": "armlilhov@mail.ru",
                "password": "111111"
              }

            expected response body example
            {
                "data": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOWQ2ZjI3YWMtMzM2Ny00NDk2LWJkNTctYzU0YTk4NmU2OGU0IiwidXNlcm5hbWUiOiJ1c2VybmFtZTMiLCJlbWFpbCI6ImFybWxpbGhvdkBtYWlsLnJ1IiwiZW1haWxfY29uZmlybWVkIjp0cnVlfSwiaWF0IjoxNTc2Njc5MTU4LCJleHAiOjE1NzY3NjU1NTh9.OsfcCWB3EMSoIwMssAaznw0-5TL01UiiKyshjOctGIY"
                }
            }
