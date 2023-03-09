let db = require('../config');
let{hash,compare,hashSync} = require('bcrypt');
let {createToken} = require('../middleware/authenticatedUser.js');
//USER CLASS 
class User{
    login(req, res){
        const {emailAdd, userPass} = req.body;
        const strQry = 
        `
        SELECT userID ,firstName ,lastName ,gender ,cellphoneNumber ,emailAdd ,userPass ,userRole ,userProfile
        FROM Users
        WHERE emailAdd = ${emailAdd};
        `;
        db.query(strQry, async(err,data)=>{
            if(err) throw err;
            if((!data) || (data == null)){
                res.status(401).json({
                    err: "you have entered a wrong email address"});
            }else {
                await compare(userPass, data[0].userPass,
                    (cErr, cResult)=>{
                        if(cErr) throw cErr;
                        //Create Token
                        const komToken =
                        createToken({
                            emailAdd,
                            userPass
                        });
                        res.cookie('RealUser', komToken,{
                            maxAge: 3600000,
                            httpOnly: true
                        });
                        if(cResult){
                            res.status(200).json({
                                msg:'You are logged in.',komToken,result:data[0]
                            });                         
                           }else{
                            res.status(404).json({
                                err: "Invalid Password,register or try again."
                           });
                        }
                    })
            }

        })
    }
    retrieveUsers(req, res) {
        const strQry =
        `
        SELECT userID , firstName,lastName,gender,cellphoneNumber,emailAdd,userRole,userProfile,joinDate
        FROM Users;
        `
        db.query(strQry,(err, data) => {
            if(err) throw err;
            else res.status(200).json({results: data})
        })
    }
    retrieveUser(req, res) {
        const strQry =
        `
        SELECT userID , firstName,lastName,gender,emailAdd,userRole,userProfile,joinDate
        FROM Users
        WHERE userID;
        `
        db.query(strQry[req.params.id],(err, data)=>{
            if(err) throw err;
            else res.status(200).json({result: data})
        })
    }
    async createUser(req, res) {
        let detail = req.body;
        detail.userPass =await
        hash(detail.userPass, 15);
        let user = {
            emailAdd: detail.emailAdd,
            userPass: detail.userPass
        }
        const strQry =
        `
        INSERT INTO Users
        SET ?;`;
        db.query(strQry, [detail], (err)=> {
            if(err) {
                res.status(401).json({err});
            }else{
                const komToken = createToken(user);
                res.cookie("RealUser",komToken, {
                    maxAge: 3600000,
                    httpOnly: true
                });
                res.status(200).json({msg: "A user record was saved successfully."})
            }
        })
    }
    updateUser(req, res) {
        let data = req.body;
        if(data.userPass !== null || data.userPass !== undifined)
            data.userPass = hashSync(data.userPass, 15);
            const strQry =
            `
            UPDATE Users
            SET ?
            WHERE userID =?;
            `;
            db.query(strQry,[data, req.params.id],
                (err)=>{
                    if(err) throw err;
                    res.status(200).json( {msg:"Your data has been updated."});
                })
    }
    deleteUser(req,res){
        const strQry =
        `
        DELETE FROM Users
        WHERe userId = ?;
        `;
        db.query(strQry,[req,params.id],
            (err)=>{
                if(err) throw err;
                res.status(200).json( {msg:"A record was deleted"});
            });
    }
    forgetPass(req,res){
        let data = req.body;
        if(data.userPass != null || data.userPass != undefined)
        data.userPass = hashSync(data.userPass,15);
        const strQry =
        `
        UPDATE Users
        SET ?
        WHERE cellphoneNumber = ? and emailAdd = ?;
        `;
        db.query(strQry,[req,params.id],
            (err)=>{
                if(err) throw err;
                res.status(200).json( {msg:"Password has been updated."});
            })
    }
}
class Product{
    retrieveProducts(req, res) {
         const strQry =
        `
       SELECT prodID, prodName, prodDescription, category, price, prodQuantity, imgUrl
       FROM Products; `;
       db.query(strQry,(err,results)=>{
         if(err) throw err;
         res.status(200).json({results: results})
        });
    }
    retrieveProduct(req, res) {
        const strQry = 
        `
        SELECT prodID, prodName, prodDescription, category, price, prodQuantity,imgUrl
        FROM Products
        WHERE prodID =?;`;
        db.query(strQry, [req.params.id], (err, results) =>{
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    addProduct(req,res) {
        const strQry =
        `
        INSERT INTO Products
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=>{
                if(err){
                    console.error(err);
                    res.status(400).json({err:"Unable to insert a new record."});
                }else{
                    res.status(200).json({msg:"Data has been successfully saved"});
                }
            });
    }
    updateProduct(req,res){
        const strQry =
        `
        UPDATE Products 
        SET ?
        WHERE ?;
        `;
        db.query(strQry,[req.body, req.params.id],
            (err) =>{
                if(err){
                    res.status(400).json({err:"Unable to update"});
                }else{
                    res.status(200).json({msg:"Product updated successfully."});
                }
            });
    }
    deleteProduct(req, res){
        const strQry =
        `
        DELETE FROM products
        WHERE prodID = ?;
        `;
        db.query(strQry,[req.params.id], (err)=>{
            if(err) res.status(400).json({err: "The record was not found"});
            res.status(200).json({msg:"A product was deleted successfully."});
        })
    }
}
//Export Classes
module.exports = {
    User,
    Product
}