import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-install-prerequisites',
  templateUrl: './install-prerequisites.component.html',
  styleUrls: ['./install-prerequisites.component.css']
})
export class InstallPrerequisitesComponent implements OnInit {

  //constructor() { }

  constructor(private http: HttpClient) { }


  ngOnInit() {
  }

  installPrerequisite(){
    console.log("inside function call")
    this.http.post('/prerequisite/installPrerequisite',null,{responseType: 'text'}).subscribe(
      //this.http.post('/prerequisite/installPrerequisite',null).subscribe(
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
