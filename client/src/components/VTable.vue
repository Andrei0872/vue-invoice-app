<template>
    <!-- TODO: $parent.$parent ===> Vuex :D -->
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
            <tbody :class="{ 'h-has-hover': !isCreating && !isUpdating }">
                <template v-for="(row, indexRow) in itemsCopy">
                    <div v-if="isCreating && indexRow > 0 || !isCreating" :key="row.id + 'icon'" :class="['icon', 'h-has-two-buttons']">
                        <font-awesome-icon 
                            v-on="{ click: !isCreating ? updateRow.bind(null, row.id, row) : deleteRow.bind(null, row.id) }" 
                            :class="isUpdating && selectedRowId === row.id ? 'times' : currentIcon"  
                            :icon="isUpdating && selectedRowId === row.id ? 'times' : currentIcon" 
                        />
                        <font-awesome-icon 
                            :icon="checkOrRemove"
                            :class="isUpdating ? 'save-changes' : 'minus-circle'"
                            v-if="isUpdating && selectedRowId === row.id || !isUpdating && !isCreating"
                            v-on="{ click: isUpdating && selectedRowId === row.id ? updateRow.bind(null, row.id, row, true) : removeRow.bind(null, row.id) }"
                        />
                    </div>
                    <tr
                    v-on="{ click: !isCreating && !isUpdating ? $parent.$parent.showInfo.bind(null, row.id) : () => {} }"
                    :class="selectedRowId === row.id ? 'selected' : isUpdating ?  'blurred' : null"
                    :key="row.id"
                >
                    <td
                        v-for="field in fields"
                        :key="field + row.id"
                    >
                        <template v-if="isCreating || isUpdating" >
                            <!-- TODO: make it more readable .. :D -->
                            <!-- TODO: placeholder class -->
                            <!-- inputValue && field === 'nr_doc' && selectedRowId === row.id ? inputValue -->
                            <!-- :placeholder="isCreating ? field : ''" -->
                            <VInput
                                :key="field + row.id + 'input'" 
                                class="the-input"
                                :disabled="isUpdating && row.id !== selectedRowId"
                                :value="inputValue && field === 'nr_doc' && selectedRowId === row.id ? inputValue : defaultUpdateValue(row, field)"
                                @input="showList($event, field, row.id)"
                                @update="updateContent(indexRow, field, $event)"
                            />
                            <VList
                                :style="listStyles"
                                v-if="field === 'nr_doc' && isTyping && selectedRowId === row.id"
                                @itemSelected="updateInputvalue($event, field)"
                            ></VList>
                        </template>

                        <span v-else>{{ row[field] || row[field] === 0 ? row[field] : 'not specified' }}</span>
                    </td>
                </tr>
                </template>
            </tbody>
        </table>
        {{ inputValue }}
        {{ selectedRowId }}
    </div>    
</template>

<script>
import VInput from './VInput';
import VList from './VList';

