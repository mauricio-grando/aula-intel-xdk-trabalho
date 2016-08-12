// inicializa um objeto contendo os dados do banco
var WebSqlDB = function (successCallback, errorCallback) {

    this.initializeDatabase = function (successCallback, errorCallback) {

        var self = this;

        // Open/create the database
        this.db = window.openDatabase("easymarketday", "1.0", "EasyMarketDay DB", 4 * 1024 * 1024);

        // WebSQL databases are tranaction based so all db querying must be done within a transaction
        this.db.transaction(
            function (tx) {
                self.createTables(tx);
                self.addSampleData(tx);
            },
            function (error) {
                console.log('Transaction error: ' + error);
                if (errorCallback) errorCallback();
            },
            function () {
                console.log('InitializeDatabases complete');
                if (successCallback) successCallback();
            }
        );
    };

    this.createTables = function (tx) {
        var sqlSuperMercado =
            " create table if not exists super_mercado ( " +
            "     codmer integer primary key autoincrement not null, " +
            "     nomemercado varchar(60) not null, " +
			"     fotmer text not null, " +
            "     ativo integer not null " +
            " ) ";
        var sqlProduto =
            " create table if not exists produto ( " +
            "     codprod integer primary key autoincrement not null, " +
            "     nomeprod varchar(45) not null, " +
            "     descprod varchar(100) not null, " +
            "     fotprod text, " +
            "     codmer integer not null, " +
            "     preco real not null, " +
            "     catprod varchar(50) not null, " +
            "     ativo integer not null " +
            " ) ";
        var sqlCompras =
            " create table if not exists compras ( " +
            "     codcomp integer primary key autoincrement not null, " +
            "     codmer integer not null, " +
            "     datcomp datetime, " +
            "     codlistaprod integer not null " +
            " ); ";
        var sqlComprasProdutos =
            " create table if not exists compras_produtos ( " +
            "     codlistaprod integer primary key autoincrement not null, " +
            "     codprod integer not null, " +
            "     quantprod integer not null, " +
            "     precoprod real not null, " +
            "     totalprod real not null " +
            " ); ";
		var sqlCategoriaProduto =
            " create table if not exists categorias_produto ( " +
            "     codcat integer primary key autoincrement not null, " +
            "     nomecat integer not null " +
            " ); ";

        tx.executeSql(sqlSuperMercado, null,
            function () { // Success callback
                console.log('SuperMercado -> DB Tables created succesfully');
            },
            function (tx, error) { // Error callback
                alert('Create table super_mercado error: ' + error.message);
            });
        tx.executeSql(sqlProduto, null,
            function () {
                console.log('Produto -> DB Tables created succesfully');
            },
            function (tx, error) {
                alert('Create table produto error: ' + error.message);
            });
        tx.executeSql(sqlCompras, null,
            function () {
                console.log('Compras -> DB Tables created succesfully');
            },
            function (tx, error) {
                alert('Create table compras error: ' + error.message);
            });
        tx.executeSql(sqlComprasProdutos, null,
            function () {
                console.log('ComprasProdutos -> DB Tables created succesfully');
            },
            function (tx, error) {
                alert('Create table compras_produtos error: ' + error.message);
            });
		tx.executeSql(sqlCategoriaProduto, null,
            function () {
                console.log('CategoriaProduto -> DB Tables created succesfully');
            },
            function (tx, error) {
                alert('Create table categorias_produto error: ' + error.message);
            });
    };
	
	this.addSampleData = function (tx) {
		// Array of objects
        var categorias = [
			{
                "codcat": 1,
                "nomecat": "Frios"
            },
			{
                "codcat": 2,
                "nomecat": "Bebidas"
            },
			{
                "codcat": 3,
                "nomecat": "Hortifruti"
            },
			{
                "codcat": 4,
                "nomecat": "Grãos"
            },
			{
                "codcat": 5,
                "nomecat": "Limpeza"
            },
			{
                "codcat": 6,
                "nomecat": "Doces"
            },
			{
                "codcat": 7,
                "nomecat": "Carnes"
            },
			{
                "codcat": 8,
                "nomecat": "Embutidos"
            },
			{
                "codcat": 9,
                "nomecat": "Padaria"
            },
			{
                "codcat": 10,
                "nomecat": "Utensílios de Cozinha"
            },
			{
                "codcat": 11,
                "nomecat": "Talheres"
            },
			{
                "codcat": 12,
                "nomecat": "Toalhas"
            },
			{
                "codcat": 12,
                "nomecat": "Caseiros"
            },
			{
                "codcat": 13,
                "nomecat": "Biscoitos"
            }			
		];
		
		var cat = categorias.length;

        var sqlT = "INSERT OR REPLACE INTO categorias_produto " +
            " (codcat, nomecat) VALUES (?, ?)";
			
		var c;

        // Loop through sample data array and insert into db
        for (var i = 0; i < cat; i++) {
            c = categorias[i];
            tx.executeSql(sqlT, [c.codcat, c.nomecat],
                function () { // Success callback
                    console.log('DEBUG - 4. Sample data DB insert success');
                },
                function (tx, error) { // Error callback
                    alert('INSERT error: ' + error.message);
                });
        }
	 };

    this.findProdutosBySuperMercado = function (codmer, callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT p.codprod as codprod, p.nomeprod as nomeprod, p.descprod as descricaoprod, p.fotprod as fotprod, p.preco as preco, m.nomemercado as nomemercado, c.nomecat as nomecat, m.codmer as codmer, c.codcat as codcat " +
				" FROM produto p INNER JOIN super_mercado m INNER JOIN categorias_produto c " +
				" WHERE p.codmer = ? AND p.catprod = c.codcat AND p.codmer = m.codmer AND p.ativo = 1 ORDER BY p.nomeprod ASC;";
                tx.executeSql(sql, [codmer], function (tx, results) {
                    var len = results.rows.length,
                        produtos = [],
                        i = 0;
                    for (; i < len; i++) {
                        produtos[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(produtos);
                });
            },
            function (tx, error) {
                alert("findProdutosBySuperMercado Error: " + error.message);
            }
        );
    };

    this.findSuperMercadosAll = function (callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM super_mercado WHERE ativo = 1 ORDER BY nomemercado ASC";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length,
                        supermercados = [],
                        i = 0;
                    for (; i < len; i++) {
                        supermercados[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(supermercados);
                });
            },
            function (tx, error) {
                alert("findSuperMercadosAll Error: " + error.message);
            }
        );
    };
	
	this.findCategoriasAll = function (callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM categorias_produto ORDER BY nomecat ASC";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length,
                        categorias = [],
                        i = 0;
                    for (; i < len; i++) {
                        categorias[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(categorias);
                });
            },
            function (tx, error) {
                alert("findCategoriasAll Error: " + error.message);
            }
        );
    };
	
	this.findProdutoById = function (codprod, callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM produto WHERE codprod = ?";
				tx.executeSql(sql, [codprod], function (tx, results) {
                    // This callback returns the first results.rows.item if rows.length is 1 or return null
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function (tx, error) {
                alert("findProdutoById Error: " + error.message);
            }
        );
    };
	
	this.findProdutosAll = function (callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT p.codprod as codprod, p.nomeprod as nomeprod, p.descprod as descricaoprod, p.fotprod as fotprod, p.preco as preco, m.nomemercado as nomemercado, c.nomecat as nomecat, m.codmer as codmer, c.codcat as codcat " +
				" FROM produto p INNER JOIN super_mercado m INNER JOIN categorias_produto c " +
				" WHERE p.catprod = c.codcat AND p.codmer = m.codmer AND p.ativo = 1 ORDER BY p.nomeprod ASC;";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length,
                        produtos = [],
                        i = 0;
                    for (; i < len; i++) {
                        produtos[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(produtos);
                });
            },
            function (tx, error) {
                alert("findProdutosAll Error: " + error.message);
            }
        );
    };

    this.findCompras = function (callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT c.datcomp as datacompra, s.nommercado as nomemercado, c.codlistaprod as codlistaprod" +
                    "FROM compras c INNER JOIN supermercados s WHERE c.codmer = s.codmer ORDER BY c.datcomp DESC;";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length,
                        comprasmercado = [],
                        i = 0;
                    for (; i < len; i++) {
                        comprasmercado[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(comprasmercado);
                });
            },
            function (tx, error) {
                alert("findCompras Error: " + error.message);
            }
        );
    };

    this.findProdutosCompras = function (codlistaprod, callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT p.nomeprod as nomeprod, p.preco as preco, p.fotprod as fotoprod, " + "cp.quantprod as quantprod, cp.precoprod as precoprod, cp.total as total " +
                    "FROM compras_produtos cp INNER JOIN produtos p " +
                    "WHERE cp.codlistaprod = ? and cp.codpro = p.codpro;";
                tx.executeSql(sql, [codlistaprod], function (tx, results) {
                    var len = results.rows.length,
                        produtoscompras = [],
                        i = 0;
                    for (; i < len; i++) {
                        produtoscompras[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(produtoscompras);
                });
            },
            function (tx, error) {
                alert("findProdutosCompras Error: " + error.message);
            }
        );
    };

    this.insertSuperMercado = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "INSERT INTO super_mercado (nomemercado, fotmer, ativo) VALUES (?, ?, ?)";
				alert(parsedJson.fotmer);
                tx.executeSql(sql, [parsedJson.nomemercado, parsedJson.fotmer, parsedJson.ativo], function (tx, result) {
                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    this.updateSuperMercado = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "UPDATE super_mercado SET nomemercado=?, ativo=? WHERE codmer=?";
                tx.executeSql(sql, [parsedJson.nomemercado, parsedJson.ativo, parsedJson.codmer], function (tx, result) {
                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    // um supermercado não pode ser removido, apenas desativado pois existem referencias de compras
    this.deleteSuperMercado = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "UPDATE super_mercado SET ativo = 0 WHERE codmer=?";
                tx.executeSql(sql, [parsedJson.codmer], function (tx, result) {
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    this.insertProduto = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "INSERT INTO produto (nomeprod, descprod, fotprod, codmer, preco, catprod, ativo) VALUES( ? , ? , ? , ? , ? , ? , 1)";
                tx.executeSql(sql, [parsedJson.nomeprod, parsedJson.descprod, parsedJson.fotprod, parsedJson.codmer, parsedJson.preco, parsedJson.catprod], function (tx, result) {
                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    this.updateProduto = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "UPDATE produto SET nomeprod=?, descprod=?, fotprod=?, preco=?, catprod=?, codmer=? WHERE codprod=?";
                tx.executeSql(sql, [parsedJson.nomeprod, parsedJson.descprod, parsedJson.fotprod, parsedJson.preco, parsedJson.catprod, parsedJson.codmer, parsedJson.codprod], function (tx, result) {
                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    // um produto não pode ser removido, apenas desativado pois existem referencias de compras
    this.deleteProduto = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "UPDATE produto SET ativo = 0 WHERE codprod=?";
                tx.executeSql(sql, [parsedJson.codprod], function (tx, result) {
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    // o retorno é o result para poder pegar o id inserido e depois usar no vínculo com a compra
    this.insertComprasProdutos = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "INSERT INTO codprod (codprod, quantprod, precoprod, totalprod) VALUES (?, ?, ?, ?)";
                tx.executeSql(sql, [parsedJson.codprod, parsedJson.quantprod, parsedJson.precoprod, parsedJson.totalprod], function (tx, result) {
                    // If results rows
                    callback(result);
                });
            }
        );
    };

    this.insertCompra = function (json, callback) {
        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);
        this.db.transaction(
            function (tx) {
                var sql = "INSERT INTO compras (codmer, datcomp, codlistaprod) VALUES (?, ?, ?)";
                tx.executeSql(sql, [parsedJson.codmer, parsedJson.datcomp, parsedJson.codlistaprod], function (tx, result) {
                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    };

    // inicializando base de dados
    this.initializeDatabase(successCallback, errorCallback);

};