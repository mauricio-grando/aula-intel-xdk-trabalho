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
                // self.addSampleData(tx);
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
    };

    this.findProdutosBySuperMercado = function (codmer, callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM produtos WHERE codmer=? ORDER BY catprod ASC";
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
                var sql = "SELECT * FROM super_mercados ORDER BY nommercado ASC";
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
                var sql = "INSERT INTO super_mercado (nomemercado, ativo) VALUES (?, ?)";
                tx.executeSql(sql, [parsedJson.nomemercado, parsedJson.ativo], function (tx, result) {
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
                var sql = "UPDATE produto SET nomeprod=?, descprod=?, fotprod=?, preco=?, catprod=? WHERE codprod=?";
                tx.executeSql(sql, [parsedJson.nomeprod, parsedJson.descprod, parsedJson.fotprod, parsedJson.preco, parsedJson.catprod, parsedJson.codprod], function (tx, result) {
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
                var sql = "UPDATE produtos SET ativo = 0 WHERE codprod=?";
                tx.executeSql(sql, [parsedJson.codmer], function (tx, result) {
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