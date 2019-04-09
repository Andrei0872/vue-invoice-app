<template>
    <input 
        type="text"
        :value="theValue"
        :style="{ 'width': widthValue }"
        :placeholder="placeholder" 
        @input="sendContent($event)"
        :tabindex="placeholder === 'sell_price' ? -1 : 0"
    >
</template>

<script>
export default {
    props: {
        placeholder: String,
        value: {
            type: [String, Number],
            default: ''
        }
    },
    
    data () {
        return {
            widthValue: null,
            theValue: `${this.value}`.trim()
        }
    },

    watch: {
        theValue (newVal) {
            this.widthValue = `${((newVal.trim().length || this.placeholder.length) + 4) * 8}px`
        }
    },

    methods: {

        sendContent (ev) {
            this.theValue = ev.target.value;

            this.$emit('input', this.theValue);
        }, 
    },

    mounted () {
        this.widthValue = ((`${this.theValue}`.trim().length || this.placeholder.length) + 4) * 8 + 'px';
    },

}
</script>

<style lang="scss" scoped>
    $text-color: #303753;

    input {
        width: 100%;
        border: none;
        outline: none;
        text-align: center;
        font-size: .95rem;
        color: $text-color;

        &:hover {
            border: none;
            outline: none;      
        }
    }

    ::-webkit-input-placeholder {
        text-align: center;
    }

    :-moz-placeholder { /* Firefox 18- */
        text-align: center;  
    }

    ::-moz-placeholder {  /* Firefox 19+ */
        text-align: center;  
    }

    :-ms-input-placeholder {  
        text-align: center; 
    }
</style>