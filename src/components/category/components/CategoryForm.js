import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import * as yup from "yup";
import { useFormik } from "formik";
import Alert, {
    msjConfirmacion, titleConfirmacion, 
    msjError, titleError,
    msjExito, titleExito} from "../../../shared/plugins/alert"
import axios from "../../../shared/plugins/axios";

export const CategoryForm = ({ isOpen, handleClose, setCategories }) => {
  const formik = useFormik({
    initialValues: {
      description: "",
      status: {
        id: 1,
        description: "Activo",
      },
    },
    validationSchema: yup.object().shape({
      description: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: (values) => {
      Alert.fire({
        title: titleConfirmacion,
        text: msjConfirmacion,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#198754",
        cancelButtonColor: "#dc3545",
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        icon: "warning",
        preConfirm: () =>{
          return axios({url: "/category/", method: "POST", data: JSON.stringify(values)})
          .then ((response) =>{
            console.log(response)
            if (!response.error){//Operador spreed (...) regresa los objetos de dada clase
              setCategories(categories => [...categories, response.data])
              Alert.fire({
                title: titleExito,
                text: msjExito,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#198754",
                icon: "success"
              })
            }
          }).catch((error)=>{
            Alert.fire({
              title: titleError,
              text: msjError,
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#198754",
              icon: "error"
            })
          })
        },
        backdrop: true,
        allowOutsideClick: !Alert.isLoading,
      })
    },
  });

  const handleCloseForm = () => {
    formik.resetForm();
    handleClose()
  }

  return (
    <Modal show={isOpen} onHide={handleCloseForm}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Nombre</Form.Label>
            <Form.Control
              name="description"
              placeholder="Gaming"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.errors.description ? (
              <span className="error-text">{formik.errors.description}</span>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-4">
            <Row>
              <Col className="text-end">
                <Button variant="danger" type="button" onClick={handleCloseForm}>
                  <FeatherIcon icon={"x"} />
                  &nbsp; Cerrar
                </Button>
                <Button
                  variant="success"
                  className="ms-3"
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <FeatherIcon icon={"check"} />
                  &nbsp; Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
