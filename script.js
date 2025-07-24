import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// عدل هذه القيم بقيم مشروع Firebase الخاص بك
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const linkEl = document.getElementById("link");

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("اختر ملفاً أولاً!");
    return;
  }

  linkEl.textContent = "جارٍ رفع الملف... الرجاء الانتظار";

  try {
    const id = Date.now().toString();
    const storageRef = ref(storage, `uploads/${id}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await setDoc(doc(db, "files", id), { url: downloadURL });

    const shortLink = `${window.location.origin}/${id}`;

    linkEl.innerHTML = `
      <strong>تم الرفع بنجاح!</strong><br>
      <a href="${downloadURL}" target="_blank" style="color:#a0e9fd;">رابط التحميل الأصلي</a><br>
      <a href="${shortLink}" target="_blank" style="color:#a0e9fd;">الرابط المختصر (غير مفعل)</a>
    `;
  } catch (error) {
    console.error(error);
    linkEl.textContent = "حدث خطأ أثناء الرفع. حاول مرة أخرى.";
  }
});
