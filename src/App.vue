<template>
    <main class="app">
        <h1>Epitech Calendar Sync</h1>
        <p class="block subtitle">
            Synchronize multiple Epitech intranet calendars with Outlook Calendar
        </p>
        <section class="block">
            <h2>Synchronize calendars</h2>
            <p class="block">
                Synchronize your Outlook Calendar with all linked Epitech intranet calendars.
            </p>
            <button v-if="intra.accounts.length > 0 && outlook.account"
                class="button small warning" @click="synchronize">Synchronize calendars</button>
            <button v-else disabled title="Please link accounts to synchronize"
                class="button small warning disabled">Synchronize calendars</button>
            <img v-if="isSynchronizing"
                style="height:1.5em;vertical-align:middle" :src="loaderImage" alt="loading..."/>
            <p v-if="resultStr" class="small" style="margin-top:.5em">{{ resultStr }}</p>
        </section>
        <section class="block">
            <h2>Epitech intranet</h2>
            <p class="block">
                To connect an Epitech intranet account, copy and paste your autologin 
                link from <chrome-link href="https://intra.epitech.eu/admin/autolog">intra.epitech.eu/admin/autolog</chrome-link>.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="account in intra.accounts" :key="account.id">
                        <td>{{ account.login.substr(0, account.login.indexOf('@')) }}</td>
                        <td><button class="fullwidth button small danger" @click="intraDisconnect(account.login)">Remove</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" placeholder="enter an autologin..." ref="autologinInput"/></td>
                        <td><button class="fullwidth button small primary" @click="intraConnect">Link</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="block">
            <h2>Outlook Calendar</h2>
            <p class="block">
                Link your Outlook Calendar account with Office365.
            </p>
            <table>
                <tbody>
                    <tr v-if="outlook.account">
                        <td>Account linked</td>
                        <td><button class="fullwidth button small danger" @click="outlookDisconnect">Remove</button></td>
                    </tr>
                    <tr v-else>
                        <td><button class="fullwidth button small primary" @click="outlookConnect">Connect with Office365</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>

<script>
import IntraAuth from '@app/auth/intra'
import OutlookAuth from '@app/auth/outlook'
import IntraConn from '@app/conn/intra'
import OutlookConn from '@app/conn/outlook'
import synchronize from '@app/sync/sync'
import ChromeLink from '@components/chrome-link'
import loaderImage from '@assets/loader.svg'

export default {
    name: 'App',
    components: {
        ChromeLink
    },
    data() {
        return {
            intra: {
                accounts: []
            },
            outlook: {
                account: null
            },
            loaderImage: loaderImage,
            isSynchronizing: false,
            resultStr: null,
            resultType: null
        }
    },
    methods: {
        /**
         * Synchronize calendars (mirror intranets to Outlook)
         */
        synchronize() {
            this.isSynchronizing = true
            synchronize()
                .then(res => {
                    this.resultType = 'primary'
                    this.resultStr = 'Sync successful'
                    this.isSynchronizing = false
                })
                .catch(err => {
                    console.error(err)
                    this.resultType = 'warning'
                    this.resultStr = 'Sync failed'
                    this.isSynchronizing = false
                })
        },
        /**
         * Add entry in intranet accounts list
         */
        intraConnect() {
            const autologinInput = this.$refs['autologinInput']
            const autologin = autologinInput.value

            autologinInput.value = ''
            IntraAuth.connect(autologin)
                .then(() => this.intraUpdate())
        },
        /**
         * Remove entry from intranet accounts list
         * 
         * @param {String} login login (email) of the account to remove
         */
        intraDisconnect(login) {
            IntraAuth.disconnect(login)
                .then(() => this.intraUpdate())
        },
        /**
         * Update intranet accounts list
         */
        intraUpdate() {
            IntraAuth.getTokens()
                .then(res => {
                    this.intra.accounts = res
                })
        },
        /**
         * Connect to Office365
         */
        outlookConnect() {
            OutlookAuth.connect()
                .then(() => this.outlookUpdate())
        },
        /**
         * Disconnect Office365 account
         */
        outlookDisconnect() {
            OutlookAuth.disconnect()
                .then(() => this.outlookUpdate())
        },
        /**
         * Update intranet accounts list
         */
        outlookUpdate() {
            OutlookAuth.getToken()
                .then(res => {
                    this.outlook.account = res
                })
        }
    },
    mounted() {
        this.intraUpdate()
        this.outlookUpdate()
    }
}
</script>