<template>
    <div class="c-vat">
        <div class="c-vat__item">
            <b>VAT food: </b>
            <span>{{ vat['food_vat'] }}%</span>
        </div>
        <div class="c-vat__item">
            <b>VAT non food: </b>
            <span>{{ vat['non_food_vat'] }}%</span>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        vat () { return this.$store.getters['dashboard/getCurrentVat'] }
    }
}
</script>

<style lang="scss" scoped>
    .c-vat {
        display: flex;
        flex-basis: 20rem;
        justify-content: space-between;
        margin-left: 3%;
        padding: .26rem;

        &__item {
            font-size: 1.2rem;
            color: #303753;
        }
    }
</style>
