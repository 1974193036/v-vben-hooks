import { isFunction } from 'lodash-es'
import { computed, unref } from 'vue'

export function useTableForm(getProps, slots, fetch, getLoading) {
  const getFormProps = computed(() => {
    const { formConfig } = unref(getProps)
    const { submitButtonOptions } = formConfig || {}
    return {
      showAdvancedButton: false,
      ...formConfig,
      submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
      compact: false,
    }
  })

  function handleSearchInfoChange(info) {
    const { handleSearchInfoFn } = unref(getProps)
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn))
      info = handleSearchInfoFn(info) || info

    fetch({ searchInfo: info, page: 1 })
  }

  const getFormSlotKeys = computed(() => {
    // console.log(Object.keys(slots)) // ['toolbar', 'bodyCell', 'form-desc']
    const keys = Object.keys(slots)
    return keys
      .map(item => (item.startsWith('form-') ? item : null))
      .filter(item => !!item)
  })

  function replaceFormSlotKey(key) {
    if (!key)
      return ''
    return key?.replace?.(/form-/, '') ?? ''
  }

  return {
    getFormProps,
    handleSearchInfoChange,
    getFormSlotKeys,
    replaceFormSlotKey,
  }
}
