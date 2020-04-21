import { pad } from '@app/utils/string'

/**
 * Intra connector
 * @class
 */
class IntraConn
{
    /**
     * Fetch intranet API
     * 
     * @param {String} autologin intranet autologin link
     * @param {String} url URL to fetch
     * @param {Object} options fetch options
     */
    static fetch(autologin, url, options = {}) {
        const prefix = autologin + '/'
        const suffix = (url.indexOf('?') != -1 ? '&' : '?') + 'format=json'
        url = prefix + url + suffix
        if (options.method === undefined) {
            options.method = 'GET'
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
            .then(resolve)
            .catch(reject)
        })
    }

    /**
     * Returns a date <daysShift> days from now, to the format "yyyy-mm-dd"
     * 
     * @param {Number} daysShift days to add to current date
     */
    static getDate(daysShift = 0) {
        const msPerDay = 1000 * 60 * 60 * 24
        const date = new Date(new Date().getTime() + msPerDay * daysShift)

        return (IntraConn.formatDate(date))
    }

    /**
     * Format a date to Intranet format (YYYY-MM-DD)
     * 
     * @param {Date} date date to format
     */
    static formatDate(date) {
        const year = pad(date.getFullYear(), 4)
        const month = pad(date.getMonth() + 1, 2)
        const day = pad(date.getDate(), 2)

        return (`${year}-${month}-${day}`)
    }

    /**
     * Get a list of upcoming events from intra accounts
     * 
     * @param {String} token intra token
     * @param {Number} interval number of days from today to get events until
     */
    static getEvents(token, interval = 0) {
        const start = IntraConn.getDate()
        const end = IntraConn.getDate(interval)
        const url = `/planning/load?start=${start}&end=${end}`

        return IntraConn.fetch(token.token, url)
            .then(events => events.filter(event => event.event_registered))
    }
}

export default IntraConn