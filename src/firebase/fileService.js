import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const storage = getStorage();

async function Fileservice(file) {
  return new Promise((resolve, reject) => {
    const user = getAuth().currentUser;
    if (!user) return reject("No user logged in");
    const storageRef = ref(
      storage,
      `upload/${user.uid}/${Date.now()}-${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress UI
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => reject(error),
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          // Save file metadata in Firestore
          await addDoc(collection(db, "files"), {
            userId: user.uid,
            filename: file.name,
            fileUrl: downloadUrl,
            created_at: serverTimestamp(),
          });
          resolve(downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

export default Fileservice;
