import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { first } from "rxjs/operators";
import { SnackService } from "../services/snack.service";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private snack: SnackService) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    await this.auth.isLoggedIn();
    const user = await this.auth.authState.pipe(first()).toPromise();

    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.snack.authError();
    }

    return isLoggedIn;
  }
}
