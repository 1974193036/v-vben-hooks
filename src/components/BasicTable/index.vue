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

const dataSource = []
const getHeaderProps = ref({})
const getLoading = ref(false)
const getRowSelectionRef = ref({})
const getRowKey = ref('id')
const getViewColumns = ref([])
const getPaginationInfo = ref({})
const getBindValues = computed(() => {
  let propsData = {
    ...attrs,
    customRow: () => {},
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
    dataSource,
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
</script>

<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <div v-bind="getBindValues">
      123
    </div>
  </div>
</template>
