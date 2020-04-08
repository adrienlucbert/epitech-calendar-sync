import '@css/index.css'
import App from './App'
import Vue from 'vue'

new Vue({
    el: '#app',
    components: { App },
    render: (h) => h(App)
})