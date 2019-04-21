<template functional>
    <table class="table">
        <thead>
            <tr>
                <th v-for="column in props.columns" :key="column">{{ column }}</th>
            </tr>
        </thead>
        <tbody>
            <slot name="tbody"></slot>
        </tbody>
    </table>
</template>

<script>
export default {
    props: { columns: Array }
}
</script>