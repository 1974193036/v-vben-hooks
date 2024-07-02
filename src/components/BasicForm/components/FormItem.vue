<script lang="jsx">
import { computed, defineComponent, toRefs, unref } from 'vue'
import { isBoolean, isFunction, isString, upperFirst } from 'lodash-es'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { componentMap } from '../componentMap'
import { useItemLabelWidth } from '../hooks/useItemLabelWidth'
import { createPlaceholderMessage, isComponentFormSchema } from '../help'
import { getSlot } from '@/utils/slot'

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
      console.log('getComponentsProps', props.schema.field)
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

    const getDisable = computed(() => {
      console.log('getDisable')
      const { disabled: globDisabled } = props.formProps
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      let disabled = !!globDisabled || itemDisabled
      if (isBoolean(dynamicDisabled))
        disabled = dynamicDisabled

      if (isFunction(dynamicDisabled))
        disabled = dynamicDisabled(unref(getValues))

      return disabled
    })

    const getReadonly = computed(() => {
      const { readonly: globReadonly } = props.formProps
      const { dynamicReadonly } = props.schema
      const { readonly: itemReadonly = false } = unref(getComponentsProps)

      let readonly = globReadonly || itemReadonly
      if (isBoolean(dynamicReadonly))
        readonly = dynamicReadonly

      if (isFunction(dynamicReadonly))
        readonly = dynamicReadonly(unref(getValues))

      return readonly
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

    function renderComponent() {
      if (!isComponentFormSchema(props.schema))
        return null

      const {
        component,
        field,
        changeEvent = 'change',
      } = props.schema
      const isCheck = component && ['Switch', 'Checkbox'].includes(component)
      const eventKey = `on${upperFirst(changeEvent)}`
      const { autoSetPlaceHolder, size } = props.formProps
      const propsData = {
        allowClear: true,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
        readonly: unref(getReadonly),
      }

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== 'RangePicker' && component !== 'DatePickerRange' && component) {
        propsData.placeholder
            = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component)
      }

      const bindValue = {
        [(isCheck ? 'checked' : 'value')]: props.formModel[field],
      }

      const on = {
        [eventKey]: (...args) => {
          const [e] = args
          if (propsData[eventKey])
            propsData[eventKey](...args)

          const target = e ? e.target : null
          const value = target ? (isCheck ? target.checked : target.value) : e
          props.setFormModel(field, value, props.schema)
        },
      }

      const Comp = componentMap.get(component)
      const compAttr = {
        ...propsData,
        ...on,
        ...bindValue,
      }

      return <Comp {...compAttr} />
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

      const opts = { disabled: unref(getDisable), readonly: unref(getReadonly) }
      const getContent = () => {
        return slot ? getSlot(slots, slot, unref(getValues), opts) : renderComponent()
      }

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
            <div style="flex:1;">{getContent()}</div>
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

      return isIfShow && (
        <a-col {...colProps} v-show={isShow}>
          {renderItem()}
        </a-col>
      )
    }
  },
})
</script>
