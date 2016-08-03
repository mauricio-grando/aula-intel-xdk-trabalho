alert('caiu');

var db = new WebSqlDB(sucesso, erro);

function sucesso() {
    console.log("sucesso DB");
}

function erro(error) {
    console.log("Erro de DB: " + error);
}