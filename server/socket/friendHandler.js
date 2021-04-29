module.exports = (io) => {
    io.on("connection", (socket) => {

        // send friend request by usernmae
        socket.on("send-friend-request", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var target = getData(data);

            // result code: 0 for request sent, 1 for sql connection error, 2 for invalid username, 4 for blocked user,
            //              8 for being blocked, 16 friend already, 32 for pending already, 64 for become friend
            var resultCode = 0;

            var queryString1 = "SELECT userid FROM accounts where username=?;";
            var queryString2 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString3 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
            var queryString4 = "UPDATE friendship SET status=0 WHERE id1=? AND id2=?;";

            // get user id of the target user
            SQLQuery(queryString1, [target], (result, error) => {
                if(!result) {
                    resultCode |= 1;
                    socket.emit("friend-request-result", resultCode);
                    return;
                }

                // check whether target user exist
                if(!result[0]) {
                    resultCode |= 2;
                    socket.emit("friend-request-result", resultCode);
                    return;
                }

                var targetId = result[0].userid;
                var id1 = Math.min(user.id, targetId);
                var id2 = Math.max(user.id, targetId);
                var smaller = id1 == user.id;

                // check whether user adding himself
                if(id1 == id2) {
                    socket.emit("friend-request-result", 2);
                    return;
                }
                
                // get friend relationship of two users
                SQLQuery(queryString2, [id1, id2], (result, error) => {
                    if(!result) {
                        resultCode |= 1;
                        socket.emit("friend-request-result", resultCode);
                        return;
                    }
                    
                    // check whether there is relationship between users
                    if(!result[0]) {
                        // insert a new relationship if no
                        SQLQuery(queryString3, [id1, id2, smaller?1:2], (result, error) => {
                            if(!result) resultCode |= 1;
                            socket.emit("friend-request-result", resultCode);
                            if(socketIds.has(targetId)) {
                                io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                            }
                        });
                        return;
                    }
                    var status = result[0].status;

                    // update a new relationship
                    // check whether the target user is pending friend request for user
                    if((status == 1 && !smaller) || (status == 2 && smaller)) {
                        SQLQuery(queryString4, [id1, id2], (result, error) => {
                            if(!result) {
                                resultCode |= 1;
                                socket.emit("friend-request-result", resultCode);
                                return;
                            }
                            resultCode |= 64;
                            socket.emit("friend-request-result", resultCode);
                            if(socketIds.has(targetId)) {
                                io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                            }
                        });
                        return;
                    }

                    // friendship status: 0 for friend, 1 for id1 pending id2, 2 for id2 pending id1,
                    //                    3 for id1 blocked id2, 4 for id2 blocked id1, 5 for both blocked
                    // handle invalid friend request
                    if(status == 0) resultCode |= 16;
                    else if(status < 3) resultCode |= 32;
                    else if(status == 3) {
                        if(smaller) resultCode |= 4;
                        else resultCode |= 8;
                    }
                    else if(status == 4) {
                        if(smaller) resultCode |= 8;
                        else resultCode |= 4;
                    }
                    else if(status == 5) resultCode |= 12;

                    socket.emit("friend-request-result", resultCode);
                });
            });
        });

        // accept friend request by id
        socket.on("accept-friend-request", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);

            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "UPDATE friendship SET status=0 WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);
            var smaller = id1 == user.id;
            
            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;
                
                var status = result[0].status;

                // check whether user can accept friend request
                if((smaller && status == 2) || (!smaller && status == 1)) {
                    // set users to be friend
                    SQLQuery(queryString2, [id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                        if(socketIds.has(targetId)) {
                            io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                        }
                    });
                }
            });
        });

        // accept friend request by id
        socket.on("deny-friend-request", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);

            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "DELETE FROM friendship WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);
            var smaller = id1 == user.id;

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;
                
                var status = result[0].status;
                // check whether user can deny friend request
                if((smaller && status == 2) || (!smaller && status == 1)) {
                    // remove the friend request
                    SQLQuery(queryString2, [id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                        if(socketIds.has(targetId)) {
                            io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                        }
                    });
                }
            });
        });

        // cancel friend request by id
        socket.on("cancel-friend-request", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);

            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "DELETE FROM friendship WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);
            var smaller = id1 == user.id;

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;
                
                var status = result[0].status;
                // check whether user can cancel the friend request
                if((smaller && status == 1) || (!smaller && status == 2)) {
                    // remove the friend request
                    SQLQuery(queryString2, [id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                        if(socketIds.has(targetId)) {
                            io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                        }
                    });
                }
            });
        });

        // block user by id
        socket.on("block-user", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);
            
            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
            var queryString3 = "DELETE from messages WHERE (fromid=? AND toid=?) OR (fromid=? AND toid=?);";
            var queryString4 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);
            var smaller = id1 == user.id;

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result) return;
                
                // check whether there is no relationship between users
                if(!result[0]) {
                    // insert a new relationship if no
                    SQLQuery(queryString2, [id1, id2, smaller?3:4], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                    });
                    return;
                }

                var status = result[0].status;
                var newStatus = smaller ? 3 : 4;
                // update a new relationship
                if((status == 3 && !smaller) || (status == 4 && smaller)) {
                    newStatus = 5;
                }
                
                // delete all private message between two users
                SQLQuery(queryString3, [id1, id2, id2, id1], (result, error) => {
                    if(!result) return;
                });

                // update new friend relationship
                SQLQuery(queryString4, [newStatus, id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                    if(socketIds.has(targetId)) {
                        io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                    }
                });
            });
        });
        
        // block user by username
        socket.on("block-user-name", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var target = getData(data);
            
            var queryString1 = "SELECT userid FROM accounts where username=?;";
            var queryString2 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString3 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
            var queryString4 = "DELETE from messages WHERE (fromid=? AND toid=?) OR (fromid=? AND toid=?);";
            var queryString5 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";

            // get user id
            SQLQuery(queryString1, [target], (result, error) => {
                if(!result || !result[0]) return;

                var targetId = result[0].userid;
                var id1 = Math.min(user.id, targetId);
                var id2 = Math.max(user.id, targetId);
                var smaller = id1 == user.id;

                // get user friend relationship
                SQLQuery(queryString2, [id1, id2], (result, error) => {
                    if(!result) return;
                    
                    // check whether there is no relationship between users
                    if(!result[0]) {
                        // insert a new relationship if no
                        SQLQuery(queryString3, [id1, id2, smaller?3:4], (result, error) => {
                            if(!result) return;
                            socket.emit("update-friends");
                        });
                        return;
                    }

                    var status = result[0].status;
                    var newStatus = smaller ? 3 : 4;
                    // update a new relationship
                    if((status == 3 && !smaller) || (status == 4 && smaller)) {
                        newStatus = 5;
                    }
                    
                    // delete all private message between two users
                    SQLQuery(queryString4, [id1, id2, id2, id1], (result, error) => {
                        if(!result) return;
                    });

                    // update new friend relationship
                    SQLQuery(queryString5, [newStatus, id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                        if(socketIds.has(targetId)) {
                            io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                        }
                    });
                });
            });
        });
        
        // unblock user by id
        socket.on("unblock-user", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);
            
            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";
            var queryString3 = "DELETE from friendship WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);
            var smaller = id1 == user.id;

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;

                var status = result[0].status;
                
                // check whether both users blocking each other
                if(status == 5) {
                    // update new friend relationship
                    SQLQuery(queryString2, [smaller?4:3, id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                    });
                }
                // check whether users blocking target user
                else if((status == 3 && smaller) || (status == 4 && !smaller)) {
                    // remove the friend relationship
                    SQLQuery(queryString3, [id1, id2], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                    });
                }
            });
        });
        
        // unfriend user by id
        socket.on("unfriend-user", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            var targetId = getData(data);

            var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
            var queryString2 = "DELETE from messages WHERE (fromid=? AND toid=?) OR (fromid=? AND toid=?);";
            var queryString3 = "DELETE from friendship WHERE id1=? AND id2=?;";

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;
                
                // check whether users are friend
                if(result[0].status != 0) return;

                // delete private message between users
                SQLQuery(queryString2, [id1, id2, id2, id1], (result, error) => {
                    if(!result) return;
                });

                // remove friend relationship
                SQLQuery(queryString3, [id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                    if(socketIds.has(targetId)) {
                        io.sockets.sockets.get(socketIds.get(targetId)).emit("update-friends");
                    }
                });
            });
        });

        // get all friends
        socket.on("get-friends", () => {
            if(!usersInfo.has(socket.id)) return;
            var user = usersInfo.get(socket.id);

            var queryString = "SELECT a.userid, a.username, f.status, l.ranking, (SELECT COUNT(*) FROM `messages` m WHERE m.fromid=a.userid AND m.toid=? AND m.unread=1) AS unread FROM `friendship` f INNER JOIN `accounts` a ON (f.id1 = a.userid OR f.id2 = a.userid) AND (a.userid != ?) INNER JOIN `leaderboard` l ON (a.userid = l.userid) WHERE f.id1=? OR f.id2=?;";
            // get users information (userid, username, friend status, ranking, unread message)
            SQLQuery(queryString, [user.id, user.id, user.id, user.id], (result, erorr) => {
                if(!result) return;
                result.forEach(user => {
                    // set user online state
                    // 0 for offline, 1 for online, 2 for room, 3 for queue, 4 for playing
                    if(socketIds.has(user.userid)) {
                        var roomId = room.getRoomIdByUserID(user.userid);
                        if(roomId) {
                            var roomState = room.getRoomState(roomId);
                            if(roomState.start) {
                                user.state = 4;
                            } else {
                                user.state = 2;
                            }
                        } else if (ranking.inQueueById(user.userid)) {
                            user.state = 3;
                        } else {   
                            user.state = 1;
                        }
                    } else {
                        user.state = 0;
                    }
                });
                socket.emit("load-friends", JSON.stringify(result));
            });
        });

        // send private message to target user id
        socket.on("send-private-message", (data) => {
            if(!usersInfo.has(socket.id)) return;
            var user = usersInfo.get(socket.id);
            var {targetId, content} = getData(data);

            var id1 = Math.min(user.id, targetId);
            var id2 = Math.max(user.id, targetId);

            var queryString1 = "SELECT status FROM friendship WHERE id1=? AND id2=?;";
            var queryString2 = "INSERT INTO messages (fromid, toid, content) VALUES (?,?,?);"

            // get friend relationship
            SQLQuery(queryString1, [id1, id2], (result, error) => {
                if(!result || !result[0]) return;

                // check whether users are friends
                if(result[0].status != 0) return;
                
                // insert new message to private message table
                SQLQuery(queryString2, [user.id, targetId, content], (result, error) => {
                    if(!result) return;
                    socket.emit("update-private-chat", JSON.stringify({fromid: user.id, toid: targetId}));
                    if(socketIds.has(targetId)) {
                        // send message to target user
                        io.sockets.sockets.get(socketIds.get(targetId)).emit("update-private-chat", JSON.stringify({fromid: user.id, toid: targetId}));
                    }
                });
            });
        });

        // get all private message by user id
        socket.on("get-private-message", (data) => {
            if(!usersInfo.has(socket.id)) return;
            var user = usersInfo.get(socket.id);
            var targetId = getData(data);

            var queryString1 = "SELECT * FROM messages WHERE (fromid=? AND toid=?) OR (fromid=? AND toid=?) ORDER BY createdate;";
            var queryString2 = "UPDATE messages SET unread=0 WHERE fromid=? AND toid=?;";

            // get private message
            SQLQuery(queryString1, [user.id, targetId, targetId, user.id], (result, error) => {
                if(!result) return;
                socket.emit("load-private-message", JSON.stringify(result));

                // set all message as read
                SQLQuery(queryString2, [targetId, user.id], (result, error) => {
                    if(!result) return;
                });
            });
        });

        // add user to friend's room
        socket.on("spectate-friend", (targetId) => {
            if(!usersInfo.has(socket.id)) return;
            if(!room.getRoomIdByUserID(targetId)) {
                socket.emit("popup-message", JSON.stringify({title: "Spectate Result", messages: ["Room is dismissed."]}));
                return;
            }
            
            var user = usersInfo.get(socket.id);
            if(room.getRoomId(user)) return;
            if(ranking.inQueue(user)) return;

            var roomId = room.getRoomIdByUserID(targetId);

            if(!room.spectateFriend(roomId, user)) {
                socket.emit("popup-message", JSON.stringify({title: "Spectate Result", messages: ["You are not allowed to spectate."]}));
                return;
            }
            socket.join(roomId);
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        });
    });
}

const { SQLQuery } = require("../database.js");
const { usersInfo , socketIds } = require("../connection.js");
const room = require("../room.js");
const ranking = require("../ranking.js");