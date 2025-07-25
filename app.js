document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginFm");
  const signupForm = document.getElementById("signupFm");
  const signupBtn = document.getElementById("signupBtn");
  const backtoLoginBtn = document.getElementById("backtoLoginBtn");
  const signupConfirmBtn = document.getElementById("signupConfirmBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const logoImg = document.querySelector(".logo");
  const brdMessage = document.getElementById("message");

   //-----------------------------------------------------
   // Login
   //----------------------------------------------------- 
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();   // Prevents the page from refreshing on form submission
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      // Sign in with email and passworduser, Credential.user only
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);  
      // Get the user's data from Realtime DB using the user's UID
      const dataSnapshot = await firebase.database().ref(`users/${user.uid}`).get(); 
      // Get the actual user data from the dataSnapshot
      const userData = dataSnapshot.val();   

      if (!userData) {
        alert("User Not Found! Please Try Again!");
        return;
      }

      // Day Counting
      const { name, dob } = userData;
      const today = new Date();  // ex. Thu Jul 24 2025 19:17:34 GMT-0600 
      const [year, month, day] = dob.split('-').map(Number);   // ex. dob 2025-08-23 -> 20250823
      const birthDateCurrentYear = new Date(today.getFullYear(), month - 1, day);  // ex. Sat Aug 23 2025 00:00:00 GMT-0600 

      logoImg.classList.add("small");
      loginForm.style.display = "none";
      signupForm.style.display = "none";
      logoutBtn.style.display = "block";

      // Today is user's birthday
      if (birthDateCurrentYear.toDateString() === today.toDateString()) {
        //const res = await fetch("https://zenquotes.io/api/random");   // it doesn't work
        const quoteSrc = await fetch("https://api.codetabs.com/v1/proxy?quest=https://zenquotes.io/api/random");  // used CORS proxy 
        const contents = await quoteSrc.json();
        const quote = contents[0].q;
        const author = contents[0].a;

        brdMessage.innerHTML = `
          <div class="message-line1"> Happy Birthday🥳, <span style="color:#b6273fff;">${name}</span>!</div>
          <div class="message-line2">"${quote}"<br> by ${author}</div>
        `;
      } else {  // Day counting 
        // if the birthday passes the current date, it makes the birthday a next year's date => prevent minus daysleft
        if (birthDateCurrentYear < today) birthDateCurrentYear.setFullYear(today.getFullYear() + 1);

        // 100ms : 1 sec, 60sec x 60 min : 1 hour, x 24 hours = 1 day 
        const daysLeft = Math.ceil((birthDateCurrentYear - today) / (1000 * 60 * 60 * 24));

        brdMessage.innerHTML = `
          <div class="message-line1">Hi <span style="color:#b6273fff;">${name}</span>! \n <span style="color:#b6273fff;">${daysLeft}</span> Days Left</div>
          <div class="message-line2">Until Your Birthday! 🎂</div>
        `;
      }

      brdMessage.style.display = "block";
    } catch (err) {
        alert("Login failed!\n" + err.message);
        loginForm.reset();
    }
  });

  //-----------------------------------------------------
  // Logout
  //----------------------------------------------------- 
  logoutBtn.addEventListener("click", async () => {
    try {
      await firebase.auth().signOut();
      alert("Logout successful!");

      loginForm.reset();
      brdMessage.style.display = "none";
      logoutBtn.style.display = "none";
      loginForm.style.display = "flex";
      logoImg.classList.remove("small");
    } catch (err) {
        alert("Logout failed!\n" + err.message);
    }
  });

  // Signup - Switch form
  signupBtn.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "flex";
    logoImg.classList.add("small");
  });

  // Back to login
  backtoLoginBtn.addEventListener("click", () => {
    loginForm.reset();
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
    logoImg.classList.remove("small");
  });

  //-----------------------------------------------------
  // Signup
  //----------------------------------------------------- 
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("signupName").value;
    const dob = document.getElementById("signupDob").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.database().ref(`users/${user.uid}`).set({ name, dob });
      alert("Sign up successful! Please log in.");

      signupForm.reset();
      signupForm.style.display = "none";
      loginForm.style.display = "flex";
      logoImg.classList.remove("small");
    } catch (err) {
        alert("Sign up failed\n" + err.message);
    }
  });
});
