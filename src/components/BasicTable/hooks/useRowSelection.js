import { computed, shallowRef, toRaw, unref, watch } from 'vue'
import { isFunction, omit } from 'lodash-es'

const ROW_KEY = 'id'
const DEFAULT_CONFIG = {
  id: 'id',
  children: 'children',
  pid: 'pid',
}
const getConfig = config => Object.assign({}, DEFAULT_CONFIG, config)

function findNodeAll(
  tree,
  func,
  config = {},
) {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  const result = []
  for (const node of list) {
    func(node) && result.push(node)
    node[children] && list.push(...node[children])
  }
  return result
}

export function useRowSelection(getProps, tableData, emit) {
  const selectedRowKeysRef = shallowRef([]) // 选中行的keys集合
  const selectedRowRef = shallowRef([]) // 选中行的数据

  const getRowSelectionRef = computed(() => {
    const { rowSelection } = unref(getProps)
    if (!rowSelection)
      return null

    return {
      selectedRowKeys: unref(selectedRowKeysRef),
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys)
        // 维持外部定义的onChange回调
        rowSelection.onChange?.(selectedRowKeys, selectedRows)
      },
      ...omit(rowSelection, ['onChange']),
    }
  })

  const getAutoCreateKey = computed(() => {
    return unref(getProps).autoCreateKey && !unref(getProps).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(getProps)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  // 根据keys设置选中行
  function setSelectedRowKeys(rowKeys) {
    // tableData: 列表数据加载完成时，同步给tableData一份值
    // console.log(toRaw(unref(tableData)))
    selectedRowKeysRef.value = rowKeys || []
    const allSelectedRows = findNodeAll(
      toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef))),
      item => rowKeys?.includes(item[unref(getRowKey)]),
      {
        children: getProps.value.childrenColumnName ?? 'children',
      },
    )
    const trueSelectedRows = []
    rowKeys?.forEach((key) => {
      const found = allSelectedRows.find(item => item[unref(getRowKey)] === key)
      found && trueSelectedRows.push(found)
    })
    selectedRowRef.value = trueSelectedRows

    emit('selection-change', {
      keys: unref(selectedRowKeysRef),
      rows: unref(selectedRowRef),
    })
  }

  // 根据rows设置选中行
  function setSelectedRows(rows) {
    const { rowKey } = unref(getProps)
    selectedRowRef.value = rows
    selectedRowKeysRef.value = selectedRowRef.value.map((o) => {
      const key = (isFunction(rowKey) ? rowKey(o) : rowKey) || ROW_KEY
      return o[key]
    })
  }

  // 获取选中行的 rows
  function getSelectRows() {
    return unref(selectedRowRef)
  }

  // 获取选中行的 keys
  function getSelectRowKeys() {
    return unref(selectedRowKeysRef)
  }

  // 清空选中行
  function clearSelectedRowKeys() {
    selectedRowRef.value = []
    selectedRowKeysRef.value = []
  }

  // 根据 key 删除取消选中行
  function deleteSelectRowByKey(key) {
    const selectedRowKeys = unref(selectedRowKeysRef)
    const index = selectedRowKeys.findIndex(item => item === key)
    if (index !== -1)
      unref(selectedRowKeysRef).splice(index, 1)
  }

  watch(
    () => unref(getProps).rowSelection?.selectedRowKeys,
    (v) => {
      setSelectedRowKeys(v)
    },
  )

  return {
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    setSelectedRows,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
  }
}
