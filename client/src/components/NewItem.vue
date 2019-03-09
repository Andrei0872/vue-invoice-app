<template>
    <div>
        create a new item!
        {{ fields }}
        <br>
        {{ data }}
    </div>    
</template>

<script>
export default {
    name: 'new-item',

    props: {
        fields: Array,
        data: Array,
    },
}
</script>
