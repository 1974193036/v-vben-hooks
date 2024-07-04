import { computed, ref, unref, watch } from 'vue'

export function useLoading(getProps) {
  const loadingRef = ref(unref(getProps).loading)

  watch(() => unref(getProps).loading, (loading) => {
    loadingRef.value = loading
  })

  function setLoading(loading) {
    loadingRef.value = loading
  }

  return {
    getLoading: computed(() => unref(loadingRef)),
    setLoading,
  }
}
