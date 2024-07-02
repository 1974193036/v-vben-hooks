<script lang="tsx">
import { computed, defineComponent, toRefs, unref } from 'vue'
import { isBoolean, isFunction, isString } from 'lodash-es'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { componentMap } from '../componentMap'
import { useItemLabelWidth } from '../hooks/useItemLabelWidth'

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
    // console.log('props', props)
    const { schema, formProps } = toRefs(props)
    // 当父组件更改了props.formProps 或 props.schema，这两个原本不是响应式数据的，无法被computed监听到，解决方式如下
    // deprecated: useItemLabelWidth(props.schema, props.formProps)
    // 1. 通过watch监听来实现，watch([() => props.schema, () => props.formProps])
    // 2. toRefs解构props，把这两个属性包裹成ref对象，使其和原对象产生链接；当props上的这两个属性值发生变化，schema.value或formProps.value也会改变，就被computed监听到了
    const itemLabelWidthProp = useItemLabelWidth(schema, formProps)

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

    const getComponentsProps = computed(() => {
      const { schema, formModel, formActionType } = props
      let { componentProps = {} } = schema
      if (isFunction(componentProps))
        componentProps = componentProps({ schema, formModel, formActionType }) ?? {}

      if (schema.component === 'Divider') {
        componentProps = Object.assign(
          { type: 'horizontal' },
          {
            orientation: 'left',
            plain: true,
          },
          componentProps,
        )
      }
      return componentProps
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

    function renderLabelHelpMessage() {
      const { label, helpMessage } = props.schema
      const getLabel = isFunction(label) ? label(unref(getValues)) : label
      const getHelpMessage = isFunction(helpMessage)
        ? helpMessage(unref(getValues))
        : helpMessage
      if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0))
        return getLabel

      const renderTitle = () => {
        if (isString(getHelpMessage))
          return <p>{getHelpMessage}</p>
        if (Array.isArray(getHelpMessage)) {
          return getHelpMessage.map((text) => {
            return (
              <p key={text} style="margin-bottom: 4px">
                {text}
              </p>
            )
          })
        }
        return <div>{getHelpMessage}</div>
      }
      return (
        <span>
          {getLabel}
          <a-tooltip placement="top" title={renderTitle()}>
            <span style="margin: 0 2px; cursor: pointer"><InfoCircleOutlined /></span>
          </a-tooltip>
        </span>
      )
    }

    function renderItem() {
      const { itemProps, slot, field, suffix, component } = props.schema
      if (component === 'Divider') {
        return (
          <a-col span={24}>
            <a-divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</a-divider>
          </a-col>
        )
      }

      const { colon } = props.formProps
      const showSuffix = !!suffix
      const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp)

      return (
        <a-form-item
          name={field}
          colon={colon}
          class={{ 'suffix-item': showSuffix }}
          {...itemProps}
          label={renderLabelHelpMessage()}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <div style="display:flex">
            <div style="flex:1;">123</div>
            {showSuffix && <span class="suffix" style="padding-left: 6px">{getSuffix}</span>}
          </div>
        </a-form-item>
      )
    }

    return () => {
      console.log('=======render函数执行=======', props.schema)

      const { colProps = {}, slot, component } = props.schema
      if (!((component && componentMap.has(component)) || slot))
        return null

      const { isIfShow, isShow } = getShow()

      const getContent = () => {
        return renderItem()
      }

      return isIfShow && (
        <a-col {...colProps} v-show={isShow}>
          {getContent()}
        </a-col>
      )
    }
  },
})
</script>
