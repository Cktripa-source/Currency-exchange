import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import backgroundImage from "./1711107399590.gif";
import Logo from "./app-icon.png";

const App = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currency, setCurrency] = useState({ value: 0, direction: "inrToFrw" });
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Added mobile menu state
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
        "service_r0au4i2",
        "template_6ju20hn",
        templateParams,
        "HM-EG97fBUfe2HXc1"
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
  const handleConversion = () => {
    const { value, direction } = currency;
    const conversionRate = direction === "inrToFrw" ? 15.7000000 : 0.056179775280;

    // Calculate the converted amount
    const converted = (value * conversionRate).toFixed(3);

    // Determine currency labels based on direction
    const fromCurrency = direction === "inrToFrw" ? "INR" : "FRW";
    const toCurrency = direction === "inrToFrw" ? "FRW" : "INR";

    // Set the converted result in the desired format
    setConvertedAmount(`${value} ${fromCurrency} = ${converted} ${toCurrency}`);
  };

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex items-center justify-between flex-wrap">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full border-2 border-white" />
          <h1 className="text-xl md:text-2xl font-bold">MARTIN CURRENCY TRANSFER APP</h1>
        </div>

        {/* Optional Right Section for Future Use */}
        <div className="relative">
          {/* Links for larger screens */}
          <div className="md:flex space-x-6 text-white text-lg">
            <a
              href="https://www.instagram.com/ck_tr_pa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-gray-300"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/ck_tr_pa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-gray-300"
            >
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/ck_tr_pa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-gray-300"
            >
              Instagram
            </a>
          </div>

          {/* Dropdown Menu for mobile */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-green-600 text-white flex flex-col space-y-2 p-4 rounded-md shadow-lg">
              <a
                href="https://www.facebook.com/martin.niyomugabo.3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-gray-300"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/ck_tr_pa/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-gray-300"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/martin__91__91/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-gray-300"
              >
                Instagram
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Welcome Section */}
      <section
        className="h-1/2 p-6 sm:p-10 py-10 sm:py-20 flex items-center justify-center relative bg-cover sm:bg-contain bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-6xl sm:text-8xl font-extrabold text-green-300 mb-4">Welcome</h2>
          <p className="text-xl sm:text-4xl text-green-100 max-w-4xl mx-auto font-mono font-extrabold">
            Welcome to the Currency Transfer App! Send messages with payment proof and convert currencies between INR and FRW.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Contact Section */}
          <section className="flex-1 bg-green-50 rounded-lg shadow-lg p-6 mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold font-mono text-green-500 mb-4">Contact & Send Payment Proof</h2>
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
                <label className="block text-sm font-medium">Payment Screenshot</label>
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
            <h2 className="text-2xl text-green-500 font-bold font-mono mb-4">Currency Converter</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={currency.value === 0 ? "" : currency.value}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setCurrency({
                      ...currency,
                      value: inputValue === "" ? 0 : parseFloat(inputValue),
                    });
                  }}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Convert</label>
                <select
                  value={currency.direction}
                  onChange={(e) => setCurrency({ ...currency, direction: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="inrToFrw">INR to FRW</option>
                  <option value="frwToInr">FRW to INR</option>
                </select>
              </div>
              <button
                onClick={handleConversion}
                className="w-full bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Convert
              </button>
              {convertedAmount && (
                <p className="text-lg font-bold text-gray-700 mt-4 p-2 border rounded-full">
                  {convertedAmount}
                </p>
              )}
            </div>
          </section>

          {/* Payment Methods Section */}
          <section className="flex-1 bg-green-50 rounded-lg shadow-lg p-6 my-10">
            <h2 className="text-2xl font-bold font-mono text-green-500 mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700 p-2 border rounded-full">
                <strong>Phone:</strong> +250790025908
              </p>
              <p className="text-lg font-medium text-gray-700 p-2 border rounded-full">
                <strong>Equity Bank :</strong>4006100907609
              </p>
            <p className="text-lg font-medium text-gray-700 p-2 border rounded-full"><strong>Both Acount Name </strong>: NIYOMUGABO MARTIN </p>
            <p className="text-xl font-medium text-green-500 p-2 border rounded-full">THANK YOU !</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © 2024 Currency Transfer App | Developed by Patrick |
          <div className="flex gap-6 text-xl text-green-600 justify-center">
            <a href="https://www.facebook.com/martin.niyomugabo.3" target="_blank">Facebook</a>
            <a href="https://www.instagram.com/ck_tr_pa/" target="_blank">WhatsApp</a>
            <a href="https://www.instagram.com/martin__91__91/" target="_blank">Instagram</a>
          </div>
        </p>
      </footer>
    </div>
  );
};

export default App;
