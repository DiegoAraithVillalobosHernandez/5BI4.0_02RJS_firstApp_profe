import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import "../../../assets/css/custom-styles.css";
import axios from "../../../shared/plugins/axios";
import Alert, {
  titleConfirmacion,
  titleError,
  titleExito,
  msjConfirmacion,
  msjError,
  msjExito,
} from "../../../shared/plugins/alert";

export const ProductDetails = ({ 
    isOpen, 
    handleClose, 
    product,
    name,
    brand,
    description,
    images,
    quantity,
    price,
    subcategory,
    status
}) => {
  return (
      <Modal
        size="lg"
        backdrop="static"
        keyboard={false}
        show={isOpen}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>Detalles del producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group classname="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Nombre</Form.Label>
                </Col>
                <Col>
                  <Form.Label classname="form-label">Marca</Form.Label>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group classname="mb-3">
              <Form.Label classname="form-label">Description</Form.Label>
            </Form.Group>
            <Form.Group classname="mb-3">
              <Form.Label classname="form-label">Imágenes</Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Existencias</Form.Label>
                </Col>
                <Col>
                  <Form.Label classname="form-label">Precio</Form.Label>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Categoría</Form.Label>
                </Col>
                <Col>
                  <Form.Label classname="form-label">Subcategorías</Form.Label>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row className="text-end">
                <Col>
                  <Button variant="success">
                    <FeatherIcon icon={"x"} />
                    &nbsp; Cerrar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
  );
};
