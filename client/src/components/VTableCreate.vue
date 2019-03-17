<template>
    <!-- TODO: use a blueprint table -->
    <div class="table-responsive">
        {{ items }}
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
                        <td v-for="field in fields" :key="field + 'td'">
                            <VInput 
                                :key="row[field]"
                                class="the-input"
                                :placeholder="field"
                                :value="row[field] !== field ? row[field] : ''"
                                @input="inputValue = $event"
                                @focus.native="selectRow(row.id, field, $event)"
                                @blur.native="addField(row.id, field, $event)"
                            />
                            <component
                                @itemSelected="selectItem($event)" 
                                v-if="field === 'nr_doc' && selectedField === 'nr_doc' && inputValue && row.id === selectedRowId"
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
            selectedField: null
        }
    },

    computed: {
        VList () {
            // TODO: optimize it!
            return this.$store.state['currentEntity'] === 'documents' 
                ? () => import('./VList.vue') 
                : false
        }
    },

    methods: {
        addField (rowId, fieldName, ev) {
            const val = ev.target ? ev.target.value : ev;
            
            if (!!this.VList === false) {
                this.$emit('addField', [rowId, fieldName,  val])
                return;
            }

            if (this.selectedItemFromList) {
                this.selectedItemFromList = null
            } else {
                this.$emit('addField', [rowId, fieldName,  val])
                // Give enough time to update the items after the user has chosen an item from the list
                setTimeout(() => {
                    this.inputValue = null
                }, 100)
            }
        },

        deleteRow (rowId) {
            this.$emit('deleteRow', rowId);
        },

        selectRow (id, field, ev) {
            this.inputValue = null
            this.selectedRowId = id
            this.selectedField = field;
        },

        needsAdditionalUpdate () {
            return this.items.some(
                item => item.id === this.selectedRowId 
                    && item[this.selectedField] === this.selectedItemFromList
            )
        },

        selectItem (val) {
            this.selectedItemFromList = val;

            if (this.needsAdditionalUpdate()) {
                console.log('new update')
                this.$emit('addField', [this.selectedRowId, this.selectedField,  this.inputValue])
            }

            setTimeout(() => {
                this.$emit('addField', [this.selectedRowId, this.selectedField,  val]);
                this.inputValue = null
            }, 0);
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
