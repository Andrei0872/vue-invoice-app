<script>
// TODO: add arrows to footer

const shouldCloseModal = (context, e) => {
    if (e.currentTarget === e.target) {
        context.parent.showDetails = false
        return;
    }
}

export default {
    name: 'modal-comp',

    functional: true,

    props: {
        showModal: Boolean
    },

    render (h, context) {
        console.log(context)

        const header = context.scopedSlots.header &&context.scopedSlots.header() || "Default header";
        const body = context.scopedSlots.body && context.scopedSlots.body() || "Default body";
        const footer = context.scopedSlots.footer && context.scopedSlots.footer() || "Default footer";
        const closeModal = h('font-awesome-icon', {
            class: 'modal__close', 
            props: { icon: 'times' },
            on: { click: context.listeners.closeModal }
        });

        const modal =  context.props.showModal 
            ? h(
                'div', { class: 'modal', on: { click: shouldCloseModal.bind(null, context) } }, [
                    h(
                        'div', { class: 'modal__container' }, [
                        h('div', { class: 'modal__header', props: { name: 'header' } }, [header, closeModal]),
                        h('div', { class: 'modal__body', props: { name: 'body' } }, body),
                        h('div', { class: 'modal__footer', props: { name: 'footer' } }, footer)
                    ])
                ]
            )
            : null;

        return h('transition', {
            props: { name: 'fade', mode: 'out-in' } },
            [modal])
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
        transition: all .3s;

        &__container {
            // TODO: media query
            width: 32rem;
            min-height: 18rem;
            background-color: #fff;
            display: flex;
            flex-flow: column nowrap;
            border-radius: 15px;
            padding: 1rem;
            transition: all .3s;

            .fade-enter &,
            .fade-leave-to & {
                transform: scale(1.1);
            }
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
            flex: 1 0 auto;
        }
    }

    .fade-leave-to, .fade-enter {
        opacity: 0;
    }
</style>
