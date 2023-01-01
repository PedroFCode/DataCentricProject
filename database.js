const pmysql = require('promise-mysql');

pmysql.createPool({
    connectionLimit: 3,
    host: "localhost",
    port: '3308',
    user: "root",
    password: "password",
    database: "proj2022",
    authMethod: 'mysql_native_password'
})
    .then(p => {
        pool = p;
    })
    .catch(e => {
        console.log("pool error: " + e)
    })

module.exports = {
    getEmployees: function () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM employee')
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    updateEmployee: function (eid, data) {
        return new Promise((resolve, reject) => {
            pool.query(`UPDATE employee SET
            ename = '${data.ename}',
            role = '${data.role}',
            salary = ${data.salary}
            WHERE eid LIKE(\"${eid}\")`)
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })

    },

    getDept: function () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM dept')
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    deleteDept: function (did) {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM dept WHERE did like(\"${did}\")`)
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })

    }
}