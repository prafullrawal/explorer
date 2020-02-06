import { Component, OnInit } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import * as $ from 'jquery';

interface Containers {
  CONTAINER_ID: string;
  NAMES: string;
  IMAGE: string;
  STATUS: string;
  PORTS: string;
}


@Component({
  selector: 'app-docker-container-logs',
  templateUrl: './docker-container-logs.component.html',
  styleUrls: ['./docker-container-logs.component.css']
})


export class DockerContainerLogsComponent implements OnInit {

  containers;
  isShowTable = true;
  isOkModal = true;
  isSpinner = true;
  isSpinnerModal = false;


  constructor(private http: HttpClient) { }

  ngOnInit() {
  }


RefreshAndShowContainersStatus(){

    console.log("inside refresh");

    // showing table 



    this.http.post('/docker/RefreshAndShowContainersStatus', null).subscribe(
      data => {
        let table = JSON.parse(JSON.stringify(data));
        console.log("POST Request is successful Table data", table);
        var CONTAINER : Containers [] = table;
        this.containers = CONTAINER;
      },
      error => {
        console.log("Error", error);
        alert(JSON.stringify(error));
      }
    );
  }

getContainerLogs(container_id) {

let  data = {"container_id":container_id};

  $("#openModal").click();
  $('#dockerContainerLogs').html("");

  this.http.post('/docker/getContainerLogs', {data}).subscribe(
      data => {
        let logs = JSON.parse(JSON.stringify(data));
        console.log(logs);
	
        $('#dockerContainerLogs').append(logs.stderr);
      },
      error => {
        console.log("Error", error);
        alert(JSON.stringify(error));
      }
    );
}




}
