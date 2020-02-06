import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-install-update-chaincode',
  templateUrl: './install-update-chaincode.component.html',
  styleUrls: ['./install-update-chaincode.component.css']
})
export class InstallUpdateChaincodeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  installChaincode(){
    console.log("inside function call")
    this.http.post('/chaincode/installChaincode', null).subscribe(
      data => {
        console.log("Sucess")
      },
      error => {
        console.log("Error", error);
        alert(JSON.stringify(error));
      }
    );   
  }

  upgradeChaincode(){
    console.log("inside function call")
    this.http.post('/chaincode/upgradeChaincode', null).subscribe(
      data => {
        console.log("Sucess")
      },
      error => {
        console.log("Error", error);
        alert(JSON.stringify(error));
      }
    );   
  }

}
