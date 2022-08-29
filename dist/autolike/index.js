// Draws heavy inspiration from https://github.com/Izzmo/AutoAwesomer
// with some script restructuring and formatting done

$(document).ready(function () {
  if (window.ttfmplus == undefined) window.ttfmplus = {};

  window.ttfmplus = $.extend(window.ttfmplus, {
    ttObj: null,
    awesomer: null,
    lamed: false,
    vote: function (msg) {
      try {
        const f = $.sha1(
          window.ttfmplus.ttObj.roomId +
            msg +
            window.ttfmplus.ttObj.currentSong._id
        );
        const d = $.sha1(Math.random() + '');
        const e = $.sha1(Math.random() + '');
        window.ttfmplus.socket({
          api: 'room.vote',
          roomid: window.ttfmplus.ttObj.roomId,
          val: msg,
          vh: f,
          th: d,
          ph: e
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    socket: function (socketData, socketHandler) {
      if (socketData.api == 'room.now') {
        return;
      }

      socketData.msgid = turntable.messageId;
      turntable.messageId += 1;
      socketData.clientid = turntable.clientId;

      if (turntable.user.id && !socketData.userid) {
        socketData.userid = turntable.user.id;
        socketData.userauth = turntable.user.auth;
      }

      const strigifiedSocketData = JSON.stringify(socketData);
      if (turntable.socketVerbose) {
        LOG(util.nowStr() + ' Preparing message ' + strigifiedSocketData);
      }

      const deferredObj = $.Deferred();

      turntable.whenSocketConnected(function () {
        if (turntable.socketVerbose) {
          LOG(
            util.nowStr() +
              ' Sending message ' +
              socketData.msgid +
              ' to ' +
              turntable.socket.host
          );
        }

        if (turntable.socket.transport.type == 'websocket') {
          turntable.socketLog(
            turntable.socket.transport.sockets[0].id + ':<' + socketData.msgid
          );
        }

        turntable.socket.send(strigifiedSocketData);
        turntable.socketKeepAlive(true);
        turntable.pendingCalls.push({
          msgid: socketData.msgid,
          handler: socketHandler,
          deferred: deferredObj,
          time: util.now()
        });
      });

      return deferredObj.promise();
    },
    listener: function (msg) {
      // If a new song starts
      if (
        msg.command == 'newsong' &&
        msg.room.metadata.current_dj != window.turntable.user.id
      ) {
        clearTimeout(window.ttfmplus.awesomer);
        window.ttfmplus.lamed = false;
        const timeAmt = Math.floor(
          ((Math.random() * window.ttfmplus.ttObj.currentSong.metadata.length) /
            4) *
            1000
        );
        window.ttfmplus.awesomer = setTimeout(function () {
          window.ttfmplus.vote('up');
        }, timeAmt);
      }

      // Check if the user's vote went through and stop trying to awesome
      if (msg.command == 'update_votes') {
        $.each(msg.room.metadata.votelog, function () {
          if (this[0] == window.turntable.user.id) {
            window.ttfmplus.stop();
            return false;
          }
        });
      }
    },
    stop: function () {
      clearTimeout(window.ttfmplus.awesomer);
    },
    awesome: function () {
      window.ttfmplus.vote('up');
      window.ttfmplus.stop();
    },
    lame: function () {
      if (!window.ttfmplus.lamed) {
        window.ttfmplus.vote('up');
        window.ttfmplus.stop();
        window.ttfmplus.lamed = true;
      }
      setTimeout(function () {
        window.ttfmplus.vote('down');
      }, 250);
    },
    init: function () {
      console.log('Initializing Auto-Awesome.');
      $('.roomView').ready(function () {
        window.ttfmplus.ttObj = window.turntable.buddyList.room;
        if (window.ttfmplus.ttObj === null) {
          alert(
            'Could not find turntable.fm objects. You should refresh your page and try again.'
          );
          return;
        }
        window.ttfmplus.room = window.location.pathname;

        // Replaces turntables default callback for the lame button, adds our own
        $('#lame-button')
          .unbind()
          .bind('click', function () {
            window.ttfmplus.lame();
          });

        // Capture all message events and send to listener
        turntable.addEventListener('message', window.ttfmplus.listener);
        window.ttfmplus.awesome();

        // Timer for resetting Turntable's AFK Timers
        window.ttfmplus.botResetAFKTimer = setInterval(function () {
          $(window).focus();
        }, 60000);
      });
    },
    destruct: function () {
      console.log('Turning off Auto-Awesome.');
      turntable.removeEventListener('message', window.ttfmplus.listener);
      clearInterval(window.ttfmplus.botResetAFKTimer);
      window.ttfmplus.stop();
    }
  });

  const body = document.querySelector('body');

  const div_init = document.createElement('div');
  div_init.setAttribute('id', 'init_autolike');
  div_init.addEventListener('click', () => {
    window.ttfmplus.init();
  });

  const div_destruct = document.createElement('div');
  div_destruct.setAttribute('id', 'destruct_autolike');
  div_destruct.addEventListener('click', () => {
    window.ttfmplus.destruct();
  });

  body.appendChild(div_init);
  body.appendChild(div_destruct);

  console.log('Initializing tt.fm+ autolike script');
});
