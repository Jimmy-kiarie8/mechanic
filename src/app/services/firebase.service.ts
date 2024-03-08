import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, setDoc, query, where } from '@angular/fire/firestore';
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

  getRequestById_(id: any): Observable<Request> {
    const noteDocRef = doc(this.firestore, `items/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Request>;
  }


  deleteRequest(data: Request) {
    const noteDocRef = doc(this.firestore, `items/${data.id}`);
    return deleteDoc(noteDocRef);
  }

  updateRequest(status: String, uid: any) {
    const noteDocRef = doc(this.firestore, `requests/${uid}`);
    return updateDoc(noteDocRef, { status: status });
  }

  async updateRequestStatus(status: string, uid: any): Promise<void> {
    console.log("🚀 ~ FirebaseService ~ updateRequestStatus ~ status:", status)
    console.log("🚀 ~ FirebaseService ~ updateRequestStatus ~ uid:", uid)
    try {
      const reqDocRef = doc(this.firestore, `requests/${uid}`);
      await updateDoc(reqDocRef, { status: status });
      console.log("Request status updated successfully");
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
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


  getItemsByMechanicId(item: string, mechanicId: any): Observable<any[]> {
    const requestsRef = collection(this.firestore, item);
    const queryRef = query(requestsRef, where('mechanic_id', '==', mechanicId));
    return collectionData(queryRef, { idField: 'id' }) as Observable<any[]>;
  }


  getRequestById(id: any): Observable<Request> {
    console.log("🚀 ~ FirebaseService ~ getRequestById ~ id:", id)
    const noteDocRef = doc(this.firestore, `requests/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Request>;
  }
}
