import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/Equipment.css";
import EquipmentList from "../equipment/EquipmentList";
import RegisterEquipment from "../equipment/RegisterEquipment";
import LifecycleEquipment from "../equipment/LifecycleEquipment";

const Equipment = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);

  return (
    <div className="equipment-page">
      <h2 className="text-center fs-1 fw-bold text-dark mb-3">Equipment Management</h2>

      <div className="action-cards">
        <div className="action-card" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <h4>Register New Equipment</h4>
          <p>Add new equipment to the system</p>
        </div>

        <div className="action-card" onClick={() => setShowListModal(true)}>
          <i className="bi bi-list-ul"></i>
          <h4>List of Equipment</h4>
          <p>View all registered equipment</p>
        </div>

        <div className="action-card" onClick={() => setShowLifecycleModal(true)}>
          <i className="bi bi-clock-history"></i>
          <h4>Lifecycle of Equipment</h4>
          <p>View equipment lifecycle history</p>
        </div>
      </div>

      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Register New Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterEquipment/>
        </Modal.Body>
      </Modal>

      <Modal
        show={showListModal}
        onHide={() => setShowListModal(false)}
        size="xl"
        className="equipment-list-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Equipment List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <EquipmentList />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowListModal(false)}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showLifecycleModal}
        onHide={() => setShowLifecycleModal(false)}
        size="xl"
        className="equipment-lifecycle-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lifecycle of Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LifecycleEquipment />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowLifecycleModal(false)}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
    // </div>
  );
};

export default Equipment;
