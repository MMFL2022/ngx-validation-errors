import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {ChangeDetectorRef, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
// import {MESSAGE_PIPE_FACTORY_TOKEN, MESSAGES_PROVIDER, NgxValidationErrorsModule} from '@xtream/ngx-validation-errors';
import { MESSAGE_PIPE_FACTORY_TOKEN, MESSAGES_PROVIDER, NgxValidationErrorsModule } from 'projects/xtream/ngx-validation-errors/src/public-api';
import {TranslateLoader, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomErrorsComponent} from './custom-errors/custom-errors.component';
import {MainFromComponent} from './main-from/main-from.component';
import {SharedModule} from './shared/shared.module';
import {SimpleErrorPipe} from './simple-error-pipe.pipe';
import {SimpleMessagesProviderService} from './simple-messages-provider.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MaterialFromComponent} from './material-from/material-from.component';

export function httpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}


export function translatePipeFactoryCreator(translateService: TranslateService) {
  return (detector: ChangeDetectorRef) => new TranslatePipe(translateService, detector);
}

export function simpleCustomPipeFactoryCreator(messageProvider: SimpleMessagesProviderService) {
  return (detector: ChangeDetectorRef) => new SimpleErrorPipe(messageProvider, detector);
}


@NgModule({
  declarations: [
    AppComponent,
    CustomErrorsComponent,
    MainFromComponent,
    MaterialFromComponent,
    SimpleErrorPipe
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    HammerModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxValidationErrorsModule.forRoot({
      defaultContext: 'general',
      // errorComponent: CustomErrorsComponent
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  providers: [
    // {
    //   provide: MESSAGE_PIPE_FACTORY_TOKEN,
    //   useFactory: translatePipeFactoryCreator,
    //   deps: [TranslateService]
    // },
    // {
    //   provide: MESSAGES_PROVIDER,
    //   useExisting: SimpleMessagesProviderService
    // }
    {
      provide: MESSAGE_PIPE_FACTORY_TOKEN,
      useFactory: translatePipeFactoryCreator,
      deps: [TranslateService]
    },
    {
      provide: MESSAGES_PROVIDER,
      useExisting: TranslateService
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}