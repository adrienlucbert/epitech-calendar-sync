import config from '@app/config'

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
        const suffix = '?format=json'
        url = prefix + url + suffix
        if (options.method === undefined) {
            options.method = 'GET'
        }
        // Insert token in request headers
        return new Promise((resolve, reject) => {
            fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    throw Error(res.statusText)
                }
            })
            .then(resolve)
            .catch(reject)
        })
    }
}

export default IntraConn