<script lang="jsx">
import { defineComponent } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { isArray, isString } from 'lodash-es'
import { getSlot } from '@/utils/slot'

export default defineComponent({
  name: 'BasicTitle',
  props: {
    text: {
      type: [Array, String, Object],
    },
  },
  setup(props, { slots }) {
    const prefixCls = 'v-basic-title'

    function renderTitle() {
      const textList = props.text

      if (isString(textList))
        return <p>{textList}</p>

      if (isArray(textList)) {
        return textList.map((text, index) => {
          return (
            <p key={text}>
              <>
                {props.showIndex ? `${index + 1}. ` : ''}
                {text}
              </>
            </p>
          )
        })
      }
      return <div>{textList}</div>
    }

    return () => {
      return (
        <a-tooltip
          overlayClassName={`${prefixCls}__wrap`}
          title={renderTitle()}
          autoAdjustOverflow={true}
          placement="right"
          destroyTooltipOnHide={false}
        >
          <span class={{ 'flex-self-start': true, [prefixCls]: true }}>{getSlot(slots) || <InfoCircleOutlined />}</span>
        </a-tooltip>
      )
    }
  },
})
</script>

<style scoped>
.v-basic-title {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px;
  cursor: pointer;
}

.v-basic-title:hover {
  color: red;
}
.v-basic-title__wrap p {
  margin-bottom: 0;
}
</style>
