import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { TicketsState } from './store/tickets.state';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockApiInterceptor } from './interceptors/mock-api-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore([TicketsState]),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([mockApiInterceptor])),
  ]
};
