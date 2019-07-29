<script>

const beforeDetroy = () => {
    console.log('beforeDetroy');
}

export default {
    functional: true,
    
    props: {
        title: {
            type: String,
            required: true,
        },

        shouldDisplayModal: {
            type: Boolean,
            default: true,
        },

        currentIndex: Number,

        closeModal: Function,
    },

    render (h, { props, scopedSlots }) {
        const modalBoxAttrs = { ...props.currentIndex > 0 && { style: { 'top': `${props.currentIndex * 6}rem` } } };
        const onModalClose = props.closeModal;

        const modalTitle = <div class="c-modal-box__title" key={props.title}>{props.title}</div>

        const defaultModalContent = (
            <div 
                class="h-icon-wrapper"
                onClick={onModalClose.bind(null, props.title)}
            >
            <font-awesome-icon icon="times" />
          </div>
        );
        
        const modalContent = (
            <div class="c-modal-box__content">
                {
                    scopedSlots.content
                        ? scopedSlots.content
                        : defaultModalContent
                }
            </div>
        );

        const modalBox = (
            <transition onBeforeLeave={beforeDetroy} name="slide-up" appear>
                {
                    props.shouldDisplayModal
                        ? <div {...modalBoxAttrs} class="c-modal-box">{modalTitle}{modalContent}</div>
                        : null
                }
            </transition>
        );

        return modalBox;
    }
}
</script>

<style lang="scss" scoped>
    .c-modal-box {
        max-height: 7em;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 5px rgba(0,0,0,0.23);
        position: absolute;
        width: 20rem;
        background-color: #fff;
        top: 2rem;
        left: 50%;

        &__title,
        &__content {
            width: 100%;
            height: 100%;
        }

        &__title {
            text-align: center;
            font-weight: bold;
            padding: .3rem;
        }

        &__content {
            height: 1rem;
            max-height: 100%;
            display: flex;
            justify-content: center;
        }
    }

    .slide-up-enter, .slide-up-leave-to {
        transform: translateY(-10rem);
    }

    .slide-up-enter-active, .slide-up-leave-active {
        transition: all .5s;
    }
</style>
