import { computed, onMounted, ref, toRaw, unref, watch, watchEffect } from 'vue'
import { cloneDeep, get, isBoolean, isFunction, merge } from 'lodash-es'
import { useTimeoutFn } from '@vueuse/core'
import { buildUUID } from '@/utils/uuid'

const ROW_KEY = 'id'
const PAGE_SIZE = 10

export function useDataSource(getProps, {
  tableData,
  getPaginationInfo,
  setPagination,
  setLoading,
  getFieldsValue,
  clearSelectedRowKeys,
}, emit) {
  const dataSourceRef = ref([])
  const rawDataSourceRef = ref({})

  watchEffect(() => {
    tableData.value = unref(dataSourceRef)
  })

  watch(
    () => unref(getProps).dataSource,
    () => {
      const { dataSource, api } = unref(getProps)
      !api && dataSource && (dataSourceRef.value = dataSource)
    },
    {
      immediate: true,
    },
  )

  const getAutoCreateKey = computed(() => {
    return unref(getProps).autoCreateKey && !unref(getProps).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(getProps)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  function setTableKey(items) {
    if (!items || !Array.isArray(items))
      return
    items.forEach((item) => {
      if (!item[ROW_KEY])
        item[ROW_KEY] = buildUUID()

      if (item.children && item.children.length)
        setTableKey(item.children)
    })
  }

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef)
    if (!dataSource || dataSource.length === 0)
      return unref(dataSourceRef)

    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0]
      const lastItem = dataSource[dataSource.length - 1]

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = cloneDeep(unref(dataSourceRef))
          data.forEach((item) => {
            if (!item[ROW_KEY])
              item[ROW_KEY] = buildUUID()

            if (item.children && item.children.length)
              setTableKey(item.children)
          })
          dataSourceRef.value = data
        }
      }
    }
    return unref(dataSourceRef)
  })

  async function fetch(opt) {
    const {
      api,
      searchInfo,
      fetchSetting,
      beforeFetch,
      afterFetch,
      useSearchForm,
      pagination,
    } = unref(getProps)
    if (!api || !isFunction(api))
      return
    try {
      setLoading(true)
      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        fetchSetting,
      )
      let pageParams = {}

      const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo)

      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {}
      }
      else {
        pageParams[pageField] = (opt && opt.page) || current
        pageParams[sizeField] = pageSize
      }

      let params = merge(
        pageParams,
        // 获取表单数据，加入到请求参数中
        useSearchForm ? getFieldsValue() : {},
        useSearchForm ? {} : {},
        searchInfo, // 额外的请求参数
        opt?.searchInfo ?? {},
      )
      console.log('params', params)
      if (beforeFetch && isFunction(beforeFetch))
        params = (await beforeFetch(params)) || params

      const res = await api(params)
      rawDataSourceRef.value = res
      // console.log('res', res)

      const isArrayResult = Array.isArray(res)

      let resultItems = isArrayResult ? res : get(res, listField)
      const resultTotal = isArrayResult ? res.length : get(res, totalField)

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (Number(resultTotal)) {
        const currentTotalPage = Math.ceil(resultTotal / pageSize)
        if (current > currentTotalPage) {
          setPagination({
            current: currentTotalPage,
          })
          return await fetch(opt)
        }
      }

      if (afterFetch && isFunction(afterFetch))
        resultItems = (await afterFetch(resultItems)) || resultItems

      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal || 0,
      })
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        })
      }
      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      })
      return resultItems
    }
    catch (error) {
      emit('fetch-error', error)
      dataSourceRef.value = []
      setPagination({
        total: 0,
      })
    }
    finally {
      setLoading(false)
    }
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(getProps).immediate && fetch()
    }, 16)
  })

  function setTableData(values) {
    dataSourceRef.value = values
  }

  function getDataSource() {
    return toRaw(getDataSourceRef.value)
  }

  function getRawDataSource() {
    return toRaw(rawDataSourceRef.value)
  }

  async function reload(opt) {
    return await fetch(opt)
  }

  function handleTableChange() {
    const { clearSelectOnPageChange } = unref(getProps)
    if (clearSelectOnPageChange)
      clearSelectedRowKeys()
  }

  async function updateTableData(index, key, value) {
    const record = dataSourceRef.value[index]
    if (record)
      dataSourceRef.value[index][key] = value

    return dataSourceRef.value[index]
  }

  return {
    getDataSourceRef,
    getRowKey,
    fetch,
    setTableData,
    getDataSource,
    getRawDataSource,
    reload,
    updateTableData,
    handleTableChange,
  }
}
