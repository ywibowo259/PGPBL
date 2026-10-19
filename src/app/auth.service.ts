import { Injectable } from '@angular/core';
import { auth } from './firebase.service';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fungsi login yang sudah dibuat sebelumnya
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Tambahkan fungsi register ini agar errornya hilang
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
}
