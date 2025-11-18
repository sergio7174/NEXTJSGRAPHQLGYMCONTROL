const 

User = require('../models/User');
// use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),

// Define another GET endpoint for a specific path '/users'
    router.get('/getalladmin',  async(req, res) => {

       console.log ("Estoy enotherControllers/index - getAllAdmin - line 41 - ");

    let haveAdmin = await User.find({ isAdmin: 'true' });
        try {

        /***If there is data in database ***/    
        if (haveAdmin.length>0){
                
           const haveAdmintrue = 'true';
           console.log ("Estoy en otherControllers/index - getAllAdmin - line 50 - haveAdmin: haveAdmin found, data in database:"+haveAdmintrue);

            return res.status(200).json({haveAdmin: haveAdmintrue , message:' Have Admin its true .. !'})}
         else { 
            const haveAdminfalse = 'false';
            console.log('Register api issue, IsAdmin not found .. !, maybe Not Data in Database. haveAdmin:'+haveAdmin);
            return res.status(200).json({ message: 'Register api issue, IsAdmin not found .. !, maybe Not Data in Database.', haveAdmin:haveAdminfalse });
}}catch (error) {
    console.log(error);
    res.status(200).send({ message: `Register api issue : ${error.message}`.bgRed.black, error })

} 

    });

module.exports = router;