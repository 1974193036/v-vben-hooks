import { createInjectionState } from '@vueuse/core'

const [createFormContext, useFormContext] = createInjectionState((context) => {
  return context
})

export { createFormContext }
export { useFormContext }
