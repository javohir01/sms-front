<template>
  <v-container fluid class="statistics-container">
    <v-row>
      <div class="filter-bar">
        <el-date-picker
          v-model="dateRange"
          class="filter-date"
          type="daterange"
          range-separator=" - "
          start-placeholder="Начало"
          end-placeholder="Конец"
          size="large"
          format="YYYY-MM-DD"
          :prefix-icon="CalendarIcon"
        />
        <el-input
          v-model.lazy="filter.search"
          class="filter-search"
          size="large"
          placeholder="Поиск"
          clearable
          @keyup.enter="fetchSms"
        >
          <template #prepend>
            <img src="/img/search.svg" style="width: 18px; height: 18px; margin-right: 6px;" />
          </template>
        </el-input>
        <el-button
          class="filter-btn"
          icon="el-icon-filter"
          circle
          @click="showFilterModal = true"
        >
          <img src="/img/filter.svg" style="width: 18px; height: 18px;" />
          <span class="filter-btn-text">Фильтры</span>
        </el-button>
      </div>
    </v-row>

    <!-- Filter Modal -->
    <el-dialog v-model="showFilterModal" title="Фильтры" width="400px">
      <div>
        <el-select
          v-model="filter.operator"
          placeholder="По оператору"
          style="margin-bottom: 12px; width: 100%;"
          clearable
        >
          <el-option
            v-for="item in resourceStore.operators"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="filter.status"
          placeholder="По статусу"
          style="margin-bottom: 12px; width: 100%;"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="filter.merchant"
          placeholder="По отправителю"
          style="margin-bottom: 12px; width: 100%;"
          clearable
        >
          <el-option
            v-for="item in resourceStore.merchants"
            :key="item.merchant"
            :label="item.merchantId"
            :value="item.merchant"
          />
        </el-select>
      </div>
      <template #footer>
        <el-button @click="clearFilter">Сбросить</el-button>
        <el-button type="primary" @click="fetchSms">Применить</el-button>
      </template>
    </el-dialog>

    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="smsStore?.smses?.content"
        :loading="smsStore.loading"
        :items-per-page="parseInt(filter.size)"
        :page.sync="filter.page"
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
          {{ item.isManual ? 'Ручное' : 'Автоматическое' }}
        </template>

        <template #item.amount="{ item }">
          <span class="amount-text">{{ item.amount }}</span>
        </template>
        <template #item.status="{ item }">
          <span>{{ item.status }}</span>
        </template>
        <template #item.createdDate="{ item }">
          <span class="date-text">{{ new Date(item.createdDate).toLocaleString() }}</span>
        </template>
      </v-data-table>

      <div class="d-flex justify-space-between mt-4 ml-4 mb-2">
        <div class="d-flex align-center" style="gap:8px">
          <span class="pagination-text">Показано</span>
            <el-select
              v-model="filter.size"
              placeholder="Период"
              size="large"
              class="pagination-select"
              @update:modelValue="onPageChange"
            >
              <el-option
                v-for="item in itemsPerPageOptions"
                :key="item + 'page'"
                :label="item"
                :value="item"
              />
            </el-select>
          <span class="pagination-text d-flex">из {{ smsStore?.smses?.totalElements }}</span>
        </div>
        <v-pagination
          v-model="filter.page"
          :length="smsStore?.smses?.totalPages"
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
import { ref, h, watch, onMounted } from 'vue'
import { ElDatePicker, ElInput, ElButton, ElDialog } from 'element-plus'
import {useSmsStore} from "@/stores/sms";
import {useResourceStore} from "@/stores/resource";
import {formatDateToIso} from "@/utils/helpers";

const smsStore = useSmsStore()
const resourceStore = useResourceStore()

const itemsPerPageOptions = ['5', '10', '20', '50']
const isLoading = ref(false)
const totalItems = ref(0)
const dateRange = ref('')
const filter = ref({
  size: 10,
  page: 1,
  search: "",
  operator: null,
  status: null,
  merchant: null,
  startDate: null,
  endDate: null
})
const showFilterModal = ref(false)
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
const statusOptions = [
  'CREATED',
  'FAILED',
  'NOT_FOUND',
  'EXPIRED',
  'TRANSMITTED',
  'DELIVERED',
  'REJECTED',
  'NOT_DELIVERED'
]
const CalendarIcon = () => h('img', {
  src: '/img/calendar.svg',
  style: 'width: 16px; height: 16px;'
})

watch([filter.value.page, filter.value.size], () => {
  fetchSms()
})
watch(dateRange, (newVal) => {
  filter.value.startDate = newVal?.[0] ? formatDateToIso(newVal[0]) : null
  filter.value.endDate   = newVal?.[1] ? formatDateToIso(newVal[1]) : null
  fetchSms()
})

const fetchSms = async () => {
  isLoading.value = true
  try {
    await smsStore.fetchSmses({...filter.value})
  } finally {
    isLoading.value = false
  }
}
const fetchOperators = () => {
  isLoading.value = true
  try {
    resourceStore.fetchOperators()
  } finally {
    isLoading.value = false
  }
}
const fetchMerchants = () => {
  isLoading.value = true
  try {
    resourceStore.fetchMerchants()
  } finally {
    isLoading.value = false
  }
}
const onPageChange = (newPage: number) => {
  filter.value.page = newPage
  fetchSms()
}
function clearFilter() {
  filter.value.page = 1
  filter.value.size = 10
  filter.value.operator = null
  filter.value.status = null
  filter.value.merchant = null
  filter.value.startDate = null
  filter.value.endDate = null
  filter.value.search = ''
}

onMounted(() => {
  fetchSms()
  fetchOperators()
  fetchMerchants()
})
</script>

<style>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px 0px;
  gap: 16px;
  margin-bottom: 16px;
}
.filter-date :deep(.el-input__wrapper),
.filter-search :deep(.el-input__wrapper) {
  background: #fff;
  border: none!important;
  box-shadow: none!important;
  border-radius: 14px;
  padding-left: 0;
  padding-right: 12px;
}
.filter-date :deep(.el-input__prefix),
.filter-search :deep(.el-input__prefix) {
  background: transparent;
  border: none!important;
}
.filter-bar .el-date-editor .el-input__wrapper,
.filter-bar .el-input__wrapper {
  background: transparent;
  border: none!important;
  box-shadow: none!important;
  border-radius: 14px;
  padding-left: 0;
  padding-right: 12px;
}
.filter-date :deep(.el-input__inner),
.filter-search :deep(.el-input__inner) {
  background: transparent;
  border: none!important;
  box-shadow: none;
}
.filter-btn {
  background: #fff;
  border: none;
  box-shadow: none;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  border-radius: 14px;
  height: 44px;
}
.filter-btn:hover {
  background: #f3f4f6;
}
.filter-btn-text {
  margin-left: 4px;
  font-size: 16px;
}
.filter-btn .el-button span {
  margin-left: 25px;
}
.filter-bar .el-input-group__prepend{
  box-shadow: none!important;
  padding: 0;
}
.filter-bar .el-date-editor.el-input__wrapper{
  box-shadow: none !important;
  padding: 0;
  width: 140% !important;
}
.pagination-text{
  white-space: nowrap!important;
}
el-select.pagination-select {
  width: 70px!important;

}
</style>