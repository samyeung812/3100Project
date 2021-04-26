var queue = new Map(); // get user queuing state by user id

// sort user by queuing time
queue[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a,b) => compare(a,b));
}

function compare(a, b) {
    return a[1].time.getTime() < b[1].time.getTime();
}

// Check whether user is in ranking queue
function inQueue(user) {
    if(!user) return false;
    if(queue.has(user.id)) return true;
    return false;
}

// Check whether user is in ranking queue by user id
function inQueueById(userId) {
    if(queue.has(userId)) return true;
    return false;
}

// Enqueue player to ranking queue
function enqueuePlayer(user, callback) {
    if(!user) return;
    var q = {
        user: user,
        time: new Date()
    }
    queue.set(user.id, q);

    // check match in every 10 seconds
    setTimeout(checkMatch, 10 * 1000, user, callback);
}

// Dequeue player from ranking queue
function dequeuePlayer(user) {
    if(!user) return;
    if(!inQueue(user)) return;
    queue.delete(user.id);
}

// Check whether user can find opponent
function checkMatch(user, callback) {
    if(!inQueue(user)) return;

    var now = new Date().getTime();
    // opponent ranking difference will increase by 100 in every 10 seconds
    var playerRange = Math.floor((now - queue.get(user.id).time.getTime()) / 10000) * 100;
    var match = false;
    var opponent;

    for(let [key, value] of queue) {
        if(!inQueue(value.user)) continue;
        if(key == user.id) continue;

        // ranking difference within player range
        if(Math.abs(value.user.ranking - user.ranking) <= playerRange) {
            match = true;
            opponent = value.user;
            dequeuePlayer(user);
            dequeuePlayer(value.user);
            break;
        }
    }

    // check match 10 seconds later if no match
    if(!match) setTimeout(checkMatch, 10 * 1000, user, callback);
    else callback(user, opponent);
}

module.exports = {
    inQueue,
    inQueueById,
    enqueuePlayer,
    dequeuePlayer
};