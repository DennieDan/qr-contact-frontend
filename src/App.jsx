import { useState } from "react";
import "./App.css";

function App() {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // State for the QR code image URL, loading status, and errors
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update state when user types in the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);
    setError("");
    setQrCodeUrl("");

    try {
      // IMPORTANT: Replace with your backend server's URL
      const response = await fetch(
        "https://qr-contact.onrender.com/generate-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setQrCodeUrl(data.imageUrl); // Set the received image URL
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Contact QR Code Generator</h1>
      <p>Enter your details to create a scannable contact card.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate QR Code"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {qrCodeUrl && (
        <div className="qr-code-container">
          <h2>Your QR Code</h2>
          <img src={qrCodeUrl} alt="Generated Contact QR Code" />
          <p>Scan this with your phone's camera.</p>
        </div>
      )}
    </div>
  );
}

export default App;
