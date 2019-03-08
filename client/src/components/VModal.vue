<script>
// TODO: add arrows to footer
export default {
    name: 'modal-comp',

    functional: true,

    render (h, context) {

        const header = context.scopedSlots.header &&context.scopedSlots.header() || "Default header";
        const body = context.scopedSlots.body && context.scopedSlots.body() || "Default body";
        const footer = context.scopedSlots.footer && context.scopedSlots.footer() || "Default footer";
        const closeModal = h('font-awesome-icon', {
            class: 'modal__close', 
            props: { icon: 'times' },
            on: { click: context.listeners.closeModal }
        });

        return h(
            'div', { class: 'modal' }, [h(
                'transition', { props: { name: 'modal-effect' } }, [
                    h(
                        'div', { class: 'modal__container' }, [
                        h('div', { class: 'modal__header', props: { name: 'header' } }, [header, closeModal]),
                        h('div', { class: 'modal__body', props: { name: 'body' } }, body),
                        h('div', { class: 'modal__footer', props: { name: 'footer' } }, footer)
                    ])
                ]
            )]
        );
    }
}
</script>

<style lang="scss" scoped>
    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(1, 1, 1, .6);
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        // opacity: 0;
        // display: none;

        &__container {
            // TODO: media query
            width: 32rem;
            // height: 35rem;
            min-height: 18rem;
            background-color: #fff;
            display: flex;
            flex-flow: column nowrap;
            border-radius: 15px;
            padding: 1rem;
        }

        &__header {
            display: flex;
            justify-content: space-around;
            margin-bottom: 1.2rem;
        }

        &__close {
            cursor: pointer;
        }

        &__body {
            margin-bottom: 1.2rem;
        }

        &__footer {
            margin-top: auto;
            // flex-basis: 10%;
            flex: 1 0 auto;
        }
    }

    .modal-effect-leave-to, .modal-effect-enter {
        opacity: 0;
    }

    .modal-effect-leave-active, .modal-effect-enter-active {
        transition: opacity 1s;
    }
</style>
