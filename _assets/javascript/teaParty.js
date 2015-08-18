var app_id, authFun, bindEvent, cleart_members, click_member, clientIdToMember, close_connect, connect, elements, encodeHTML, formatTime, getLog, get_conversation, get_element, get_member, get_online_members, main, members, msgTime, originClientId, pressEnter, rerender_members_list, roomname, secret_key, sendMsg, showLog, showMsg, start, timeoutPromise;

elements = {};

app_id = void 0;

secret_key = void 0;

msgTime = void 0;

roomname = "teaParty-demo";

this.chat_demo = {};

members = [
  {
    clientId: "leancloud",
    name: "leancloud"
  }, {
    clientId: "1",
    name: "爱丽丝"
  }, {
    clientId: "2",
    name: "亚瑟王"
  }, {
    clientId: "3",
    name: "特斯拉"
  }, {
    clientId: "4",
    name: "爱因斯坦"
  }, {
    clientId: "5",
    name: "绅士君"
  }, {
    clientId: "6",
    name: "超人"
  }, {
    clientId: "7",
    name: "变态君"
  }, {
    clientId: "8",
    name: "咖啡君"
  }, {
    clientId: "9",
    name: "多啦A梦"
  }, {
    clientId: "10",
    name: "金闪闪"
  }
];

start = function(appid, secret_key) {
  AV.initialize(appid, secret_key);
  roomname = "teaParty-demo";
  app_id = appid;
  secret_key = secret_key;
  get_element();
  return get_conversation().then(function(conv_id) {
    return connect(roomname, conv_id, "leancloud").then(function(rt, room) {
      return get_member(rt, room).then(function(client_id) {
        return close_connect(rt).then(function() {
          if (client_id !== void 0) {
            return main(roomname, conv_id, client_id);
          } else {
            return showLog('该茶会人已经满了,请过会来');
          }
        });
      });
    });
  }, function(err) {
    return console.log("Error: " + error.code + " " + error.message);
  });
};

connect = function(roomname, conv_id, client_id) {
  var promise, rt;
  rt = AV.realtime({
    appId: app_id,
    clientId: roomname + ":" + client_id,
    secure: false,
    auth: authFun
  });
  promise = new AV.Promise;
  rt.on('open', function() {
    return rt.room(conv_id, function(obj) {
      if (obj) {
        return promise.resolve(rt, obj);
      } else {
        return rt.room({
          name: roomname,
          attr: {
            room_id: roomname
          },
          members: [roomname + ":leancloud"]
        }, function(obj) {
          conv_id = obj.id;
          return close_connect(rt).then(function() {
            return promise.resolve(rt, obj);
          });
        });
      }
    });
  });
  return promise;
};

close_connect = function(rt) {
  var promise;
  promise = new AV.Promise;
  rt.close();
  rt.on('close', function() {
    return promise.resolve();
  });
  return promise;
};

get_element = function() {
  elements.body = $("body");
  elements.printWall = $("#print_wall");
  elements.sendMsgBtn = $("#basic-addon2");
  elements.vister_list = $("#vister_list");
  return elements.inputSend = $("#input_send");
};

get_conversation = function() {
  var conv, promise, q;
  promise = new AV.Promise;
  conv = AV.Object.extend('_conversation');
  q = new AV.Query(conv);
  q.equalTo('attr.room_id', roomname);
  q.find({
    success: function(response) {
      var conv_id, ref;
      conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
      return promise.resolve(conv_id);
    },
    error: function() {
      return promise.reject(err);
    }
  });
  return promise;
};

bindEvent = function(rt, room) {
  elements = elements;
  elements.body.on('keydown', function(e) {
    return pressEnter(e, room);
  });
  elements.sendMsgBtn.on('click', function() {
    return sendMsg(room);
  });
  return $(document).on('click', '.member', click_member);
};

click_member = function(e) {
  return alert($(this).html());
};

