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

export default OutlookConn