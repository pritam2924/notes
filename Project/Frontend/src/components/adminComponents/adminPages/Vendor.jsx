import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import VendorList from "../Vendor/VendorList";
import "../styles/Vendor.css";

const Vendor = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const vendorList = [
    {
      id: 1,
      name: "CAT Inc.",
      contact: "John Smith",
      email: "john@cat.com",
      phone: "+1-234-567-8900",
      status: "Active",
    },
    {
      id: 2,
      name: "Toyota Industrial",
      contact: "Sarah Johnson",
      email: "sarah@toyota.com",
      phone: "+1-234-567-8901",
      status: "Active",
    },
    {
      id: 3,
      name: "Cummins Power",
      contact: "Mike Davis",
      email: "mike@cummins.com",
      phone: "+1-234-567-8902",
      status: "Active",
    },
    {
      id: 4,
      name: "Liebherr Group",
      contact: "Emma Wilson",
      email: "emma@liebherr.com",
      phone: "+1-234-567-8903",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Atlas Copco",
      contact: "David Brown",
      email: "david@atlascopco.com",
      phone: "+1-234-567-8904",
      status: "Active",
    },
  ];

  return (
    <div className="vendor-page">
      <h2>Vendor Management</h2>

      <div className="action-cards">
        <div className="action-card" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <h4>Register New Vendor</h4>
          <p>Add new vendor to the system</p>
        </div>

        <div className="action-card" onClick={() => setShowListModal(true)}>
          <i className="bi bi-list-ul"></i>
          <h4>List of Vendors</h4>
          <p>View all registered vendors</p>
        </div>
      </div>

      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Register New Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vendor ID</Form.Label>
              <Form.Control type="text" placeholder="Auto Generated" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Vendor name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email address" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRegisterModal(false)}
          >
            Cancel
          </Button>
          <Button style={{ backgroundColor: "var(--primary-color)" }}>
            Register Vendor
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showListModal}
        onHide={() => setShowListModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Vendor List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by vendor name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <VendorList searchTerm={searchTerm} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowListModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vendor;
