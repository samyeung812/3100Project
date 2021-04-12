module.exports = {
    inQueue,
    inQueueById,
    enqueuePlayer,
    dequeuePlayer
};

var queue = new Map();

queue[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a,b) => compare(a,b));
}

function inQueue(user) {
    if(!user) return false;
    if(queue.has(user.id)) return true;
    return false;
}

function inQueueById(userId) {
    if(queue.has(userId)) return true;
    return false;
}

function enqueuePlayer(user, callback) {
    if(!user) return;
    var q = {
        user: user,
        time: new Date()
    }
    queue.set(user.id, q);
    setTimeout(checkMatch, 10 * 1000, user, callback);
}

function dequeuePlayer(user) {
    if(!user) return;
    if(!inQueue(user)) return;
    queue.delete(user.id);
}

function compare(a, b) {
    return a[1].time.getTime() < b[1].time.getTime();
}

function checkMatch(user, callback) {
    if(!inQueue(user)) return;
    var now = new Date().getTime();
    var playerRange = Math.floor((now - queue.get(user.id).time.getTime()) / 10000) * 100;
    var match = false;
    var opponent;
    for(let [key, value] of queue) {
        if(!inQueue(value.user)) continue;
        if(key == user.id) continue;
        if(Math.abs(value.user.ranking - user.ranking) <= playerRange) {
            match = true;
            opponent = value.user;
            dequeuePlayer(user);
            dequeuePlayer(value.user);
        }
    }
    if(!match) setTimeout(checkMatch, 10 * 1000, user, callback);
    else callback(user, opponent);
}