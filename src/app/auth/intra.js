import IntraConn from '@app/conn/intra'

/**
 * Intra authenticator
 * @class
 */
class IntraAuth
{
    /**
     * Retrieves Intranet autologin links
     */
    static getTokens() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['intraTokens'], (result) => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                }
                const tokens = result['intraTokens'] || []
                resolve(tokens)
            })
        })
    }

    /**
     * Add an entry in intranet tokens list
     * 
     * @param {String} autologin autologin link to save
     */
    static connect(autologin) {
        /**
         * Fetch user login from intranet API
         * 
         * @param {String} autologin autologin link
         */
        const getLogin = (autologin) => {
            return new Promise((resolve, reject) => {
                IntraConn.fetch(autologin, '/user/')
                .then(json => {
                    resolve(json['login'])
                })
                .catch(reject)
            })
        }

        return new Promise(async (resolve, reject) => {
            const login = await getLogin(autologin)
            let accounts = await this.getTokens()
            let isReplaced = false
            const newAccount = {
                login: login,
                token: autologin
            }

            accounts.forEach(account => {
                if (account.login === login) {
                    account = newAccount
                    isReplaced = true
                }
            })
            if (isReplaced == false) {
                accounts.push(newAccount)
            }
            chrome.storage.sync.set({ 'intraTokens': accounts }, () => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(newAccount)
                }
            })
        })
    }

    /**
     * Deletes token from storage (doesn't actually disconnect from intranet)
     * 
     * @param {String} login login of account to disconnect
     */
    static disconnect(login) {
        return new Promise(async (resolve, reject) => {
            let accounts = await this.getTokens()

            accounts = accounts.filter(account => {
                return (account.login !== login)
            })
            chrome.storage.sync.set({ 'intraTokens': accounts }, () => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                }
            })
        })
    }
}

export default IntraAuth