const express = require("express");
var exec =  require('child_process').exec

const router = express.Router();

router.post('/installChaincode', (req, res) => {
  console.log("inside cspost function")
  //exec('./script.sh')
  exec('sh backend/scripts/install.sh', function (err, stdout, stderr) {
   // if (err) handleError();

    //Print stdout/stderr to console
    console.log(stdout);
    console.log(stderr);

    //Simple response to user whenever localhost:8888 is accessed
    //response.write(stdout);
    //response.end();
  });
});

router.post('/upgradeChaincode', (req, res) => {
  console.log("inside cspost function")
  //exec('./script.sh')
  exec('sh backend/scripts/upgrade.sh', function (err, stdout, stderr) {
   // if (err) handleError();

    //Print stdout/stderr to console
    console.log(stdout);
    console.log(stderr);

    //Simple response to user whenever localhost:8888 is accessed
    //response.write(stdout);
    //response.end();
  });
});
  

  module.exports = router;