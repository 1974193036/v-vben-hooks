import { computed, unref } from 'vue'
import { isNumber } from 'lodash-es'

export function useItemLabelWidth(schemaItemRef, propsRef) {
  const col = computed(() => {
    const schemaItem = unref(schemaItemRef)
    const { labelCol = {}, wrapperCol = {} } = schemaItem.itemProps || {}
    const { labelWidth } = schemaItem
    const {
      labelWidth: globalLabelWidth,
      labelCol: globalLabelCol,
      wrapperCol: globWrapperCol,
      layout,
    } = propsRef

    let width = labelWidth || globalLabelWidth
    const _labelCol = { ...globalLabelCol, ...labelCol }
    const _wrapCol = { ...globWrapperCol, ...wrapperCol }

    if (width)
      width = isNumber(width) ? `${width}px` : width

    return {
      labelCol: { style: { width }, ..._labelCol },
      wrapperCol: {
        style: { width: layout === 'vertical' ? '100%' : `calc(100% - ${width})` },
        ..._wrapCol,
      },
    }
  })

  return col
}
