const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// Cria uma conexão com o banco de dados empresa.db si esta criado, si não, esse código criará uma db com esse nome.
const db = new  sqlite3.Database("empresa.db", (err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Conexão estabelecida com sucesso.")
    }
});

// Cria uma tabela cao ela não exista no banco de dados empresa.db.

db.run(
    `CREATE TABLE IF NOT EXISTS Produtos(
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductName TEXT,
        SupplierID INTEGER,
        CategoryID INTEGER,
        Unit TEXT,
        Price FLOAT
    )`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Tabela criada com sucesso.");
        }
    }
);
  
// Realiza uma consulta de todas as informações da tabela produtos.
const search = (callback)=>{
    db.all("SELECT * FROM produtos", (err, rows)=>{
        if(err){
            console.error(err);
        }else{
            callback(rows);
        }
    });
};
// Prepara uma consulta para adicionar dados ao nosso bd.
const insertData = db.prepare(
    `INSERT INTO Produtos (ProductName, SupplierID, CategoryID, Unit, Price)
    VALUES (?, ?, ?, ?, ?)`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Dados inseridos com sucesso.");
        }
    }
);

// Prepara uma consulta para excluir dados do bd.
const deleteData = db.prepare(
    `DELETE FROM Produtos WHERE ProductID == ?`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Dados excluídos com sucesso.");
        }
    }
);

// Prepara uma consulta para modificar os dados do bd.
const modifyData = db.prepare(
    `UPDATE Produtos
      SET ProductName = ?,
          SupplierID = ?,
          CategoryID = ?,
          Unit = ?,
          Price = ?
     WHERE ProductID = ?`,
     (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Dados modificados com sucesso.");
        }
     }
);

// Agora vamos criar o servidor e trazer as informações do bd para o servidor.
const server = http.createServer((req, res)=>{
    // Para permitir os CORS e que não tenha problema en este exemplo.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Retorna todas as informações para o servidor.
    search((result)=>{
        res.write(JSON.stringify(result));
        res.end();
    });

    
    // Verifica se é uma solicitação com o método POST.
    if(req.method === "POST"){
        let body = "";
        // Recebe as informações enviadas para o servidor.
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            // Deserializa as informações.
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // Usa a consulta preparada para inserir os dados recebidos do Frontend.
            insertData.run(
                parsedBody.ProductName,
                parsedBody.SupplierID,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price
            );
            console.log("Dados criados com sucesso.");
        });

        
    // Verifica se é uma solicitação com o método DELETE.
    }else if(req.method === "DELETE"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // Usamos a consulta preparada para excluir os dados que o Frontend indicar.
            deleteData.run(parsedBody.ProductID);
            console.log("Dados excluídos com sucesso.");
        });
    // Verifica se é uma solicitação com o método PUT.
    }else if(req.method === "PUT"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // Usamos a consulta preparada para modificar os dados recebidos do Frontend.
            modifyData.run(
                parsedBody.ProductName,
                parsedBody.SupplierID,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price,
                parsedBody.ProductID
            );
            console.log("Dados modificados com sucesso.");
        });
    }

});
const port = 3000;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`)