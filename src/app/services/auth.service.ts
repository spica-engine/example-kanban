import { Injectable } from '@angular/core';
import * as Identity from '@spica-devkit/identity';
import * as Bucket from '@spica-devkit/bucket';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: { _id?: string; email?: string, identity_id?: string, columns?: [] };
  currentUserJWT: string;
  authState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {
    Identity.initialize({ apikey: environment.apikey, publicUrl: environment.publicUrl });
    Bucket.initialize({ apikey: environment.apikey, publicUrl: environment.publicUrl });
  }

  async isLoggedIn() {
    if(!this.currentUser && localStorage.getItem("user_token")){
      this.currentUserJWT = localStorage.getItem("user_token");
      let user = this.parseJwt(this.currentUserJWT);
      user = await Bucket.data.getAll(environment.usersBucketId, { queryParams: { filter: `email=='${user.identifier}'` } });
      if(user[0]){
        this.currentUser = user[0];
        this.authState.next(true);
      }
    }else if(this.currentUser){
      this.authState.next(true);
    }
    
  }

  async login(identifier, password) {
    this.currentUserJWT = await Identity.login(identifier, password);
    let currentUser = await Bucket.data.getAll(environment.usersBucketId, { queryParams: { filter: `email=='${identifier}'` } });
    this.currentUser = currentUser[0];
    localStorage.setItem("user", JSON.stringify(this.currentUser));
    localStorage.setItem("user_token", this.currentUserJWT);
    this.authState.next(true);
  }

  async register(identifier, password) {
    return await Identity.insert({ identifier, password, policies: ["BucketFullAccess"] }).then(identity => {
      Bucket.data.insert(environment.usersBucketId, { email: identifier, identity_id: identity._id })
    });
  }

  logout() {
    localStorage.clear();
    this.authState.next(false);
  }

  getUser(){
    return this.currentUser;
  }

  setUser(user) {
    this.currentUser = user;
  }

  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}
