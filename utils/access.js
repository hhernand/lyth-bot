module.exports = {
  playerByID: function(id, con, callback) {
    let sql = 'SELECT * FROM player WHERE playerID = "' + id + '"';
    con.query(sql, (err, player) => {
      if (err) throw err;
      callback(player);
    });
  },
  logByID: function(id, con, callback) {
    let sql = 'SELECT * FROM sublog WHERE playerID = "' + id + '"';
    con.query(sql, (err, logs) => {
      if (err) throw err;
      callback(logs);
    });
  }
}
