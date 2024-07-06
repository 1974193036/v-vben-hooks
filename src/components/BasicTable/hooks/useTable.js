import { onUnmounted, ref, toRaw, unref, watch } from 'vue'

function isProdMode() {
  return import.meta.env.PROD
}

function getDynamicProps(props) {
  const ret = {}

  Object.keys(props).map((key) => {
    ret[key] = unref(props[key])
    return ret[key]
  })

  return ret
}

export function useTable(tableProps) {
  const tableRef = ref(null)
  const loadedRef = ref(false)

  const formRef = ref(null)

  let stopWatch

  function register(instance, formInstance) {
    isProdMode()
      && onUnmounted(() => {
        tableRef.value = null
        loadedRef.value = null
      })

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef))
      return

    tableRef.value = instance
    formRef.value = formInstance
    tableProps && instance.setProps(getDynamicProps(tableProps))
    loadedRef.value = true

    stopWatch?.()

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps))
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  function getTableInstance() {
    const table = unref(tableRef)
    if (!table) {
      console.error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      )
    }
    return table
  }

  const methods = {
    reload: async (opt) => {
      return await getTableInstance().reload(opt)
    },
    setProps: (props) => {
      getTableInstance().setProps(props)
    },
    setSelectedRows: (rows) => {
      return toRaw(getTableInstance().setSelectedRows(rows))
    },
    setLoading: (loading) => {
      getTableInstance().setLoading(loading)
    },
    getDataSource: () => {
      return getTableInstance().getDataSource()
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource()
    },
    getColumns: () => {
      const columns = getTableInstance().getColumns() || []
      return toRaw(columns)
    },
    setColumns: (columns) => {
      getTableInstance().setColumns(columns)
    },
    setTableData: (values) => {
      return getTableInstance().setTableData(values)
    },
    setPagination: (info) => {
      return getTableInstance().setPagination(info)
    },
    getSelectRowKeys: () => {
      return toRaw(getTableInstance().getSelectRowKeys())
    },
    getSelectRows: () => {
      return toRaw(getTableInstance().getSelectRows())
    },
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys()
    },
    setSelectedRowKeys: (keys) => {
      getTableInstance().setSelectedRowKeys(keys)
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize())
    },
    getForm: () => {
      return unref(formRef)
    },
  }

  return [register, methods]
}
