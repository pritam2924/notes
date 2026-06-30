import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const TaskDebug = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    fetchDebugData();
  }, []);

  const fetchDebugData = async () => {
    try {
      // Get current user
      const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Fetch all tasks
        const allTasksResponse = await axios.get(`${API_BASE_URL}/maintenance-tasks/debug/all`);
        setAllTasks(allTasksResponse.data);
        
        // Fetch my tasks
        if (user.userID) {
          const myTasksResponse = await axios.get(`${API_BASE_URL}/maintenance-tasks/operator/${user.userID}`);
          setMyTasks(myTasksResponse.data);
        }
      }
    } catch (error) {
      console.error('Debug fetch error:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3>Task Assignment Debug</h3>
      
      <div className="row">
        <div className="col-md-6">
          <h5>Current User</h5>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        </div>
        
        <div className="col-md-6">
          <h5>My Tasks ({myTasks.length})</h5>
          <pre>{JSON.stringify(myTasks, null, 2)}</pre>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h5>All Tasks ({allTasks.length})</h5>
          <div style={{maxHeight: '400px', overflow: 'auto'}}>
            <pre>{JSON.stringify(allTasks, null, 2)}</pre>
          </div>
        </div>
      </div>
      
      <button className="btn btn-primary mt-3" onClick={fetchDebugData}>
        Refresh Data
      </button>
    </div>
  );
};

export default TaskDebug;