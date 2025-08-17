<template>
  <v-container fluid class="operations-registry-container">
    <!-- Filters Section -->
    <div style="justify-content: space-between;" class="d-flex  align-start">
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
            v-model.lazy="searchQuery"
            class="search-field"
            size="large"
            placeholder="Поиск"
        >
          <template #prepend>
            <img src="/img/search.svg" style="width: 24px; height: 24px; margin-right: 8px;" />
          </template>
        </el-input>
      </div>

      <div class="filter-group">
        <el-select v-model="statusFilter" placeholder="Статус" size="large"  class="filter-box">
          <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>

      </div>

      <div class="filter-group">
        <el-select v-model="reportTypeFilter" placeholder="Тип отчета" size="large"  class="filter-box">
          <el-option
              v-for="item in reportTypeOptions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </div>

      <div class="filter-group">
        <v-btn
          color="primary"
          variant="text"
          class="reset-btn right"
          @click="clearFilter"
        >
          Сбросить
        </v-btn>
      </div>
      </div>

      <div >
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          class="create-btn"
          @click="createDialog = true"
        >
          Создать
        </v-btn>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="operations"
        :items-per-page="parseInt(itemsPerPage)"
        :search="searchQuery"
        class="operations-table"
        hide-default-footer
      >
        <template #item.index="{ index }">
          <span class="row-number">{{ index + 1 }}</span>
        </template>

        <template #item.id="{ item }">
          <span class="operation-id">{{ item.id }}</span>
        </template>

        <template #item.date="{ item }">
          <span class="date-text">{{ item.date }}</span>
        </template>

        <template #item.period="{ item }">
          <span class="period-text">{{ item.period }}</span>
        </template>

        <template #item.name="{ item }">
          <span class="name-text">{{ item.name }}</span>
        </template>

        <template #item.type="{ item }">
          <span class="type-text">{{ item.type }}</span>
        </template>

        <template #item.orgStructure="{ item }">
          <span class="structure-text">{{ item.orgStructure }}</span>
        </template>

        <template #item.status="{ item }">
          <v-chip
          v-if="item.status"
            :color="getStatusColor(item.status)"
            :style="getChipStyle(item.status)"
            size="small"
            variant="flat"
            class="status-chip"
          >
            {{ item.status  }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            v-if="item.file"
            variant="text"
            size="small"
            class="action-btn"
            @click="downloadReport(item)"
          >
            <img src="/img/download-black.svg" alt="" />
          </v-btn>
        </template>
      </v-data-table>

      <!-- Custom Pagination -->
       <div class="d-flex justify-space-between mx-4 my-2">
                <div class="d-flex align-center" style="gap:8px">
                <span class="pagination-text">Показано</span>
                <span style="border:1px solid #D1D5DB; padding: 10px; border-radius: 14px;">{{ page }}</span>
                <span class="pagination-text"> из {{ lastPage }}</span>
              </div>
              <v-pagination
              v-model="page"
              :length="lastPage"
              :total-visible="5"
              color="primary"
              size="small"
              @update:model-value="fetchServices"
              />
            </div>
    </div>

    <el-dialog
      v-model="createDialog"
      title="Создать запрос"
      class="create-dialog"
      width="500"
    >
      <el-form :model="form" label-width="auto" class="create-form" style="max-width: 600px">
        <el-row class="form-row">
          <el-col :span="8" class="label-cell">
            <span class="label">Название:</span>
          </el-col>
          <el-col :span="16">
            <el-input type="text" size="large" v-model="form.name" placeholder="Например: Отчёт за ХХХ-ХХ-ХХ" />
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="8" class="label-cell">
            <span class="label">Дата ОТ:</span>
          </el-col>
          <el-col :span="16">
            <el-date-picker
              v-model="form.fromDate"
              type="date"
              size="large"
              placeholder="Выберите дату"
              style="width: 100%"
            >
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="8" class="label-cell">
            <span class="label">Дата ДО:</span>
          </el-col>
          <el-col :span="16">
            <el-date-picker
              size="large"
              v-model="form.toDate"
              type="date"
              placeholder="Выберите дату"
              style="width: 100%"
            />
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="8" class="label-cell">
            <span class="label">Структура орг:</span>
          </el-col>
          <el-col :span="16">
            <el-select v-model="form.serviceId" placeholder="" size="large">
              <el-option v-for="item of serviceOptions" :label="item.title" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <div class="d-flex" style="width: 100%;">
            <el-button 
              @click="createDialog = false" 
              class="dialog-btn" 
              style="flex: 1;">
              Отмена
            </el-button>
            <el-button 
              style="flex: 1; background-color: #2563EB; color: white;" 
              @click="sendFilter" 
              class="dialog-btn">
              Создать
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="excelDialog"
        title="Создать запрос"
        class="excel-dialog"
        width="80%"
    >
      <div id="preview" v-if="excelData">
        <el-table stripe :data="excelData.slice(1)" style="width: 100%" height="65vh">
          <el-table-column v-for="(item, index) in excelData[0]" :prop="index == 0 ? '0' : index" :label="item" width="150" />
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createDialog = false">Cancel</el-button>
          <el-button style="background-color: #2563EB;" @click="saveFile">
            Создать
          </el-button>
        </div>
      </template>
    </el-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useOperationRegistry } from '@/stores/operationRegistry'
