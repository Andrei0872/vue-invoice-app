<template>
 <VModal :showModal="showModal" @closeModal="closeModal" v-bind="{ 'background-color': '#DCE4F2', 'max-height': '45rem', 'max-width': '70rem' }">
    <template v-slot:header v-if="selectedHistoryRow">
      {{ selectedHistoryRow.message }}
    </template>
      
    <template v-slot:body v-if="selectedHistoryRow">
      <template v-if="actionType === 'delete'">
        <div v-if="selectedHistoryRow.entity.includes('empty')">
          <!-- TODO: add this msg to `additional_info` -->
          <p v-if="getEmptyEntityName === 'document'">
            This document does not exist anymore. <br>
          </p>
          <p>
            There are no more {{ getEmptyEntityName }}s
          </p>
        </div>

        <template v-for="(entity, ind) in modalData">
          <p :key="ind + 'title'">{{ entity.title }}</p>  

          <div :key="ind + 'table'" class="c-table">
            <VTableSimple 
              :columns="getPropertiesOfNestedObj(entity.items)"
            >
              <template v-slot:tbody>
                
                <tr v-for="(values, id) in entity.items" :key="id">
                  <td v-for="columnName in $options.currentEntityColumns" :key="id + columnName">
                    {{ values[columnName] }}
                  </td>
                </tr>

              </template>
            </VTableSimple>
          </div>
        </template>
      </template>

      <template v-else-if="actionType === 'update'">
        <template v-for="(fromTo, id) in modalData">
          <p :key="id"><b>{{ id }}</b></p>

          <p :key="id + 'from'">From</p>
          <div :key="id + 'table'" class="c-table">
            <VTableSimple 
              :columns="getPropertiesOfNestedObj(fromTo)"
            >
              <template v-slot:tbody>
                <tr>
                  <td v-for="column in $options.currentEntityColumns" :key="id + column">
                    {{ fromTo.from[column] }}
                  </td>
                </tr> 
              </template>
            </VTableSimple>
          </div>

          <p :key="id + 'to'">To</p>
          <div :key="id + 'table' + 'to'" class="c-table">
            <VTableSimple 
              :columns="$options.currentEntityColumns"
            >
              <template v-slot:tbody>
                <tr>
                  <td v-for="column in $options.currentEntityColumns" :key="column + id">
                    {{ fromTo.to[column] }}
                  </td>
                </tr>
              </template>
            </VTableSimple>
          </div>
        </template>
      </template>

      <template v-else-if="actionType === 'insert'">
        <div class="c-table">
          <VTableSimple
            :columns="$options.currentEntityColumns"
          >
            <template v-slot:tbody>
              <!-- Using `index` as a key because this modal is readonly -->
              <tr v-for="(createdItem, index) in modalData" :key="index">
                <td v-for="column in $options.currentEntityColumns" :key="column + index">
                  {{ createdItem[column] }}
                </td>
              </tr> 
            </template>
          </VTableSimple>
        </div>

        <template v-if="additionalInfo">
          <template v-for="(additionalItemObj, title, index) in additionalInfo">
            <p :key="index + 'title'">{{ title }}</p>

            <div :key="index + title" class="c-table">
                <VTableSimple
                  :columns="getPropertiesOfPropArr(additionalInfo[title])"
                >
                <template v-slot:tbody>
                  <tr v-for="(additionalItem, index) in additionalItemObj" :key="index">
                    <td v-for="column in $options.currentEntityColumns" :key="column + index + title">
                      {{ additionalItem[column] }}
                    </td>
                  </tr> 
                </template>
              </VTableSimple>
            </div>
          </template>
        </template>
      </template>

      <div align="right">
        {{ formatDate(selectedHistoryRow.inserted_date) }}
      </div>
    </template>
  </VModal>
</template>

<script>
import VModal from '../VModal';
import VTableSimple from '../VTableSimple';

import { mapState } from 'vuex'

import uuidv1 from 'uuid/v1'

import modalMixin from '../../mixins/modalMixin';

import { separateValues, formatDate, getRidOfObjProp, getPropertiesOfNestedObj } from '../../utils/index';

import historySharedData from '../../observables/history';

