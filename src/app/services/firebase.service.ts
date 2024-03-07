import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
}
