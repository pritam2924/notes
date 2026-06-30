import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import maintenanceTaskService from "../../../services/maintenanceTaskService";
import "./OperatorWorkboard.css";

const OperatorWorkboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");
      const operatorId = currentUser.userID;
      
      console.log("Current user:", currentUser);
      console.log("Operator ID:", operatorId);
      
      if (!operatorId) {
        console.warn("No userID found in user data");
        setTasks([]);
        return;
      }
      
      console.log("Fetching tasks for operator:", operatorId);
      const response = await maintenanceTaskService.getTasksByOperatorId(operatorId);
      console.log("Tasks received:", response);
      console.log("Task statuses:", response.map(t => ({ id: t.id, status: t.status })));
      setTasks(response);
    } catch (error) {
      console.error("Error fetching operator tasks:", error);
      if (error.response?.status === 400) {
        console.error("Bad request - check operator ID format:", error.response.data);
      }
      setTasks([]);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await maintenanceTaskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addTaskNotes = async (taskId, newNotes) => {
    try {
      await axios.patch(`${API_BASE_URL}/maintenanceTasks/${taskId}`, {
        notes: newNotes,
        updatedAt: new Date().toISOString(),
      });
      fetchTasks();
      setShowNotesModal(false);
      setSelectedTask(null);
      setNotes("");
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const openNotesModal = (task) => {
    setSelectedTask(task);
    setNotes(task.notes || "");
    setShowNotesModal(true);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status?.toUpperCase() === status.toUpperCase());
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "#dc3545";
      case "high":
        return "#fd7e14";
      case "medium":
        return "#ffc107";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="operator-workboard">
      <h2>My Workboard</h2>

      <div className="workboard-columns">
        <div className="task-column">
          <div className="column-header scheduled">
            <i className="bi bi-calendar-check"></i>
            <h4>Scheduled ({getTasksByStatus("Scheduled").length})</h4>
          </div>
          <div className="task-list">
            {getTasksByStatus("Scheduled").length === 0 ? (
              <div className="empty-state">
                <p>No scheduled tasks</p>
              </div>
            ) : (
              getTasksByStatus("Scheduled").map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h5>{task.title}</h5>
                    <span
                      className="priority-dot"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    ></span>
                  </div>
                  <p className="equipment-name">{task.equipmentName}</p>
                  <p className="task-date">
                    Due: {new Date(task.scheduledDate).toLocaleDateString()}
                  </p>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                  <div className="task-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => updateTaskStatus(task.id, "In Progress")}
                    >
                      Start Task
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openNotesModal(task)}
                    >
                      <i className="bi bi-sticky"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header in-progress">
            <i className="bi bi-gear"></i>
            <h4>In Progress ({getTasksByStatus("In Progress").length})</h4>
          </div>
          <div className="task-list">
            {getTasksByStatus("In Progress").map((task) => (
              <div key={task.id} className="task-card active">
                <div className="task-header">
                  <h5>{task.title}</h5>
                  <span
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  ></span>
                </div>
                <p className="equipment-name">{task.equipmentName}</p>
                <p className="task-date">
                  Due: {new Date(task.scheduledDate).toLocaleDateString()}
                </p>
                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}
                {task.notes && (
                  <div className="task-notes">
                    <small>
                      <strong>Notes:</strong> {task.notes}
                    </small>
                  </div>
                )}
                <div className="task-actions">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateTaskStatus(task.id, "Completed")}
                  >
                    Complete
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openNotesModal(task)}
                  >
                    <i className="bi bi-sticky"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header completed">
            <i className="bi bi-check-circle"></i>
            <h4>Completed ({getTasksByStatus("Completed").length})</h4>
          </div>
          <div className="task-list">
            {getTasksByStatus("Completed").map((task) => (
              <div key={task.id} className="task-card completed">
                <div className="task-header">
                  <h5>{task.title}</h5>
                  <span
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  ></span>
                </div>
                <p className="equipment-name">{task.equipmentName}</p>
                <p className="task-date">
                  Completed:{" "}
                  {new Date(
                    task.updatedAt || task.createdAt,
                  ).toLocaleDateString()}
                </p>
                {task.notes && (
                  <div className="task-notes">
                    <small>
                      <strong>Notes:</strong> {task.notes}
                    </small>
                  </div>
                )}
                <div className="task-actions">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openNotesModal(task)}
                  >
                    <i className="bi bi-sticky"></i> View Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <h6>{selectedTask.title}</h6>
              <p className="text-muted">{selectedTask.equipmentName}</p>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => addTaskNotes(selectedTask.id, notes)}
          >
            Save Notes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OperatorWorkboard;
