
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFP0KD6vU7Q8fwnwbLXJERDyLZz1RhZZI",
  authDomain: "eamcet-college-recommender.firebaseapp.com",
  projectId: "eamcet-college-recommender",
  storageBucket: "eamcet-college-recommender.firebasestorage.app",
  messagingSenderId: "676733593679",
  appId: "1:676733593679:web:563bb6f448592fc0e4223a",
  measurementId: "G-SDY5XQMXK1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ HTML elements
const findBtn = document.getElementById("findBtn");
const rankInput = document.getElementById("rankInput");
const resultsDiv = document.getElementById("results");

// ✅ Button click logic
findBtn.addEventListener("click", async () => {
  const userRank = parseInt(rankInput.value);

  if (isNaN(userRank) || userRank <= 0) {
    resultsDiv.innerHTML = "<p>Please enter a valid rank!</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading colleges...</p>";

  try {
    // ✅ Firestore query (field name must match your Firestore)
    const q = query(
      collection(db, "Colleges"),
      where("closing_rank", ">=", 1),
      where("closing_rank", "<=", userRank)
    );

    const querySnapshot = await getDocs(q);
    resultsDiv.innerHTML = "";

    if (querySnapshot.empty) {
      resultsDiv.innerHTML = "<p>No colleges found for this rank 😢</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.classList.add("college-card");
      card.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Branch:</strong> ${data.branch}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Closing Rank:</strong> ${data.closing_rank}</p>
        <p><strong>Year:</strong> ${data.year}</p>
      `;
      resultsDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    resultsDiv.innerHTML = "<p>Something went wrong 😔</p>";
  }
});
