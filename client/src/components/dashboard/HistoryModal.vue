<template>
 <VModal :showModal="showModal" @closeModal="closeModal" v-bind="{ 'background-color': '#DCE4F2', 'max-height': '45rem' }">
      <template v-slot:header v-if="selectedHistoryRow">
        <!-- TODO: tell the user what has been added / deleted -->
        {{ selectedHistoryRow.message }}
      </template>
      
      <template v-slot:body v-if="selectedHistoryRow">
        <router-link class="redirect-link" :to="selectedHistoryRow.entity" v-if="selectedHistoryRow.entity.includes('documents/edit')">
          Read more about this document
        </router-link>
        
        <template v-if="!selectedHistoryRow.current_state.includes('\n')">
          <div v-if="selectedHistoryRow.additional_info">{{ getHistoryProductNames[0] }}</div>

          <div class="c-table">
            <VTableSimple :columns="['Field', 'From', 'To']">
      <!-- If a product / provider / document has been updated -->
      <template v-if="multipleRowsUpdated === false">
        <div v-if="selectedHistoryRow.additional_info">{{ getHistoryProductNames[0] }}</div>

        <div class="c-table">
          <VTableSimple :columns="['Field', 'From', 'To']">
            <template v-slot:tbody>
              <tr
                  v-for="(values, field) in getHistoryStateInformation"
                  :key="field"
                >
                  <td>{{ field }}</td>
                  <td>{{ values[0] }}</td>
                  <td>{{ values[1] }}</td>
              </tr>
            </template>
          </VTableSimple>
        </div>
      </template>
              <template v-slot:tbody>
                <tr
                    v-for="(values, field) in getHistoryStateInformation"
                    :key="field"
                  >
                    <td>{{ field }}</td>
                    <td>{{ values[0] }}</td>
                    <td>{{ values[1] }}</td>
                </tr>
              </template>
            </VTableSimple>
          </div>
        </template>

        <template v-else>
          <template v-for="(product, productIndex) in computeProductRows">
            <div :key="product.id">{{ getHistoryProductNames[productIndex] }}</div>
            
            <div :key="product.id + productIndex" class="c-table">
              <VTableSimple  :columns="['Field', 'From', 'To']">
                <template v-slot:tbody>
                  <tr
                    v-for="(field) in Object.keys(getRidOfObjProp(product, 'id'))"
                    :key="product.id + field"
                  >
                    <td>{{ field }}</td>
                    <td>{{ product[field][0] }}</td>
                    <td>{{ product[field][1] }}</td>
                  </tr>
                </template>
              </VTableSimple>
          </div>
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

import uuidv1 from 'uuid/v1'

import { createNamespacedHelpers } from 'vuex';
const { mapState } = createNamespacedHelpers('dashboard')

import modalMixin from '../../mixins/modalMixin';

import { separateValues, formatDate, getRidOfObjProp } from '../../utils/index';

import historySharedData from '../../observables/history';

export default {
    name: 'history-modal',

    components: { VModal, VTableSimple },

    data: () => ({}),

    mixins: [modalMixin],

    watch: {
        showModal (shouldDisplayModal) {
            shouldDisplayModal
                ?
                window.addEventListener("keyup", this.modalHandler) :
                window.removeEventListener("keyup", this.modalHandler)
        }
    },

    computed: {
        // Decided to name this way because the `modalMixin` already contains a property `showDetails`
        showModal () { return historySharedData.showModal },

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
    },

    methods: {

        formatDate (date) { return formatDate(date) },

        getRidOfObjProp (obj, prop) { return getRidOfObjProp(obj, prop) },

        closeModal () {
            historySharedData.showModal = false
            historySharedData.selectedHistoryRow = null
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
