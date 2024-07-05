import { computed, h, unref } from 'vue'
import { isString } from 'lodash-es'
import TableHeader from '../components/TableHeader.vue'
import { getSlot } from '@/utils/slot'

export function useTableHeader(getProps, slots) {
  const getHeaderProps = computed(() => {
    const { title, titleHelpMessage, showTableSetting, tableSetting } = unref(getProps)
    const hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting
    if (hideTitle && !isString(title))
      return {}

    return {
      // 返回的title必须是一个函数，或null
      title: hideTitle
        ? null
        : () => h(TableHeader, {
            title,
            titleHelpMessage,
            showTableSetting,
            tableSetting,
          }, {
            ...(slots.toolbar
              ? {
                  toolbar: () => getSlot(slots, 'toolbar'),
                }
              : {}),
          }),
    }
  })

  return {
    getHeaderProps,
  }
}
