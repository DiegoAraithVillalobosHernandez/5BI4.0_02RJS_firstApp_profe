import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { CategoryScreen } from "../category/CategoryScreen";
import { SubcategoryScreen } from "../subcategory/SubcategoryScreen";
import { authContext } from "../auth/authContext";
import { LoginScreen } from "../auth/LoginScreen";
import { HomeScreen } from "../home/HomeScreen";
import { ContactScreen } from "../contact/ContactScreen";
import { PublicNavBar } from "../../shared/components/PublicNavBar";

export const AppRouter = () => {
  const { user } = useContext(authContext);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginScreen />} />
        <Route
          path="/*"
          element={
            !user.logged ? (
              <>
                {/**Navbar Público */}
                <PublicNavBar/>
                <Container>
                  <Route path={"/home"} element={<HomeScreen />} />
                  <Route path={"/contact"} element={<ContactScreen />} />
                  <Route path={"/"} element={<HomeScreen />} />
                  <Route path={"*"} element={<div>Error 404</div>}/>
                </Container>
              </>
            ) : (
              <>
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
                    </Nav>
                  </Container>
                </Navbar>
                <Container>
                  <Route path={"/"} element={<CategoryScreen />} />
                  <Route path="/subcategory" element={<SubcategoryScreen />} />
                </Container>
              </>
            )
          }
        />
      </Routes>
    </Router>
  );
};
