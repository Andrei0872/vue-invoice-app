<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th
                        v-for="field in fields"
                        :key="field"
                    >
                        {{ field.includes('_') ? formatColumnName(field) : capitalize(field) }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="row in items">
                    <div :key="row.id" class="icon">
                        <font-awesome-icon 
                            icon="minus-circle" 
                            class="minus-circle" 
                            @click="deleteRow(row.id)"    
                        />
                    </div>
                    <tr :key="row.id + 'row'">
                        <td 
                            @click="focusInputChild($event)" 
                            v-for="field in fields" 
                            :key="field + 'td'"
                            :class="{ 'blurred': ['sell_price', 'product_vat', 'sell_price_vat'].includes(field) }"
                        >
                            <VInput 
                                :key="typeof row[field] === 'object' ? row[field].id : row[field]"
                                class="the-input"
                                :placeholder="field"
                                :value="row[field] !== field ? typeof row[field] === 'object' ? row[field].name : row[field] : ''"
                                @input="setTdWidth($event)"
                                @focus.native="selectRow(row, field, $event)"
                                @blur.native="addField(row, field, $event)"
                            />
                            <component
                                @itemSelected="selectItem($event)" 
                                v-if="field === 'product_name' && selectedField === 'product_name' && inputValue && row.id === selectedRowId"
                                :is="VList"
                                :filterKey="inputValue"
                                :key="row.id"
                                :currentTdWidth="currentTdWidth"
                            />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import VInput from './VInput';

import computeDoc from '../mixins/computeDoc';

import { formatColumnName, capitalize } from '../utils/'

export default {
    props: {
        fields: Array,
        items: Array
    },

    mixins: [computeDoc],

    components: { VInput },

    data () {
        return {
            currentTdWidth: null,
            inputValue: null,
            selectedRowId: null,
            prevSelectedRowId: null,
            selectedItemFromList: null,
            selectedField: null,
            selectedFieldValue: '',
            listVisible: false,
            lastUsedVatId: null,
            lastUsedSellPrice: null,
        }
    },

    computed: {
        VList () {
            // TODO: optimize it! - directory;
            return this.$store.state['currentEntity'] === 'documents' 
                ? () => import('./VList.vue') 
                : false
        },

        currentFieldValue () {
            return typeof this.selectedFieldValue  === 'object' 
                ? this.selectedFieldValue.name
                : this.selectedFieldValue
        },
    },

    watch: {
        inputValue (newVal) {
            (newVal === null || newVal.trim() === '') && (this.listVisible = false)
        },
    },

    methods: {
        setTdWidth ({ value, ev }) {
            this.inputValue = value

            this.$nextTick(() => {
                this.currentTdWidth = ev.target.parentElement.offsetWidth;
            })

        },

        formatColumnName (field) { return formatColumnName(field) },
        
        capitalize (field) { return capitalize(field) },

        async addField (row, fieldName, ev) {
            if (this.listVisible)
                return;

            let val = ev.target ? ev.target.value : ev;
            this.$emit('addField', [row.id, fieldName,  val]);
            
            if (fieldName === 'buy_price' || fieldName === 'markup') {
                const sellPriceValue = parseFloat(this.computeSellPrice(row, fieldName, val)).toFixed(2);
                this.$emit('addField', [row.id, 'sell_price', sellPriceValue]);

                const vat = this.$store.getters['dashboard/getCurrentVat'];

                const { product_name: { isComestible = undefined } } = row;

                if (isComestible !== undefined) {
                    console.log('sellPriceValue', sellPriceValue)
                    const vatValue = this.getVatValue(isComestible, sellPriceValue, vat).toFixed(2);

                    this.lastUsedVatId = vatValue;
                    this.$emit('addField', [row.id, 'product_vat', vatValue]);
                    const sellPriceVat = +vatValue + +sellPriceValue;
                    this.$emit('addField', [row.id, 'sell_price_vat', sellPriceVat.toFixed(2)]);
                }

                this.lastUsedSellPrice = sellPriceValue;
            }

            this.prevSelectedRowId = this.selectedRowId;
        },

        focusInputChild (ev) {
            if (ev.currentTarget !== ev.target) 
                return

            ev.target.children[0].focus(); 
        },

        deleteRow (rowId) {
            this.$emit('deleteRow', rowId);
        },

        selectRow (row, field, ev) {
            if (['sell_price', 'product_vat', 'sell_price_vat'].includes(field))
                return ev.target.blur();

            this.inputValue = null;
            this.selectedRowId = row.id;
            this.selectedField = field;

            this.selectedFieldValue = row[field] || '';
        },

        // Happens when a list item is selected, then altered and the user
        // wants to get the initial item name
        needsAdditionalUpdate () {
            return this.items.some(
                item => item.id === this.selectedRowId 
                    && item[this.selectedField] === this.selectedItemFromList.name
                    || typeof item[this.selectedField] === 'object' && item[this.selectedField].name === this.selectedItemFromList.name
            )
        },

        selectItem (itemInfo) {
            this.selectedItemFromList = { ...itemInfo };

            // If the user had chosen an item, altered the its name, but then decided to choose the same item
            if (this.needsAdditionalUpdate()) {
                console.log('new update')
                this.$emit('addField', [this.selectedRowId, this.selectedField,  this.inputValue]);
            }

            this.inputValue += ' ';
            const { id, name, comestible: isComestible, buy_price } = this.selectedItemFromList;
            // this.inputValue = null; // Not reactive
            this.$emit('addField', [this.selectedRowId, this.selectedField, { id, name , isComestible }]);
            
            if (this.selectedRowId !== this.prevSelectedRowId)
                this.lastUsedSellPrice = null
                
            const vatValue = this.getVatValue(isComestible, this.lastUsedSellPrice, this.$store.getters['dashboard/getCurrentVat']);
            vatValue && this.$emit('addField', [this.selectedRowId, 'product_vat', vatValue]);
            vatValue && this.$emit('addField', [this.selectedRowId, 'sell_price_vat', (+vatValue + +this.lastUsedSellPrice)]);
        }
    },

    created () {
        this.$emit('init');
    }
}
</script>

<style lang="scss" scoped>

.table-responsive {
    overflow: auto;
    padding: 1.5rem;
    width: 80vw;
}


.icon {
    position: absolute;
    transform: translateY(60%) translateX(-120%);
    cursor: pointer;

    &.h-has-two-buttons {
        transform: translateY(10%) translateX(-120%);
        display: flex;
        flex-direction: column;

        svg:first-child {
            margin-bottom: 3px;
        }
    }

    svg {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        &:hover {
            transform: scale(1.1);
        }

        &.minus-circle {
            color: tomato;
            background-color: #fff;
        }

        &.pencil-alt {
            color: rgb(51, 72, 99);
        }

        &.save-changes {
            color: #4caf50;
        }

        &.times {
            color: darken(tomato, 10%);
        }
    }
}

.blurred {
    cursor: default;
    user-select: none;
    background-color: lighten($color: #394263, $amount: 50%);

    & .the-input {
        background-color: lighten($color: #394263, $amount: 50%);
        cursor: default;
    }
}

</style>
