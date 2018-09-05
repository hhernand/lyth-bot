const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');

module.exports = {
  register: function(msg, con) {
    let id = msg.author.id;
    access.playerByID(id, con, function(player){
      if (player.length == 0) {
        let sql = 'INSERT INTO player VALUES ("' + id + '", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)';
        con.query(sql);
        msg.channel.send('You have been registered! Use !profile to see your info.');
      }
    })
  },
  prof: function(msg, con) {
    access.playerByID(msg.author.id, con, function(player) {
      if (player.length == 0) {
        msg.channel.send('You haven\'t registered yet! Please register so your currencies can be set up.')
      }
      else {
        let spaces = ['  ', ' ', ''];
        let space = [
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0],
          spaces[0]
        ]

        if (player[0].loonole > 9) {
          space[0] = spaces[1];
          if (player[0].loonole > 99) {
            space[0] = spaces[2];
          }
        }
        if (player[0].ladarka > 9) {
          space[1] = spaces[1];
          if (player[0].ladarka > 99) {
            space[1] = spaces[2];
          }
        }
        if (player[0].colozian > 9) {
          space[2] = spaces[1];
          if (player[0].colozian > 99) {
            space[2] = spaces[2];
          }
        }
        if (player[0].pippik > 9) {
          space[3] = spaces[1];
          if (player[0].pippik > 99) {
            space[3] = spaces[2];
          }
        }
        if (player[0].carashean > 9) {
          space[4] = spaces[1];
          if (player[0].carashean > 99) {
            space[4] = spaces[2];
          }
        }
        if (player[0].mordial > 9) {
          space[5] = spaces[1];
          if (player[0].mordial > 99) {
            space[5] = spaces[2];
          }
        }
        if (player[0].loy > 9) {
          space[6] = spaces[1];
          if (player[0].loy > 99) {
            space[6] = spaces[2];
          }
        }
        if (player[0].myur > 9) {
          space[7] = spaces[1];
          if (player[0].myur > 99) {
            space[7] = spaces[2];
          }
        }
        if (player[0].moyn > 9) {
          space[8] = spaces[1];
          if (player[0].moyn > 99) {
            space[8] = spaces[2];
          }
        }
        if (player[0].wreyn > 9) {
          space[9] = spaces[1];
          if (player[0].wreyn > 99) {
            space[9] = spaces[2];
          }
        }
        if (player[0].wyar > 9) {
          space[10] = spaces[1];
          if (player[0].wyar > 99) {
            space[10] = spaces[2];
          }
        }
        if (player[0].zeyl > 9) {
          space[11] = spaces[1];
          if (player[0].zeyl > 99) {
            space[11] = spaces[2];
          }
        }

        let header = 'Player Profile - ' + msg.author.username;
        let currencies = 'Loonole:   ' + space[0] + player[0].loonole   + '   Loy:   ' + space[6] + player[0].loy + '\n' +
                         'Ladarka:   ' + space[1] + player[0].ladarka   + '   Myur:  ' + space[7] + player[0].myur + '\n' +
                         'Colozian:  ' + space[2] + player[0].colozian  + '   Moyn:  ' + space[8] + player[0].moyn + '\n' +
                         'Pippik:    ' + space[3] + player[0].pippik    + '   Wreyn: ' + space[9] + player[0].wreyn + '\n' +
                         'Carashean: ' + space[4] + player[0].carashean + '   Wyar:  ' + space[10] + player[0].wyar + '\n' +
                         'Mordial:   ' + space[5] + player[0].mordial   + '   Zeyl:  ' + space[11] + player[0].zeyl;
        let info = '```' + header + '\n\n' + 'Currencies and Energies\n\n' + currencies + '```';
        msg.channel.send(info);
      }
    });
  },
  clears: function(msg, con) {
    let id = msg.author.id;
    access.logByID(id, con, function(logs){
      if ((msg.content.split(' ')).length == 2) {
        if (msg.content.split(' ')[1] == 'last') {
          let take = 0;
          let currencies = logs[logs.length-1].currencies;
          let l = logs[logs.length-1].type;
          if (l == 'conversion') {
            let ts = [currencies.split(' ')[1], currencies.split(' ')[4]];
            let nums = [Number(currencies.split(' ')[0]), (take-Number(currencies.split(' ')[3]))];
            for (i = 0; i < 2; i++) {
              helper.insertCurr(id, con, ts[i], nums[i]);
            }
          }
          else {
            if ((currencies.split(' ')).length == 2) {
              currtype = currencies.split(' ')[1];
              amount = Number(currencies.split(' ')[0]);
              if (l == 'loss') {
                take += amount;
              }
              else {
                take -= amount;
              }
              helper.insertCurr(id, con, currtype, take);
            }
            else {
              let currs = currencies.split(', ');
              for (i = 0; i < currs.length; i++) {
                currtype = currs[i].split(' ')[1];
                amount = Number(currs[i].split(' ')[0]);
                if (l == 'loss') {
                  take += amount;
                }
                else {
                  take -= amount;
                }
                helper.insertCurr(id, con, currtype, take);
                take = 0;
              }
            }
          }

          let sql = 'DELETE FROM sublog WHERE logID = ' + logs.length + ' AND playerID = "' + id + '"';
          con.query(sql);
          msg.channel.send('Last entry has been undone.');
        }
        else if (msg.content.split(' ')[1] == 'all') {
          let sql = 'DELETE FROM sublog WHERE logID < ' + (logs.length+1) + ' AND playerID = "' + id + '"';
          let sql2 = 'UPDATE player SET loonole = 0, ladarka = 0, colozian = 0, pippik = 0, carashean = 0, mordial = 0, ' +
                     'loy = 0, myur = 0, moyn = 0, wreyn = 0, wyar = 0, zeyl = 0 WHERE playerID = "' + id + '"';
          con.query(sql);
          con.query(sql2);
          msg.channel.send('Logs cleared and profile currencies set to 0.');
        }
      }
    })
  }
}
