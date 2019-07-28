
<script>
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
        disabled: {
            type: Boolean,
            default: false
        },
    },

    render (h, { listeners, children, props, slots }) {        
        const hasContentTag = children[0].tag !== undefined;
        const isSvg = children[0].tag === 'svg';
        
        const content = hasContentTag ? slots().default : children[0].text;

        const functionNames = Object.keys(listeners);
        const combinedFunctions = ctx => functionNames.forEach(fn => listeners[fn](ctx));

        const button = h('button', {
            ...functionNames.length && !props.disabled && { on: { click: combinedFunctions } },
            class: {
                [`button--${props.btnClass}`]: true, 
                'h-disabled': props.disabled,
                'is-svg-parent': isSvg,
            },
        }, content);

        return props.btnClass === 'success'
            ? h('transition', { props: { name: 'slide-in' } }, [
                props.showBtn ? button : null
            ])
            : button;
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

        &:hover:not(.h-disabled) {
            transform: scale(1.05);
        }

        &.h-disabled {
            cursor: not-allowed;
            opacity: .4;
        }
    }
    
    .button--primary {
        background-color: $button-color-primary;
        @include boxShadow($button-color-primary);
    }

    .button--primary.is-svg-parent {
        background: none;
        box-shadow: none;
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
        animation: slide-in .4s ease-in-out;
    }

    .slide-in-leave-active {
        animation: slide-in .4s reverse ease-in;
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