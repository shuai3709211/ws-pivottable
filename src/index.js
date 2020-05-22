import PivotTable from './Pivottable'
if (typeof window !== 'undefined' && window.Vue) window.Vue.use(PivotTable)
export {
  PivotTable
}
export default (Vue) => {
  Vue.component(PivotTable.name, PivotTable)
}
