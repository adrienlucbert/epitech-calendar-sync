/**
 * Outlook connector
 * @class
 */
class OutlookConn
{
    /**
     * Fetch Outlook Calendar API
     * 
     * @param {String} token Office365 API access token
     * @param {String} url URL to fetch
     * @param {Object} options fetch options
     */
    static fetch(token, url, options = {}) {
        const prefix = 'https://outlook.office.com/api/v2.0/'
        url = prefix + url
        if (options.method === undefined) {
            options.method = 'GET'
        }
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        return new Promise((resolve, reject) => {
            fetch(url, options)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw Error(res.statusText)
                }
            })
            .then(res => res.value)
            .then(resolve)
            .catch(reject)
        })
    }

    /**
     * Returns a date <daysShift> days from now, to the ISO format
     * 
     * @param {Number} daysShift days to add to current date
     */
    static getDate(daysShift = 0) {
        const msPerDay = 1000 * 60 * 60 * 24
        const date = new Date(new Date().getTime() + msPerDay * daysShift)

        return (OutlookConn.formatDate(date))
    }

    /**
     * Format a date to Outlook format (ISO)
     * 
     * @param {Date} date date to format
     */
    static formatDate(date) {
        return (date.toISOString())
    }

    /**
     * Get a list of upcoming events from the Outlook Calendar
     * 
     * @param {String} token outlook access token
     * @param {Number} interval number of days from today to get events until
     */
    static getEvents (token, interval = 0, calendarId) {
        const start = OutlookConn.getDate()
        const end = OutlookConn.getDate(interval)
        let url
        if (calendarId) {
            url = `/me/calendars/${calendarId}`
        } else {
            url = '/me'
        }
        url += `/calendarview?startdatetime=${start}&enddatetime=${end}`

        return OutlookConn.fetch(token.token, url)
    }

    /**
     * Get calendar groups
     * 
     * @param {String} token outlook access token
     */
    static getCalendarGroups(token) {
        const url = `/me/calendargroups`

        return OutlookConn.fetch(token.token, url)
    }

    /**
     * Create a calendar group
     * 
     * @param {String} token outlook access token
     * @param {String} name calendar group name
     */
    static createCalendarGroup(token, name) {
        const url = `/me/calendargroups`

        return OutlookConn.fetch(token.token, url, {
            method: 'POST',
            body: JSON.stringify({
                'Name': name
            })
        })
    }

    /**
     * Get calendars
     * 
     * @param {String} token outlook access token
     * @param {String} groupId calendar group ID
     */
    static getCalendars(token, groupId) {
        let url
        if (groupId) {
            url = `/me/calendargroups/${groupId}/calendars`
        } else {
            url = '/me/calendars'
        }
    
        return OutlookConn.fetch(token.token, url)
    }

    /**
     * Create a calendar
     * 
     * @param {String} token outlook access token
     * @param {String} name calendar name
     * @param {String} groupId calendar group ID
     */
    static createCalendar(token, name, groupId) {
        let url
        if (groupId) {
            url = `/me/calendargroups/${groupId}/calendars`
        } else {
            url = '/me/calendars'
        }

        return OutlookConn.fetch(token.token, url, {
            method: 'POST',
            body: JSON.stringify({
                'Name': name
            })
        })
    }

    /**
     * Create an event
     * 
     * @param {Object} token outlook access token
     * @param {String} calendarId ID of the event's calendar
     * @param {String} subject event subject
     * @param {Date} start date of event start
     * @param {Date} end date of event end
     * @param {String} location location name
     * @param {String} body event description
     */
    static createEvent(token, calendarId, subject, start, end, location, body) {
        let url
        if (calendarId) {
            url = `/me/calendars/${calendarId}/events`
        } else {
            url = '/me/events'
        }

        return OutlookConn.fetch(token.token, url, {
            method: 'POST',
            body: JSON.stringify({
                Subject: subject,
                Start: {
                    DateTime: OutlookConn.formatDate(start),
                    TimeZone: 'Europe/Paris'
                },
                End: {
                    DateTime: OutlookConn.formatDate(end),
                    TimeZone: 'Europe/Paris'
                },
                Location: {
                    DisplayName: location || ''
                },
                Body: {
                    ContentType: 'HTML',
                    Content: body || ''
                }
            })
        })
    }
}

export default OutlookConn