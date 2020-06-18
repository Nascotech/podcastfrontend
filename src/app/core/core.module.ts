import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  imports: [
    HttpClientModule,
    
  ],
  providers: [
 
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    //throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}