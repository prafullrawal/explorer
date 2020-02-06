import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExplorerLogin, ExplorerMainPageData, BlockInfoToBeSent, TxnInfoToBeSent } from '../models/application.model';

@Component({
  selector: 'app-custom-explorer',
  templateUrl: './custom-explorer.component.html',
  styleUrls: ['./custom-explorer.component.css']
})
export class CustomExplorerComponent implements OnInit {
  showModal: boolean;
  public explorerLoginData: ExplorerLogin;
  public explorerMainPageData: ExplorerMainPageData;
  public blockData: BlockInfoToBeSent;
  public txnData: TxnInfoToBeSent;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.explorerLoginData = new ExplorerLogin();
    this.explorerMainPageData = new ExplorerMainPageData();
    this.showModal = true;
  }

  fetchData() {
    this.httpClient.post('/explorer/getMainPageData', this.explorerLoginData).subscribe( response => {
      console.log(response);
    });
  }

  previousBlockData() {
    this.blockData.orgname = this.explorerLoginData.orgname;
    this.blockData.username = this.explorerLoginData.username;
    this.blockData.peername = this.explorerLoginData.peername;
    this.blockData.blocknuber = this.explorerMainPageData.currentBlockNo - 1;
    this.httpClient.post('/explorer/blockInfo', this.blockData).subscribe( response => {
      console.log(response);
    });
  }

  nextBlockData() {
    this.blockData.orgname = this.explorerLoginData.orgname;
    this.blockData.username = this.explorerLoginData.username;
    this.blockData.peername = this.explorerLoginData.peername;
    this.blockData.blocknuber = this.explorerMainPageData.currentBlockNo - 1;
    this.httpClient.post('/explorer/blockInfo', this.blockData).subscribe( response => {
      console.log(response);
    });
  }

  txnkData() {
    this.txnData.orgname = this.explorerLoginData.orgname;
    this.txnData.username = this.explorerLoginData.username;
    this.txnData.peername = this.explorerLoginData.peername;
    this.txnData.txnId = this.explorerMainPageData.txnId;
    this.httpClient.post('/explorer/txnInfo', this.txnData).subscribe( response => {
      console.log(response);
    });
  }

  hideModal() {
    this.showModal = false;
  }
}