export default {
    name: 'history-modal',

    components: { VModal, VTableSimple },

    /**
     * We don't want this variable to be reactive, as we might get into infinite loops
     * when mutating this variable
     */
    currentEntityColumns: null,

    data: () => ({
      multipleRowsUpdated: null,
      displayDeletedOrAdded: null,
      // Couldn't think of a better name...
      displayDeletedOrAddedProductsInDoc: null,

      actionType: null,
      modalData: null,
      /**
       * For example, when creating a product, we need to keep tract of
       * the `created provider` and the `created products`
       */
      additionalInfo: null
    }),

    mixins: [modalMixin],

    watch: {
        showModal (shouldDisplayModal) {
            shouldDisplayModal
                ?
                window.addEventListener("keyup", this.modalHandler) :
                window.removeEventListener("keyup", this.modalHandler)
        },

        selectedHistoryRow (row) {
          if (!row)
            return;

          console.log(row)
          this.actionType = row.action_type;

          switch (this.actionType) {
            case 'delete': {
              this.modalData = (JSON.parse(row.prev_state)).data;              
              break;
            }
            
            case 'update': {
              this.modalData = JSON.parse(row.current_state);
              break;
            }

            case 'insert': {
              this.modalData = JSON.parse(row.current_state);
              row.additional_info && (this.additionalInfo = JSON.parse(row.additional_info))
              this.$options.currentEntityColumns = Object.keys(this.modalData[0]);
              
              break;
            }
          }
        }
    },

    computed: {
        // Decided to name this way because the `modalMixin` already contains a property `showDetails`
        showModal () { return historySharedData.showModal },

        getEmptyEntityName () {
          return this.selectedHistoryRow.entity.slice(0, this.selectedHistoryRow.entity.indexOf('/'))
        },

        selectedHistoryRow () { return historySharedData.selectedHistoryRow },

        computeProductRows () {
            const currentStateRows = this.selectedHistoryRow.current_state.split('\n');
            const prevValuesRows = this.selectedHistoryRow.prev_state.split('\n');

            return prevValuesRows.map((items, index) => {
                const row = {};
                const currentStateRow = currentStateRows[index].split('|');

                items.split('|').forEach((kvPair, kvPairIndex) => {
                const [key, value] = separateValues(kvPair, ':');

                // row[field] = [prevValue, currentValue]
                row[key] = [value, currentStateRow[kvPairIndex]]
                });

                row['id'] = uuidv1()

                return row;
            })
        },

        getHistoryProductNames () {
            return this.selectedHistoryRow.additional_info.split('|')
        },

        getHistoryStateInformation () {

          const { current_state: currentState, prev_state: prevState } = this.selectedHistoryRow;

          // result[field] = [prevValue, currentValue]
          const result = {};

          if (~prevState.indexOf('|')) {
              // Multiple fields have been updated
              const valuesArr = currentState.split('|');

              prevState.split('|').forEach((kvPair, index) => {
              const [key, value] = separateValues(kvPair, ':');

              result[key] = [value, valuesArr[index]];
              })

          } else {
              // Only one field has been updated
              const [key, value] = separateValues(prevState, ':');

              result[key] = [value, currentState];
          }

          return result
        },

        ...mapState('dashboard', ['documentIds'])
    },

    methods: {
        getPropertiesOfNestedObj (obj) {

          this.$options.currentEntityColumns = getPropertiesOfNestedObj(obj);

          return this.$options.currentEntityColumns;
        },

        getPropertiesOfPropArr (arr) {
          this.$options.currentEntityColumns = Object.keys(arr[0]);

          return this.$options.currentEntityColumns;
        },

        formatDate (date) { return formatDate(date) },

        getRidOfObjProp (obj, prop) { return getRidOfObjProp(obj, prop) },

        closeModal () {
            historySharedData.showModal = false
            historySharedData.selectedHistoryRow = null
            this.multipleRowsUpdated = null;
        },
    },
}
</script>

<style lang="scss">
    $main-blue: #394263;

    .c-table {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .redirect-link {
    color: darken($color: $main-blue, $amount: 15%);
    font-style: italic;

    &:hover {
      font-weight: bold;
    }
  }
</style>
