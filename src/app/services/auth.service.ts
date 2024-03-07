import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firstTime = false;
  user = null;
  centralUrl = environment.centralUrl + '/api/mobile';
  httpType = environment.httpType;

  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
  };
  domain = localStorage.getItem('domain');

  constructor(private auth: Auth, private firestore: Firestore) { }

  async register({ email, password }: any) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("🚀 ~ AuthService ~ register ~ user:", user)
      return user;
    } catch (e) {
      console.log("🚀 ~ AuthService ~ register ~ e:", e)
      return null;
    }
  }

  async login({ email, password }: any) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }


	getUserProfile() {
    return this.auth.currentUser;
		const user = this.auth.currentUser;
		console.log("🚀 ~ AuthService ~ getUserProfile ~ user:", user)
		const userDocRef = doc(this.firestore, `users/${user?.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}
}
