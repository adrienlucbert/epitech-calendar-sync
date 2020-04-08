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
            <table class="fullwidth">
                <tbody>
                    <tr>
                        <td>
                            <button v-if="intra.accounts.length > 0 && outlook.accounts.length > 0"
                                class="fullwidth button small warning">Synchronize calendars</button>
                            <button v-else disabled title="Please link accounts to synchronize"
                                class="fullwidth button small warning disabled">Synchronize calendars</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
                        <td><button class="fullwidth button small danger">Remove</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" placeholder="enter an autologin..."/></td>
                        <td><button class="fullwidth button small primary">Link</button></td>
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
                    <tr v-if="outlook.accounts.length > 0" :key="account.id">
                        <td>{{ outlook.accounts[0].login.substr(0, outlook.accounts[0].login.indexOf('@')) }}</td>
                        <td><button class="fullwidth button small danger">Remove</button></td>
                    </tr>
                    <tr v-else>
                        <td><button class="fullwidth button small primary">Connect with Office365</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>

<script>
import ChromeLink from '@components/chrome-link'

export default {
    name: 'App',
    components: {
        ChromeLink
    },
    data: () => {
        return {
            intra: {
                accounts: []
            },
            outlook: {
                accounts: []
            }
        }
    }
}
</script>