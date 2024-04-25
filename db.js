/*
CREATE TABLE `users` (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 password varchar(255) COLLATE utf8_unicode_ci NOT NULL,
 username varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

 */
let mysql = require('mysql2'),
    pool  = mysql.createPool({
    connectionLimit : 10,
			host            : 'localhost',
			user            : 'root',
			password        : '2#@Are_1',
			database        : 'fx'
    }), db = {
			on: function(ev, cb){
				if(ev==='pooled') this.cb=cb;
				db.connection&&cb(db.connection)
			},
			
			cb: _=>_,
			getDuplicate: function(obj) {
				  this.query(`SELECT  ${obj.fields} FROM ${obj.table} GROUP BY ${obj.fields} HAVING COUNT(id) >1;`, obj.cb||=_=>_);
			},
			user: function(id, cb) {
				this.query(`SELECT username, email FROM users WHERE id = ${mysql.escape(id)}`, cb)
			},
			/** determine whether in users database is an email or a username */
			column: col=>/@[a-z]+\.com$/.test(col) ? 'email' : 'username',
			
			query: function(query,data, cb) {
				this.on('pooled', function(conn){
					conn.query(query, data, function(){
						conn.release(),
						cb(...arguments)
					})
				})
			},
			exists: function(table, arr, cb, query){
				query = `SELECT ${arr[0]} FROM ${table} WHERE ${arr[0]} =${mysql.escape(arr[1])}`
				this.query(query, cb)
			}
		}
		
		module.exports = db,
		pool.getConnection((err, connection) => {
			if(err) throw err;
			db.cb(db.connection = connection)
			connection.connect(function(err){
				if(err) console.error('Error in connecting database...', err);
			})
		})
/**
		 * Templates called into connection.query
		 * `INSERT INTO programming_languages 
    (name, released_year, githut_rank, pypl_rank, tiobe_rank) 
    VALUES 
    ('${programmingLanguage.name}', ${programmingLanguage.released_year}, ${programmingLanguage.githut_rank}, ${programmingLanguage.pypl_rank}, ${programmingLanguage.tiobe_rank})`

		`UPDATE programming_languages 
    SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
    pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
    WHERE id=${id}` 

		`DELETE FROM programming_languages WHERE id=${id}`

		Store Procedures (created in the database)
		----------------
		DELIMITER $$
CREATE PROCEDURE `sp_search_programming_languages_by_id`(in langid int)
BEGIN
    SELECT name, githut_rank, pypl_rank, tiobe_rank, created_at
    FROM programming_languages
    where id = langid;
END $$

		 */