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
          format="YYYY-MM-DD HH:mm:ss"
          :prefix-icon="CalendarIcon"
        >
          <!-- <template #prefix>
            <img src="/img/calendar.svg" style="width: 18px; height: 18px;" />
          </template> -->
        </el-date-picker>
        <el-input
          v-model.lazy="filter.comment"
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
        <el-input v-model="filter.comment" placeholder="Комментарий" style="margin-bottom: 12px;" />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator=" - "
          start-placeholder="Дата от"
          end-placeholder="Дата до"
          style="margin-bottom: 12px;"
        />
        <!-- Qo'shimcha filterlar -->
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
          {{ item.isManual ? 'Ручное' : 'Автоматическое' }}
        </template>

        <template #item.amount="{ item }">
<!--          <span class="amount-text" :class="{ 'negative': String(item.amount).includes('-') }">-->
<!--           {{ (item.type == 'INCOME'?'': '-') + formatSum(item.amount) }}-->
<!--          </span>-->
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
import { ref, h, onMounted } from 'vue'
import { ElDatePicker, ElInput, ElButton, ElDialog } from 'element-plus'
import {useSmsStore} from "@/stores/sms";

const smsStore = useSmsStore()

const dateRange = ref('')
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
const CalendarIcon = () => h('img', {
  src: '/img/calendar.svg',
  style: 'width: 16px; height: 16px;'
})

const fetchSms = async () => {
  isLoading.value = true
  try {
      const response = await smsStore.fetchSmses({
        page: 1,
        limit: itemsPerPage.value,
        search: searchQuery.value,
        fromDate: dateRange.value ? new Date(dateRange.value).toISOString() : null,
        toDate: dateRange2.value ? new Date(dateRange2.value).toISOString() : null
      }).then(res => {
        totalItems.value = res?.totalElements || 0
        lastPage.value = Math.ceil(totalItems.value / parseInt(itemsPerPage.value))
      })

  } finally {
    isLoading.value = false
  }
}
function clearFilter() {
  dateRange.value = ''
  itemsPerPage.value = '5'
  filter.value.comment = ''
}

onMounted(() => {
  fetchSms()
})
</script>

<style scoped>
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
.el-date-editor .el-input__wrapper,
.el-input__wrapper {
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
.el-input-group__prepend{
  box-shadow: none!important;
  padding: 0;
}
.filter-btn .el-button span {
  margin-left: 25px;
}
</style>