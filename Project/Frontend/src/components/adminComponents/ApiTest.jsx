import React, { useState } from 'react';
import sparePartService from '../../services/sparePartService';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
	setLoading(true);
	setTestResult('Testing API...');
	
	try {
	  // Test 1: Get all spare parts
	  console.log('Testing getAllSpareParts...');
	  const spareParts = await sparePartService.getAllSpareParts();
	  console.log('Spare parts result:', spareParts);
	  
	  // Test 2: Create a test spare part
	  const testSparePart = {
		sparePartId: 'TEST-001',
		sparePartName: 'Test Part',
		category: 'Test Category',
		description: 'Test Description',
		stockQuantity: 10,
		minimumStockLevel: 5,
		unitPrice: 25.99,
		supplier: 'Test Supplier'
	  };
	  
	  console.log('Testing createSparePart...');
	  const created = await sparePartService.createSparePart(testSparePart);
	  console.log('Created spare part:', created);
	  
	  setTestResult('API Test Successful! Check console for details.');
	} catch (error) {
	  console.error('API Test Error:', error);
	  setTestResult(`API Test Failed: ${error.message}`);
	} finally {
	  setLoading(false);
	}
  };

  return (
	<div style={{ padding: '20px' }}>
	  <h2>API Test</h2>
	  <button onClick={testAPI} disabled={loading}>
		{loading ? 'Testing...' : 'Test API'}
	  </button>
	  <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
		{testResult}
	  </div>
	</div>
  );
};

export default ApiTest;