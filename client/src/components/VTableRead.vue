<template>
    <div class="table-responsive" v-if="componentLoaded && items.length && fields.length">
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
            <tbody :class="{ 'h-has-hover': !isUpdating, 'h-readonly': $route.name === 'documentEditOne' && readonly  }">
                <template v-for="(row, rowIndex) in itemsFromProps">
                    <div v-if="shouldDisplayButtons" :key="row.id" class="icon h-has-two-buttons">
                        <template v-if="!isUpdating || isUpdating && selectedRowId !== row.id">
                            <font-awesome-icon 
                                v-if="!showDelete"
                                icon="pencil-alt" 
                                class="pencil-alt"
                                @click="updateRow(row)"
                            />
                            <font-awesome-icon
                                :style="{ 'margin-top': showDelete ? '13px' : undefined }" 
                                icon="minus-circle" 
                                class="minus-circle" 
                                @click="deleteRow(row)"    
                            />
                        </template>
                        <template v-else-if="isUpdating && selectedRowId === row.id">
                            <font-awesome-icon 
                                icon="times" 
                                class="times"
                                @click="cancelChanges(row)"
                            />
                            <font-awesome-icon 
                                icon="check" 
                                class="check" 
                                @click="confirmChanges(row)"
                            />
                        </template>
                    </div>
                    <tr 
                        :key="row.id + 'row'"
                        :class="isUpdating && selectedRowId === row.id ? 'selected' : isUpdating ? 'blurred' : null"
                        v-on="{ click: !isUpdating ? showInfo.bind(null, row) : () => {} }"
                    >
                        <td 
                            @click="focusInputChild($event)" 
                            v-for="field in fields" 
                            :key="field + 'td'"
                            :class="{ 'blurred': isUpdating && selectedRowId === row.id && (['sell_price', 'product_name', 'product_vat', 'sell_price_vat'].includes(field)), 'actions': field === 'actions' }"
                        >
                            <template v-if="field !== 'actions'">
                                <!-- Add :key to easily trigger reactiviy -->
                                <VInput
                                    :key="row[field]"
                                    class="the-input"
                                    :placeholder="field"
                                    :value="row[field] || row[field] === 0 ? `${row[field]}`.trim() : ''"
                                    @input="inputValue = $event"
                                    @focus.native="handleFocus(row.id, field, $event)"
                                    @blur.native="addField(row, field, $event)"
                                />
                            </template>
                            <template v-else>
                                <span class="file file--pdf">
                                    <font-awesome-icon icon="file-pdf" @click="generateFile('pdf', row.id)" />
                                </span>
                                <span class="file file--excel">
                                    <font-awesome-icon icon="file-excel" @click="generateFile('excel', row.id, rowIndex)" />
                                </span>
                            </template>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import VInput from '../components/VInput';

import { 
    fetchExcelFile, 
    formatColumnName, 
    capitalize, 
    compareObjects, 
    isObjectEmpty,
} from '../utils/'; 

