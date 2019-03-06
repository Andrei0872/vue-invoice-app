<template>
    <div class="header">
        <span class="header__title">Name of the company</span>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        padding: 1%;
        display: flex;
        justify-content: center;

        &__title {
            font-size: 1.3rem;
            color: darken($color: #fff, $amount: 10%);
        }
    }
</style>
