<template>
    <!-- TODO: add filter for th -->
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th
                        v-for="field in fields"
                        :key="field"
                    >
                        {{ field }}
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
                        <td @click="focusInputChild($event)" v-for="field in fields" :key="field + 'td'">
                            <VInput 
                                :key="typeof row[field] === 'object' ? row[field].id : row[field]"
                                class="the-input"
                                :placeholder="field"
                                :value="row[field] !== field ? typeof row[field] === 'object' ? row[field].name : row[field] : ''"
                                @input="inputValue = $event"
                                @focus.native="selectRow(row, field, $event)"
                                @blur.native="addField(row, field, $event)"
                            />
                            <component
                                @itemSelected="selectItem($event)" 
                                v-if="field === 'product_name' && selectedField === 'product_name' && inputValue && row.id === selectedRowId"
                                :is="VList"
                                :filterKey="inputValue"
                                :key="row.id + 'uniq'"
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

export default {
    props: {
        fields: Array,
        items: Array
    },

    components: { VInput },

    data () {
        return {
            inputValue: null,
            selectedRowId: null,
            selectedItemFromList: null,
            selectedField: null,
            selectedFieldValue: ''
        }
    },

    computed: {
        VList () {
            // TODO: optimize it! - mixin & directory
            return this.$store.state['currentEntity'] === 'documents' 
                ? () => import('./VList.vue') 
                : false
        },

        currentFieldValue () {
            return typeof this.selectedFieldValue  === 'object' 
                ? this.selectedFieldValue.name
                : this.selectedFieldValue
        }
    },

    methods: {
        async addField (row, fieldName, ev) {
            // Because when the user clicks on a list item, the first event that will be triggered will be `blur`, and then `click`
            // When the user uses the arrow keys and presses ENTER, the `blur` event will come second and the first event will be the one emitted by another component
            if (!!(this.VList)) {
                await setTimeout(() => {}, 300);
            }

            console.log('second')
                const val = ev.target ? ev.target.value : ev;
                
                if (this.currentFieldValue.trim() === val.trim() || !!(this.selectedItemFromList)) {
                    this.selectedItemFromList = null
                    return
                }
                
                if (!!this.VList === false) {
                    this.$emit('addField', [row.id, fieldName,  val])
                    return;
                }

                console.log('danger zone!')
                this.$emit('addField', [row.id, fieldName,  val])
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
            console.log('first')
            this.selectedItemFromList = { ...itemInfo };

            // If the user had chosen an item, altered the its name, but then decided to choose the same item
            if (this.needsAdditionalUpdate()) {
                console.log('new update')
                this.$emit('addField', [this.selectedRowId, this.selectedField,  this.inputValue]);
            }

            // Make it reactive
            setTimeout(() => {
                this.$emit('addField', [this.selectedRowId, this.selectedField, { id: this.selectedItemFromList.id, name: this.selectedItemFromList.name }]);
                this.inputValue = null;
            }, 100);
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
    // position: relative;
}

.table {
    border-collapse: collapse;
    background-color: #FFF;
    border-radius: 13px;
    width: 100%;
    // table-layout: fixed;

    td, th {
        padding: 15px;
        text-align: center;
    }

    thead {
        background-color: darken($color: #394263, $amount: 5%);
        color: #fff;
        font-weight: 300;

        tr {            

            th:not(:last-child) {
                border-right: 1px solid #ccc;
            }

            th:first-child {
                border-top-left-radius: 13px;
            }

            th:last-child {
                border-top-right-radius: 13px;
            }
        }
    }

    tbody {
        tr > td:not(:last-child) {
            border-right: 1px solid #ccc;
        }
        
        tr:last-child {

            td:first-child {
                border-bottom-left-radius: 13px;
            }

            td:last-child {
                border-bottom-right-radius: 13px;
            }
        }

        tr:not(:last-child) {
            border-bottom: 1px solid #ccc;
        }

        tr td {
            outline: 0;
            border: none;
            padding: 15px 1px;
        }
    }
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


</style>
