const express = require("express");

const router = express.Router();

module.exports = router;
const yaml = require('js-yaml');
const { exec } = require('child_process');
const csv = require('csvtojson');
const fs = require('fs');
const replace = require('replace-in-file');

const csvFilePath = './docker-containers.csv'


router.post('/RefreshAndShowContainersStatus', (req, res) => {

   console.log("inside refresh");	

    try {
      exec('docker ps -a --format "table {{.ID}},{{.Names}},{{.Image}},{{.Status}},{{.Ports}}"', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
        fs.writeFile("docker-containers.csv", stdout, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file docker-containers.csv was saved!");
        });
        console.log(`stdout: ${stdout}`);
      });
      setTimeout(function() {
        const options = {
          files: csvFilePath,
          from: [/tcp,/g, /CONTAINER ID/g],
          to: ['tcp', 'CONTAINER_ID'],
        };
        replace(options)
          .then(results => {
            console.log('Replacement results:', results);
          })
          .catch(error => {
            console.error('Error occurred:', error);
          });
      }, 1000);
      setTimeout(function() {
        csv()
          .fromFile(csvFilePath)
          .then((jsonObj) => {
            res.send(jsonObj)
            //console.log(jsonObj);
          })
      }, 2000);
    } catch (e) {
      console.log(e);
    }

    });

    router.post('/getContainerLogs', (req, res) => {

      let container_id = req.body.data.container_id

      exec('docker logs '+container_id , (error, stdout, stderr) => {
       if (error) {
        console.error(`exec error: ${error}`);
        res.send({
          success: false,
          stdout: stdout,
          stderr: stderr
        });

      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.send({
          success: true,
          stdout: stdout,
          stderr: stderr
        });

       });
    });
