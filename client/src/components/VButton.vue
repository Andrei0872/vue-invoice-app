
<script>
// TODO: add class the specifies the color and other styles
export default {
    name: 'base-button',

    functional: true,
    
    props: {
        btnClass: {
            type: String,
            default: 'primary'
        },
        showBtn: {
            type: Boolean
        },
    },

    render (h, { listeners, children, props }) {
        const content = children[0].text;

        const button = h('button', {
            ...{ hasToggleEvent: !!listeners.toggleState }.hasToggleEvent 
                && { on: { click: listeners.toggleState } },
            class: `button--${props.btnClass}`
        }, content);

        return props.btnClass === 'success'
            ? h('transition', { props: { name: 'slide-in' } }, [
                props.showBtn ? button : null
            ])
            : button;

        // return props.btnClass === 'success'
        //     ? (
        //         <transition name="slide-in">
        //         { props.showBtn ? button : null }
        //         </transition>
        //     )
        //     : button
    }
}
</script>

<style lang="scss" scoped>
    $button-color-primary: darken($color: #394263, $amount: 5%);
    $button-color-shadow: darken($color: #394263, $amount: 15%);
    $button-color-success: #08A045;
    $button-color-danger: #DD4132;

    @mixin boxShadow ($c) {
        box-shadow: 1px 2px 3px darken($c,15%);
    }

    button {
        padding: 8px;
        display: inline-block;
        color: #fff;
        border-radius: 15px;
        min-width: 1rem;
        height: 40px;
        outline: none;
        border: none;
        cursor: pointer;
        letter-spacing: 1px;
        font-size: 1rem;

        &:hover {
            transform: scale(1.05);
        }
    }
    
    .button--primary {
        background-color: $button-color-primary;
        @include boxShadow($button-color-primary);
    }

    .button--danger {
        background-color: $button-color-danger;
        @include boxShadow($button-color-danger);
    }

    .button--success {
        background-color: $button-color-success;
        @include boxShadow($button-color-success);
        transition: all .4s linear;
    }

    /* Transitions */

    .slide-in-enter-active {
        animation: slide-in .4s;
    }

    .slide-in-leave-active {
        animation: slide-in .4s reverse;
    }

    .slide-in-leave-to, .slide-in-enter {
        opacity: 0;
    }

    @keyframes slide-in {
        from {
            margin-left: -6rem;
        }
    }
</style>