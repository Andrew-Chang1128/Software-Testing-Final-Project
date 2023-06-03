const request = require('supertest');
let server = require('../server');
//since we export the server object using exports.server = server, we need to access app via server.server.app
server = server.server
// jest.mock('../models/userModel', () => {
//   return {
//     login: jest.fn().mockResolvedValue("wdwww"),
//   };
// });
// jest.mock("../models/userModel");
describe('Server', () => {
  describe("public endpoint",()=>{
    describe("GET /driver", ()=>{
      test("should respond with 200 and 'driver'", async ()=>{
        const res = await request(server.app).get("/driver");
        expect(res.status).toBe(200);
        expect(res.text).toBe("driver")
      });
      test("should respond with 200 and 'alldriver'", async ()=>{
        const res = await request(server.app).get("/driver/all");
        expect(res.status).toBe(200);
        expect(res.text).toBe("allDriver")
      });
    });
    describe("GET /user", ()=>{
      test("should respond with 200 and 'user'", async ()=>{
        const res = await request(server.app).get("/user");
        expect(res.status).toBe(200);
        expect(res.text).toBe("user")
      });
      test("should respond with 200 and 'alluser'", async ()=>{
        const res = await request(server.app).get("/user/all");
        expect(res.status).toBe(200);
        expect(res.text).toBe("alluser")
      });
    });
    describe("POST /user/login",()=>{
      describe("name and password is passed",()=>{
       
        test("correct user and password", async ()=>{
          const res = await request(server.app).post("/user/login").send({
              username: "user1",
              password: "123"
            })
          console.log(`res test: ${res.text}`)
          expect(res.text).not.toBe("Unauthorized!")
          // console.log(res.text)
        })
        test("incorrect user and password", async ()=>{
          const res = await request(server.app).post("/user/login").send({
              username: "user1",
              password: "456"
            })
          expect(res.text).toBe("Unauthorized!")
        })
      })
      describe("name or password is missing",()=>{
        test("name  is missing", async ()=>{
          const res = await request(server.app).post("/user/login").send({
            username:"david"
          })
          expect(res.text).toBe("Unauthorized!")
        })
        test(" password is missing", async ()=>{
          const res = await request(server.app).post("/user/login").send({
            username:"david"
          })
          expect(res.text).toBe("Unauthorized!")
        })
        test("name and password are missing", async ()=>{
          const res = await request(server.app).post("/user/login").send({
            username:"david"
          })
          expect(res.text).toBe("Unauthorized!")
        })
      })
    })
    describe("JWT authorization",()=>{
      test("use /allRoutes to test authorization (first login to get token then get allRoutes)", async()=>{
        //get toekn
        const res = await request(server.app).post("/user/login").send({
          username: "user1",
          password: "123"
        });
        console.log("token: ",res.text);
        const token = res.text;
        const resGetAllRoute  = await request(server.app).get("/allRoutes").set('Authorization', `Bearer ${token}`);
        console.log("get all routes:", resGetAllRoute.text);
        expect(resGetAllRoute.text).not.toBe("Forbidden");//successfully get routes
      })
    })
    // describe("createUser", ()=>{
    //   test("createUser unit test", async()=>{
    //     const res = await request(server.app).post("/user/createUser").send({
    //       username: "user3",
    //       password: "3"
    //     });
        
    //   })
    // })
    describe("get item",()=>{
      test("get user1 item", async ()=>{
        const res = await request(server.app).post("/user/login").send({
          username: "user1",
          password: "123"
        });
        console.log("token: ",res.text);
        const token = res.text;
        const resUserItem  = await request(server.app).get("/item/userItem").set('Authorization', `Bearer ${token}`);
        const resultJson = JSON.parse(resUserItem.text);
        console.log(`resultJson: ${resultJson[0].id}`);
        // console.log(`resultJson: ${resultJson}`);
        expect(resultJson[1].id).toBe(455756);//successfully get routes
      });
      test("get user2 item", async ()=>{
        const res = await request(server.app).post("/user/login").send({
          username: "user2",
          password: "456"
        });
        console.log("token: ",res.text);
        const token = res.text;
        const resUserItem  = await request(server.app).get("/item/userItem").set('Authorization', `Bearer ${token}`);
        const resultJson = JSON.parse(resUserItem.text);
        console.log(`resultJson: ${resultJson[0].id}`);
        // console.log(`resultJson: ${resultJson}`);
        expect(resultJson[0].id).toBe(455359);//successfully get routes
      });
      test("get item without loggin in (no auth token)", async ()=>{
        const resUserItem  = await request(server.app).get("/item/userItem");
        expect(resUserItem.text).toBe("Unauthorized");//successfully get routes
      });
      test("get all item", async ()=>{
        const resItem  = await request(server.app).get("/item/all");
        const resultJson = JSON.parse(resItem.text);
        expect(resultJson.length).toBe(33);//successfully get routes
      });
    })
  })
})
server.close()
afterAll(() => {
  server.close()
})
