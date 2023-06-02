import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ListOfResult.css";

function ListOfResult() {
  // Guarda e atualiza as informações recebidas do backend.
  const [result, setResult] = useState([]);

  // Faz a solicitação das informações no backend quando a página é carrgada.
  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Detecta em qual cartão de informação estamos clicando, obém o ProductID e o envia para o backend, que será responsável por excluir os dados do bd.

  const handleDelete = (e) => {
    console.log(e.target.name);
    // Pergunta se temos certeza de que desejamos excluir as informaçõe.
    if (confirm("Tem certeza que deseja excluir estas informações?")) {
      // Se confirmar a pergunta anterior, envia as informações para o backend.
      console.log("Informação excluída");
      fetch("http://localhost:3000", {
        method: "DELETE",
        body: JSON.stringify({
          ["ProductID"]: e.target.name,
        }),
        headers: { "Content-Type": "application/json" },
      });
      // Atualiza a página para atualizar os dados do bd.
      window.location.reload();
    } else {
      console.log("Pedido de exclusão cancelado.");
    }
  };

  return (
    <div className="results">
      <h1 className="title_results">Resultados</h1>
      <section className="section_all_results">
        {result.map((item, index) => (
          <section key={index} className="section_individual_result">
            <article>
              <p className="p_results">Product Name</p>
              <p className="product_result">{item.ProductName}</p>
              <p className="p_results">Supplier ID</p>
              <p className="product_result">{item.SupplierID}</p>
              <p className="p_results">Category ID</p>
              <p className="product_result">{item.CategoryID}</p>
              <p className="p_results">Unit</p>
              <p className="product_result">{item.Unit}</p>
              <p className="p_results">Price</p>
              <p className="product_result">{item.Price}</p>
            </article>
            <div className="div_buttons_results">
              <Link to={`/modify/${item.ProductID}`}>
                <button className="modify_results">modifcar</button>
              </Link>
              <button
                name={item.ProductID}
                onClick={handleDelete}
                className="delete_results"
              >
                Excluir
              </button>
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}

export default ListOfResult;
