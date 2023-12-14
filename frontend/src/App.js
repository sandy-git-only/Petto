import { Routes, Route, Navigate  } from "react-router-dom";
import { React, useState, useEffect} from "react";
import { Header, Footer, FloatingButton, GlobalStyle, AppContainer,ContentContainer } from "./components";
import { Home } from "./pages/HomePage.js";
import { HomeShelter } from "./pages/HomeShelterPage.js";
import {PetDetail} from "./pages/PetDetailPage.js";
import { QueryClient, QueryClientProvider } from "react-query";
import { PetCreate } from "./pages/PetCreatePage.js";
import { PetMissing } from "./pages/PetMissingPage.js"
import { PetFound } from "./pages/PetFoundPage.js";
import { LogIn } from "./pages/LogInPage.js"
import { Register } from "./pages/RegisterPage.js"
import {AuthContext} from "./utils/contexts.js";
import { getAuthToken, getMe } from "./utils/token.js";
import { Members } from "./pages/MemberPage.js"
import  GPS  from "./pages/GpsPage.js"

const queryClient = new QueryClient();
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // 以 getAuthToken 從 localStorage 讀取 token
    // console.log("getAuthToken",getAuthToken)
    const token = getAuthToken();
    if (!token) {
      return;
    } else {
      getMe().then((response) => {
        if (response) {
          setUser(response.userID);
        }
      }).catch((error) => {
        console.error('Error fetching user profile:', error);
      });
    }
  }, []);
  console.log(user);
  return (
    <AuthContext.Provider value={{user, setUser}}>
    <QueryClientProvider client={queryClient}>
      <AppContainer>
        <GlobalStyle />
        <Header />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shelters" element={<HomeShelter />} />
            <Route path="/pets/details/:id" element={<PetDetail />} />
            <Route path="/pets/create" element={user ? <PetCreate /> : <Navigate to="/users/login" />} />
            <Route path="/pets/missing" element={user ? <PetMissing />: <Navigate to="/users/login" />} />
            <Route path="/pets/found" element={user ? <PetFound />: <Navigate to="/users/login" />} />
            <Route path="/users/login" element={<LogIn />} />
            <Route path="/users/register" element={<Register />} />
            <Route path="/members/*" element={<Members />} />
            <Route path="/pets/gps" element={<GPS />} />
            {/* <Route path="/pets/category/:category" element={<CategoryPage />} /> */}
            {/* 
              
              <Route path="/cart" element={<CartProvider><OrderProvider><CheckoutPage /></OrderProvider></CartProvider>} />
              <Route path="/thankyou" element={<CartProvider><ThankYouPage /></CartProvider>} /> */}
          </Routes>
        </ContentContainer>
        <Footer />
      </AppContainer>
      <FloatingButton />
    </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
