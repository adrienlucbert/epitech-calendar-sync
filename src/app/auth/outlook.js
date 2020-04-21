import { getTimestamp } from '@app/utils/time'
import { outlookConfig } from '@app/config'

/**
 * Outlook authenticator
 * @class
 */
class OutlookAuth
{
    /**
     * Retrieves Outlook service access token
     * 
     * @param {Boolean} fetchIfNecessary if token cannot be retrieved from cloud 
     * storage, it will be fetched from Office365
     */
    static getToken(fetchIfNecessary = false) {
        /**
         * Build an URL
         */
        const getURL = () => {
            const conf = outlookConfig()
            // Build URL from parameters
            const url = conf.base + '?' + Object.entries(conf.params)
                .map(entry => {
                    return (entry[0] + '=' + entry[1])
                })
                .join('&')
            return (url)
        }

        /**
         * Parse a url to extract query parameters (separated with #, ? and &)
         * 
         * @param {String} url url to parse
         */
        const extractQueryParams = (url) => {
            const queryData = {
                base: '',
                params: {}
            }
            url.split('&').forEach((param, id) => {
                let pair = param.split('=')
                if (id == 0) {
                    let tmp = pair[0].split(/[\?#]/)
                    queryData.base = tmp[0]
                    pair[0] = tmp[tmp.length - 1]
                }
                queryData.params[pair[0]] = decodeURIComponent(pair[1])
            })
            return (queryData)
        }

        return new Promise((resolve, reject) => {
            // Try retrieving token from chrome storage
            // If obsolete, generate a new one
            chrome.storage.sync.get(['outlookToken'], async (result) => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                }
                const tokenData = result['outlookToken']
                const isValid = (tokenData !== undefined && tokenData.end > getTimestamp())
                if (isValid) {
                    resolve(tokenData)
                } else {
                    if (tokenData !== undefined) {
                        await this.disconnect()
                    }
                    if (fetchIfNecessary) {
                        await generateToken()
                    } else {
                        resolve(null)
                    }
                }
            })

            /**
             * Parse web auth call response to extract and return token
             * 
             * @param {String} callbackURL url returned from web auth call
             */
            const webAuthCallback = (callbackURL) => {
                const queryData = extractQueryParams(callbackURL)
                const tokenData = {
                    end: getTimestamp(queryData.params['expires_in']),
                    token: queryData.params['access_token']
                }
                chrome.storage.sync.set({ 'outlookToken': tokenData }, () => {
                    if (chrome.runtime.lastError !== undefined) {
                        reject(chrome.runtime.lastError)
                    } else {
                        resolve(tokenData)
                    }
                })
            }

            /**
             * Generate a new access token by connecting with Office365
             */
            const generateToken = () => {
                try {
                    chrome.identity.launchWebAuthFlow({
                        url: getURL(),
                        interactive: true
                    }, webAuthCallback)
                } catch(err) {
                    reject(err)
                }
            }
        })
    }

    /**
     * Connects to Office365
     */
    static connect() {
        // TODO: get Office365 account login to display

        return (this.getToken(true))
    }

    /**
     * Deletes token from storage (doesn't actually disconnect from Office365)
     */
    static disconnect() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(['outlookToken'], () => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                }
            })
        })
    }
}

export default OutlookAuth