import { usePaymentHistoryStore } from '@/stores/paymentHistory'
import * as XLSX from 'xlsx';
import { useUsersStore } from '@/stores/users'
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import {ElMessage} from "element-plus";
import { useAuthStore } from '@/stores/auth'

// Store and state management
const operationStore = useOperationRegistry()
const paymentHistoryStore = usePaymentHistoryStore()
const usersStore = useUsersStore()
const loading = ref(false)
const error = ref(null)
const excelData = ref([])
const excelDialog = ref(false)
const page = ref(1)
const itemsPerPage = ref('10')
const lastPage = ref(1)
const totalCount = ref(0)
// Pagination and filtering
const searchQuery = ref('')
const statusFilter = ref('')
const reportTypeFilter = ref('')
const createDialog = ref(false)
const authStore = useAuthStore()
const operations = computed(() => {
  const data = []
  if (operationStore.getOperations) {
    for (const item of operationStore.getOperations) {
      data.push({
        id: item.id,
        name: item.name,
        date: formatDate(item.date),
        period: formatDate(item.fromDate) + ' - ' + formatDate(item.toDate),
        file: item.file,
        orgStructure:item.orgStructure  
      })
    }
  }
  return data
})

const formatDate = (date) => {
  if (date) {
    return  String(date[2]).padStart(2, '0') + '.' + String(date[1]).padStart(2, '0') + '.' + date[0] + ' ' + String(date[3]).padStart(2, '0') + ':' + String(date[4]).padStart(2, '0')
  }
  return ''
}
// Form data
const form = ref({
  serviceId: null,
  name: '',
  fromDate: '',
  toDate: '',
  file: null
})

onMounted(() => {
  fetchServices()
})
// Options for filters and dropdowns
const itemsPerPageOptions = ['10', '25', '50', '100']
const statusOptions = ['Все статусы', 'В процессе', 'Обработана', 'Ошибка']
const reportTypeOptions = ['Все типы', 'Пополнение', 'Снятие', 'Оплата', 'Выплата на карту']

// Table headers
const headers = [
  { title: 'ID', key: 'id', width: '80px', sortable: true },
  { title: 'Дата', key: 'date', width: '150px', sortable: true },
  { title: 'Период', key: 'period', width: '200px', sortable: true },
  { title: 'Название', key: 'name', width: '200px', sortable: true },
  { title: 'Структура орг.', key: 'orgStructure', width: '200px', sortable: true },
  // { title: 'Тип', key: 'type', width: '150px', sortable: true },
  { title: 'Статус', key: 'status', width: '120px', sortable: true },
  { title: '', key: 'actions', width: '60px', sortable: false },
]

// Fetch operations with error handling
const fetchOperations = async () => {
  loading.value = true
  error.value = null

  try {
    const filters = {
      page: page.value,
      perPage: itemsPerPage.value,
      search: searchQuery.value,
      status: statusFilter.value === 'Все статусы' ? '' : statusFilter.value,
      type: reportTypeFilter.value === 'Все типы' ? '' : reportTypeFilter.value
    }

    const response = await operationStore.fetchOperations(filters)
    totalCount.value = response.totalCount || 0
    lastPage.value = Math.max(1, Math.ceil(totalCount.value / itemsPerPage.value))
  } catch (err) {
    error.value = err.message || 'Failed to fetch operations'
    console.error('Error fetching operations:', err)
  } finally {
    loading.value = false
  }
}
const userRoles = computed(() => authStore.user?.roles || [])
const fetchServices = () => {
  if (userRoles.value.includes('ROLE_ADMIN')) {
     usersStore.fetchUsers()
  }
  else{
    usersStore.fetchUsersService(authStore.user?.id)
  }
}

