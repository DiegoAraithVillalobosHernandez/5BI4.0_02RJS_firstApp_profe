import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import * as yup from "yup";
import { useFormik } from "formik";
import Alert, {
  msjConfirmacion,
  titleConfirmacion,
  msjError,
  titleError,
  msjExito,
  titleExito,
} from "../../../shared/plugins/alert";
import axios from "../../../shared/plugins/axios";

export const CategoryUpdate = ({
  isOpenU,
  handleClose,
  setCategories,
  categories,
  category,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: category.description,
      id: category.id,
      status: {
        id: category.status.id,
        description: category.status.description,
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
        preConfirm: () => {
          return axios({
            url: "/category/",
            method: "PUT",
            data: JSON.stringify(values),
          })
            .then((response) => {
              console.log(response);
              if (!response.error) {
                //Operador spreed (...) regresa los objetos de dada clase
                let categoryUpdated = {
                  description: values.description,
                  id: values.id,
                  status: {
                    id: category.status.id,
                    description: category.status.description,
                  },
                };
                let categoriesTemp = categories.filter(
                  (it) => it.id != category.id
                );
                console.log([...categoriesTemp, categoryUpdated]);
                setCategories([...categoriesTemp, categoryUpdated]);
                handleCloseForm();
                Alert.fire({
                  title: titleExito,
                  text: msjExito,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: "#198754",
                  icon: "success",
                });
              }
            })
            .catch((error) => {
              Alert.fire({
                title: titleError,
                text: msjError,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#198754",
                icon: "error",
              });
            });
        },
        backdrop: true,
        allowOutsideClick: !Alert.isLoading,
      });
    },
  });

  const statusChange = (category) => {
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
      backdrop: true,
      allowOutsideClick: !Alert.isLoading,
      preConfirm: () => {
        let categoryUpdated = {};
        if (category.status.description === "Activo") {
          categoryUpdated = {
            ...category,
            status: { id: 2, description: "Inactivo" },
          };
        } else {
          categoryUpdated = {
            ...category,
            status: { id: 1, description: "Activo" },
          };
        }

        return axios({
          url: "/category/",
          method: "PUT",
          data: JSON.stringify(categoryUpdated),
        })
          .then((response) => {
            if (response.error) {
              Alert.fire({
                title: titleError,
                text: msjError,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#198754",
                icon: "error",
              });
            } else {
              let categoriesTemp = categories.filter(
                (it) => it.id != category.id
              );
              setCategories([...categoriesTemp, categoryUpdated]);
              Alert.fire({
                title: titleExito,
                text: msjExito,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#198754",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  };

  const handleCloseForm = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Modal show={isOpenU} onHide={handleCloseForm}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Nombre</Form.Label>
            <Form.Control
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <Form.Control
              name="id"
              type="hidden"
              value={formik.values.id}
              onChange={formik.handleChange}
            />
            {formik.errors.description ? (
              <span className="error-text">{formik.errors.description}</span>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-4">
            <Row>
              <Col className="text-end">
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleCloseForm}
                >
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
