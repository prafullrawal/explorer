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

## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.org1..."
installChaincode 0 1
echo "Install chaincode on peer0.org2..."
installChaincode 0 2
echo "Install chaincode on peer1.org1..."
installChaincode 1 1
echo "Install chaincode on peer1.org2..."
installChaincode 1 2

# Instantiate chaincode on peer0.org2
echo "Instantiating chaincode on peer0.org2..."
instantiateChaincode 1 2

echo "Sending invoke transaction on peer0.org1 peer0.org2..."
chaincodeInvoke 0 1

echo "chaincode instantiation and invocation completed"

exit 0
