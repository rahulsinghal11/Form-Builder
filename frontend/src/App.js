import React, { useState } from "react";
import Select from "./components/Select/Select";

const App = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div>
      <Select onChange={setSelectedOption} />
    </div>
  );
};

export default App;
