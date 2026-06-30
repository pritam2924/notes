import React, { useState, useEffect } from 'react';
import sparePartService from '../../services/sparePartService';

const SparePartsTest = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    testSparePartsAPI();
  }, []);

  const testSparePartsAPI = async () => {
    try {
      console.log('Testing Spare Parts API...');
      
      // Test creating a spare part
      const testSparePart = {
        sparePartId: 'SP-TEST-001',
        sparePartName: 'Test Bearing',
        category: 'Mechanical',
        description: 'Test bearing for equipment',
        stockQuantity: 10,
        minimumStockLevel: 5,
        unitPrice: 25.99,
        supplier: 'Test Supplier',
        equipmentId: null,
        equipmentName: null
      };

      console.log('Creating test spare part...');
      const created = await sparePartService.createSparePart(testSparePart);
      console.log('Created:', created);

      // Test getting all spare parts
      console.log('Fetching all spare parts...');
      const allParts = await sparePartService.getAllSpareParts();
      console.log('All parts:', allParts);
      setSpareParts(allParts);

    } catch (error) {
      console.error('API Test Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Testing API...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Spare Parts API Test</h3>
      <p>Found {spareParts.length} spare parts</p>
      <ul>
        {spareParts.map(part => (
          <li key={part.sparePartId}>
            {part.sparePartName} - Stock: {part.stockQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SparePartsTest;