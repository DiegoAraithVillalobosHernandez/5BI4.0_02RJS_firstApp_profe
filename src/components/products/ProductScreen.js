import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTableCustom } from "../../shared/components/DataTableCustom";
import { Badge, Card, Row, Col } from "react-bootstrap";
import axios from "../../shared/plugins/axios";
import { ButtonCircle } from "../../shared/components/ButtonCircle";
import Alert, {
  titleConfirmacion,
  titleError,
  titleExito,
  msjConfirmacion,
  msjError,
  msjExito,
} from "../../shared/plugins/alert";
import { ProductForm } from "./components/ProductForm";
import { ProductDetails } from "./components/ProductDetails";

export const ProductScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [productSelected, setProductSelected] = useState({});

  const columns = [
    {
      name: "#",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Nombre",
      selector: (row) => row.name, //nos sirve para buscar
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Categoría",
      selector: (row) => row.subcategory?.category?.description, //Navegacion segura ?, ignora si el objeto tiene atributos nulos
      sortable: true,
    },
    {
      name: "Subcategoría",
      selector: (row) => row.subcategory?.description,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.status?.description,
      sortable: true,
      cell: (row) =>
        row.status?.description === "Activo" ? (
          <Badge pill bg="success">
            Activo
          </Badge>
        ) : (
          <Badge pill bg="danger">
            Inactivo
          </Badge>
        ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <ButtonCircle
            type={"btn btn-circle btn-info me-1"}
            icon="search"
            onClickFunct={() => {
                setProductSelected(row);
                setIsDetailsOpen(true);
            }}
            size={18}
          />
          <ButtonCircle
            type={"btn btn-circle btn-warning me-1"}
            icon="edit"
            onClickFunct={() => {}}
            size={18}
          />
          <ButtonCircle
            type={
              row.status?.description === "Activo"
                ? "btn btn-circle btn-danger"
                : "btn btn-circle btn-success"
            }
            icon={
              row.status?.description === "Activo" ? "trash-2" : "check-circle"
            }
            onClickFunct={() => {
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
                  let status =
                    row.status?.description === "Activo"
                      ? { id: 2, description: "Inactivo" }
                      : { id: 1, description: "Activo" };
                  let statusProduct = {
                    ...row,
                    status: status,
                    file: row.fileBase64,
                  };
                  return axios({
                    url: "/product/",
                    method: "PUT",
                    data: JSON.stringify(statusProduct),
                  })
                    .then((response) => {
                      console.log(response);
                      if (!response.error) {
                        setProducts((products) => [
                          statusProduct,
                          ...products.filter((it) => it.id !== row.id),
                        ]);
                        Alert.fire({
                          title: titleExito,
                          text: msjExito,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: "#198754",
                          icon: "success",
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
            }}
            size={18}
          />
        </>
      ),
    },
  ];

  const getProducts = () => {
    axios({
      url: "/product/",
      method: "GET",
    })
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    document.title = "MP | Productos";
    getProducts();
  }, []);

  return (
    <Card className="mt-5">
      <Card.Header as={"h5"}>
        <Row className="mt-1">
          <Col>Products</Col>
          <Col className="text-end">
            <ProductForm
              getProducts={getProducts}
              isOpen={isCreating}
              handleClose={() => setIsCreating(false)}
            />
            <ProductDetails
              isOpen={isDetailsOpen}
              handleClose={setIsDetailsOpen(false)}
              {...productSelected}
            />
            <ButtonCircle
              type={"btn btn-circle btn-success"}
              icon={"plus"}
              size={24}
              onClickFunct={() => {
                setIsCreating(true);
              }}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTableCustom
          columns={columns}
          data={products}
          isLoading={isLoading}
        />
      </Card.Body>
    </Card>
  );
};

/*import axios from "axios";
import React, {useState, useEffect} from "react";
import { Card, Col, Row } from "react-bootstrap";
import { ButtonCircle } from "../../shared/components/ButtonCircle";
import { DataTableCustom } from "../../shared/components/DataTableCustom";

export default function ProductScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    axios({
      url: "/product/",
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => <div>{index + 1}</div>,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getProducts();
  }, []);

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Row>
              <Col>Productos</Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-success btn-circle"}
                  onClickFunct={() => {}}
                  icon="plus"
                  size={20}
                />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTableCustom
              columns={columns}
              data={products}
              isLoading={isLoading}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
*/
