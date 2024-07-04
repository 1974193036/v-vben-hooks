import { unref } from 'vue'
import { isFunction } from 'lodash-es'

export function useTableStyle(getProps, prefixCls) {
  function getRowClassName(record, index) {
    const { striped, rowClassName } = unref(getProps)
    const classNames = []
    if (striped)
      classNames.push(index % 2 === 1 ? `${prefixCls}-row__striped` : '')

    if (rowClassName && isFunction(rowClassName))
      classNames.push(rowClassName(record, index))

    return classNames.filter(cls => !!cls).join(' ')
  }

  return { getRowClassName }
}
