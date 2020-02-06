#!/bin/sh 
 export CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)
 # Creating CA docker container
 docker-compose -f docker-compose-ca.yaml up -d
 # Creating orderer docker container
 docker-compose -f docker-compose-orderer.yaml up -d
 # Creating couchdb docker container
 docker-compose -f docker-compose-couchdb.yaml up -d
 # Creating peer docker container
 docker-compose -f docker-compose-peer.yaml up -d