const serviceOptions = computed(() => {
  const options = usersStore.users.map(item => {
    return {
      title: item.merchantName,
      value: item.id
    }
  })
  return options
})

// Computed operations with filtering
const filteredOperations = computed(() => {
  let ops = operationStore.getOperations || []
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    ops = ops.filter(op => 
      op.name?.toLowerCase().includes(query) ||
      op.type?.toLowerCase().includes(query) ||
      op.structure?.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value && statusFilter.value !== 'Все статусы') {
    ops = ops.filter(op => op.status === statusFilter.value)
  }
  
  // Apply report type filter
  if (reportTypeFilter.value && reportTypeFilter.value !== 'Все типы') {
    ops = ops.filter(op => op.type === reportTypeFilter.value)
  }
  
  return ops
})




const sendFilter = () => {
  const f = {...form.value}
  delete f.name
  delete f.file
  f.fromDate = formatDateToIso(f.fromDate)
  f.toDate = formatDateToIso(f.toDate)
  paymentHistoryStore.downloadExcel(f).then((res) => {
    if (res) {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const reader = new FileReader()
      blobToBase64(blob).then(f =>{
        form.value.file = f
      })
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        // const html = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName])
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
        excelData.value = json
        // excelData.value = html
        excelDialog.value = true
        createDialog.value = false
      }
      reader.readAsArrayBuffer(blob);
    }
  }).finally(() => {
    loading.value = false
  })
}

const saveFile = () => {
  const f = {...form.value}
  f.fromDate = formatDateToIso(f.fromDate)
  f.toDate = formatDateToIso(f.toDate)
  f.date = formatDateToIso(new Date())
  // orgStructure va orgId ni ham qo‘shing, agar kerak bo‘lsa
  const selectedService = serviceOptions.value.find(item => item.value === f.serviceId)
  if (selectedService) {
    f.orgStructure = selectedService.title
    f.orgId = f.serviceId
  }
  delete f.serviceId
  operationStore.save(f).then(res => {
    ElMessage.success("Success")
    excelDialog.value = false
    fetchOperations()
  })
}
// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'В процессе': return '#E2FBE8'
    case 'Обработана': return '#EFF6FF'
    case 'Ошибка': return '#FEF2F2'
    default: return 'success'
  }
}
const getChipStyle = (status: string) => {
  switch (status) {
     case 'В процессе': return 'color: #1B3822'
    case 'Обработана': return 'color: #2563EB'
    case 'Ошибка': return 'color: #DC2626'
    default:  return 'color: #000000';               // Oddiy qora yozuv
  }
};
const formatDateToIso = (date) => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}


const downloadReport = (item: any) => {
  const link = document.createElement("a");
  link.href = item.file
  link.download = item.name + '.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}




const clearFilter = () => {
  itemsPerPage.value = 10
  searchQuery.value = ''
  statusFilter.value = ''
  reportTypeFilter.value = ''
}
watch([page, itemsPerPage, searchQuery, statusFilter, reportTypeFilter], () => {
  // Reset to first page when filters change
  if (page.value !== 1) {
    page.value = 1
  } else {
    fetchOperations()
  }
}, { deep: true })
// Initial fetch
onMounted(() => {
  fetchOperations()
  fetchServices()
})
</script>

<style scoped>
.operations-registry-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  min-width: 220px;
}

.filter-group:first-child {
  min-width: 80px; 
}

.status-select,
.report-type-select {
  width: 150px;
}

.reset-btn,
.create-btn {
  height: 40px;
  text-transform: none;
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  border-radius: 50px;
  padding: 0 20px;
}

.create-btn {
  background: #4F7DF3;
}

.create-btn:hover {
  background: #3d6ae6;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.operations-table {
  font-family: 'Mulish', sans-serif;
}

:deep(.v-data-table__th) {
  background-color: #f8f9fc;
  font-family: 'Mulish', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #e5e7eb;
  height: 48px;
  padding: 12px 16px;
}

:deep(.v-data-table__td) {
  font-family: 'Mulish', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
  height: 56px;
  padding: 12px 16px;
}

