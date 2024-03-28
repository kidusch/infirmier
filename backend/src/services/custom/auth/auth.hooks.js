
async function attachUserIdAndSessionIdToConnectionData(context) {
    const { user, session } = context.result
    context.socket.data.userId = user.id
    context.socket.data.sessionId = session.id
}

async function addToAuthenticatedChannel(context) {
    context.app.joinChannel('authenticated', context.socket)
}

async function afterCheckAndExtendExpiration(context) {
    const expireAt = context?.socket.data.expireAt
    if (expireAt) {
        const now = new Date()
        const expireAtDate = new Date(expireAt)
        if (now > expireAtDate) {
            // expiration date is met: clear connection data
            context.socket.data = {}
            context.result = true
        } else {
            context.result = false
        }
    } else {
        context.result = undefined
    }
}

async function beforeGetTimeLeftBeforeExpiration(context) {
    const expireAt = context?.socket.data.expireAt
    if (expireAt) {
        const now = new Date()
        const expireAtDate = new Date(expireAt)
        const ms = expireAtDate - now
        if (!ms) console.log('!!!!!!', now, expireAtDate)
        context.result = ms
    } else {
        context.result = undefined
    }
}

function logoutAfter(context) {
    // clear connection data
    context.socket.data = {}
    // leave all rooms except socket#id
    const rooms = new Set(context.socket.rooms)
    for (const room of rooms) {
        if (room === context.socket.id) continue
        context.socket.leave(room)
    }
}


export default {
    after: {
        login: [attachUserIdAndSessionIdToConnectionData, addToAuthenticatedChannel],
        logout: [logoutAfter],
        getTimeLeftBeforeExpiration: [beforeGetTimeLeftBeforeExpiration],
        checkAndExtendExpiration: [afterCheckAndExtendExpiration],
    },
}
