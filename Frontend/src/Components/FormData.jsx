import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/FormData.css";

function FormData() {
  // Guarda as informações do formulário para enviar ao backend.
  const [result, setResult] = useState([]);
  const [dataToInsert, setDataToInsert] = useState({
    ProductName: "",
    SupplierID: "",
    CategoryID: "",
    Unit: "",
    Price: "",
  });
  const [redirected, setRedirected] = useState(false);

  const navigate = useNavigate();

  //   Faz a solicitação das informações no backend quando a página é carregada.
  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);

        // Procura o item com o mesmo ProductID que o pathname.
        const foundItem = data.find(
          (item) => window.location.pathname === `/modify/${item.ProductID}`
        );

        if (foundItem) {
          setDataToInsert((prevState) => ({
            ...prevState,
            ...foundItem,
          }));
        } else {
          // Se não encontrar o item, redireciona para a página principal.
          if (!redirected) {
            setRedirected(true);
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Envia as informações para o backend quando o botão de enviar é clicado.
  const handleSubmit = (e) => {
    const foundItem = result.find(
      (item) => window.location.pathname === `/modify/${item.ProductID}`
    );
    if (foundItem) {
      fetch("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify(dataToInsert),
        headers: { "Content-Type": "application/json" },
      });
      navigate("/");
    } else {
      fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify(dataToInsert),
        headers: { "Content-Type": "application/json" },
      });
    }
  };
  // Armazena as informações no estado conforme são digitados.
  const handleChange = (e) => {
    setDataToInsert({
      ...dataToInsert,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form_div">
      <form onSubmit={handleSubmit} className="form">
        <input
          className="form_input"
          type="text"
          value={dataToInsert.ProductName}
          name="ProductName"
          onChange={handleChange}
          placeholder="Product Name"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.SupplierID}
          name="SupplierID"
          onChange={handleChange}
          placeholder="Supplier ID"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.CategoryID}
          name="CategoryID"
          onChange={handleChange}
          placeholder="Category ID"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="text"
          value={dataToInsert.Unit}
          name="Unit"
          onChange={handleChange}
          placeholder="Unit"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.Price}
          name="Price"
          onChange={handleChange}
          placeholder="Price"
          required
          autoComplete="none"
        />
        <button className="form_button">Save</button>
      </form>
    </div>
  );
}

export default FormData;
