import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currency, setCurrency] = useState({ value: 0, direction: "inrToFrw" });
  const formRef = useRef();

  // Handle File Upload
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle Email Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

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

      const formData = new FormData(formRef.current);
      const templateParams = {
        to_name: formData.get("to_name"),
        from_name: formData.get("from_name"),
        email: formData.get("email"),
        message: formData.get("message"),
        image_url: imageUrl || "",
        timestamp: new Date().toLocaleString(),
      };

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

  // Handle Currency Conversion
  const handleConversion = () => {
    const { value, direction } = currency;
    if (direction === "inrToFrw") {
      setConvertedAmount(value * 15.1);
    } else {
      setConvertedAmount(value * 0.051);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">CURRENCY TRANSFER APP</h1>
      </header>

      {/* Welcome Section */}
      <section className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Welcome to the Currency Transfer App! Here, you can send messages
            with payment proof and also convert currencies between Indian Rupees
            (INR) and Rwandan Francs (FRW).
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Contact and Currency Converter */}
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Contact Section */}
          <section className="flex-1 bg-white rounded-lg shadow-lg p-6 mb-6 lg:mb-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
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
                <input
                  type="hidden"
                  name="to_name"
                  required
                  value="MARTIN EXCHANGER !"
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
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Upload Screenshot
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </section>

          {/* Currency Converter Section */}
          <section className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Currency Converter
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={currency.value}
                  onChange={(e) =>
                    setCurrency({
                      ...currency,
                      value: parseFloat(e.target.value),
                    })
                  }
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
              <button
                onClick={handleConversion}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Convert
              </button>
              {convertedAmount && (
                <p className="text-lg font-bold text-gray-700 mt-4">
                  Converted Amount: {convertedAmount.toFixed(2)}
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © 2024 Currency Transfer App | Developed by Patrick |{" "}
          <a
            href="https://www.instagram.com/ck_tr_pa/"
            target="_blank"
            className="underline"
          >
            Instagram
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
