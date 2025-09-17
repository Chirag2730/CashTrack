import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });
  const [loading, setLoading]= useState(false);
  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  const handleAddIncome = async () => {
    setLoading(true); 
    try {
      await onAddIncome(income); 
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setLoading(false); 
    }
  };
  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="10,000"
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleAddIncome}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Income'}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
