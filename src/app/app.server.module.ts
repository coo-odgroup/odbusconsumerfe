import { NgModule, Injector } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
// import { BrowserAnimationsModule} from '@angular/platform-browser/animations'; 



// For SSR, we need to use NoopAnimationsModule instead of BrowserAnimationsModule
// Since AppModule imports BrowserAnimationsModule, we import NoopAnimationsModule here
// Angular's DI system will use the last imported module
@NgModule({
    imports: [
        ServerModule,
        AppModule,
        // BrowserAnimationsModule
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {}