import computeDoc from '../mixins/computeDoc';

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    props: {
        fields: Array,
        items: Array,
        readonly: {
            type: Boolean,
            default: false
        },
        showDelete: {
            type: Boolean,
            default: false
        }
    },

    mixins: [computeDoc],

    components: { VInput },

    data () {
        return {
            isUpdating: false,
            selectedRowId: null,
            selectedRow: null,
            itemsFromProps: null,
            inputValue: '',
            selectedRowId: '',
            selectedField: '',
            untouchedRow: null,
            // Fields from `History` table
            prevState: ``,
            crtState: ``,
            componentLoaded: false,
        }
    },

    watch: {
        items (newVal) {
            this.itemsFromProps = JSON.parse(JSON.stringify(this.items))
        }
    },

    computed: {

        shouldDisplayButtons () {
            return !this.readonly
        },

        //! Can be deleted
        ...mapState('document_product', { allItems : 'items' }),
        //! Can be deleted
        ...mapGetters('document_product', { documentProducts: 'getItemsById' }),
    },

    methods: {
        formatColumnName (field) { return formatColumnName(field) },
        
        capitalize (field) { return capitalize(field) },

        ...mapActions('document_product', ['setId', 'fetchById']),

        generateFile (type, id, rowIndex = null) {
            const url = `${this.$store.getters['api/mainURL']}/file`;

            if (type === 'pdf') {
                return this.$router.push({ name: 'file', params: { id } });
            }

            this.setId(id);
            fetchExcelFile.call(this, url, rowIndex, id);
        },

        // TODO: add props to be avoided
        handleFocus (rowId, field, ev) {
            if (!this.isUpdating || this.isUpdating && this.selectedRowId !== rowId || ['sell_price', 'product_name', 'product_vat', 'sell_price_vat'].includes(field)) {
                ev.target.blur();
                return;
            }

            this.inputValue = null;
            this.selectedRowId = rowId;
            this.selectedField = field;
        },

        focusInputChild (ev) {
            if (ev.currentTarget !== ev.target) 
                return

            ev.target.children[0].focus();
        },

        // selectItem (itemInfo) {
        //     console.log('item selected')

        //     this.selectedItemFromList = { ...itemInfo };

        //     if (this.needsAdditionalUpdate()) {
        //         console.log('new update')
        //         this.$emit('update', [this.selectedRowId, { [this.selectedField]: this.inputValue }])
        //     }

        //     this.$emit('update', [this.selectedRowId, { [this.selectedField]: itemInfo.name }]);
        //     this.inputValue = null;
        // },

        // needsAdditionalUpdate () {
        //     return this.items.some(
        //         item => item.id === this.selectedRowId 
        //             && item[this.selectedField] === this.selectedItemFromList.name
        //     )
        // },

        updateRow (row) {
            if (this.$store.state['currentEntity'] === 'documents' && this.$route.name !== 'documentEditOne') {
                this.$emit('update', row.id);
                return;
            }

            this.isUpdating = true;
            this.selectedRowId = row.id;
            this.selectedRow = { ...row };
            this.untouchedRow = { ...row };
        },

        deleteRow (row) {
            this.$emit('deleteRow', row);
        },

        resetData (rowId) {
            this.isUpdating = false;
            this.selectedRowId = this.selectedRow = this.untouchedRow = null;
            this.prevState = this.crtState = ``;
        },

        compareChanges (rowBeforeChanges, rowAfterChange) {
            const cbWhenChangeFound = (beforeCh, afterCh, k) => {
                this.prevState += `${k}:${beforeCh[k]}|`
                this.crtState += `${afterCh[k]}|`
            };

            return compareObjects(rowBeforeChanges, rowAfterChange, cbWhenChangeFound);
        },

        confirmChanges (row) {

            const changes = this.compareChanges(this.untouchedRow, this.selectedRow);

            if (!isObjectEmpty(changes)) {
                this.$emit('update', { ...changes, id: row.id });

                if (this.$route.name === 'documentEditOne') {
                    this.resetData();

                    return;
                }
                
                const currentEntity = this.$store.getters['getEntityName'];
                const message = `Update one ${currentEntity}`
                this.$store.dispatch('dashboard/insertHistoryRow', {
                    entity: currentEntity, message, 
                    action_type: 'update',
                    prev_state: this.prevState.slice(0, -1),
                    current_state: this.crtState.slice(0, -1),
                    additional_info: this.selectedRow.name
                });
            }

            this.resetData();
        },

        cancelChanges (row) {

            Object.keys(row).forEach(key => {
                row[key] = this.untouchedRow[key] ? this.untouchedRow[key] : '';
            });

            this.resetData();
        },

        addField (row, fieldName, ev) {
            if (!this.selectedRowId)
                return;
            
            const val = ev.target.value.trim();
            this.selectedRow[fieldName] = val;
            row[fieldName] = val;

            if (fieldName === 'buy_price' || fieldName === 'markup') {
                // this.selectedRow['sell_price'] = row['sell_price'] = this.computeSellPrice(row, fieldName, val)

                const sellPriceValue = parseFloat(this.computeSellPrice(row, fieldName, val)).toFixed(2);
                this.selectedRow['sell_price'] = row['sell_price'] = sellPriceValue;

                const vat = this.$store.getters['dashboard/getCurrentVat'];

                const { isComestible } = row;

                if (isComestible !== undefined) {
                    const vatValue = this.getVatValue(isComestible, sellPriceValue, vat).toFixed(2);

                    this.lastUsedVatId = vatValue;
                    this.selectedRow['product_vat'] = row['product_vat'] = vatValue;
                    const sellPriceVat = +vatValue + +sellPriceValue;
                    this.selectedRow['sell_price_vat'] = row['sell_price_vat'] = sellPriceVat.toFixed(2);
                }

                this.lastUsedSellPrice = sellPriceValue;
            }
        },

        showInfo (row, ev) {
            !(ev.target.closest('.file')) && this.$emit('showInfo', row);
        },
    },

    mounted () {
        this.itemsFromProps = JSON.parse(JSON.stringify(this.items));

        this.componentLoaded = true;
    }
}
</script>

<style lang="scss" scoped>

.file {
    width: 60px;
    height: 60px;
    padding: .9rem .8rem;

    svg {
        font-size: 1.1rem;
        cursor: pointer;
    }

    &--pdf {
        color: orange;
    }

    &--excel {
        color: green;
    }
}

.blurred {
    cursor: default;
    filter: blur(2px);
    user-select: none;
    background-color: lighten($color: #394263, $amount: 50%);

    & .the-input {
        background-color: lighten($color: #394263, $amount: 50%);
        cursor: default;
    }
}

td.blurred {
    filter: blur(0);
}

.placeholder {
    color: #ccc;
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

        &.check {
            color: #4caf50;
        }

        &.times {
            color: darken(tomato, 10%);
        }
    }
}

.table-responsive {
    overflow: auto;
    padding: 1.5rem;
    width: 80vw;
}

.h-has-hover {
    tr:hover {

        td:not(.actions) {
            background-color: rgba($color: #394263, $alpha: .5);
            cursor: pointer;

            input {
                background: transparent;
                cursor: pointer;
            }
        }

    }
}

.h-readonly {
    tr:hover {
        cursor: default;

        input {
            cursor: default;
        }
    }
}

</style>
