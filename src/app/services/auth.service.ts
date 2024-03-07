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

  // async register({ email, password }: any) {
  //   try {
  //     const user = await createUserWithEmailAndPassword(this.auth, email, password);
  //     return user;
  //   } catch (e) {
  //     return null;
  //   }
  // }


  async register(formData: any) {
    console.log("🚀 ~ AuthService ~ register ~ formData:", formData)
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("🚀 ~ AuthService ~ register ~ user:", user)


			const userDocRef = doc(this.firestore, `userProfile/${user.uid}`);

      await setDoc(userDocRef, {
        name: formData.name,
        phone: formData.phone,
        isMechanic: formData.isMechanic,
        isDriver: formData.isDriver
    });
			// await setDoc(userDocRef, {name: name, phone: phone, isMechanic: isMechanic, isDriver: isDriver});

      // You can store additional information in Firebase Realtime Database or Firestore here
      // For example, if you're using Firestore:
      // await collection(this.firestore, 'drivers').doc(this.firestore, user.uid).set(phone);

      return user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
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
    // return this.auth.currentUser;
		const user = this.auth.currentUser;
		console.log("🚀 ~ AuthService ~ getUserProfile ~ user:", user)
		const userDocRef = doc(this.firestore, `userProfile/${user?.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}
}
