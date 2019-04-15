export default {
    beforeMount() {
        const { title = null } = this.$options;

        title && (document.title = title);
    },
}