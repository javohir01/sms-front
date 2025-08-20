<template>
  <v-container fluid class="sms-container">
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
          v-model.lazy="filter.phoneNumber"
          class="filter-search"
          size="large"
          placeholder="Поиск"
          clearable
          @keyup.enter="fetchSmsFrame"
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

    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="smsStore?.smsFrames?.content"
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
          <v-chip
            :color="getStatusColor(item.status)"
            :style="getChipStyle(item.status)"
            size="small"
            variant="flat"
            style="border-radius: 6px;"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.createdDate="{ item }">
          <div class="d-flex flex-column gap-2  ">
            <span class="date-text">Дата отправки:{{ new Date(item.createdDate).toLocaleString() }}</span>
            <span class="date-text">Дата доставки:{{ new Date(item.modifiedDate).toLocaleString() }}</span>
          </div>
        </template>
      </v-data-table>
        <v-btn
          color="primary"
          variant="flat"
          class="export-btn"
          prepend-icon="mdi-export"
          @click="exportSms"
        >
          Экспорт
        </v-btn>
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
    <!-- Filter Modal -->
     <el-dialog v-model="showFilterModal" width="360px" custom-class="filter-dialog">
      <template #header>
        <div class="filter-header">
          <span>Фильтры</span>
          <el-button text icon="el-icon-close" @click="showFilterModal = false"></el-button>
        </div>
      </template>

      <el-collapse v-model="activeCollapse" accordion class="filter-collapse">
        <!-- Operator -->
        <el-collapse-item name="operator">
          <template #title>
            <span class="filter-title">По оператору</span>
          </template>
          <el-radio-group v-model="filter.operator" class="filter-radio-group">
            <el-radio v-for="op in resourceStore.operators" :key="op.id" :label="op.id">
              {{ op.name }}
            </el-radio>
          </el-radio-group>
        </el-collapse-item>

        <!-- Status -->
        <el-collapse-item name="status">
          <template #title>
            <span class="filter-title">По статусу</span>
          </template>
          <el-radio-group v-model="filter.status" class="filter-radio-group">
            <el-radio v-for="s in statusOptions" :key="s" :label="s">{{ s }}</el-radio>
          </el-radio-group>
        </el-collapse-item>

        <!-- Merchant -->
        <el-collapse-item name="merchant">
          <template #title>
            <span class="filter-title">По отправителю</span>
          </template>
          <el-radio-group v-model="filter.merchant" class="filter-radio-group">
            <el-radio
              v-for="m in resourceStore.merchants"
              :key="m.merchant"
              :label="m.merchant"
            >
              {{ m.merchantId }}
            </el-radio>
          </el-radio-group>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div class="filter-footer">
          <el-button 
            class="btn-reset"
            text 
            @click="clearFilter"
          > 
            Сбросить
          </el-button>
          <el-button 
            type="primary" 
            class="btn-apply" 
            @click="applyFilter"
          > 
            Применить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, h, watch, onMounted } from 'vue'
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
  phoneNumber: "",
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
  { title: 'Отправитель', key: 'originator', width: '200px' },
  { title: 'Шаблон', key: 'content', width: '500px' },
  { title: 'Статус', key: 'status', width: '200px' },
  { title: 'Дата', key: 'createdDate', width: '500px' },
]
const statusOptions = [
  'DRAFT',
  'PENDING_APPROVAL',
  'ACTIVE',
  'INACTIVE',
  'REJECTED'
]
const CalendarIcon = () => h('img', {
  src: '/img/calendar.svg',
  style: 'width: 16px; height: 16px;'
})

watch([filter.value.page, filter.value.size], () => {
  fetchSmsFrame()
})
watch(dateRange, (newVal) => {
  filter.value.startDate = newVal?.[0] ? formatDateToIso(newVal[0]) : null
  filter.value.endDate   = newVal?.[1] ? formatDateToIso(newVal[1]) : null
  fetchSmsFrame()
})

const fetchSmsFrame = async () => {
  isLoading.value = true
  try {
    await smsStore.fetchSmsFrames({...filter.value})
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
  fetchSmsFrame()
}
function applyFilter() {
  fetchSmsFrame()
  showFilterModal.value = false
}
function clearFilter() {
  filter.value.page = 1
  filter.value.size = 10
  filter.value.operator = null
  filter.value.status = null
  filter.value.merchant = null
  filter.value.startDate = null
  filter.value.endDate = null
  filter.value.phoneNumber = ''
  // showFilterModal.value = false
}
const exportSms = () => {
  isLoading.value = true
  const f = {...filter}
  smsStore.smsFrameExport({...filter.value}).then((res) => {
    if (res) {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'smsTemplates.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }).finally(() => {
    isLoading.value = false
  })
}
const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return '#DDF7FB'
      case 'PENDING_APPROVAL': return '#FEF2F2'
      case 'ACTIVE': return '#FEF2F2'
      case 'INACTIVE': return '#F7EFFF'
      case 'REJECTED': return '#EFF6FF'
      default: return '#E2E3E5'
    }
  }
const getChipStyle = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'color: #1B3822';
    case 'PENDING_APPROVAL': return 'color: #B17700'
    case 'ACTIVE': return 'color: #DC2626'
    case 'INACTIVE': return 'color: #000000'
    case 'REJECTED': return 'color: #2563EB'
    default: return '#E2E3E5'
  }
};

onMounted(() => {
  fetchSmsFrame()
  fetchOperators()
  fetchMerchants()
})
</script>

<style>
.filter-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px 20px;
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
.filter-dialog {
  border-radius: 16px;
  padding: 0;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding: 4px 8px;
}

/* Collapse */
.filter-collapse {
  border: none;
}
.filter-title {
  font-weight: 500;
  color: #111827;
  font-size: 15px;
}
.el-collapse-item__header {
  background: transparent !important;
  padding: 10px 0;
}
.el-collapse-item__content {
  padding: 4px 0 10px 0 !important;
}

/* Radio buttons */
.filter-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.sms-container .el-radio {
  margin-right: 0 !important;
}
.sms-container .el-radio__label {
  font-size: 14px;
  color: #111827;
}
.sms-container .el-radio.is-checked .el-radio__inner {
  border-color: #2563eb;
  background: #2563eb;
}
.sms-container .el-radio__inner {
  width: 18px;
  height: 18px;
}

/* Footer buttons */
.sms-container .filter-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0px;
}
.btn-reset {
  color: #ef4444;
  font-weight: 500;
}
.btn-apply {
  background: #2563eb;
  border-radius: 20px;
  font-weight: 500;
  color: #fff;
  padding: 8px 18px;
}
.sms-container .el-dialog__headerbtn{
  top:10px;
  right: 10px;
}
.btn-reset.el-button, .btn-reset.el-button.is-round {
  padding: 8px 0px;
}
.sms-container .el-select--large{
  width: 90%;
}
.sms-container .el-select--large .el-select__wrapper {
  width: 100px!important;
}
.table-container {
  position: relative;
}
.export-btn{
  background: #2563eb;
  color: #fff;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 500;
  position: absolute;
  right: 20px; 
  top: 10px;
}
</style>