<template>
    <a :href="href" @click="openTab" v-bind="$attrs" v-on="$listeners">
        <slot></slot>
    </a>
</template>

<script>
export default {
    name: 'chrome-link',
    props: {
        href: {
            type: String
        }
    },
    methods: {
        openTab() {
            if (this.$props.href !== undefined) {
                chrome.tabs.create({ url: this.$props.href })
            }
        }
    }
}
</script>