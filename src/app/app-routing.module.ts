import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallPrerequisitesComponent } from './install-prerequisites/install-prerequisites.component';
import { CreateUpdateNetworkComponent } from './create-update-network/create-update-network.component';
import { InstallUpdateChaincodeComponent } from './install-update-chaincode/install-update-chaincode.component';
import { CreateIdentitiesComponent } from './create-identities/create-identities.component';
import { CustomExplorerComponent } from './custom-explorer/custom-explorer.component';
import { CustomSwaggerApiComponent } from './custom-swagger-api/custom-swagger-api.component';
import { DockerContainerLogsComponent } from './docker-container-logs/docker-container-logs.component';


const routes: Routes = [
  {path: 'prerequisite', component: InstallPrerequisitesComponent},
  {path: 'network', component: CreateUpdateNetworkComponent},
  {path: 'chaincode', component: InstallUpdateChaincodeComponent},
  {path: 'identities', component: CreateIdentitiesComponent},
  {path: 'explorer', component: CustomExplorerComponent},
  {path: 'swagger', component: CustomSwaggerApiComponent},
  {path: 'docker', component: DockerContainerLogsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
