const express = require("express");
const path = require("path");
const hfc = require("fabric-client");
var fs = require("fs");
var json = require("circular-json");
var util = require("util");

const router = express.Router();

router.post("/getMainPageData", function(req, res) {
  var username = "";
  var orgname = "";
  var peername = "";
  checkUserDetails().then(function(user) {
    if (user.success) {
      fetchChannelDetails().then(function(channel) {
        if (channel.success) {
          fetchBlockDetails().then(function(block) {
            if (block.success)
              res.json({
                success: true,
                code: 200,
                channel: channel,
                block: block
              });
            else res.json({ success: false, code: 500, block: block });
          });
        } else {
          res.json({ success: false, code: 500, channel: channel });
        }
      });
    } else res.json({ success: false, code: 500, user: user });
  });
});

router.post("/blockInfo", function(req, res) {
  var username = "";
  var orgname = "";
  var peername = "";
  checkUserDetails().then(function(user) {
    if (user.success) {
      fetchChannelDetails().then(function(channel) {
        if (channel.success) {
          fetchBlockDetails().then(function(block) {
            if (block.success)
              res.json({
                success: true,
                code: 200,
                channel: channel,
                block: block
              });
            else res.json({ success: false, code: 500, block: block });
          });
        } else {
          res.json({ success: false, code: 500, channel: channel });
        }
      });
    } else res.json({ success: false, code: 500, user: user });
  });
});

router.post("/txnInfo", function(req, res) {
  var username = "";
  var orgname = "";
  var peername = "";
  checkUserDetails().then(function(user) {
    if (user.success) {
      fetchChannelDetails().then(function(channel) {
        if (channel.success) {
          fetchTxnDetails().then(function(txn) {
            if (block.success)
              res.json({
                success: true,
                code: 200,
                channel: channel,
                txn: txn
              });
            else res.json({ success: false, code: 500, txn: txn });
          });
        } else {
          res.json({ success: false, code: 500, channel: channel });
        }
      });
    } else res.json({ success: false, code: 500, user: user });
  });
});

var checkUserDetails = async username => {
  try {
    var client = hfc.loadFromConfig("network.yaml");
    client.loadFromConfig("user.yaml");
    await client.initCredentialStores();
    if (username) {
      var user = await client.getUserContext(username, true);
      if (!user) {
        return {
          success: false,
          message: "User was not found",
          response: user
        };
      } else {
        return {
          success: true,
          message: "User was found successfully",
          response: user,
          client: client
        };
      }
    }
  } catch (error) {
    console.log("Issues in fetching data !");
    return {
      success: false,
      message: "Issues in fetching data !"
    };
  }
};

var fetchChannelDetails = async (peername, client) => {
  try {
    var channelName = "";
    var channelInfo = await client.queryChannels(peer);
    if (channelInfo) {
      for (var i = 0; i < channelInfo.channels.length; i++) {
        channelName = channelInfo.channels[i].channel_id;
      }
      if (channelName != "") {
        var channel = client.getChannel(channelName);
        if (channel) {
          var channel_payload = await channel.queryInfo(peername);
          if (channel_payload) {
            console.log("Channel payload found successfully !");
            return {
              success: true,
              message: "Channel payload found successfully !",
              channel_name: channelName,
              channel: channel,
              response: channel_payload
            };
          } else {
            console.log("Channel payload not found !");
            return {
              success: false,
              message: "Channel payload not found !",
              channel_name: channelName
            };
          }
        } else {
          console.log("Channel data not found !");
          return {
            success: false,
            message: "Channel data not found !",
            channel_name: channelName
          };
        }
      } else {
        console.log("Channel name not found !");
        return {
          success: false,
          message: "Channel name not found !",
          channel: channelName
        };
      }
    } else {
      console.log("Channel info not found !");
      return {
        success: false,
        message: "Channel info not found !"
      };
    }
  } catch (error) {
    console.log("Issues in fetching data !");
    return {
      success: false,
      message: "Issues in fetching data !"
    };
  }
};

var fetchBlockDetails = async (channel, blockNumber, peername) => {
  try {
    var block_payload = await channel.queryBlock(
      parseInt(blockNumber, peername)
    );
    if (block_payload) {
      console.log("Block data fetched successfully !");
      return {
        success: true,
        message: "Block data fetched successfully !",
        response: block_payload
      };
    } else {
      console.log("Issues in fetching block data !");
      return {
        success: false,
        message: "Issues in fetching block data !"
      };
    }
  } catch (error) {
    console.log("Issues in fetching data !");
    return {
      success: false,
      message: "Issues in fetching data !"
    };
  }
};

var fetchTxnDetails = async (channel, txnId, peername) => {
  try {
    var txn_payload = await channel.queryTransaction(txnId, peer);
    if (txn_payload) {
      console.log("Txn data fetched successfully !");
      return {
        success: true,
        message: "Txn data fetched successfully !",
        response: txn_payload
      };
    } else {
      console.log("Issues in fetching txn data !");
      return {
        success: false,
        message: "Issues in fetching txn data !"
      };
    }
  } catch (error) {
    console.log("Issues in fetching data !");
    return {
      success: false,
      message: "Issues in fetching data !"
    };
  }
};

module.exports = router;
