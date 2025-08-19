<template>
  <v-container fluid class="statistics-container">
    <h1>Количество SMS по статусам</h1>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col :cols="6">
            <div class="filters-section">
              <div class="filter-group">
                <el-select v-model="itemsPerPage" placeholder="Период" size="large"   class="filter-box">
                  <el-option
                    v-for="item in itemsPerPageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div class="filter-group">
              <el-input
                v-model.lazy="filter.comment"
                class="search-field"
                size="large"
                placeholder="Поиск"
              >
                <!-- <template> -->
                  <img src="/img/search.svg" style="width: 24px; height: 24px; margin-right: 8px;" />
                <!-- </template> -->
              </el-input>
              </div>
              <div class="filter-group">
                <el-date-picker
                  v-model="dateRange"
                  class="filter-box"
                  type="daterange"
                  range-separator=" - "
                  start-placeholder="Начало"
                  end-placeholder="Конец"
                  size="large"
                  dayjs="dayjs"
                  format="DD MMMM"
                  :prefix-icon="CalendarIcon"
                />
              </div>
              <div class="filter-group">
                <el-select v-model="filter.serviceId" placeholder="Структура орг" size="large"   class="filter-box">
                  <el-option
                      v-for="item in serviceOptions"
                      :key="item"
                      :label="item.title"
                      :value="item.value"
                  />
                </el-select>
              </div>
              <div class="filter-group">
                <v-btn
                    color="primary"
                    variant="text"
                    style="border-radius: 50px;"
                    @click="clearFilter"
                >
                  Сбросить
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="filters-section" style="justify-content: right">
              <div class="filter-group">
                <v-btn
                  color="primary"
                  variant="flat"
                  class="reset-btn "
                  prepend-icon="mdi-plus"
                >
                  Создать
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="smsStore.smses"
        :loading="smsStore.loading"
        :items-per-page="parseInt(itemsPerPage)"
        :page.sync="page"
        :server-items-length="totalItems"
        hide-default-footer
        class="balance-table"
      >
        <template #item.index="{ index }">
          <span class="row-number">{{ index + 1 }}</span>
        </template>

        <template #item.id="{ item }">
          <span class="transaction-id">{{ item.id }}</span>
        </template>

        <template #item.comment="{ item }">
          <span class="comment-text">{{ item.comment }}</span>
        </template>
        <template #item.isManual="{ item }">
          <v-chip
              :color="getStatusColor(item.isManual)"
              :style="getChipStyle(item.isManual)"
              size="small"
              variant="flat"
              class="status-chip"
          >
            {{ item.isManual ? 'Ручное' : 'Автоматическое' }}
          </v-chip>
        </template>

        <template #item.amount="{ item }">
          <span class="amount-text" :class="{ 'negative': String(item.amount).includes('-') }">
           {{ (item.type == 'INCOME'?'': '-') + formatSum(item.amount) }}
          </span>
        </template>

        <template #item.createdDate="{ item }">
          <span class="date-text">{{ new Date(item.createdDate).toLocaleString() }}</span>
        </template>
      </v-data-table>

      <div class="d-flex justify-space-between mt-4 ml-4 mb-2">
        <div class="d-flex align-center" style="gap:8px">
          <span class="pagination-text">Показано</span>
          <span style="border:1px solid #D1D5DB; padding: 10px; border-radius: 14px;">{{ page }}</span>
          <span class="pagination-text">из {{ lastPage }}</span>          
        </div>
        <v-pagination
          v-model="page"
          :length="lastPage"
          :total-visible="5"
          color="primary"
          size="small"
          @update:modelValue="onPageChange"
        />
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useSmsStore} from "@/stores/sms";


const smsStore = useSmsStore()

const dateRange = ref('')
const dateRange2 = ref('')
const itemsPerPageOptions = ['5', '10', '20', '50']
const itemsPerPage = ref('5')
const lastPage = ref(1)
const searchQuery = ref('')
const isLoading = ref(false)
const totalItems = ref(0)
const filter = ref({
  comment:"",
  fromDate: null,
  toDate: null
})
const headers = [
  { title: '#', key: 'index', width: '60px', sortable: false },
  { title: 'ID', key: 'id', width: '100px' },
  { title: 'Партнер', key: 'comment', width: '100px' },
  { title: 'ID Партнера', key: 'isManual', width: '200px' },
  { title: 'Отправитель', key: 'serviceName', width: '200px' },
  { title: 'Получатель', key: 'amount', width: '200px' },
  { title: 'Статус', key: 'amount', width: '200px' },
  { title: 'Дата', key: 'createdDate', width: '180px' },
]

const fetchSms = async () => {
  isLoading.value = true
  try {
      const response = await smsStore.fetchSmses({
        page: 1,
        limit: itemsPerPage.value,
        search: searchQuery.value,
        fromDate: dateRange.value ? new Date(dateRange.value).toISOString() : null,
        toDate: dateRange2.value ? new Date(dateRange2.value).toISOString() : null
      })
  } finally {
    isLoading.value = false
  }
}
function clearFilter() {
  dateRange.value = ''
  dateRange2.value = ''
  itemsPerPage.value = '5'
  searchQuery.value = ''
}
function clearFilterAgents() {
  dateRange2.value = ''
  itemsPerPage.value = '5'
  searchQuery.value = ''
}

onMounted(() => {
  fetchSms()
})
</script>