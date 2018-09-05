const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');

module.exports = {
  entry: function(msg, con){
    var today = helper.date(new Date());

    let type = msg.content.split(' ')[1];
    let id = msg.author.id;
    let url = '';
    let currencies = '';
    let res = 0;
    let statement = '';

    if (type == 'dash') {
      let num = Number(msg.content.split(' ')[2]);
      if (!isNaN(num) && num < 10) {
        let loodash = [0, 5, 10, 20, 20, 30, 40, 50, 60];
        let loydash = [0, 0, 0, 0, 10, 15, 20, 25, 30];

        type += ' ' + msg.content.split(' ')[2];
        url = msg.content.split(' ')[3];

        let loototal = 10 + loodash[num-1];
        res = helper.insertCurr(id, con, 'loonole', loototal);
        currencies += loototal + ' loonoles'
        statement += 'You got ' + currencies;

        let and = '';
        if (num == 4) {
          and += ' and ' + loydash[num] + ' loys';
        }
        if (num > 4) {
          let loytotal = loydash[num-1];
          res = helper.insertCurr(id, con, 'loy', loytotal);
          currencies += ', ' + loytotal + ' loys';
          statement += ' and ' + loytotal + ' loys';
          if (num < 9) {
            and += ' and ' + loydash[num] + ' loys';
          }
          else {
            and += ' and ' + loydash[num-1] + ' loys';
          }
        }

        statement += '!';
        if (num < 9) {
          statement += ' Next dash task will give you ' + (10 + loodash[num]) + ' loonoles' + and + '.';
        }
        else {
          statement += ' Next dash task will give you ' + (10 + loodash[num-1]) + ' loonoles' + and + '.';
        }
      }
      else {
        res = 1;
      }
    }
    else if (type == 'other') {
      let currtype = '';
      let amount = 0;
      if (msg.content.split('[').length == 2 && msg.content.split('] ').length == 2) {
        url = msg.content.split('] ')[1];
        currencies = (msg.content.split('[')[1]).split(']')[0];
        if ((currencies.split(' ')).length == 2) {
          currtype = currencies.split(' ')[1];
          if (helper.checkCurr(currtype) >= 0) {
            amount = Number(currencies.split(' ')[0]);
            if (isNaN(amount)) {
              res = 1;
            }
            else {
              helper.insertCurr(id, con, currtype, amount);
            }
          }
          else {
            res = 1;
          }
        }
        else {
          let currs = currencies.split(', ');
          for (j = 0; j < currs.length; j++) {
            currtype = currs[j].split(' ')[1];
            res = helper.checkCurr(currtype);
            if (res < 0) {
              res = 1;
              break;
            }
            amount = Number(currs[j].split(' ')[0]);
            if (isNaN(amount)) {
              res = 1;
              break;
            }
          }
          if (res == 0) {
            for (i = 0; i < currs.length; i++) {
              currtype = currs[i].split(' ')[1];
              amount = Number(currs[i].split(' ')[0]);
              helper.insertCurr(id, con, currtype, amount);
            }
          }
        }
        if (res == 0) {
          statement += 'Added ' + currencies + '.';
        }
      }
    }
    else {
      res = 1;
    }

    if (res == 1) {
      msg.channel.send('Entry unsuccessful, something went wrong...');
    }
    else {
      access.logByID(msg.author.id, con, function(logs) {
        let logI = logs.length + 1;
        let sql = 'INSERT INTO sublog VALUES(' + logI + ', "' + id + '", "' + type + '", "' + currencies + '", "' + url + '", "' + today + '")';
        con.query(sql);
        msg.channel.send(statement);
      });
    }
  },

  convert: function(msg, con) {
    var today = helper.date(new Date());

    let conversions = [5, 6, 5, 4, 5, 5, 5, 2, 3, 2, 3, 1];
    let num = Number(msg.content.split(' ')[1]);
    let num2 = 0;
    let res = 0;
    let id = msg.author.id;
    let type1 = '';
    let type2 = '';
    let statement = '';

    if (!isNaN(num) && num % 5 == 0) {
      type1 = msg.content.split(' ')[2];

      if (helper.checkCurr(type1) == 0 || helper.checkCurr(type1) == 6) {
        let t1 = helper.checkCurr(type1);
        type2 = msg.content.split(' ')[4];

        if (t1 == 0 && helper.checkCurr(type2) < 6 && helper.checkCurr(type2) != -1) {
          let t2 = helper.checkCurr(type2);
          num2 = conversions[t2] * (num/5);
        }
        else if (t1 == 6 && helper.checkCurr(type2) > 6) {
          let t2 = helper.checkCurr(type2);
          num2 = conversions[t2] * (num/5);
        }
        else {
          res = 1;
          statement = 'Currency you\'re converting to doesn\'t exist.'
        }
      }
      else {
        res = 1;
        statement = 'Currency you\'re converting from doesn\'t exist.'
      }
    }
    else {
      res = 1;
      statement = 'Number has to be divisible by 5.'
    }

    if (res == 0) {
      helper.insertCurr(id, con, type1, -Math.abs(num));
      helper.insertCurr(id, con, type2, num2);
      access.logByID(id, con, function(logs) {
        let logI = logs.length + 1;
        let currencies = String(num) + ' ' + type1 + ' to ' + num2 + ' ' + type2;
        let type = 'conversion';
        let sql = 'INSERT INTO sublog VALUES(' + logI + ', "' + id + '", "' + type + '", "' + currencies + '", "-", "' + today + '")';
        con.query(sql);
        msg.channel.send('You converted ' + currencies + '.');
      });
    }
    else {
      msg.channel.send(statement);
    }
  },

  lose: function(msg, con) {
    if (msg.content.split('[').length == 2 && msg.content.split(']').length == 2) {
      var today = helper.date(new Date());
      let currencies = (msg.content.split('[')[1]).split(']')[0];
      if (currencies != '') {
        let url = msg.content.split('] ')[1];
        let take = 0;
        let res = 0;
        let id = msg.author.id;

        if ((currencies.split(' ')).length == 2) {
          currtype = currencies.split(' ')[1];
          if (helper.checkCurr(currtype) >= 0) {
            amount = Number(currencies.split(' ')[0]);
            if (isNaN(amount)) {
              res = 1;
            }
            else {
              take -= amount;
              helper.insertCurr(id, con, currtype, take);
            }
          }
          else {
            res = 1;
          }
        }
        else {
          let currs = currencies.split(', ');
          for (j = 0; j < currs.length; j++) {
            currtype = currs[j].split(' ')[1];
            res = helper.checkCurr(currtype);
            if (res < 0) {
              res = 1;
              break;
            }
            amount = Number(currs[j].split(' ')[0]);
            if (isNaN(amount)) {
              res = 1;
              break;
            }
          }
          if (res == 0) {
            for (i = 0; i < currs.length; i++) {
              currtype = currs[i].split(' ')[1];
              amount = Number(currs[i].split(' ')[0]);
              take -= amount;
              helper.insertCurr(id, con, currtype, take);
              take = 0;
            }
          }
        }
        if (res == 1) {
          msg.channel.send('Entry unsuccessful, something went wrong...');
        }
        else {
          statement = 'Lost ' + currencies + '.';
          access.logByID(id, con, function(logs) {
            let logI = logs.length + 1;
            let sql = 'INSERT INTO sublog VALUES(' + logI + ', "' + id + '", "loss", "' + currencies + '", "' + url + '", "' + today + '")';
            con.query(sql);
            msg.channel.send(statement);
          });
        }
      }
    }
  },

  log: function(msg, con) {
    let statement = 'Bank Log - ' + msg.author.username + '\n\n';
    access.logByID(msg.author.id, con, function(logs){
      if (logs.length == 0) {
        statement += 'No entries.';
      }
      else {
        for (i = 0; i < logs.length; i++) {
          if (logs[i].proof.startsWith('http')) {
            statement += '<' + logs[i].proof + '>';
          }
          else {
            statement += logs[i].proof;
          }
          statement += '  ||  ' + logs[i].type + '  ||  ';
          if (logs[i].type == 'loss') {
            statement += '- (' + logs[i].currencies + ')\n';
          }
          else {
            statement += logs[i].currencies + '\n';
          }
        }
      }
      msg.channel.send(statement);
    })
  }
}
