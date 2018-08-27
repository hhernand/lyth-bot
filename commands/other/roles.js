module.exports = {
  assign: function(msg){
    let type = msg.content.split(' ')[1];
    if (type == 'customs') {
      msg.member.addRole('483425658077446163');
      msg.channel.send(msg.author + ' You now have the customs role.');
    }
    else if (type == 'seeking') {
      msg.member.addRole('483426748822978570');
      msg.channel.send(msg.author + ' You now have the seeking role.');
    }
    else if (type == 'gift') {
      msg.member.addRole('483427545404932119');
      msg.channel.send(msg.author + ' You now have the gift role.');
    }
    else {
      msg.channel.send(msg.author + ' That role doesn\'t exist or you can\'t give yourself that role.');
    }
  }
}
