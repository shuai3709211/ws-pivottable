import TableRenderer from './TableRenderer'
import defaultProps from './helper/defaultProps'
import { PivotData } from './helper/utils'

export default {
  name: 'vue-pivottable',
  props: ['tableMaxWidth'],
  mixins: [defaultProps],
  computed: {
    renderers () {
      return TableRenderer[this.rendererName in TableRenderer ? this.rendererName : Object.keys(TableRenderer)[0]]
    }
  },
  methods: {
    createPivottable (h) {
      const props = this.$props
      return h(this.renderers, {
        props
      })
    },
    createWrapperContainer (h) {
      return h('div', {
        style: {
          display: 'block',
          // width: '100%',
          'overflow-x': 'auto',
          'max-width': `${this.tableMaxWidth}px`
        }
      }, [
        this.createPivottable(h)
      ])
    },
    excelExport () {
      let pivotData = new PivotData(this.$props)
      let rowKeys = pivotData.getRowKeys()
      let colKeys = pivotData.getColKeys()
      if (rowKeys.length === 0) {
        rowKeys.push([])
      }
      if (colKeys.length === 0) {
        colKeys.push([])
      }
      let headerRow = pivotData.props.rows.map(r => r)
      if (colKeys.length === 1 && colKeys[0].length === 0) {
        headerRow.push(this.aggregatorName)
      } else {
        colKeys.map(c => headerRow.push(c.join('-')))
      }
      let result = rowKeys.map(r => {
        let row = r.map(x => x)
        colKeys.map(c => {
          let v = pivotData.getAggregator(r, c).value()
          row.push(v || '')
        })
        return row
      })
      result.unshift(headerRow)
      return result.map(r => r.join(',')).join('\n')
    }
  },
  render (h) {
    return this.tableMaxWidth > 0 ? this.createWrapperContainer(h) : this.createPivottable(h)
  }
}
