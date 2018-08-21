const access = require('./access.js');

module.exports = {
  checkCurr: function(type) {
    let types = ['loonole',
                 'ladarka',
                 'colozian',
                 'pippik',
                 'carashean',
                 'mordial',
                 'loy',
                 'myur',
                 'moyn',
                 'wreyn',
                 'wyar',
                 'zeyl'
               ];
    for (i = 0; i < types.length; i++) {
      if (type == types[i] || type == types[i]+'s') {
        return 0;
      }
    }
    return 1;
  },
  insertCurr: function(id, con, type, amount) {
    access.playerByID(id, con, function(player) {
      if (player.length == 1) {
        let total = amount;
        let sql = '';
        switch (type) {
          case 'loonoles':
          case 'loonole':
              total += player[0].loonole;
              type = 'loonole';
              break;
          case 'ladarka':
          case 'ladarkas':
              total += player[0].ladarka;
              type = 'ladarka';
              break;
          case 'colozian':
          case 'colozians':
              total += player[0].colozian;
              type = 'colozian';
              break;
          case 'pippik':
          case 'pippiks':
              total += player[0].pippik;
              type = 'pippik';
              break;
          case 'carashean':
          case 'carasheans':
              total += player[0].carashean;
              type = 'carashean';
              break;
          case 'mordial':
          case 'mordials':
              total += player[0].mordial;
              type = 'mordial';
              break;
          case 'loy':
          case 'loys':
              total += player[0].loy;
              type = 'loy';
              break;
          case 'myur':
          case 'myurs':
              total += player[0].myur;
              type = 'myur';
              break;
          case 'moyn':
              total += player[0].moyn;
              type = 'moyn';
              break;
          case 'wreyn':
          case 'wreyns':
              total += player[0].wreyn;
              type = 'wreyn';
              break;
          case 'wyar':
          case 'wyars':
              total += player[0].wyar;
              type = 'wyar';
              break;
          case 'zeyl':
          case 'zeyls':
              total += player[0].zeyl;
              type = 'zeyl';
              break;
        }

        sql = 'UPDATE player SET ' + type + ' = ' + total + ' WHERE playerID = "' + id + '"';
        con.query(sql);
      }
    })
  },
  date: function(date) {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0'+dd
    }

    if (mm < 10) {
        mm = '0'+mm
    }

    return yyyy + '-' + mm + '-' + dd;
  }
}
