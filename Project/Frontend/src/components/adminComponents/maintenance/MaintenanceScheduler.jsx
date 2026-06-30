import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import maintenanceTaskService from "../../../services/maintenanceTaskService";
import equipmentService from "../../../services/equipmentService";
import api from "../../../config/api";
import "./MaintenanceScheduler.css";

const MaintenanceScheduler = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTaskListModal, setShowTaskListModal] = useState(false);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
    fetchEquipment();
    fetchOperators();
    // Auto-refresh every 5 seconds to show real-time updates
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);
  const location = useLocation();
  const { autoOpenScheduleModal, equipmentId, alertId, alert } =
    location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");

  useEffect(() => {
    if (autoOpenScheduleModal && equipmentId) {
      setSelectedEquipment(equipmentId);
      setShowScheduleModal(true);
    }
  }, [autoOpenScheduleModal, equipmentId]);

  const fetchTasks = async () => {
    try {
      const tasks = await maintenanceTaskService.getAllTasks();
      // Fetch operator names for each task
      const tasksWithOperatorNames = await Promise.all(
        tasks.map(async (task) => {
          if (task.assignedOperatorId) {
            try {
              const response = await api.get(`/users/details/${task.assignedOperatorId}`);
              return {
                ...task,
                assignedOperatorName: `${response.data.firstName} ${response.data.lastName}`
              };
            } catch (error) {
              console.error(`Error fetching operator ${task.assignedOperatorId}:`, error);
              return task;
            }
          }
          return task;
        })
      );
      setMaintenanceTasks(tasksWithOperatorNames);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const equipment = await equipmentService.getAllEquipment();
      setEquipmentList(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await api.get('/users/operators');
      setOperatorList(response.data);
    } catch (error) {
      console.error("Error fetching operators:", error);
      setOperatorList([]);
    }
  };

  const handleScheduleTask = async () => {
    if (!selectedEquipment || !taskTitle || !scheduledDate || !selectedOperator) {
      window.alert("Please fill in all required fields");
      return;
    }

    const selectedEquipmentData = equipmentList.find(
      (eq) => eq.equipmentId === selectedEquipment
    );

    // Check if equipment is already in maintenance
    if (selectedEquipmentData?.status === "Maintenance") {
      window.alert("This equipment is already under maintenance. Please select a different equipment.");
      return;
    }

    // Check if equipment has active maintenance tasks (SCHEDULED or IN_PROGRESS)
    const hasActiveTasks = maintenanceTasks.some(
      (task) => 
        task.equipmentId === selectedEquipment && 
        (task.status === "SCHEDULED" || task.status === "IN_PROGRESS")
    );

    if (hasActiveTasks) {
      window.alert("This equipment already has an active maintenance task. Please complete or cancel the existing task first.");
      return;
    }

    const newTask = {
      equipmentId: selectedEquipment,
      equipmentName: selectedEquipmentData?.equipmentName || "Unknown Equipment",
      title: taskTitle,
      description: taskDescription,
      scheduledDate,
      priority: priority.toUpperCase(),
      status: "SCHEDULED",
      assignedOperatorId: selectedOperator
    };

    try {
      await maintenanceTaskService.createTask(newTask);
      await fetchTasks();
      setShowScheduleModal(false);
      resetForm();
      window.alert("Task scheduled successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      window.alert("Error scheduling task. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedEquipment("");
    setSelectedOperator("");
    setTaskTitle("");
    setTaskDescription("");
    setScheduledDate("");
    setPriority("MEDIUM");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await maintenanceTaskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this completed task?')) {
      try {
        await maintenanceTaskService.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error deleting task. Please try again.");
      }
    }
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return maintenanceTasks.filter(
      (task) =>
        task.scheduledDate === dateStr &&
        task.status !== "Completed" &&
        task.status !== "Cancelled"
    );
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className="maintenance-scheduler">
      <h2>Maintenance Management</h2>

      <div className="action-cards">
        <div className="action-card" onClick={() => setShowScheduleModal(true)}>
          <i className="bi bi-calendar-plus"></i>
          <h4>Schedule Maintenance</h4>
          <p>Schedule preventive maintenance tasks</p>
        </div>

        <div className="action-card" onClick={() => setShowCalendarModal(true)}>
          <i className="bi bi-calendar3"></i>
          <h4>View Calendar</h4>
          <p>View scheduled maintenance in calendar</p>
        </div>

        <div
          className="action-card"
          onClick={() => {
            setShowTaskListModal(true);
            fetchTasks(); // Refresh tasks when opening modal
          }}
        >
          <i className="bi bi-list-task"></i>
          <h4>Task List</h4>
          <p>View all maintenance tasks</p>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule Preventive Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Equipment</Form.Label>

              <Form.Select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
              >
                <option value="">Select Equipment</option>
                {equipmentList
                  .filter((eq) => eq.status !== "Maintenance")
                  .map((eq) => (
                    <option key={eq.equipmentId} value={eq.equipmentId}>
                      {eq.equipmentName} ({eq.equipmentId})
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g., Oil Change, Filter Replacement"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detailed maintenance instructions..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Scheduled Date</Form.Label>
              <Form.Control
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign Operator</Form.Label>
              <Form.Select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                required
              >
                <option value="">Select Operator</option>
                {operatorList.map((operator) => (
                  <option key={operator.userID} value={operator.userID}>
                    {operator.firstName} {operator.lastName} ({operator.userID})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowScheduleModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleTask}
            style={{
              backgroundColor: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            Schedule Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        show={showCalendarModal}
        onHide={() => setShowCalendarModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Maintenance Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="calendar-header">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <h3>
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days">
              {generateCalendarDays().map((date, index) => {
                const tasksForDate = getTasksForDate(date);
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`calendar-day ${
                      !isCurrentMonth ? "other-month" : ""
                    } ${isToday ? "today" : ""}`}
                  >
                    <span className="day-number">{date.getDate()}</span>
                    {tasksForDate.map((task) => (
                      <div
                        key={task.id}
                        className={`task-indicator priority-${task.priority.toLowerCase()}`}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Task List Modal */}
      <Modal
        show={showTaskListModal}
        onHide={() => setShowTaskListModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Maintenance Task List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="task-list">
            {maintenanceTasks.length === 0 ? (
              <p>No maintenance tasks scheduled.</p>
            ) : (
              <table className="table">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "var(--primary-color)", // uses your :root --bs-primary
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th style={{ backgroundColor: "inherit" }}>Equipment</th>
                    <th style={{ backgroundColor: "inherit" }}>Task</th>
                    <th style={{ backgroundColor: "inherit" }}>
                      Scheduled Date
                    </th>
                    <th style={{ backgroundColor: "inherit" }}>Assigned Operator</th>
                    <th style={{ backgroundColor: "inherit" }}>Priority</th>
                    <th style={{ backgroundColor: "inherit" }}>Status</th>
                    <th style={{ backgroundColor: "inherit" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.equipmentName}</td>
                      <td>
                        <strong>{task.title}</strong>
                        {task.description && (
                          <div className="task-description">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td>
                        {new Date(task.scheduledDate).toLocaleDateString()}
                      </td>
                      <td>
                        {task.assignedOperatorName || (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`priority-badge priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${task.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value)
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          {task.status === "COMPLETED" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteTask(task.id)}
                              title="Delete completed task"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MaintenanceScheduler;
