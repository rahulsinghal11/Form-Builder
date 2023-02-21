import React, { useState } from "react";
import "./Form.css";

const SourceForm = ({ template }) => {
  const [sourceType, setSourceType] = useState(template.type);
  const [formData, setFormData] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const handleFormChange = (event) => {
    console.log(event.target.name, event.target.value);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm("http://localhost:8000/source", formData, event);
  };

  const clearFormData = (event) => {
    console.log("Here");
    setFormData({}); // Clear the form data
    setIsChecked(false);
    const formFields = event.target.querySelectorAll("input, select");
    formFields.forEach((field) => (field.value = ""));
  };

  const submitForm = async (url, data, event) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        alert("Error submitting form, please try later.");
      } else {
        alert("Form successfully submitted!");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form, please try later.");
    }
    clearFormData(event);
  };

  const renderFormFields = () => {
    if (!sourceType) {
      return null;
    }
    const fields = template.fields;
    return Object.keys(fields).map((key) => {
      const field = fields[key];
      const inputName = key;
      const inputType = field.type;
      const inputLabel = field.label;
      const inputPlaceholder = field.placeholder;
      const isInputRequired = field.required;
      const inputRegex = field.regex;
      const inputOptions = field.options;
      return (
        <div key={key}>
          <label>{inputLabel}</label>
          {inputType === "input" && (
            <input
              name={inputName}
              type="text"
              placeholder={inputPlaceholder}
              required={isInputRequired}
              onChange={handleFormChange}
              pattern={inputRegex}
            />
          )}
          {inputType === "checkbox" && (
            <input
              name={inputName}
              type="checkbox"
              onChange={(event) => {
                setIsChecked(event.target.checked);
                event.target.value = event.target.checked;
                handleFormChange(event);
              }}
              value={isChecked}
              checked={isChecked}
            />
          )}
          {inputType === "singleSelect" && (
            <select
              name={inputName}
              onChange={handleFormChange}
              required={isInputRequired}
            >
              <option value="">Select category</option>
              {inputOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    });
  };

  return (
    <div className="form-box">
      <form className="source-form" onSubmit={handleSubmit}>
        {renderFormFields()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SourceForm;
