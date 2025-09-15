"use client"
import React, { useState } from 'react'

function Form() {
  const [name, setname] = useState("");
  const [age, setage] = useState("");
  const [village, setvillage] = useState("");
  const [email, setemail] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          village,
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ User created successfully!");
        console.log("Created User:", data);
        // reset form
        setname("");
        setage("");
        setvillage("");
        setemail("");
      } else {
        alert(`❌ Error: ${data.error || "Failed to create user"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handlesubmit} className="flex gap-2 flex-col w-64">
      <input
        type="text"
        required
        placeholder="Enter the name"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <input
        type="number"
        required
        placeholder="Enter the age"
        value={age}
        onChange={(e) => setage(e.target.value)}
      />
      <input
        type="text"
        required
        placeholder="Enter the village"
        value={village}
        onChange={(e) => setvillage(e.target.value)}
      />
      <input
        type="email"
        required
        placeholder="Enter the email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Post
      </button>
    </form>
  )
}

export default Form
