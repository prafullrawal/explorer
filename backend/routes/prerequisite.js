const express = require("express");
var exec =  require('child_process').exec

const router = express.Router();

module.exports = router;

router.post('/installPrerequisite', (req, res) => {
    console.log("inside cspost function")
    //exec('./script.sh')
    exec('sh backend/scripts/installPrerequisite.sh', function (err, stdout, stderr) {
     // if (err) handleError();
      //Print stdout/stderr to console
      console.log(stdout);
      console.log(stderr);
    });
  });
