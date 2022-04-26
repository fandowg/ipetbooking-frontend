export const questions = {
  personality: [{
      title: '粘人',
      name: 'clingy'
    },
    {
      title: '膽小',
      name: 'timid'
    },
    {
      title: '親人',
      name: 'nice'
    },
    {
      title: '活潑',
      name: 'lively'
    },
    {
      title: '怕生',
      name: 'shy'
    },
    {
      title: '討厭同類',
      name: 'hate-same'
    }
  ],
  healthy: [{
      title: '關節疾病',
      name: 'joint-disease',
      text: ''
    },
    {
      title: '皮膚疾病',
      name: 'skin-condition',
      text: ''
    },
    {
      title: '過敏反應',
      name: 'allergy',
      text: ''
    },
    {
      title: '其他疾病',
      name: 'other',
      text: ''
    }
  ],
  behavior: [{
      title: '分離焦慮症',
      name: 'SAD',
      text: ''
    },
    {
      title: '攻擊過家人',
      name: 'attack-familly',
      text: ''
    },
    {
      title: '攻擊陌生人',
      name: 'attack-stranger',
      text: ''
    },
    {
      title: '攻擊過同類',
      name: 'attack-same',
      text: ''
    },
    {
      title: '被同類咬過',
      name: 'be-attacked',
      text: ''
    }
  ],
  vaccine: 0
}

export const afterOrder = [

  {
    title: '正常'
  },
  {
    title: '皮膚病',
  },
  {
    title: '指甲流血',
  },
  {
    title: '剃傷',
  },
  {
    title: '跳蚤',
    children: [{
        title: '少量',
        value: 1
      },
      {
        title: '多量',
        value: 2
      }
    ]
  },
  {
    title: '璧蝨',
    children: [{
        title: '少量',
        value: 1
      },
      {
        title: '多量',
        value: 2
      }
    ]
  },
  {
    title: '耳炎',
    children: [{
        title: '輕微',
        value: 1
      },
      {
        title: '嚴重',
        value: 2
      }
    ]
  },
  {
    title: '耳疥',
    children: [{
        title: '輕微',
        value: 1
      },
      {
        title: '嚴重',
        value: 2
      }
    ]
  },
  {
    title: '眼睛',
    children: [{
        title: '紅眼',
        value: 1
      },
      {
        title: '分泌物',
        value: 2
      },
      {
        title: '毛渣凝塊',
        value: 3
      },
      {
        title: '闔眼',
        value: 4
      },
    ]
  }

]

export const handle = 
  [{
    title: '已上藥'
  },
  {
    title: '經醫師看診'
  }
]
