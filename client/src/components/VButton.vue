
<script>
export default {
    name: 'base-button',
    functional: true,
    render (h, { listeners, children }) {
        const content = children[0].text;
        
        return h('button', { on: { click: listeners.toggleState } }, content);
    }
}
</script>

<style lang="scss" scoped>
    $button-color: darken($color: #394263, $amount: 5%);
    $button-color-shadow: darken($color: #394263, $amount: 15%);

    button {
        padding: 8px;
        display: inline-block;
        background-color: $button-color;
        color: #fff;
        border-radius: 15px;
        min-width: 1rem;
        height: 40px;
        outline: none;
        border: none;
        cursor: pointer;
        letter-spacing: 1px;
        font-size: 1rem;
        box-shadow: 1px 2px 3px $button-color-shadow;

        &:hover {
            transform: scale(1.05);
        }
    }    
</style>