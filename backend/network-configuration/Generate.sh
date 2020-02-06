#!/bin/sh 
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
# generate crypto material
cryptogen generate --config=./orderer-crypto-config.yaml
cryptogen generate --config=./peer-crypto-config.yaml
 configtxgen -profile OneOrgOrdererGenesis -channelID ordererchannel -outputBlock ./config/genesis.block
 configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
 configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP