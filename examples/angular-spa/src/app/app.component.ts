import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular SPA with OAuth2 / OpenID Connect';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(environment.auth);
    this.oauthService.loadDiscoveryDocumentAndLogin({ customHashFragment: window.location.search });

    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => this.oauthService.loadUserProfile());
  }

  get userName(): string | null {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }

    return claims['name'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refresh() {
    this.oauthService.refreshToken();
  }
}
