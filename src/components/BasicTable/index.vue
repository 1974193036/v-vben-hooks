<script setup>
import { computed, ref, toRaw, unref, useAttrs } from 'vue'
import { omit } from 'lodash-es'
import { basicProps } from './props'

const props = defineProps(basicProps)
const emit = defineEmits([
  'fetch-success',
  'fetch-error',
  'selection-change',
  'register',
  'row-click',
  'row-dbClick',
  'change',
])

const attrs = useAttrs()
const wrapRef = ref(null)
const tableElRef = ref(null)
const innerPropsRef = ref()

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) }
})

function setProps(props) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
}

const getRowClassName = (_record, index) => (index % 2 === 1 ? 'v-basic-table-row__striped' : null)
const maxTableWidth = 500

const getDataSourceRef = computed(() => props.dataSource)
const getHeaderProps = ref({})
const getLoading = computed(() => props.loading)
const getRowSelectionRef = ref(null)
const getRowKey = ref('id')
const getViewColumns = computed(() => props.columns)
const getPaginationInfo = computed(() => ({
  showSizeChanger: true,
  size: 'large',
  position: ['bottomRight'],
  pageSize: 10,
  ...props.pagination,
}))

const getBindValues = computed(() => {
  let propsData = {
    ...attrs,
    customRow: (_record, _index) => {},
    ...unref(getProps),
    ...unref(getHeaderProps),
    title: () => '基础示例',
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

const prefixCls = 'v-basic-table'
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

// 分页、排序、筛选变化时触发
function handleTableChange(pagination, filters, sorter, extra) {
  console.log(pagination, filters, sorter, extra)
}
// 拖动列时触发
function setColumnWidth(width, column) {
  console.log(width, column)
}
</script>

<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <a-table
      ref="tableElRef"
      v-bind="getBindValues"
      :row-class-name="getRowClassName"
      :scroll="{ x: maxTableWidth }"
      @change="handleTableChange"
      @resize-column="setColumnWidth"
    />
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
