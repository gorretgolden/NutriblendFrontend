
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";


interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  dob: string;
  gender: string;
}

const RegisterAccount: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Account, "id">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    const { name, email, password, gender, dob } = formData;
    if (!name || !email || !password || !gender || !dob) {
      setError("Please fill in all required fields!");
      return;
    }

    setMessage(`Account for ${formData.name} has been created successfully!`);

    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      dob: "",
      gender: "",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Account</h1>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
        
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default RegisterAccount;