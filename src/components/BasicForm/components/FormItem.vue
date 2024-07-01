<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    formActionType: {
      type: Object,
      default: () => ({}),
    },
    schema: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    allDefaultValues: {
      type: Object,
      default: () => ({}),
    },
    formModel: {
      type: Object,
      default: () => ({}),
    },
    setFormModel: {
      type: Function,
      default: null,
    },
    isAdvanced: {
      type: Boolean,
    },
  },
  setup(props, { slots }) {
    return () => {
      return <div>123</div>
    }
  },
})
</script>
