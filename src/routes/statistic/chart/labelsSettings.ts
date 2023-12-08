export function getLabelSettings() {
  return {
    value: {
      align: 'end',
      clamp: true,
      // backgroundColor: function(ctx) {
      //   var value = ctx.dataset.data[ctx.dataIndex];
      //   return value > 50 ? 'white': null
      // },
      // borderColor: 'white',
      // borderWidth: 1,
      // borderRadius: 2,
      font: function(ctx: any) {
        var weight = ctx.dataset.data[ctx.dataIndex] > 99 ? 'normal' : 'bolder';
        return {
          size: 12,
          weight: weight
        }
        // weight: 'bolder',
      },
      color: function(ctx: any) {
        var value = ctx.dataset.data[ctx.dataIndex];
        return value > 99 ? 'black': 'white'
      },
      formatter: function(value: number, ctx: any) {
        return ctx.active ? Number(value).toFixed(2) : ctx.chart.data.labels[ctx.dataIndex];
      },
      padding: 2,
      offset: 0
    }
  }
}