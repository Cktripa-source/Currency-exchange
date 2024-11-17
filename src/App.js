import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import backgroundImage from "./1711107399590.gif";

const App = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currency, setCurrency] = useState({ value: 0, direction: "inrToFrw" });
  const formRef = useRef();

  /**
   * Handle File Upload
   */
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  /**
   * Handle Form Submission and Send Email
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      // Upload image to Cloudinary if available
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "pfozggdc");
        formData.append("cloud_name", "dv93rsjzy");

        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dv93rsjzy/image/upload",
          formData
        );
        imageUrl = uploadResponse.data.secure_url;
      }

      // Prepare email data
      const formData = new FormData(formRef.current);
      const templateParams = {
        to_name: "MARTIN EXCHANGER!",
        from_name: formData.get("from_name"),
        email: formData.get("email"),
        message: formData.get("message"),
        image_url: imageUrl || "",
        timestamp: new Date().toLocaleString(),
      };

      // Send email using EmailJS
      await emailjs.send(
        "service_71uo36k",
        "template_075izud",
        templateParams,
        "yScYlzZAGrKBPtyJG"
      );

      alert("Email sent successfully!");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Input Change and Conversion
   */
  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const conversionRate = currency.direction === "inrToFrw" ? 15.1 : 0.051;
    setCurrency({ ...currency, value });
    setConvertedAmount((value * conversionRate).toFixed(2));
  };

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="bg-green-500 text-white p-4 text-center">
        <h1 className="text-2xl font-bold p-4 border rounded-full">
          CURRENCY TRANSFER APP
        </h1>
      </header>

      {/* Welcome Section */}
      <section
        className="h-1/2 p-6 sm:p-10 py-10 sm:py-20 flex items-center justify-center relative bg-cover sm:bg-contain bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-6xl sm:text-8xl font-extrabold text-green-400 mb-4">
            Welcome
          </h2>
          <p className="text-xl sm:text-4xl text-green-100 max-w-4xl mx-auto font-mono font-extrabold">
            Welcome to the Currency Transfer App! Send messages with payment
            proof and convert currencies between INR and FRW.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Contact Section */}
          <section className="flex-1 bg-green-50 rounded-lg shadow-lg p-6 mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold font-mono text-gray-800 mb-4">
              Contact & Send Payment Proof
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  name="from_name"
                  required
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  required
                  className="mt-1 block w-full border rounded-md p-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </section>

          {/* Currency Converter Section */}
          <section className="flex-1 bg-green-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold font-mono text-gray-800 mb-4">
              Currency Converter
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={currency.value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Convert</label>
                <select
                  value={currency.direction}
                  onChange={(e) =>
                    setCurrency({ ...currency, direction: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="inrToFrw">INR to FRW</option>
                  <option value="frwToInr">FRW to INR</option>
                </select>
              </div>
              {convertedAmount && (
                <p className="text-lg font-bold text-gray-700 mt-4">
                  Converted Amount: {convertedAmount}{" "}
                  {currency.direction === "inrToFrw" ? "FRW" : "INR"} from{" "}
                  {currency.direction === "inrToFrw" ? "INR" : "FRW"}
                </p>
              )}
            </div>
          </section>

          {/* Payment Details Section */}
          <section className="flex-1 bg-green-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold font-mono text-gray-800 mb-4">
              Payment Methods
            </h2>
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700">
                <strong>Phone:</strong> +250790025908
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>Equity Bank Account:</strong> 7848384767346
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © 2024 Currency Transfer App | Developed by Patrick |
          <div className="flex gap-6 text-xl text-green-600 justify-center">
            <a href="https://www.instagram.com/ck_tr_pa/" target="_blank">
              Facebook
            </a>
            <a href="https://www.instagram.com/ck_tr_pa/" target="_blank">
              WhatsApp
            </a>
            <a href="https://www.instagram.com/ck_tr_pa/" target="_blank">
              LinkedIn
            </a>
          </div>
        </p>
      </footer>
    </div>
  );
};

export default App;
