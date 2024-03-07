import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';

import { Auth } from '@angular/fire/auth';

export interface Request {
  id?: string;
  title: string;
  text: string;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(private auth: Auth,private firestore: Firestore) { }

  getItems(item: any): Observable<Request[]> {
    const requestsRef = collection(this.firestore, item);
    return collectionData(requestsRef, { idField: 'id'}) as Observable<Request[]>;
  }

  getRequestById(id: any): Observable<Request> {
    const noteDocRef = doc(this.firestore, `items/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Request>;
  }


  deleteRequest(data: Request) {
    const noteDocRef = doc(this.firestore, `items/${data.id}`);
    return deleteDoc(noteDocRef);
  }

  updateRequest(data: Request) {
    const noteDocRef = doc(this.firestore, `items/${data.id}`);
    return updateDoc(noteDocRef, { title: data.title, text: data.text });
  }

	async addMechanic(data: any) {
		const user = this.auth.currentUser;

		try {
			const userDocRef = doc(this.firestore, `users/${user?.uid}`);
			await setDoc(userDocRef, data);
			return true;
		} catch (e) {
			console.log("🚀 ~ FirebaseService ~ addMechanic ~ e:", e)
			return null;
		}
	}

	async addRequest(data: any, id: any) {
		// const user = this.auth.currentUser;

		try {
			const userDocRef = doc(this.firestore, `requests/${id}`);
			await setDoc(userDocRef, data);
			return true;
		} catch (e) {
			console.log("🚀 ~ FirebaseService ~ addMechanic ~ e:", e)
			return null;
		}
	}



  getUsersWithProfile(): Observable<any> {

    const usersQuery = collection(this.firestore, 'users');
    const userProfileQuery = collection(this.firestore, 'userProfile');
    // const usersQuery = collectionData(requestsRef, { idField: 'id'}) as Observable<Request[]>;
    const users = collectionData(usersQuery, { idField: 'id'});
    const profiles = collectionData(userProfileQuery, { idField: 'id'});
    // return userProfileQuery;

    // Query both collections separately
    // const usersQuery = this.firestore.collection('users').valueChanges();
    // const userProfileQuery = this.firestore.collection('userProfile').valueChanges();

    // Combine the results of both queries
    const res = combineLatest([users, profiles]);
    console.log("🚀 ~ FirebaseService ~ getUsersWithProfile ~ res:", res)
    return res;
  }
}
