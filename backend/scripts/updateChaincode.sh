#!/bin/bash

export PATH=${PWD}/../bin:${PWD}:$PATH

echo "start building chaincode"
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5

# CC_SRC_PATH="path to chaincode"
CC_SRC_PATH="github.com/chaincode/tracktrace/go/"

echo "Channel name : "$CHANNEL_NAME
# docker exec cli sdk/Scripts/script.sh $CHANNEL_NAME $CLI_DELAY $LANGUAGE $CLI_TIMEOUT $VERBOSE
# import utils
# ../network/scripts/script.sh
. scripts/utils.sh

 #Cleanup the chaincode containers
    clearContainers
    #Cleanup images
    removeUnwantedImages

#echo "===================== Installing chaincode 2.0 on peer0.org1 ===================== "
installChaincode 0 1 1.2
echo "===================== Installing chaincode 2.0 on peer0.org2 ===================== "
installChaincode 0 2 1.2

echo "===================== Upgrading chaincode on peer0.org1 ===================== "
upgradeChaincode 0 1

echo "chaincode updation completed sucessfully"

exit 0
