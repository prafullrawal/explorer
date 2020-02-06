import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { faCloudDownloadAlt, faFingerprint, faNetworkWired, faCubes, faFileCode, faServer, faGlobe } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-page-tabs',
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.css']
})
export class PageTabsComponent implements OnInit {
  faCloudDownloadAlt = faCloudDownloadAlt;
  faFingerprint = faFingerprint;
  faNetworkWired = faNetworkWired;
  faCubes = faCubes;
  faFileCode = faFileCode;
  faServer = faServer;
  faGlobe = faGlobe;

  constructor() { }

  ngOnInit() {
  }

}