export default {
    name: 'table-comp',

    props: {
        items: Array,
        fields: Array,
        isCreating: {
            type: Boolean,
            default: false
        }
    },

    components: { VList, VInput },

    data: () => ({
        itemsCopy: [],
        newItems: {},
        selectedRowId: null,
        selectedRow: [],
        isUpdating: false,
        listStyles: {},
        isTyping: false,
        hasBeenEmpty: false,
        currentInputCoords: {},
        listPos: {},
        inputValue: null
    }),

    computed: {
        currentIcon () {
            return this.isCreating ? 'minus-circle' : 'pencil-alt'
        },

        checkOrRemove () {
            return this.isUpdating ? 'check' : 'minus-circle'
        },
    },

    watch: {
        // If the value is changed from true to false
        // it means the `Create` btn has been pressed
        isCreating (newVal) {
            if (!newVal) {
                this.$root.$emit('createItems', this.newItems)
                this.itemsCopy = []
                this.$parent.toggleState();
            }
        },

        // Update when new rows are added
        items (newVal) {
            // console.log(newVal)
            this.isTyping = false;
            this.currentInputCoords = {};
            this.listPos = {};
            // !
            // this.inputValue = null;
            this.createCopy();
        },
    },

    methods: {
        
        defaultUpdateValue (row, field) {
            return this.isUpdating && (row[field] || row[field] === 0) 
                ? row[field] 
                : this.isCreating ? field : 'not specified'
        },

        updateInputvalue (value, field) {
            this.isTyping = false;
            this.inputValue = value;

            console.log('updating the input:', this.inputValue)
        },

        showList (width, field, rowId) {
            if (field !== 'nr_doc')
                return;

            if (!width) {
                (this.isCreating || this.isUpdating) || (this.selectedRowId = null)
                this.isTyping = false;
                return;
            }
            
            this.listStyles = {
                'width': `${width}px`
            };
            this.selectedRowId = rowId;
            // Make the VList component send its position && make it visible
            this.isTyping = true;
        },

        // TODO: make use of Vuex
        removeRow (id) {
            this.$parent.$parent.items = this.$parent.$parent.items.filter(item => item.id !== id)
        },

        updateContent (rowIndex, field, val) {
            console.log('updating value', val)
            this.isTyping = false;

            this.isUpdating && (this.selectedRow[field] = val);

            // Get the field array and add the new item
            const arr = this.newItems[field];
            this.$set(arr, rowIndex, val);
            
            // Get the entire object and set the new array
            const currentObj = this.newItems;
            this.$set(currentObj, `${field}`, arr);

            // Update the changes
            this.newItems = {... this.newItems, ...currentObj}
        },

        createCopy () {
            this.itemsCopy = JSON.parse(JSON.stringify(this.items))
        },

        deleteRow (id) {
            this.itemsCopy = this.itemsCopy.filter(item => item.id !== id);

            this.$parent.newItems = [... this.itemsCopy];
        },

        compareUpdates (row) {
            // console.log(row)
            // console.log(this.selectedRow)
            console.log('comparing...')

            return true;
        },

        // TODO: add this to utils
        // Clone object without Observer object
        cloneObjProps (obj) {
            const result = Object.create(null);

            Object.getOwnPropertyNames(obj)
                .forEach(prop => {
                    if (obj.hasOwnProperty(prop) && typeof obj[prop] !== 'object') {
                        result[prop] = obj[prop]
                    }
                })

            return result;
        },

        updateRow (id, row, saveChanges = false) {
            this.inputValue = null
            let hasChanges = false;

            // If a row is selected and the user clicks on another row
            if (this.isUpdating && this.selectedRowId !== id) {
                this.selectedRowId = id;
                this.selectedRow = JSON.parse(JSON.stringify(row));
            } else {
                this.isUpdating = !this.isUpdating

                // this.selectedRowId = this.isUpdating ? id : null
                this.isUpdating
                    && (
                        this.selectedRowId = id,
                        this.selectedRow = JSON.parse(JSON.stringify(row))
                    )
                    || (
                        this.selectedRowId = null,
                        this.isTyping = false,
                        saveChanges === true ? (hasChanges = this.compareUpdates(row)) : null
                        // this.selectedRow = [],
                    ) 
            }
            
            // TODO: refactor a little bit :D
            if (hasChanges) {
                // TODO: api call: update data; but first, check if any changes have been made!
                console.log('saving changes....')
                console.log(row)
                console.log(this.selectedRow)

                Object.keys(row)
                    .forEach(key => {
                        row[`${key}`] = " " + this.selectedRow[`${key}`]
                    });

                const indexRow = this.itemsCopy.findIndex(item => item.id === id)
                this.$set(this.itemsCopy, indexRow, row);
                this.$parent.$parent.items = this.itemsCopy

            } else if(!this.isUpdating) {
                console.log('keep the initial values');

                // Trigger reactivity
                Object.keys(row)
                    .forEach(key => {
                        row[`${key}`] = " " + row[`${key}`]
                    });

                const indexRow = this.itemsCopy.findIndex(item => item.id === id)
                this.$set(this.itemsCopy, indexRow, row);
                this.$parent.$parent.items = this.itemsCopy
            }
        }
    },

    created () {
        this.createCopy();
        this.fields.forEach(field => {
            this.newItems[field] = [];
        });
        /* 
        --> this.newFields = {
            field1: [],
            field2: [],
            ...
        }
        */
    },
}

</script>

<style lang="scss" scoped>

.selected {
    font-size: 1.105em;
}

.blurred {
    filter: blur(2px);
    background-color: lighten($color: #394263, $amount: 50%);

    & .the-input {
        background-color: lighten($color: #394263, $amount: 50%);
    }
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

        &.save-changes {
            color: #4caf50;
        }

        &.times {
            color: darken(tomato, 10%);
        }
    }
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

.table-responsive {
    overflow: auto;
    padding: 1.5rem;
    width: 80vw;
    // position: relative;
}

.h-has-hover {
    tr:hover {
        background-color: rgba($color: #394263, $alpha: .5);
        cursor: pointer;
    }
}

</style>