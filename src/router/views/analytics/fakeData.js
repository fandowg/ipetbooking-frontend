const data = {
  date: '2021/05/01',
  orders: 1,
  total: 8040,
  refund: 0,
  coupon: 300,
  profit: 7740,
  tax: 387,
  profitAfterTax: 7740,
  averageProfit: 774
}

export const inComeData = {
  total: {
    averageOrders: 6,
    orders: 30,
    total: 24828,
    refund: 1600,
    coupon: 600,
    profit: 22628,
    tax: 1131,
    profitAfterTax: 21497,
    averageProfit: 730
  },
  filterDay: [{
      ...data
    },
    {
      ...Object.assign(data, {
        date: '2021/05/02'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/03'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/04'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/05'
      })
    },
  ],
  filterWeek: [{
      ...Object.assign(data, {
        date: '2021/05/01~2021/05/07'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/08~2021/05/14'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/15~2021/05/21'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/22~2021/05/28'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05/29~2021/05/31'
      })
    },
  ],
  filterMonth: [{
      ...Object.assign(data, {
        date: '2021/01'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/02'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/03'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/04'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/05'
      })
    },
  ],
  filterSeason: [{
      ...Object.assign(data, {
        date: '2021/01/01~2021/03/31'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/04/01~2021/06/30'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/07/01~2021/09/30'
      })
    },
    {
      ...Object.assign(data, {
        date: '2021/10/01~2021/12/31'
      })
    },
  ],
  filterYear: [{
    ...Object.assign(data, {
      date: '2021'
    })
  }, ],
}
const itemsDay = [{
    title: '2021/05/01~2021/05/07',
    items: [{
        date: '05/01',
        total: 4800,
        orders: 10
      },
      {
        date: '05/02',
        total: 5400,
        orders: 10
      },
      {
        date: '05/03',
        total: 5400,
        orders: 10
      },
      {
        date: '05/04',
        total: 5400,
        orders: 10
      },
      {
        date: '05/05',
        total: 5400,
        orders: 10
      },
      {
        date: '05/06',
        total: 5400,
        orders: 10
      },
      {
        date: '05/07',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/05/08~2021/05/14',
    items: [{
        date: '05/08',
        total: 4800,
        orders: 10
      },
      {
        date: '05/09',
        total: 5400,
        orders: 10
      },
      {
        date: '05/10',
        total: 5400,
        orders: 10
      },
      {
        date: '05/11',
        total: 5400,
        orders: 10
      },
      {
        date: '05/12',
        total: 5400,
        orders: 10
      },
      {
        date: '05/13',
        total: 5400,
        orders: 10
      },
      {
        date: '05/14',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/05/15~2021/05/21',
    items: [{
        date: '05/15',
        total: 4800,
        orders: 10
      },
      {
        date: '05/16',
        total: 5400,
        orders: 10
      },
      {
        date: '05/17',
        total: 5400,
        orders: 10
      },
      {
        date: '05/18',
        total: 5400,
        orders: 10
      },
      {
        date: '05/19',
        total: 5400,
        orders: 10
      },
      {
        date: '05/20',
        total: 5400,
        orders: 10
      },
      {
        date: '05/21',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  }
]

const itemsWeek = [{
    title: '2021/04',
    items: [{
        date: '04/01~04/07',
        total: 4800,
        orders: 10
      },
      {
        date: '04/08~04/14',
        total: 5400,
        orders: 10
      },
      {
        date: '04/15~04/21',
        total: 5400,
        orders: 10
      },
      {
        date: '04/22~04/28',
        total: 5400,
        orders: 10
      },
      {
        date: '04/29~04/30',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/05',
    items: [{
        date: '05/01~05/07',
        total: 4800,
        orders: 10
      },
      {
        date: '05/08~05/14',
        total: 5400,
        orders: 10
      },
      {
        date: '05/15~05/21',
        total: 5400,
        orders: 10
      },
      {
        date: '05/22~05/28',
        total: 5400,
        orders: 10
      },
      {
        date: '05/29~05/31',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/06',
    items: [{
        date: '06/01~06/07',
        total: 4800,
        orders: 10
      },
      {
        date: '06/08~06/14',
        total: 5400,
        orders: 10
      },
      {
        date: '06/15~06/21',
        total: 5400,
        orders: 10
      },
      {
        date: '06/22~06/28',
        total: 5400,
        orders: 10
      },
      {
        date: '06/29~06/30',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },

]
const itemsMonth = [{
    title: '2020/07~2020/12',
    items: [{
        date: '2020/07',
        total: 4800,
        orders: 10
      },
      {
        date: '2020/08',
        total: 5400,
        orders: 10
      },
      {
        date: '2020/09',
        total: 5400,
        orders: 10
      },
      {
        date: '2020/10',
        total: 5400,
        orders: 10
      },
      {
        date: '2020/11',
        total: 5400,
        orders: 10
      },
      {
        date: '2020/12',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/01~2021/06',
    items: [{
        date: '2021/01',
        total: 4800,
        orders: 10
      },
      {
        date: '2021/02',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/03',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/04',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/05',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/06',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
  {
    title: '2021/07~2021/12',
    items: [{
        date: '2021/07',
        total: 4800,
        orders: 10
      },
      {
        date: '2021/8',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/09',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/10',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/11',
        total: 5400,
        orders: 10
      },
      {
        date: '2021/12',
        total: 5400,
        orders: 10
      },
      {
        date: '日期加總',
        total: 20000,
        orders: 10
      },
    ]
  },
]

const itemsSeason = [{
  title: '2021',
  items: [{
      date: '2021/01~03',
      total: 4800,
      orders: 10
    },
    {
      date: '2021/04~06',
      total: 5400,
      orders: 10
    },
    {
      date: '2021/07~09',
      total: 5400,
      orders: 10
    },
    {
      date: '2021/10~12',
      total: 5400,
      orders: 10
    },
    {
      date: '日期加總',
      total: 20000,
      orders: 10
    },
  ]
}]
const itemsYear = [{
  title: '2021',
  items: [{
    date: '2021',
    total: 4800,
    orders: 10
  }]
}]

export const sellData = {
  total: {
    order: 20644,
    addition: 1000,
    prepaid: 500,
    profit: 19144

  },
  filterDay: [{
      title: '服務',
      items: itemsDay,
      total: 438254
    },
    {
      title: '加購',
      items: itemsDay,
      total: 438254
    },
    {
      title: '包月方案',
      items: itemsDay,
      total: 438254
    },
    {
      title: '訂單加總',
      items: itemsDay,
      total: 438254
    }
  ],
  filterWeek: [{
      title: '服務',
      items: itemsWeek,
      total: 438254
    },
    {
      title: '加購',
      items: itemsWeek,
      total: 438254
    },
    {
      title: '包月方案',
      items: itemsWeek,
      total: 438254
    },
    {
      title: '訂單加總',
      items: itemsWeek,
      total: 438254
    }
  ],
  filterMonth: [{
      title: '服務',
      items: itemsMonth,
      total: 438254
    },
    {
      title: '加購',
      items: itemsMonth,
      total: 438254
    },
    {
      title: '包月方案',
      items: itemsMonth,
      total: 438254
    },
    {
      title: '訂單加總',
      items: itemsMonth,
      total: 438254
    }
  ],
  filterSeason: [{
      title: '服務',
      items: itemsSeason,
      total: 438254
    },
    {
      title: '加購',
      items: itemsSeason,
      total: 438254
    },
    {
      title: '包月方案',
      items: itemsSeason,
      total: 438254
    },
    {
      title: '訂單加總',
      items: itemsSeason,
      total: 438254
    }
  ],
  filterYear: [{
      title: '服務',
      items: itemsYear,
      total: 438254
    },
    {
      title: '加購',
      items: itemsYear,
      total: 438254
    },
    {
      title: '包月方案',
      items: itemsYear,
      total: 438254
    },
    {
      title: '訂單加總',
      items: itemsYear,
      total: 438254
    }
  ],
}

export const sellDataPrices = {
  filterDay: Array.from({
    length: 8
  }).fill({
    title: '小美容/貓/短毛',
    store: '分店A',
    items: itemsDay,
  }),
  filterWeek: Array.from({
    length: 8
  }).fill({
    title: '小美容/貓/短毛',
    store: '分店A',
    items: itemsWeek,
  }),
  filterMonth: Array.from({
    length: 8
  }).fill({
    title: '小美容/貓/短毛',
    store: '分店A',
    items: itemsMonth,
  }),
  filterSeason: Array.from({
    length: 8
  }).fill({
    title: '小美容/貓/短毛',
    store: '分店A',
    items: itemsSeason,
  }),
  filterYear: Array.from({
    length: 8
  }).fill({
    title: '小美容/貓/短毛',
    store: '分店A',
    items: itemsYear,
  }),
}
