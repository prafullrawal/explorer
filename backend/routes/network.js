const express = require("express");

const router = express.Router();

const yaml = require('js-yaml');
const { exec } = require('child_process');
const csv = require('csvtojson')
const replace = require('replace-in-file');
const csvFilePath = './docker-containers.csv';
const fs = require('fs');

module.exports = router;


router.post('/CreateOrderer', (req, res) => {

    //creating generate.sh script file.
    fs.writeFile('./network-configuration/Generate.sh','#!/bin/sh '+
                                                        '\nexport PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH'+
                                                        '\nexport FABRIC_CFG_PATH=${PWD}', function (err) {
       if (err) throw err;
          console.log('Saved!');
    });

    let orderObject = req.body.OrdererObject;

    try {

      let yamlStr = yaml.safeDump(orderObject);
      fs.writeFileSync('./network-configuration/orderer-crypto-config.yaml', yamlStr, 'utf8');

      fs.appendFile('./network-configuration/Generate.sh', '\n# generate crypto material\ncryptogen generate --config=./orderer-crypto-config.yaml', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });


      res.send({
        success: true,
        response: "Orderer created success"
      });

    } catch (e) {

      console.log(e);
      res.send({
        success: false,
        response: "Issue while creating Orderer "+e
      });
    }

  });

  router.post('/CreatePeers', (req, res) => {

    let peerObject = req.body.peersObject;

    try {

      let yamlStr = yaml.safeDump(peerObject);
      fs.writeFileSync('./network-configuration/peer-crypto-config.yaml', yamlStr, 'utf8');

      fs.appendFile('./network-configuration/Generate.sh', '\ncryptogen generate --config=./peer-crypto-config.yaml', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

      res.send({
        success: true,
        response: "Peers created success"
      });

    } catch (e) {

      console.log(e);
      res.send({
        success: false,
        response: "Issue while creating Peers "+e
      });
    }

  });


  router.post('/CreateConfigTx', (req, res) => {

    let configtxObject = req.body.configtxObject;

     try {

      let yamlStr = yaml.safeDump(configtxObject);
      fs.writeFileSync('./network-configuration/configtx.yaml', yamlStr, 'utf8');


      fs.appendFile('./network-configuration/Generate.sh', '\n configtxgen -profile OneOrgOrdererGenesis -channelID ordererchannel -outputBlock ./config/genesis.block'+
                                                       '\n configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME'+
                                                       '\n configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP'
                                                       , function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    res.send({
        success: true,
        response: "Configtx created success"
      });

    } catch (e) {

      console.log(e);
      res.send({
        success: false,
        response: "Issue while creating Configtx "+e
      });

    }

  });

  router.post('/GenerateCertificate', (req, res) => {

     let channelName = req.body.channelName;
     console.log("Channel Name : "+ channelName);
     exec('mkdir ./network-configuration/config');
     exec('export CHANNEL_NAME='+channelName+' &&  sudo chmod -R 777 ./network-configuration &&  cd ./network-configuration && ./Generate.sh', (error, stdout, stderr) => {
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

  router.post('/CreateDockerComposeYAML', (req, res) => {

    let CA_Object = req.body.dataObject.CA_Object;
    let Orderer_Object = req.body.dataObject.Orderer_Object;
    let CouchDB_Object = req.body.dataObject.CouchDB_Object;
    let Peer_Object = req.body.dataObject.Peer_Object;

  try {

    // writing CA into docker composer file
    let CAYaml = yaml.safeDump(CA_Object);
    fs.writeFileSync('./network-configuration/docker-compose-ca.yaml', CAYaml, 'utf8');

    fs.writeFile('./network-configuration/start.sh',   '#!/bin/sh '+
                                                       '\n export CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)'+
                                                       '\n # Creating CA docker container'+
                                                       '\n docker-compose -f docker-compose-ca.yaml up -d'
                                                       , function (err) {
        if (err) throw err;
        console.log('docker-compose -f docker-compose-ca.yaml up -d added Saved! start.sh ');
    });


    // writing Orderer into docker composer file
    let OrdererYaml = yaml.safeDump(Orderer_Object);
    fs.writeFileSync('./network-configuration/docker-compose-orderer.yaml', OrdererYaml, 'utf8');

    fs.appendFile('./network-configuration/start.sh',   '\n # Creating orderer docker container'+
                                                       '\n docker-compose -f docker-compose-orderer.yaml up -d'
                                                       , function (err) {
        if (err) throw err;
        console.log('docker-compose -f docker-compose-orderer.yaml up -d added Saved! start.sh ');
    });

    // writing CouchDB into docker composer file
    let CouchDBYaml = yaml.safeDump(CouchDB_Object);
    fs.writeFileSync('./network-configuration/docker-compose-couchdb.yaml', CouchDBYaml, 'utf8');

    fs.appendFile('./network-configuration/start.sh',   '\n # Creating couchdb docker container'+
                                                       '\n docker-compose -f docker-compose-couchdb.yaml up -d'
                                                       , function (err) {
        if (err) throw err;
        console.log('docker-compose -f docker-compose-couchdb.yaml up -d added Saved! start.sh ');
    });


    // writing Peer into docker composer file
    let PeerYaml = yaml.safeDump(Peer_Object);
    fs.writeFileSync('./network-configuration/docker-compose-peer.yaml', PeerYaml, 'utf8');

    fs.appendFile('./network-configuration/start.sh',   '\n # Creating peer docker container'+
                                                       '\n docker-compose -f docker-compose-peer.yaml up -d'
                                                       , function (err) {
        if (err) throw err;
        console.log('docker-compose -f docker-compose-peer.yaml up -d added Saved! start.sh ');
    });


    res.send({
        success: true,
        response: "created success docker-compose.yaml"
      });

    } catch (e) {

      console.log(e);
      res.send({
        success: false,
        response: "Issue while creating docker-compose files "+e
      });
    }

  });


  router.post('/BringUPNetwork', (req, res) => {
     exec('sudo chmod -R 777 ./network-configuration/* &&  cd ./network-configuration && ./start.sh && docker ps -a', (error, stdout, stderr) => {
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
