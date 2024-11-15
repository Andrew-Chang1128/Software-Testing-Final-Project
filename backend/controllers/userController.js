const model = require("../models/userModel")
// const userModel = new model()

module.exports= class userController{
    constructor(){
        console.log("creating userModel")
        // this.userModel = new model();
        // console.log(this.userModel);
    };
    user(req, res){
        //use userModel to fetch data from db
        res.send("user");
    };
    alluser(req, res){
        //use userModel to fetch data from db
        res.send("alluser");
    };
    async login(req, res){
        // console.log("name: ", req.body.username,"password: ",req.body.password);
        const { username, password } = req.body;
        if (!username || !password){
            res.status(422).send("Unauthorized!");
            return;
        }
        const userModel = new model();
        const result = await userModel.login(username, password);
        if (result == false){
            res.status(400).send("Unauthorized!")
        }else{
            const jwtToken = result;
            console.log(`jwtToken returned is:${jwtToken}`)
            res.json(jwtToken);
        }
        userModel.close();
        // console.log("fetch result: ",result);
        // if (result == password){
        //     const user = {"user": username};
        //     // console.log(process.env.tokenSecret);
        //     const jwtToken = jwt.sign(user, process.env.tokenSecret);
        //     res.json(jwtToken)
        // }else{
        //     res.status(400).send("Unauthorized!")
        // }
    };
    async createUser(req, res){
        const userModel = new model();
        const { username, password } = req.body;
        if (!username || !password){
            res.status(422).json({error: 'inappropriate parameters'})
        }
        const existResult = await userModel.checkUserExist(username);
        if (existResult) {
            res.status(500).json({ error: 'User already exist' });
            return;
        }
        // Insert user information into the users table
        const result = await userModel.createUser(username, password);
        if (result == false){
            res.status(500).json({ error: 'Failed to insert user information' });
        }else{
            res.status(200).json({ message: 'User information inserted successfully' });
        }
        userModel.close()
    };

}