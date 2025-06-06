// src/App.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

const VAPID_KEY =
  "BC2amr5RIbgoxXr84BqkcfVYcahw3iYkeB_VULfJTSboGOH0vuTlPQDaGI244T4YLsBH1xNQpW7twHhjXaIzoDA";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(90); // 1:30 = 90 seconds
  const [intervalId, setIntervalId] = useState(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  // Get current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  // Save FCM token when user logs in
  useEffect(() => {
    if (user) saveTokenForUser(user.id);
  }, [user]);

  // Watch timer to notify at 1:00 and clear interval at 0
  useEffect(() => {
    if (timer === 60) {
      notifyUser("Notification", "Come to the office time is in 1 minute!");
    }
    if (timer === 0) {
      clearInterval(intervalId);
      setIntervalId(null);
      setTimer(90); // optional: reset timer
    }
  }, [timer]);

  async function saveTokenForUser(userId) {
    try {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        // Upsert based on user_id assuming user_id is unique in your table
        const { error } = await supabase.from("user_tokens").upsert(
          {
            user_id: userId,
            fcm_token: currentToken,
          },
          { onConflict: "user_id" }
        );
        if (error) {
          console.error("Error saving FCM token:", error);
        } else {
          console.log("FCM Token saved!");
        }
      } else {
        console.log("No registration token available.");
      }
    } catch (err) {
      console.error("Error getting token", err);
    }
  }

  function notifyUser(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  async function handleLogin() {
    console.log("Logging in with:", { email, password });
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    setUser(user);
  }

  function startTimer() {
    if (intervalId) return; // prevent multiple timers
    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    setIntervalId(id);
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {!user ? (
        <>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10, padding: 8, width: 250 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10, padding: 8, width: 250 }}
          />
          <button onClick={handleLogin} style={{ padding: "8px 20px" }}>
            Login
          </button>
        </>
      ) : (
        <>
          <h2>Welcome, {user.email}</h2>
          <div style={{ textAlign: "center" }}>
            <h3>
              Timer: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </h3>
            <button onClick={startTimer} style={{ padding: "8px 20px" }}>
              Start
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
