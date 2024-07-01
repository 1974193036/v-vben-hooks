<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { isBoolean, isFunction } from 'lodash-es'
import { componentMap } from '../componentMap'

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
    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...allDefaultValues,
          ...formModel,
        },
        schema,
      }
    })

    function getShow() {
      const { show, ifShow } = props.schema
      const { showAdvancedButton } = props.formProps
      const itemIsAdvanced = showAdvancedButton
        ? isBoolean(props.isAdvanced)
          ? props.isAdvanced
          : true
        : true

      let isShow = true
      let isIfShow = true

      if (isBoolean(show))
        isShow = show

      if (isBoolean(ifShow))
        isIfShow = ifShow

      if (isFunction(show))
        isShow = show(unref(getValues))

      if (isFunction(ifShow))
        isIfShow = ifShow(unref(getValues))

      isShow = isShow && itemIsAdvanced
      return { isShow, isIfShow }
    }

    return () => {
      const { colProps = {}, slot, component } = props.schema
      if (!((component && componentMap.has(component)) || slot))
        return null

      const { isIfShow, isShow } = getShow()

      return isIfShow && (
        <a-col {...colProps} v-show={isShow}>
          123
        </a-col>
      )
    }
  },
})
</script>
