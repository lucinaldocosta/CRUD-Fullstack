import FormData from "../Components/FormData";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

function RouteData() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "83.9vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FormData />
        <button
          style={{ width: "20%", margin: "0 auto" }}
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
      <Footer />
    </>
  );
}

export default RouteData;
