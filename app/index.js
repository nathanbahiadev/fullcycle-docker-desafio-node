const express = require("express")
const mysql = require("mysql")

const app = express()
const port = 3000

const config = {
	host: "mysql",
	user: "nodeuser",
	password: "nodepass",
	database: "nodedb"
}

const sql = {
	createTablePeople: () => "CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id))",
	insertPeople: (name) => `INSERT INTO people(name) VALUES('${ name }')`,
	selectPeople: () => "SELECT * FROM people",
}


app.get(["/", "/:name"], (req, res) => {
	const connection = mysql.createConnection(config)
	connection.query(sql.createTablePeople())
	
	if (req.params?.name?.trim().length) {
		connection.query(sql.insertPeople(req.params.name))
		res.redirect("/")
	} 

	else {
		connection.query(sql.selectPeople(), function (_, result, _) {      		
			const peopleList = result.map(people => `<li>${people.id}: ${ people.name }</li>`).join("")
			res.send(`
				<h1>Full Cycle Rocks</h1>
				<ul>${ peopleList }</ul>
			`)
		})
	}
	
	connection.end()
})


app.listen(port, () => {
	console.log(`Executando servidor na porta ${port}`)
})

