import IntraAuth from '@app/auth/intra'
import IntraConn from '@app/conn/intra'
import OutlookAuth from '@app/auth/outlook'
import OutlookConn from '@app/conn/outlook'

/**
 * Create a calendar group if it doesn't exist already
 * 
 * @param {String} outlookToken outlook access token
 */
const createCalendarGroupIfNeeded = async (outlookToken) => {
    const name = 'Epitech Calendars'
    let groups
    try {
        groups = await OutlookConn.getCalendarGroups(outlookToken)
    } catch(err) {
        return Promise.reject(err)
    }

    return new Promise((resolve, reject) => {
        for (let group of groups) {
            if (group.Name == name)
                return resolve(group)
        }
        OutlookConn.createCalendarGroup(outlookToken, name)
            .then(resolve)
            .catch(reject)
    })
}

/**
 * Create calendar if it doesn't exist already
 * 
 * @param {Array} outlookToken outlook access token
 * @param {Array} intraToken intra token
 * @param {String} groupId calendar group ID
 */
const createCalendarIfNeeded = async (outlookToken, intraToken, groupId) => {
    const name = intraToken.login.substr(0, intraToken.login.indexOf('@'))
    let calendars
    try {
        calendars = await OutlookConn.getCalendars(outlookToken, groupId)
    } catch (err) {
        return Promise.reject(err)
    }

    for (let calendar of calendars) {
        if (calendar.Name == name)
            return Promise.resolve(calendar)
    }
    return OutlookConn.createCalendar(outlookToken, name, groupId)
}

/**
 * Synchronize an intranet account with Outlook Calendar
 * 
 * @param {Object} intraToken intranet token
 */
const synchronizeAccount = async (intraToken, outlookToken) => {
    let calendar
    let intraEvents
    let outlookEvents
    try {
        // retrieve calendar group
        const group = await createCalendarGroupIfNeeded(outlookToken)

        // retrieve calendar
        calendar = await createCalendarIfNeeded(outlookToken, intraToken, group.Id)
        
        // retrieve events
        intraEvents = await IntraConn.getEvents(intraToken, 7 * 4)
        outlookEvents = await OutlookConn.getEvents(outlookToken, 7 * 4, calendar.Id)
    } catch(err) {
        return Promise.reject(err)
    }

    // create events if they do not exist yet
    return Promise.all(intraEvents
        .filter(intraEvent => {
            const outlookMatch = outlookEvents.find(outlookEvent => {
                return outlookEvent.Subject == intraEvent.acti_title
            })
            return !Boolean(outlookMatch)
        })
        .map(intraEvent => {
            const eventDuration = {
                hours: parseInt(intraEvent.nb_hours.substr(0, 2)),
                minutes: parseInt(intraEvent.nb_hours.substr(3, 2)),
                seconds: parseInt(intraEvent.nb_hours.substr(6, 2))
            }
            const start = new Date(intraEvent.start)
            const end = new Date(
                start.getTime()
                + eventDuration.hours * 60 * 60 * 1000
                + eventDuration.minutes * 60 * 1000
                + eventDuration.seconds * 1000
            )
            const room = intraEvent.room ? intraEvent.room.code : ''
            const link = 'https://intra.epitech.eu/module/'
                + intraEvent.scolaryear + '/'
                + intraEvent.codemodule + '/'
                + intraEvent.codeinstance + '/'
                + intraEvent.codeacti + '/'

            return OutlookConn.createEvent(
                outlookToken,
                calendar.Id,
                intraEvent.acti_title,
                start,
                end,
                room,
                `<a href="${link}">${link}</a>`
            )
        })
    )
}

/**
 * Synchronize calendars
 * Create a mirror event in a dedicated outlook calendar for each event the 
 * student is registered to in the next 4 weeks
 */
const synchronize = async () => {
    let outlookToken
    let intraTokens
    try {
        outlookToken = await OutlookAuth.getToken()
        intraTokens = await IntraAuth.getTokens()
    } catch(err) {
        return Promise.reject(err)
    }

    if (intraTokens.length == 0 || !outlookToken)
        return reject(new Error('Please authenticate'))

    return Promise.all(intraTokens.map(account => {
        return synchronizeAccount(account, outlookToken)
    }))
}

export default synchronize