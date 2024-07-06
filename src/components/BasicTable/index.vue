<script setup>
import { computed, ref, toRaw, unref, useAttrs, useSlots } from 'vue'
import { isFunction, omit } from 'lodash-es'
import { basicProps } from './props'
import { useLoading } from './hooks/useLoading'
import { useRowSelection } from './hooks/useRowSelection'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'
import { useColumns } from './hooks/useColumns'
import { useTableStyle } from './hooks/useTableStyle'
import { useCustomRow } from './hooks/useCustomRow'
import HeaderCell from './components/HeaderCell.vue'
import { useTableHeader } from './hooks/useTableHeader'
import { useTableForm } from './hooks/useTableForm'
import { BasicForm, useForm } from '@/components/BasicForm'

defineOptions({ name: 'BasicTable' })

const props = defineProps(basicProps)
const emit = defineEmits([
  'fetch-success',
  'fetch-error',
  'selection-change',
  'register',
  'row-click',
  'row-dbClick',
  'change',
  'columns-change',
])

const attrs = useAttrs()
const slots = useSlots()
const wrapRef = ref(null)
const tableElRef = ref(null)
const formRef = ref(null)
const innerPropsRef = ref()
const tableData = ref([])

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) }
})

function setProps(props) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
}

const { getLoading, setLoading } = useLoading(getProps)

const {
  getRowSelectionRef,
  getSelectRows,
  getSelectRowKeys,
  setSelectedRowKeys,
  setSelectedRows,
  clearSelectedRowKeys,
  deleteSelectRowByKey,
} = useRowSelection(getProps, tableData, emit)

function fetchData() {
  // eslint-disable-next-line no-use-before-define
  return fetch()
}
const {
  getPaginationInfo,
  getPagination,
  setPagination,
} = usePagination(getProps, fetchData)

const {
  getViewColumns,
  setColumnWidth, // 拖动列时触发
  maxTableWidth,
  getColumns,
  setColumns,
} = useColumns(getProps, getPaginationInfo)

const [registerForm, formActions] = useForm()

const {
  handleTableChange: onTableChange,
  getDataSourceRef,
  getDataSource,
  getRawDataSource,
  setTableData,
  reload,
  fetch,
  updateTableData,
  getRowKey,
  getAutoCreateKey,
} = useDataSource(
  getProps,
  {
    tableData, // 钩子内进行请求获取到列表数据时，把值同步给 tableData = 列表数据
    getPaginationInfo,
    setLoading,
    setPagination,
    // 绑定表单的查询数据
    getFieldsValue: formActions.getFieldsValue,
    clearSelectedRowKeys,
  },
  emit,
)

const { customRow } = useCustomRow(getProps, {
  setSelectedRowKeys,
  getSelectRowKeys,
  clearSelectedRowKeys,
  getAutoCreateKey,
  emit,
})

const prefixCls = 'v-basic-table'
const { getRowClassName } = useTableStyle(getProps, prefixCls)

// const getRowClassName = (_record, index) => (index % 2 === 1 ? 'v-basic-table-row__striped' : null)
// const maxTableWidth = 500

const { getHeaderProps } = useTableHeader(getProps, slots)

// const getDataSourceRef = computed(() => props.dataSource)
// const getHeaderProps = ref({})
// const getLoading = computed(() => props.loading)
// const getRowSelectionRef = ref(null)
// const getRowKey = ref('id')
// const getViewColumns = computed(() => unref(getProps).columns)
// const getPaginationInfo = computed(() => ({
//   showSizeChanger: true,
//   size: 'large',
//   position: ['bottomRight'],
//   pageSize: 10,
//   ...props.pagination,
// }))

const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange }
    = useTableForm(getProps, slots, fetch, getLoading)

const getBindValues = computed(() => {
  let propsData = {
    ...attrs,
    // customRow: (_record, _index) => {},
    customRow,
    ...unref(getProps),
    ...unref(getHeaderProps),
    loading: unref(getLoading),
    tableLayout: 'fixed',
    rowSelection: unref(getRowSelectionRef)
      ? {
          columnWidth: 50,
          ...unref(getRowSelectionRef),
        }
      : null,
    rowKey: unref(getRowKey),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource: unref(getDataSourceRef),
  }

  propsData = omit(propsData, ['class', 'onChange'])
  return propsData
})

const getWrapperClass = computed(() => {
  const values = unref(getBindValues)
  return [
    prefixCls,
    attrs.class,
    {
      [`${prefixCls}-form-container`]: values.useSearchForm,
      [`${prefixCls}--inset`]: values.inset,
    },
  ]
})

const tableAction = {
  setProps,
  setLoading,
  getSelectRows,
  getSelectRowKeys,
  setSelectedRowKeys,
  setSelectedRows,
  clearSelectedRowKeys,
  deleteSelectRowByKey,
  setPagination,
  getPagination,
  getDataSource,
  getRawDataSource,
  setTableData,
  reload,
  updateTableData,
  getColumns,
  setColumns,
}

emit('register', tableAction)

// 分页、排序、筛选变化时触发
function handleTableChange(pagination, filters, sorter, extra) {
  // console.log(pagination, filters, sorter, extra)
  onTableChange()
  emit('change', pagination, filters, sorter)
  // 解决通过useTable注册onChange时不起作用的问题
  const { onChange } = unref(getProps)
  onChange && isFunction(onChange) && onChange(pagination, filters, sorter, extra)
}
</script>

<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      ref="formRef"
      v-bind="getFormProps"
      @register="registerForm"
      @submit="handleSearchInfoChange"
    >
      <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
      <!-- 相当于
      <template #desc="data">
        <slot name="form-desc" v-bind="data || {}" />
      </template> -->
    </BasicForm>
    <a-table
      ref="tableElRef"
      v-bind="getBindValues"
      :row-class-name="getRowClassName"
      :scroll="{ x: maxTableWidth }"
      @change="handleTableChange"
      @resize-column="setColumnWidth"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}" />
      </template>
      <!-- 相当于
      <template #toolbar="data">
        <slot name="toolbar" v-bind="data || {}" />
      </template> -->

      <template #headerCell="{ column }">
        <slot name="headerCell" v-bind="{ column }">
          <HeaderCell :column="column" />
        </slot>
      </template>

      <template #bodyCell="data">
        <slot name="bodyCell" v-bind="data || {}" />
      </template>
    </a-table>
  </div>
</template>

<style>
.v-basic-table-row__striped td {
  background-color: #f7f7f7;
}

.v-basic-table-row__striped .ant-table-cell-fix-right,
.v-basic-table-row__striped .ant-table-cell-fix-left {
  background-color: #f7f7f7;
}
</style>
