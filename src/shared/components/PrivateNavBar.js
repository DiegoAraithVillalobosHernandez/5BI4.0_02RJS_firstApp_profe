import React, { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/auth/authContext";
import FeatherIcon from "feather-icons-react";

export const PrivateNavBar = () => {
    const {dispatch} = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#">
          <FeatherIcon icon="home" />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link to={"/"} className="nav-link">
            Categorías
          </Link>
          <Link to={"/subcategory"} className="nav-link">
            Subcategorías
          </Link>
          <Link to={"/products"} className="nav-link">
            Productos
          </Link>
        </Nav>
        <Button
          variant="outline-light"
          onClick={() => dispatch({ type: "LOGOUT" })}
        >
          Cerrar sesión
        </Button>
      </Container>
    </Navbar>
  );
};
