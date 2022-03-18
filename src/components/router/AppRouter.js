import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Container, Nav, Navbar } from "react-bootstrap";
import { CategoryScreen } from "../category/CategoryScreen";
import { SubcategoryScreen } from "../subcategory/SubcategoryScreen";
import { AuthContext } from "../auth/authContext";
import { LoginScreen } from "../auth/LoginScreen";
import { HomeScreen } from "../home/HomeScreen";
import { ContactScreen } from "../contact/ContactScreen";
import { PublicNavBar } from "../../shared/components/PublicNavBar";
import { PrivateNavBar } from "../../shared/components/PrivateNavBar";
import ProductScreen from "../products/ProductScreen";
 
export const AppRouter = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginScreen />} />
        <Route
          path="*"
          element={
            !user.logged ? (
              <>
                {/* navBarPulbico */}
                <PublicNavBar />
                <Container>
                  <Routes>
                    <Route path={"/home"} element={<HomeScreen />} />
                    <Route path="/contact" element={<ContactScreen />} />
                    <Route path={"/"} element={<HomeScreen />} />
                    <Route path="*" element={<div>Error 404</div>} />
                  </Routes>
                </Container>
              </>
            ) : (
              <>
                <PrivateNavBar/>  
                <Container>
                  <Routes>
                    <Route path={"/category"} element={<CategoryScreen />} />
                    <Route path="/subcategory" element={<SubcategoryScreen />} />
                    <Route path={"/"} element={<ProductScreen />} />
                    <Route path="*" element={<div>Error 404</div>} />
                  </Routes>
                </Container>
              </>
            )
          }
        />
      </Routes>
    </Router>
  );
};
