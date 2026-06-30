import React, { createContext, useContext, useState, useEffect } from 'react';

const EquipmentContext = createContext();

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};

export const EquipmentProvider = ({ children }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEquipment = async () => {
    try {
      setLoadingEquip(true);
      const res = await fetch("http://localhost:3000/equipment");
      if (!res.ok) throw new Error(`Failed to load equipment: ${res.status}`);
      const data = await res.json();
      setEquipmentList(data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Could not load equipment. Is json-server on port 3000?");
    } finally {
      setLoadingEquip(false);
    }
  };

  const updateEquipment = (updatedEquipment) => {
    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === updatedEquipment.id ? updatedEquipment : eq))
    );
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <EquipmentContext.Provider value={{
      equipmentList,
      loadingEquip,
      message,
      fetchEquipment,
      updateEquipment
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};
