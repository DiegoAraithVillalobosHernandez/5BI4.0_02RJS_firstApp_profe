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
import { FormFloating } from "react-bootstrap";

export const ProductForm = ({ isOpen, handleClose, getProducts }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [fileBase64, setFileBase64] = useState([]);

  const getSubcategories = (category) => {
    axios({
      url: `/subcategory/category/${category}`,
      method: "GET",
    })
      .then((res) => {
        setSubcategories(res.data);
        console.log(subcategories);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      description: "",
      files: [],
      quantity: 0,
      price: 0.0,
      category: undefined,
      subcategory: undefined,
      status: {
        id: 1,
        description: "Activo",
      },
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      brand: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      description: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      files: yup.mixed().required("Seleccionar imágenes"),
      quantity: yup
        .number()
        .required("Campo obligatorio")
        .positive("Número mayor a 0"),
      price: yup
        .number()
        .required("Campo obligatorio")
        .positive("Número mayor a 0"),
      category: yup.number().required("Campo obligatorio"),
      subcategory: yup.number().required("Campo obligatorio"),
    }),
    onSubmit: (values) => {
      const product = {
        ...values,
        category: { id: parseInt(values.category) },
        subcategory: { id: parseInt(values.subcategory) },
        images: [...fileBase64],
      };
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
            url: "/product/",
            method: "POST",
            data: JSON.stringify(product),
          })
            .then((response) => {
              console.log(response);
              if (!response.error) {
                getProducts();
                Alert.fire({
                  title: titleExito,
                  text: msjExito,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: "#198754",
                  icon: "success",
                }).then((res) => {
                  if (res.isConfirmed) {
                    cancelRegistration();
                  }
                });
              }
              return response;
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

  const cancelRegistration = () => {
    formik.resetForm();
    setSubcategories([]);
    handleClose();
  };

  const handleChangeCategory = (event) => {
    const { value } = event.target;
    if (value > 0) {
      getSubcategories(value);
      formik.handleChange(event);
    } else {
      setSubcategories([]);
    }
  };

  const handleChangeFiles = (event) => {
    formik.handleChange(event);
    const { files } = event.target;
    let filesArray = Array.from(files);
    filesArray.map((item) => {
      let reader = new FileReader();
      reader.onloadend = (data) => {
        setFileBase64((files) => [
          ...files,
          {
            fileBase64: data.target.result.replace(
              /^data:image\/\w+;base64,/,
              ""
            ),
            name: "images",
          },
        ]);
      };
      reader.readAsDataURL(item);
    });
  };

  useEffect(() => {
    axios({
      url: "/category/",
      method: "GET",
    })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Modal
        size="lg"
        backdrop="static"
        keyboard={false}
        show={isOpen}
        onHide={cancelRegistration}
      >
        <Modal.Header>
          <Modal.Title>Registrar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group classname="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Nombre</Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="Taza"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.name ? (
                    <span className="error-text">{formik.errors.name}</span>
                  ) : null}
                </Col>
                <Col>
                  <Form.Label classname="form-label">Marca</Form.Label>
                  <Form.Control
                    name="brand"
                    placeholder="Razer"
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.brand ? (
                    <span className="error-text">{formik.errors.brand}</span>
                  ) : null}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group classname="mb-3">
              <Form.Label classname="form-label">Description</Form.Label>
              <Form.Control
                name="description"
                placeholder="Características del producto"
                as="textarea"
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              {formik.errors.description ? (
                <span className="error-text">{formik.errors.description}</span>
              ) : null}
            </Form.Group>
            <Form.Group classname="mb-3">
              <Form.Label classname="form-label">Imágenes</Form.Label>
              <Form.Control
                name="files"
                type="file"
                multiple
                accept="image/*"
                value={formik.values.files}
                onChange={handleChangeFiles}
              />
              {formik.errors.files ? (
                <span className="error-text">{formik.errors.files}</span>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Existencias</Form.Label>
                  <Form.Control
                    name="quantity"
                    type="number"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.quantity ? (
                    <span className="error-text">{formik.errors.quantity}</span>
                  ) : null}
                </Col>
                <Col>
                  <Form.Label classname="form-label">Precio</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.price ? (
                    <span className="error-text">{formik.errors.price}</span>
                  ) : null}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label classname="form-label">Categoría</Form.Label>
                  <Form.Select
                    aria-label="Seleccionar categoría"
                    value={formik.values.category}
                    onChange={handleChangeCategory}
                    name={"category"}
                  >
                    <option value={""}>Seleccionar</option>
                    {categories.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.description}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {formik.errors.category ? (
                    <span className="error-text">{formik.errors.category}</span>
                  ) : null}
                </Col>
                <Col>
                  <Form.Label classname="form-label">Subcategorías</Form.Label>
                  <Form.Select
                    aria-label="Seleccionar subcategoría"
                    value={formik.values.subcategory}
                    onChange={formik.handleChange}
                    name={"subcategory"}
                    disabled={subcategories.length === 0}
                  >
                    <option value={""}>Seleccionar</option>
                    {subcategories.length !== 0
                      ? subcategories.map((item) => {
                          return (
                            <option value={item.id} key={item.id}>
                              {item.description}
                            </option>
                          );
                          console.log(item);
                        })
                      : null}
                  </Form.Select>
                  {formik.errors.subcategory ? (
                    <span className="error-text">
                      {formik.errors.subcategory}
                    </span>
                  ) : null}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row className="text-end">
                <Col>
                  <Button
                    variant="danger"
                    onClick={cancelRegistration}
                    className="me-3"
                  >
                    <FeatherIcon icon={"x"} />
                    &nbsp; Cerrar
                  </Button>
                  <Button
                    variant="success"
                    type="submit"
                    disabled={!(formik.isValid && formik.dirty)}
                  >
                    <FeatherIcon icon={"check"} />
                    &nbsp; Registrar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
