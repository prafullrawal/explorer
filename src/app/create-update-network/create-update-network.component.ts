import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import {CreateNetwork } from "../models/application.model";

import * as $ from 'jquery';

@Component({
  selector: 'app-create-update-network',
  templateUrl: './create-update-network.component.html',
  styleUrls: ['./create-update-network.component.css'],
})


export class CreateUpdateNetworkComponent implements OnInit {

  public createNetwork: CreateNetwork;
  showModal: boolean;
  spinnerModal: boolean;
  faPlus = faPlus;

  constructor(private http: HttpClient) { }

  openModal() {
    this.showModal = true;
    this.spinnerModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  ngOnInit() {
    this.createNetwork = new CreateNetwork();
    console.log('Init :' + JSON.stringify(this.createNetwork));
  }



// Create orderer using user data
  async onSubmitGenerateCertificate() {

    this.showModal = true;
    this.spinnerModal = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    // template orderer orgnaization.
    let OrdererObject = {
      "OrdererOrgs": [
        {
          "Name": this.createNetwork.odrname,
          "Domain": this.createNetwork.host,
          "Specs": [
            {
              "host": this.createNetwork.odrname.toLowerCase()+"."+this.createNetwork.host
            }
          ]
        }
      ]
    }

    let peersObject = {
      "PeerOrgs": [
        {
          "Name": this.createNetwork.orgname,
          "Domain": this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host,
          "EnableNodeOUs": true,
          "Template": {
            "Count": 1
          },
          "Users": {
            "Count": 1 //+(this.createNetwork.userscount)
          }
        }
      ]
    }

    let configtxObject = {

      "Organizations": [
        {
          "Name": this.createNetwork.odrname + "Org",
          "ID": this.createNetwork.odrname + "MSP",
          "MSPDir": "crypto-config/ordererOrganizations/" + this.createNetwork.host + "/msp"
        },
        {
          "Name": this.createNetwork.orgname + "MSP",
          "ID": this.createNetwork.orgname + "MSP",
          "MSPDir": "crypto-config/peerOrganizations/" + this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host + "/msp",
          "AnchorPeers": [
            {
              "Host": "peer0." + this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host,
              "Port": 7051
            }
          ]
        }
      ],
      "Capabilities": {
        "Channel": {
          "V2_0": true
        },
        "Orderer": {
          "V2_0": true
        },
        "Application": {
          "V2_0": true
        }
      },
      "Application": {
        "Organizations": null,
        "Capabilities": {
          "V2_0": true
        }
      },
      "Orderer": {
        "OrdererType": "solo",
        "Addresses": [
          "orderer." + this.createNetwork.host + ":7050"
        ],
        "BatchTimeout": "2s",
        "BatchSize": {
          "MaxMessageCount": 10,
          "AbsoluteMaxBytes": "99 MB",
          "PreferredMaxBytes": "512 KB"
        },
        "Organizations": null
      },
      "Channel": {
        "Capabilities": {
          "V2_0": true
        }
      },
      "Profiles": {
        "OneOrgOrdererGenesis": {
          "Capabilities": {
            "V2_0": true
          },
          "Orderer": {
            "OrdererType": "solo",
            "Addresses": [
              "orderer." + this.createNetwork.host + ":7050"
            ],
            "BatchTimeout": "2s",
            "BatchSize": {
              "MaxMessageCount": 10,
              "AbsoluteMaxBytes": "99 MB",
              "PreferredMaxBytes": "512 KB"
            },
            "Organizations": [
              {
                "Name": this.createNetwork.odrname + "Org",
                "ID": this.createNetwork.odrname + "MSP",
                "MSPDir": "crypto-config/ordererOrganizations/" + this.createNetwork.host + "/msp"
              }
            ],
            "Capabilities": {
              "V2_0": true
            }
          },
          "Consortiums": {
            "SampleConsortium": {
              "Organizations": [
                {
                  "Name": this.createNetwork.orgname + "MSP",
                  "ID": this.createNetwork.orgname + "MSP",
                  "MSPDir": "crypto-config/peerOrganizations/" +this.createNetwork.orgname.toLowerCase()+"."+ this.createNetwork.host + "/msp",
                  "AnchorPeers": [
                    {
                      "Host": "peer0." + this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host + "",
                      "Port": 7051
                    }
                  ]
                }
              ]
            }
          }
        },
        "OneOrgChannel": {
          "Consortium": "SampleConsortium",
          "Capabilities": {
            "V2_0": true
          },
          "Application": {
            "Organizations": [
              {
                "Name": this.createNetwork.orgname + "MSP",
                "ID": this.createNetwork.orgname + "MSP",
                "MSPDir": "crypto-config/peerOrganizations/" + this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host + "/msp",
                "AnchorPeers": [
                  {
                    "Host": "peer0." + this.createNetwork.orgname.toLowerCase()+"."+this.createNetwork.host,
                    "Port": 7051
                  }
                ]
              }
            ],
            "Capabilities": {
              "V2_0": true
            }
          }
        }
      }
    }

    // create docker compose file
    let CA_Object = this.CreateCATemplate();
    let Orderer_Object = this.CreateOrdererTemplate();
    let CouchDB_Object = this.CreatCouchDBTemplete();
    let Peer_Object = this.CreatePeerTemplate();

    let dataObject = {
      "CA_Object": CA_Object,
      "Orderer_Object": Orderer_Object,
      "CouchDB_Object": CouchDB_Object,
      "Peer_Object": Peer_Object
    }

    // 1
    this.http.post('/network/CreateOrderer', { OrdererObject }).subscribe(
        data => { console.log("POST Request is successful ", data);

          // 2
          this.http.post('/network/CreatePeers', { peersObject }).subscribe(
            data => {
              console.log("POST Request is successful ", data);

              // 3
              this.http.post('/network/CreateConfigTx', { configtxObject }).subscribe(
                data => {
                  console.log("POST Request is successful ", data);
                  $(".modal-body").append('<div class="alert alert-success" role="alert"><strong>Success !!</strong> network configuration files created.</div>');

                  let channelName =  "mychannel"; // this.createNetwork.channelName;

                  // 4
                  this.http.post('/network/GenerateCertificate', { channelName }).subscribe(
                    data => {
                      console.log("POST Request is successful ", data);
                      let result = JSON.parse(JSON.stringify(data));
                      if (result.success == true)
                        $(".modal-body").append('<div class="alert alert-success" role="alert"><strong>Success !!</strong> Successfully certificates generated for orderer and peers.</div>');

                        // 5 
			console.log(dataObject);
                        this.http.post('/network/CreateDockerComposeYAML', { dataObject }).subscribe(
                          data => {
                            console.log("POST Request is successful ", data);
                            // let result = JSON.parse(JSON.stringify(data));


                            // 6
                            this.http.post('/network/BringUPNetwork',  null ).subscribe(
                              data => {
                                console.log("POST Request is successful ", data);
                                let result = JSON.parse(JSON.stringify(data));
                                if (result.success == true)
                                  $(".modal-body").append('<div class="alert alert-success" role="alert"><strong>Success !! Network is up </strong>Docker containers created.</div>');
                                  this.spinnerModal = true;
                                // alert(JSON.stringify(data));
                              },
                              error => {
                                console.log("Error", error);
                                alert(JSON.stringify(error));
                              }
                            );

                          },
                          error => {
                            console.log("Error", error);
                            alert(JSON.stringify(error));
                          }
                        );


                    },
                    error => {
                      console.log("Error", error);
                      alert(JSON.stringify(error));
                    }
                  );
                },
                error => {
                  console.log("Error", error);
                  alert(JSON.stringify(error));
                }
              );

            },
            error => {
              console.log("Error", error);
              alert(JSON.stringify(error));
            }
          );
        },
        error => {
          console.log("Error", error);
          alert(JSON.stringify(error));
        }
      );


   //this.RefreshAndShowContainersStatus();

  }



  // create ca templete for docker-compose.yaml
   CreateCATemplate () : any {

    let data = {
      "version": '2',
      "networks": {
        "basic": null
      },
      "services": {
        "ca.example.com": {
          "image": "hyperledger/fabric-ca",
          "environment": [
            "FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server",
            "FABRIC_CA_SERVER_CA_NAME=ca.example.com",
            "FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem",
            "FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${CA1_PRIVATE_KEY}"
          ],
          "ports": [
            "7054:7054"
          ],
          "command": "sh -c 'fabric-ca-server start -b admin:adminpw'",
          "volumes": [
            "./crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config"
          ],
          "container_name": "ca.example.com",
          "networks": [
            "basic"
          ]
        }
      }
    }

    return data;
  }

  // create orderer templete for docker-compose.yaml
  CreateOrdererTemplate() {

    let data = {
      "version": '2',
      "networks": {
        "basic": null
      },
      "services": {
        "orderer.example.com": {
          "container_name": "orderer.example.com",
          "image": "hyperledger/fabric-orderer",
          "environment": [
            "FABRIC_LOGGING_SPEC=info",
            "ORDERER_GENERAL_LISTENADDRESS=0.0.0.0",
            "ORDERER_GENERAL_BOOTSTRAPMETHOD=file",
            "ORDERER_GENERAL_BOOTSTRAPFILE=/etc/hyperledger/configtx/genesis.block",
            "ORDERER_GENERAL_LOCALMSPID=OrdererMSP",
            "ORDERER_GENERAL_LOCALMSPDIR=/etc/hyperledger/msp/orderer/msp"
          ],
          "working_dir": "/opt/gopath/src/github.com/hyperledger/fabric/orderer",
          "command": "orderer",
          "ports": [
            "7050:7050"
          ],
          "volumes": [
            "./config/:/etc/hyperledger/configtx",
            "./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/:/etc/hyperledger/msp/orderer",
            "./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/:/etc/hyperledger/msp/peerOrg1"
          ],
          "networks": [
            "basic"
          ]
        }
      }
    }

    return data;
  }

  // create couchdb templete for docker-compose.yaml
  CreatCouchDBTemplete() {

    let data = {
      "version": '2',
      "networks": {
        "basic": null
      },
      "services": {
        "couchdb": {
          "container_name": "couchdb",
          "image": "couchdb:2.3",
          "environment": [
            "COUCHDB_USER=",
            "COUCHDB_PASSWORD="
          ],
          "ports": [
            "5984:5984"
          ],
          "networks": [
            "basic"
          ]
        }
      }
    }

    return data;
  }

  // create peer templete for docker-compose.yaml
  CreatePeerTemplate() {

    let data = {
      "version": '2',
      "networks": {
        "basic": null
      },
      "services": {
        "peer0.org1.example.com": {
          "container_name": "peer0.org1.example.com",
          "image": "hyperledger/fabric-peer",
          "environment": [
            "CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock",
            "CORE_PEER_ID=peer0.org1.example.com",
            "FABRIC_LOGGING_SPEC=info",
            "CORE_CHAINCODE_LOGGING_LEVEL=info",
            "CORE_PEER_LOCALMSPID=Org1MSP",
            "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/peer/",
            "CORE_PEER_ADDRESS=peer0.org1.example.com:7051",
            "CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=net_basic",
            "CORE_LEDGER_STATE_STATEDATABASE=CouchDB",
            "CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb:5984",
            "CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=",
            "CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD="
          ],
          "working_dir": "/opt/gopath/src/github.com/hyperledger/fabric",
          "command": "peer node start",
          "ports": [
            "7051:7051",
            "7053:7053"
          ],
          "volumes": [
            "/var/run/:/host/var/run/",
            "./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp:/etc/hyperledger/msp/peer",
            "./crypto-config/peerOrganizations/org1.example.com/users:/etc/hyperledger/msp/users",
            "./config:/etc/hyperledger/configtx"
          ],
          "networks": [
            "basic"
          ]
        }
      }
    }
    return data;
    //export CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)

  }

}
