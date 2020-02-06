import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageTabsComponent } from './page-tabs/page-tabs.component';
import { CreateIdentitiesComponent } from './create-identities/create-identities.component';
import { CreateUpdateNetworkComponent } from './create-update-network/create-update-network.component';
import { InstallUpdateChaincodeComponent } from './install-update-chaincode/install-update-chaincode.component';
import { InstallPrerequisitesComponent } from './install-prerequisites/install-prerequisites.component';
import { CustomExplorerComponent } from './custom-explorer/custom-explorer.component';
import { CustomSwaggerApiComponent } from './custom-swagger-api/custom-swagger-api.component';
import { DockerContainerLogsComponent } from './docker-container-logs/docker-container-logs.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    PageTabsComponent,
    CreateIdentitiesComponent,
    CreateUpdateNetworkComponent,
    InstallUpdateChaincodeComponent,
    InstallPrerequisitesComponent,
    CustomExplorerComponent,
    CustomSwaggerApiComponent,
    DockerContainerLogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