rerender_members_list = function(rt, client_id, data) {
  var j, range, ref, results, vister_list;
  vister_list = elements.vister_list;
  vister_list.html("");
  range = (function() {
    results = [];
    for (var j = 0, ref = parseInt(data.length / 20); 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
    return results;
  }).apply(this);
  return _.each(range, function(i) {
    var p_data;
    p_data = data.slice(i * 20, (i + 1) * 20);
    rt.ping(p_data, function(list) {
      return _.each(list, function(d) {
        var member, name, template;
        d = originClientId(d);
        member = clientIdToMember(d);
        name = member.name;
        if (d === client_id) {
          name = member.name + "(我)";
        }
        template = '<a href="javascript:void(0)"><div class="member" >' + name + '</div></a>';
        return vister_list.append(template);
      });
    });
    if (data.length > 50) {
      return room.remove(data[1], function() {
        return showLog('人数过多驱逐出去的是', data[1]);
      });
    }
  });
};

showLog = function(msg, data, isBefore) {
  var p, printWall;
  if (data) {
    msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
  }
  printWall = $("#print_wall")[0];
  p = document.createElement('p');
  p.innerHTML = msg;
  if (isBefore) {
    return printWall.insertBefore(p, printWall.childNodes[0]);
  } else {
    return printWall.appendChild(p);
  }
};

pressEnter = function(e, room) {
  if (e.keyCode === 13) {
    return sendMsg(room);
  }
};

authFun = function(options, callback) {
  return AV.realtime._tool.ajax({
    url: 'https://gaogao.avosapps.com/sign2',
    data: {
      client_id: options.clientId,
      conv_id: options.convId,
      members: options.members,
      action: options.action
    },
    method: 'post'
  }, callback);
};

encodeHTML = function(source) {
  return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

sendMsg = function(room) {
  var inputSend, msg, printWall;
  elements = elements;
  inputSend = elements.inputSend;
  printWall = elements.printWall[0];
  msg = inputSend.val();
  if (!String(msg).replace(/^\s+/, '').replace(/\s+$/, '')) {
    alert('请输入点文字！');
    return;
  }
  return room.send({
    text: msg
  }, {
    type: 'text'
  }, function(data) {
    inputSend.val('');
    showLog('（' + formatTime(data.t) + '）  自己： ', msg);
    return printWall.scrollTop = printWall.scrollHeight;
  });
};

getLog = function(room) {
  var height, logFlag, printWall, promise;
  promise = new AV.Promise;
  elements = elements;
  printWall = elements.printWall[0];
  height = printWall.scrollHeight;
  if (logFlag) {
    return;
  } else {
    logFlag = true;
  }
  room.log({
    t: msgTime
  }, function(data) {
    var l;
    logFlag = false;
    l = data.length;
    if (l) {
      msgTime = data[0].timestamp;
      printWall.scrollTop = printWall.scrollHeight - height;
      data.reverse();
    }
    _.each(data, function(d) {
      return showMsg(d, true);
    });
    return promise.resolve();
  });
  return promise;
};

showMsg = function(data, isBefore, client_id) {
  var from, from_name, ref, text;
  text = '';
  from = data.fromPeerId;
  from_name = (ref = clientIdToMember(originClientId(from))) != null ? ref.name : void 0;
  if (data.msg.type) {
    text = data.msg.text;
  } else {
    text = data.msg;
  }
  if (data.fromPeerId === client_id) {
    from_name = '自己';
  }
  if (String(text).replace(/^\s+/, '').replace(/\s+$/, '')) {
    return showLog('（' + formatTime(data.timestamp) + '）  ' + encodeHTML(from_name) + '： ', text, isBefore);
  }
};

formatTime = function(time) {
  var date;
  date = new Date(time);
  return $.format.date(date, "yyyy-MM-dd hh:mm:ss");
};

main = function(roomname, conv_id, client_id) {
  var printWall;
  printWall = elements.printWall;
  showLog("正在加入轻飘飘的下午茶时间，请等待。。。");
  return connect(roomname, conv_id, client_id).then(function(rt, room) {
    bindEvent(rt, room);
    showLog('欢迎来到轻飘飘的下午茶时间');
    room.join(function() {
      return getLog(room).then(function() {
        printWall[0].scrollTop = printWall[0].scrollHeight;
        return showLog('已经加入，可以开始聊天。');
      });
    });
    room.receive(function(data) {
      printWall[0].scrollTop = printWall[0].scrollHeight;
      if (!msgTime) {
        msgTime = data.timestamp;
      }
      return showMsg(data);
    });
    rt.on('reuse', function() {
      return showLog("正在重新加入轻飘漂的下午茶时间");
    });
    rt.on('error', function() {
      showLog('好像有什么不对劲 请打开console 查看相关日志 ');
      return console.log(rt);
    });
    rt.on('join', function(res) {
      return _.each(res.m, function(m) {
        var member;
        if (m !== client_id) {
          member = clientIdToMember(originClientId(m));
          showLog(member.name + '加入下午茶');
          return room.list(function(data) {
            return rerender_members_list(rt, client_id, data);
          });
        }
      });
    });
    return rt.on('left', function(res) {
      return console.log(res);
    });
  });
};

cleart_members = function() {
  return room.list(function(data) {
    return room.remove(data, function() {
      return console.log("clear_members");
    });
  });
};

get_online_members = function(rt, room, opt) {
  var online_members, promise;
  if (opt == null) {
    opt = {};
  }
  online_members = [];
  promise = new AV.Promise;
  room.list(function(data) {
    var j, range, ref, results;
    range = (function() {
      results = [];
      for (var j = 0, ref = parseInt(data.length / 20); 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this);
    return _.each(range, function(i) {
      var p_data;
      p_data = data.slice(i * 20, (i + 1) * 20);
      return rt.ping(p_data, function(list) {
        _.each(list, function(d) {
          return online_members.push(d);
        });
        return promise.resolve(online_members);
      });
    });
  });
  return timeoutPromise(promise, 10000);
};

originClientId = function(client_id) {
  if (client_id !== void 0 && client_id.match(roomname) !== null) {
    return client_id.slice(roomname.length + 1);
  }
};

clientIdToMember = function(c_id) {
  var member;
  return member = _.findWhere(members, {
    clientId: c_id
  });
};

get_member = function(rt, room) {
  var promise;
  promise = new AV.Promise;
  get_online_members(rt, room).then(function(online_members) {
    var c_members, client_id, online_list, ref;
    online_list = online_members.map(function(d) {
      return originClientId(d);
    });
    c_members = _.clone(members);
    _.each(online_list, function(m) {
      var member;
      member = clientIdToMember(m);
      return c_members = _.without(c_members, member);
    });
    client_id = (ref = c_members[0]) != null ? ref.clientId : void 0;
    return promise.resolve(client_id);
  });
  return promise;
};

timeoutPromise = function(promise, ms) {
  var delayPromise, timeout_promise;
  delayPromise = function() {
    return new AV.Promise(function(resolve) {
      return setTimeout(resolve, ms);
    });
  };
  timeout_promise = delayPromise(ms).then(function() {
    return Promise.reject(new Error("请求超时"));
  });
  return AV.Promise.race([promise, timeout_promise]);
};

this.chat_demo.get_member = function() {
  return get_conversation().then(function(conv_id) {
    return connect("teaParty-demo", conv_id, "leancloud").then(function(rt, conv) {
      return get_member(rt, conv).then(function(client_id) {
        console.log(client_id);
        return close_connect(rt);
      });
    });
  });
};

this.chat_demo.get_online_members = function() {
  return get_conversation().then(function(conv_id) {
    return connect("teaParty-demo", conv_id, "leancloud").then(function(rt, conv) {
      return get_online_members(rt, conv).then(function(list) {
        console.log(list);
        return close_connect(rt);
      });
    });
  });
};

this.chat_demo.get_conversation = get_conversation;

this.chat_demo.start = start;

this.chat_demo.clear_members = cleart_members;
