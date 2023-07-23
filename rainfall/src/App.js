import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [selectedState, setSelectedState] = useState("");
  const [plotUrl, setPlotUrl] = useState("");
  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/states")
      .then((response) => {
        if (response.data.length > 0) {
          const firstState = response.data[0]; // Get the first state from the fetched data
          setSelectedState(firstState); // Set the first state as the initial selected state
        } else {
          console.log("No states found.");
        }
        setStateOptions(
          response.data.map((state) => ({ label: state, value: state }))
        );
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, []);

  const handleGeneratePlot = () => {
    axios
      .get(`http://localhost:5000/api/rainfall_plot?state=${selectedState}`)
      .then((response) => {
        // Assuming the response contains the URL of the saved plot image
        setPlotUrl(response.data.plot_url);
      })
      .catch((error) => {
        console.error("Error generating plot:", error);
      });
  };

  const handleShowPlot = () => {
    if (selectedState !== "") {
      handleGeneratePlot();
    }
  };

  useEffect(() => {
    console.log("Plot URL:", plotUrl);
  }, [plotUrl]);

  // Custom styles for react-select
  const selectStyles = {
    container: (provided) => ({
      ...provided,
      position: "relative",
      width: "300px", // Adjust the width as needed
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #93C5FD" : "2px solid #E5E7EB", // Border color on focus and blur
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        border: "2px solid #BEE3F8", // Border color on hover
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#5E87B0" : "transparent", // Background color on focus
      color: state.isFocused ? "white" : "black", // Text color on focus
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "8px",
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-slate-900 to-purple-900">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-purple-800 to-indigo-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="">
            <h2 className="text-white text-2xl font-bold">Rainfall-Explorer</h2>
          </div>

          {/* Navigation Menu */}
          <ul className="flex space-x-4 text-white">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold">
            Rainfall Data Visualization
          </h1>
          <p className="text-orange-500 text-lg">
            Explore annual rainfall data for different states in India.
          </p>
        </header>

        {/* Input and Button */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Select
              options={stateOptions}
              value={{ label: selectedState, value: selectedState }}
              onChange={(selectedOption) =>
                setSelectedState(selectedOption.value)
              }
              placeholder="Enter state name"
              styles={selectStyles}
              isSearchable
              autoFocus // Automatically focus on the input
            />
          </div>

          <button
            className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-500 hover:to-red-800 text-white py-2 px-4 rounded-md transition duration-300 shadow-md focus:ring-2 focus:ring-slate-600 focus:outline-none ml-2"
            onClick={handleShowPlot}
          >
            Show Plot
          </button>
        </div>

        {/* Display the plot image if available */}
        {plotUrl !== "" && (
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-4">
              Rainfall Plot for {selectedState}
            </h2>
            <img
              src={`http://localhost:5000/${plotUrl}`}
              alt="Rainfall Plot"
              className="max-w-full"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-indigo-800 p-4">
        <div className="container mx-auto text-white text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} RainfallExplorer. All rights
            reserved.
          </p>
          <p className="text-sm">Made with ❤️ using React and Flask.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
