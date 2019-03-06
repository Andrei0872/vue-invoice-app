
<script>
export default {
    name: 'headerComp',
    functional: true,
    render (h, { children }) {
        const headerTitle = h('div', { class: 'header__title' }, children[0].text);
        
        return h('div', { class: 'header' }, [headerTitle])
    }
}
</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;

        &__title {
            font-size: 1.3rem;
            color: darken($color: #fff, $amount: 10%);
        }
    }
</style>
