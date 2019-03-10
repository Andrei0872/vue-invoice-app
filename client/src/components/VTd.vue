<template>
    <td v-on="$listeners" :contenteditable="contentEditable" @keyup="updateState($event)">
        <slot></slot>
    </td>
</template>

<script>
export default {
    props: {
        contentEditable: {
            type: Boolean,
            default: false
        },
    },

    methods: {
        updateState (ev) {
            const content = ev.target.textContent.trim();

            this.$emit('update', content);
        },
    },
}
</script>
