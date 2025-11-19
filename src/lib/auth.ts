import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { patientService } from '../services/api';

export const signUpUser = async (email: string, password: string, patientData: any) => {
  try {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Register patient to Dorra EMR API
    const apiResponse = await patientService.createPatient(patientData);
    
    if (apiResponse.success) {
      // 3. Store patient ID mapping in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        patientId: apiResponse.data?.id,
        createdAt: new Date().toISOString()
      });

      return { success: true, user, patientId: apiResponse.data?.id };
    } else {
      // If API fails, delete Firebase user
      await user.delete();
      throw new Error(apiResponse.message || 'Failed to register patient');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get patient ID from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return { 
      success: true, 
      user, 
      patientId: userData?.patientId 
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
};