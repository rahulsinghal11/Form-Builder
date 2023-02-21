import React, { useState, useEffect } from "react";
import Form from "../Form/Form";
import "./Select.css";

const Select = ({ onChange }) => {
  const [options, setOptions] = useState([]);
  const [template, setTemplate] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleOptionChange = (e) => {
    if (e.target.value) {
      setShowForm(false);
      setIsLoading(true);
      setSelectedOption(e.target.value);
      onChange(e.target.value);

      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:8000/template/${e.target.value}`
        );
        const json = await response.json();
        setTemplate(json);
        setIsLoading(false);
        setShowForm(true);
        console.log(json);
      };
      fetchData();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/templates");
      const json = await response.json();
      setOptions(json);
      console.log(json);
    };
    fetchData();
  }, []);

  return (
    <div className="select-box-container">
      <div className="select-box">
        <div className="select-container">
          <div className="select-wrapper">
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="" disabled>
                Select source template
              </option>
              {options.map((option, id) => (
                <option key={id} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <div className="loading-icon">Loading...</div>
          ) : (
            showForm && <Form template={template} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
