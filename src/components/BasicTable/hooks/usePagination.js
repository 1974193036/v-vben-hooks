import { isBoolean } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'

const PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = ['10', '20', '30', '40', '50']

export function usePagination(getProps, fetchData) {
  const configRef = ref({})
  const show = ref(true)

  watch(
    () => unref(getProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {}),
        }
      }
    },
  )

  const getPaginationInfo = computed(() => {
    const { pagination } = unref(getProps)

    if (!unref(show) || (isBoolean(pagination) && !pagination))
      return false

    return {
      current: 1,
      size: 'large',
      defaultPageSize: PAGE_SIZE,
      showTotal: total => `总条数：${total} `,
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
      onChange(current, pageSize) {
        setPagination({ current, pageSize })
        fetchData()
      },
    }
  })

  // 设置分页信息
  function setPagination(info) {
    const paginationInfo = unref(getPaginationInfo)
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    }
  }

  // 获取分页信息
  function getPagination() {
    return unref(getPaginationInfo)
  }

  return {
    getPaginationInfo,
    setPagination,
    getPagination,
  }
}
