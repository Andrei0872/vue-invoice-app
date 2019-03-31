
<script>
export default {
    functional: true,
    
    props: {
        cardInfo: Object
    },

    render (h, { props: {cardInfo: { icon, title, value } } }) {
        return (
            <div class="card">
                <div class="card__icon">
                    <font-awesome-icon icon={icon} />
                </div>
                <div class="card__info">
                    <div class="card__title"><strong>{title}</strong></div>
                    <div class="card__value">{value}</div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="scss" scoped>
    .card {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        transition: all .3s;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
        }

        &__icon {
            width: 60px;
            height: 60px;
            background-color: #394263;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 1.2rem;
        }

        &__card {
            display: flex;
            justify-content: column;
        }
    }
</style>