.row-number {
  font-weight: 500;
  color: #666;
}

.operation-id {
  font-weight: 500;
  color: #2563eb;
}

.date-text,
.period-text,
.name-text,
.type-text,
.structure-text {
  font-weight: 400;
  color: #1a1a1a;
}

.status-chip {
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 12px;
}

.action-btn {
  color: #666;
}

.action-btn:hover {
  color: #2563eb;
}

/* Dropdown Styles */
.dropdown-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.dropdown-header {
  background-color: #f8f9fc;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-title {
  font-family: 'Mulish', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
}

.dropdown-item {
  font-family: 'Mulish', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  padding: 8px 16px;
}

.dropdown-item:hover {
  background-color: #f8f9fc;
}

/* Field Styles */
:deep(.v-field) {
  border-radius: 8px;
  font-family: 'Mulish', sans-serif;
}

:deep(.v-field__input) {
  font-size: 14px;
  padding: 8px 12px;
}

:deep(.v-field__input::placeholder) {
  color: #9ca3af;
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .filters-section {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .search-field,
  .status-select,
  .report-type-select {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-field,
  .status-select,
  .report-type-select {
    width: 100%;
  }


  :deep(.v-data-table) {
    font-size: 12px;
  }

  :deep(.v-data-table__th),
  :deep(.v-data-table__td) {
    padding: 8px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .operations-registry-container {
    padding: 16px;
  }
  
  .table-container {
    overflow-x: auto;
  }
}
:deep(.v-select .v-select__selection-text) {
  overflow: unset !important;
  text-overflow: unset !important;
  white-space: normal !important;
}
.v-card {
  border-radius: 20px !important;
}
.v-card-title {
  font-size: 20px;
  font-weight: 600;
  font-family: 'Mulish', sans-serif;
}

.v-btn--outlined {
  color: #4F7DF3;
  border-color: #4F7DF3;
}
.v-btn--contained, .v-btn--flat {
  background: #4F7DF3;
  color: #fff;
}
.v-btn--contained:hover, .v-btn--flat:hover {
  background: #3d6ae6;
}
.filters-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  min-width: 220px;
}

:deep(.v-field) {
  border-radius: 12px;
  font-size: 16px;
}
:deep(.v-select .v-select__selection-text) {
  overflow: unset !important;
  text-overflow: unset !important;
  white-space: normal !important;
}
:deep(.v-field) {
  border-radius: 12px;
  font-size: 16px;
}

:deep(.el-input__wrapper){
  color:#262626 ;
  box-shadow: none;
}

:deep(.el-select__wrapper){
  color:#262626 ;
  box-shadow: none;
}
:deep(.el-input-group__prepend){
  color:#262626;
  box-shadow: none;
  background-color: #fff;
  border-radius: 16px 0px 0px 16px;
  padding: 0px 0px 0px 10px;
}
:deep(.filter-box .el-select__wrapper) {
  border-radius: 16px !important;
  height: 40px !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  align-items: center;
  color: #262626 !important;

}

:deep(.search-field .el-input__wrapper) {
  border-radius: 0px 16px 16px 0px !important;
  height: 40px !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  align-items: center;
  color: #262626 !important;
  padding-left: 0px !important;
}

/* el-date-picker uchun alohida style */
:deep(.filter-box.el-date-editor) {
  border-radius: 16px !important;
  height: 40px !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  display: flex;
  align-items: center;
  width: 100%;
}
:deep(.operations-table thead th) {
  background-color: white !important;
}
:deep(.create-dialog .el-input__wrapper) {
  border-radius: 16px !important;
  border:1px solid #E5E7EB;
}
:deep(.create-dialog .el-select__wrapper) {
  border-radius: 16px !important;
  border:1px solid #E5E7EB;
}
</style>
<style>
.el-input__wrapper, .el-select__wrapper {
  border-radius: 10px !important;
}

.create-dialog {
  border-radius: 16px;
}
.create-dialog .el-dialog__header span, .excel-dialog .el-dialog__header span {
  color: black;
  font-weight: bold;
}
.create-dialog .create-form .form-row {
  padding: 8px 0px;
}
.create-form .el-input__wrapper .el-input__prefix {
  display: none;
}
.dialog-btn {
  border-radius: 50px;
  height: 40px;
}
.label-cell {
  display: flex;
  align-items: center;
}
.label {
  font-weight: 500;
}
</style>