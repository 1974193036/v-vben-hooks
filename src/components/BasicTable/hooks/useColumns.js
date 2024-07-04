import { computed, reactive, ref, toRaw, unref, watch } from 'vue'
import { cloneDeep, isArray, isBoolean, isEqual, isFunction, isObject, isString } from 'lodash-es'
import { formatToDate } from '@/utils/dateUtil'

export const INDEX_COLUMN_FLAG = 'INDEX'
export const ACTION_COLUMN_FLAG = 'ACTION'
export const DEFAULT_ALIGN = 'center'
const PAGE_SIZE = 10

function handleIndexColumn(getProps, getPaginationRef, columns) {
  const { showIndexColumn, indexColumnProps } = unref(getProps)

  let pushIndexColumns = false

  const indIndex = columns.findIndex(column => column.flag === INDEX_COLUMN_FLAG)
  if (showIndexColumn)
    pushIndexColumns = indIndex === -1

  else if (!showIndexColumn && indIndex !== -1)
    columns.splice(indIndex, 1)

  if (!pushIndexColumns)
    return

  const isFixedLeft = columns.some(item => item.fixed === 'left')

  columns.unshift({
    flag: INDEX_COLUMN_FLAG,
    width: 60,
    title: '序号',
    align: 'center',
    resizable: true,
    customRender: ({ index }) => {
      const getPagination = unref(getPaginationRef)
      if (isBoolean(getPagination))
        return `${index + 1}`

      const { current = 1, pageSize = PAGE_SIZE } = getPagination
      return ((current < 1 ? 1 : current) - 1) * pageSize + index + 1
    },
    ...(isFixedLeft
      ? {
          fixed: 'left',
        }
      : {}),
    ...indexColumnProps,
  })
}

function handleActionColumn(getProps, columns) {
  // actionColumn示例
  // {
  //   width: 90,
  //   title: '操作',
  //   dataIndex: 'action',
  //   fixed: 'right',
  // }
  const { actionColumn } = unref(getProps)
  if (!actionColumn)
    return

  const hasIndex = columns.findIndex(column => column.flag === ACTION_COLUMN_FLAG)
  if (hasIndex === -1) {
    columns.push({
      flag: ACTION_COLUMN_FLAG,
      fixed: 'right',
      align: 'center',
      ...actionColumn,
    })
  }
}

function handleItem(item, ellipsis) {
  const { key, dataIndex, children } = item
  item.align = item.align || DEFAULT_ALIGN
  if (ellipsis) {
    if (!key)
      item.key = typeof dataIndex == 'object' ? dataIndex.join('-') : dataIndex

    if (!isBoolean(item.ellipsis)) {
      Object.assign(item, {
        ellipsis,
      })
    }
  }
  if (children && children.length)
    handleChildren(children, !!ellipsis)
}

function handleChildren(children, ellipsis) {
  if (!children)
    return
  children.forEach((item) => {
    const { children } = item
    handleItem(item, ellipsis)
    handleChildren(children, ellipsis)
  })
}

function sortFixedColumn(columns) {
  const fixedLeftColumns = []
  const fixedRightColumns = []
  const defColumns = []
  for (const column of columns) {
    if (column.fixed === 'left') {
      column.resizable = true
      fixedLeftColumns.push(column)
      continue
    }
    if (column.fixed === 'right') {
      column.resizable = true
      fixedRightColumns.push(column)
      continue
    }
    if (column.width)
      column.resizable = true

    defColumns.push(column)
  }
  return [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(
    item => !item.defaultHidden,
  )
}

function isIfShow(column) {
  const ifShow = column.ifShow

  let isIfShow = true

  if (isBoolean(ifShow))
    isIfShow = ifShow

  if (isFunction(ifShow))
    isIfShow = ifShow(column)

  return isIfShow
}

export function formatCell(text, format, record, index) {
  if (!format)
    return text

  // custom function
  if (isFunction(format))
    return format(text, record, index)

  try {
    // date type
    const DATE_FORMAT_PREFIX = 'date|'
    if (isString(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
      const dateFormat = format.replace(DATE_FORMAT_PREFIX, '')

      if (!dateFormat)
        return text

      return formatToDate(text, dateFormat)
    }

    if (isObject(format))
      return format[text]
  }
  catch (error) {
    return text
  }
}

export function useColumns(getProps, getPaginationInfo) {
  const columnsRef = ref(unref(getProps).columns)
  let cacheColumns = unref(getProps).columns

  watch(
    () => unref(getProps).columns,
    (columns) => {
      columnsRef.value = columns
      cacheColumns = columns?.filter(item => !item.flag) ?? []
    },
  )

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef))
    handleIndexColumn(getProps, getPaginationInfo, columns)
    handleActionColumn(getProps, columns)
    if (!columns)
      return []

    const { ellipsis } = unref(getProps)

    columns.forEach((item) => {
      const { customRender } = item

      handleItem(
        item,
        Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender,
      )
    })
    return columns
  })
  const getViewColumns = computed(() => {
    const viewColumns = sortFixedColumn(unref(getColumnsRef))

    const mapFn = (column) => {
      const { slots, customRender, format, flag } = column

      if (!slots || !slots?.title)
        column.customTitle = column.title

      const isDefaultAction = [INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(flag)
      if (!customRender && format && !isDefaultAction) {
        column.customRender = ({ text, record, index }) => {
          return formatCell(text, format, record, index)
        }
      }

      return reactive(column)
    }

    const columns = cloneDeep(viewColumns)
    return columns
      .filter(column => isIfShow(column))
      .map((column) => {
        // Support table multiple header editable
        if (column.children?.length)
          column.children = column.children.map(mapFn)

        return mapFn(column)
      })
  })

  function getColumns(opt) {
    const { ignoreIndex, ignoreAction, sort } = opt || {}
    let columns = toRaw(unref(getColumnsRef))
    if (ignoreIndex)
      columns = columns.filter(item => item.flag !== INDEX_COLUMN_FLAG)

    if (ignoreAction)
      columns = columns.filter(item => item.flag !== ACTION_COLUMN_FLAG)

    if (sort)
      columns = sortFixedColumn(columns)

    return columns
  }

  // 设置表头数据
  function setColumns(columnList) {
    const columns = cloneDeep(columnList)
    if (!isArray(columns))
      return

    if (columns.length <= 0) {
      columnsRef.value = []
      return
    }

    const firstColumn = columns[0]

    const cacheKeys = cacheColumns.map(item => item.dataIndex)

    if (!isString(firstColumn) && !isArray(firstColumn)) {
      columnsRef.value = columns
    }
    else {
      // columns示例: ['name', 'desc', 'callNo']
      const columnKeys = columns.map(m => m.toString())
      const newColumns = []
      cacheColumns.forEach((item) => {
        newColumns.push({
          ...item,
          defaultHidden: !columnKeys.includes(item.dataIndex?.toString() || (item.key)),
        })
      })
      // Sort according to another array
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return (
            columnKeys.indexOf(prev.dataIndex?.toString())
            - columnKeys.indexOf(next.dataIndex?.toString())
          )
        })
      }
      columnsRef.value = newColumns
    }
  }

  const maxTableWidth = computed(() => {
    let width = 0
    unref(getViewColumns).forEach((item) => {
      if (item.width)
        width += +item.width
    })
    return width
  })

  /**
   * 拖拽列宽修改列的宽度
   */
  function setColumnWidth(w, col) {
    col.width = w
  }

  return {
    getViewColumns,
    maxTableWidth,
    setColumnWidth,
    getColumns,
    setColumns,
  }
}
