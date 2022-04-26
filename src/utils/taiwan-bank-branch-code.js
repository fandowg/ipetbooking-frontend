import { groupByKey } from '@utils'

const originalList = [
  {
    bankCode: '004',
    code: '0037',
    name: '臺灣銀行營業部',
  },
  {
    bankCode: '004',
    code: '0059',
    name: '臺灣銀行公庫部',
  },
  {
    bankCode: '004',
    code: '0071',
    name: '臺灣銀行館前分行',
  },
  {
    bankCode: '004',
    code: '0082',
    name: '臺灣銀行信託部',
  },
  {
    bankCode: '004',
    code: '0093',
    name: '臺灣銀行臺南分行',
  },
  {
    bankCode: '004',
    code: '0107',
    name: '臺灣銀行臺中分行',
  },
  {
    bankCode: '004',
    code: '0118',
    name: '臺灣銀行高雄分行',
  },
  {
    bankCode: '004',
    code: '0129',
    name: '臺灣銀行基隆分行',
  },
  {
    bankCode: '004',
    code: '0130',
    name: '臺灣銀行中興新村分行',
  },
  {
    bankCode: '004',
    code: '0141',
    name: '臺灣銀行嘉義分行',
  },
  {
    bankCode: '004',
    code: '0152',
    name: '臺灣銀行新竹分行',
  },
  {
    bankCode: '004',
    code: '0163',
    name: '臺灣銀行彰化分行',
  },
  {
    bankCode: '004',
    code: '0174',
    name: '臺灣銀行屏東分行',
  },
  {
    bankCode: '004',
    code: '0185',
    name: '臺灣銀行花蓮分行',
  },
  {
    bankCode: '004',
    code: '0196',
    name: '臺灣銀行延平分行',
  },
  {
    bankCode: '004',
    code: '0200',
    name: '臺灣銀行中山分行',
  },
  {
    bankCode: '004',
    code: '0211',
    name: '臺灣銀行高雄加工出口區分行',
  },
  {
    bankCode: '004',
    code: '0222',
    name: '臺灣銀行宜蘭分行',
  },
  {
    bankCode: '004',
    code: '0233',
    name: '臺灣銀行臺東分行',
  },
  {
    bankCode: '004',
    code: '0244',
    name: '臺灣銀行澎湖分行',
  },
  {
    bankCode: '004',
    code: '0255',
    name: '臺灣銀行鳳山分行',
  },
  {
    bankCode: '004',
    code: '0266',
    name: '臺灣銀行桃園分行',
  },
  {
    bankCode: '004',
    code: '0277',
    name: '臺灣銀行板橋分行',
  },
  {
    bankCode: '004',
    code: '0288',
    name: '臺灣銀行新營分行',
  },
  {
    bankCode: '004',
    code: '0299',
    name: '臺灣銀行苗栗分行',
  },
  {
    bankCode: '004',
    code: '0303',
    name: '臺灣銀行豐原分行',
  },
  {
    bankCode: '004',
    code: '0314',
    name: '臺灣銀行斗六分行',
  },
  {
    bankCode: '004',
    code: '0325',
    name: '臺灣銀行南投分行',
  },
  {
    bankCode: '004',
    code: '0336',
    name: '臺灣銀行南門分行',
  },
  {
    bankCode: '004',
    code: '0347',
    name: '臺灣銀行公館分行',
  },
  {
    bankCode: '004',
    code: '0358',
    name: '臺灣銀行左營分行',
  },
  {
    bankCode: '004',
    code: '0369',
    name: '臺灣銀行北投分行',
  },
  {
    bankCode: '004',
    code: '0370',
    name: '臺灣銀行霧峰分行',
  },
  {
    bankCode: '004',
    code: '0381',
    name: '臺灣銀行金門分行',
  },
  {
    bankCode: '004',
    code: '0392',
    name: '臺灣銀行馬祖分行',
  },
  {
    bankCode: '004',
    code: '0406',
    name: '臺灣銀行安平分行',
  },
  {
    bankCode: '004',
    code: '0417',
    name: '臺灣銀行中壢分行',
  },
  {
    bankCode: '004',
    code: '0428',
    name: '臺灣銀行三重分行',
  },
  {
    bankCode: '004',
    code: '0439',
    name: '臺灣銀行頭份分行',
  },
  {
    bankCode: '004',
    code: '0440',
    name: '臺灣銀行前鎮分行',
  },
  {
    bankCode: '004',
    code: '0451',
    name: '臺灣銀行城中分行',
  },
  {
    bankCode: '004',
    code: '0462',
    name: '臺灣銀行民權分行',
  },
  {
    bankCode: '004',
    code: '0473',
    name: '臺灣銀行潭子分行',
  },
  {
    bankCode: '004',
    code: '0484',
    name: '臺灣銀行連城分行',
  },
  {
    bankCode: '004',
    code: '0495',
    name: '臺灣銀行員林分行',
  },
  {
    bankCode: '004',
    code: '0509',
    name: '臺灣銀行松江分行',
  },
  {
    bankCode: '004',
    code: '0510',
    name: '臺灣銀行鼓山分行',
  },
  {
    bankCode: '004',
    code: '0521',
    name: '臺灣銀行龍山分行',
  },
  {
    bankCode: '004',
    code: '0532',
    name: '臺灣銀行忠孝分行',
  },
  {
    bankCode: '004',
    code: '0543',
    name: '臺灣銀行信義分行',
  },
  {
    bankCode: '004',
    code: '0554',
    name: '臺灣銀行復興分行',
  },
  {
    bankCode: '004',
    code: '0565',
    name: '臺灣銀行三民分行',
  },
  {
    bankCode: '004',
    code: '0576',
    name: '臺灣銀行臺中港分行',
  },
  {
    bankCode: '004',
    code: '0587',
    name: '臺灣銀行羅東分行',
  },
  {
    bankCode: '004',
    code: '0598',
    name: '臺灣銀行埔里分行',
  },
  {
    bankCode: '004',
    code: '0602',
    name: '臺灣銀行岡山分行',
  },
  {
    bankCode: '004',
    code: '0613',
    name: '臺灣銀行新興分行',
  },
  {
    bankCode: '004',
    code: '0624',
    name: '臺灣銀行苓雅分行',
  },
  {
    bankCode: '004',
    code: '0646',
    name: '臺灣銀行松山分行',
  },
  {
    bankCode: '004',
    code: '0657',
    name: '臺灣銀行健行分行',
  },
  {
    bankCode: '004',
    code: '0668',
    name: '臺灣銀行中和分行',
  },
  {
    bankCode: '004',
    code: '0679',
    name: '臺灣銀行太保分行',
  },
  {
    bankCode: '004',
    code: '0680',
    name: '臺灣銀行竹北分行',
  },
  {
    bankCode: '004',
    code: '0691',
    name: '臺灣銀行國際金融業務分行',
  },
  {
    bankCode: '004',
    code: '0705',
    name: '臺灣銀行士林分行',
  },
  {
    bankCode: '004',
    code: '0716',
    name: '臺灣銀行新莊分行',
  },
  {
    bankCode: '004',
    code: '0727',
    name: '臺灣銀行大甲分行',
  },
  {
    bankCode: '004',
    code: '0738',
    name: '臺灣銀行新竹科學園區分行',
  },
  {
    bankCode: '004',
    code: '0749',
    name: '臺灣銀行樹林分行',
  },
  {
    bankCode: '004',
    code: '0750',
    name: '臺灣銀行新店分行',
  },
  {
    bankCode: '004',
    code: '0794',
    name: '臺灣銀行黎明分行',
  },
  {
    bankCode: '004',
    code: '0808',
    name: '臺灣銀行民生分行',
  },
  {
    bankCode: '004',
    code: '0819',
    name: '臺灣銀行永康分行',
  },
  {
    bankCode: '004',
    code: '0820',
    name: '臺灣銀行三多分行',
  },
  {
    bankCode: '004',
    code: '0831',
    name: '臺灣銀行紐約分行',
  },
  {
    bankCode: '004',
    code: '0853',
    name: '臺灣銀行臺北世貿中心分行',
  },
  {
    bankCode: '004',
    code: '0864',
    name: '臺灣銀行大安分行',
  },
  {
    bankCode: '004',
    code: '0875',
    name: '臺灣銀行華江分行',
  },
  {
    bankCode: '004',
    code: '0886',
    name: '臺灣銀行潮州分行',
  },
  {
    bankCode: '004',
    code: '0897',
    name: '臺灣銀行蘇澳分行',
  },
  {
    bankCode: '004',
    code: '0901',
    name: '臺灣銀行大雅分行',
  },
  {
    bankCode: '004',
    code: '0912',
    name: '臺灣銀行楠梓分行',
  },
  {
    bankCode: '004',
    code: '0923',
    name: '臺灣銀行臺中工業區分行',
  },
  {
    bankCode: '004',
    code: '0945',
    name: '臺灣銀行洛杉磯分行',
  },
  {
    bankCode: '004',
    code: '1067',
    name: '臺灣銀行敦化分行',
  },
  {
    bankCode: '004',
    code: '1078',
    name: '臺灣銀行南港分行',
  },
  {
    bankCode: '004',
    code: '1089',
    name: '臺灣銀行和平分行',
  },
  {
    bankCode: '004',
    code: '1090',
    name: '臺灣銀行水湳分行',
  },
  {
    bankCode: '004',
    code: '1104',
    name: '臺灣銀行中崙分行',
  },
  {
    bankCode: '004',
    code: '1115',
    name: '臺灣銀行土城分行',
  },
  {
    bankCode: '004',
    code: '1148',
    name: '臺灣銀行香港分行',
  },
  {
    bankCode: '004',
    code: '1159',
    name: '臺灣銀行桃園國際機場分行',
  },
  {
    bankCode: '004',
    code: '1160',
    name: '臺灣銀行大昌分行',
  },
  {
    bankCode: '004',
    code: '1171',
    name: '臺灣銀行東京分行',
  },
  {
    bankCode: '004',
    code: '1182',
    name: '臺灣銀行五甲分行',
  },
  {
    bankCode: '004',
    code: '1193',
    name: '臺灣銀行博愛分行',
  },
  {
    bankCode: '004',
    code: '1207',
    name: '臺灣銀行中庄分行',
  },
  {
    bankCode: '004',
    code: '1218',
    name: '臺灣銀行平鎮分行',
  },
  {
    bankCode: '004',
    code: '1229',
    name: '臺灣銀行仁愛分行',
  },
  {
    bankCode: '004',
    code: '1230',
    name: '臺灣銀行南崁分行',
  },
  {
    bankCode: '004',
    code: '1241',
    name: '臺灣銀行圓山分行',
  },
  {
    bankCode: '004',
    code: '1355',
    name: '臺灣銀行五股分行',
  },
  {
    bankCode: '004',
    code: '1366',
    name: '臺灣銀行大里分行',
  },
  {
    bankCode: '004',
    code: '1377',
    name: '臺灣銀行安南分行',
  },
  {
    bankCode: '004',
    code: '1388',
    name: '臺灣銀行新加坡分行',
  },
  {
    bankCode: '004',
    code: '1414',
    name: '臺灣銀行西屯分行',
  },
  {
    bankCode: '004',
    code: '1425',
    name: '臺灣銀行天母分行',
  },
  {
    bankCode: '004',
    code: '1436',
    name: '臺灣銀行鹿港分行',
  },
  {
    bankCode: '004',
    code: '1447',
    name: '臺灣銀行內壢分行',
  },
  {
    bankCode: '004',
    code: '1469',
    name: '臺灣銀行臺南科學園區分行',
  },
  {
    bankCode: '004',
    code: '1470',
    name: '臺灣銀行虎尾分行',
  },
  {
    bankCode: '004',
    code: '1481',
    name: '臺灣銀行淡水分行',
  },
  {
    bankCode: '004',
    code: '1539',
    name: '臺灣銀行內湖分行',
  },
  {
    bankCode: '004',
    code: '1540',
    name: '臺灣銀行嘉北分行',
  },
  {
    bankCode: '004',
    code: '1551',
    name: '臺灣銀行東港分行',
  },
  {
    bankCode: '004',
    code: '1562',
    name: '臺灣銀行汐止分行',
  },
  {
    bankCode: '004',
    code: '1573',
    name: '臺灣銀行梧棲分行',
  },
  {
    bankCode: '004',
    code: '1595',
    name: '臺灣銀行小港分行',
  },
  {
    bankCode: '004',
    code: '1609',
    name: '臺灣銀行中屏分行',
  },
  {
    bankCode: '004',
    code: '1610',
    name: '臺灣銀行南非分行',
  },
  {
    bankCode: '004',
    code: '1621',
    name: '臺灣銀行群賢分行',
  },
  {
    bankCode: '004',
    code: '1643',
    name: '臺灣銀行北大路分行',
  },
  {
    bankCode: '004',
    code: '1654',
    name: '臺灣銀行文山分行',
  },
  {
    bankCode: '004',
    code: '1702',
    name: '臺灣銀行太平分行',
  },
  {
    bankCode: '004',
    code: '1713',
    name: '臺灣銀行德芳分行',
  },
  {
    bankCode: '004',
    code: '1724',
    name: '臺灣銀行建國分行',
  },
  {
    bankCode: '004',
    code: '1768',
    name: '臺灣銀行屏東農科園區分行',
  },
  {
    bankCode: '004',
    code: '1861',
    name: '臺灣銀行東桃園分行',
  },
  {
    bankCode: '004',
    code: '1872',
    name: '臺灣銀行蘆洲分行',
  },
  {
    bankCode: '004',
    code: '1919',
    name: '臺灣銀行高雄國際機場分行',
  },
  {
    bankCode: '004',
    code: '1931',
    name: '臺灣銀行永吉簡易型分行',
  },
  {
    bankCode: '004',
    code: '1942',
    name: '臺灣銀行東門簡易型分行',
  },
  {
    bankCode: '004',
    code: '1953',
    name: '臺灣銀行愛國簡易型分行',
  },
  {
    bankCode: '004',
    code: '1986',
    name: '臺灣銀行臺電簡易型分行',
  },
  {
    bankCode: '004',
    code: '2053',
    name: '臺灣銀行北府簡易型分行',
  },
  {
    bankCode: '004',
    code: '2101',
    name: '臺灣銀行倫敦分行',
  },
  {
    bankCode: '004',
    code: '2189',
    name: '臺灣銀行臺北港分行',
  },
  {
    bankCode: '004',
    code: '2204',
    name: '臺灣銀行臺中科學園區分行',
  },
  {
    bankCode: '004',
    code: '2215',
    name: '臺灣銀行高雄科學園區分行',
  },
  {
    bankCode: '004',
    code: '2237',
    name: '臺灣銀行東湖分行',
  },
  {
    bankCode: '004',
    code: '2248',
    name: '臺灣銀行高榮分行',
  },
  {
    bankCode: '004',
    code: '2259',
    name: '臺灣銀行南港軟體園區分行',
  },
  {
    bankCode: '004',
    code: '2260',
    name: '臺灣銀行龍潭分行',
  },
  {
    bankCode: '004',
    code: '2271',
    name: '臺灣銀行仁德分行',
  },
  {
    bankCode: '004',
    code: '2282',
    name: '臺灣銀行林口分行',
  },
  {
    bankCode: '004',
    code: '2293',
    name: '臺灣銀行木柵分行',
  },
  {
    bankCode: '004',
    code: '2307',
    name: '臺南創新園區分行',
  },
  {
    bankCode: '004',
    code: '2363',
    name: '臺灣銀行武昌分行',
  },
  {
    bankCode: '004',
    code: '2385',
    name: '臺灣銀行臺北分行',
  },
  {
    bankCode: '004',
    code: '2396',
    name: '臺灣銀行金山分行',
  },
  {
    bankCode: '004',
    code: '2400',
    name: '臺灣銀行信安分行',
  },
  {
    bankCode: '004',
    code: '2411',
    name: '臺灣銀行劍潭分行',
  },
  {
    bankCode: '004',
    code: '2422',
    name: '臺灣銀行萬華分行',
  },
  {
    bankCode: '004',
    code: '2433',
    name: '臺灣銀行板新分行',
  },
  {
    bankCode: '004',
    code: '2444',
    name: '臺灣銀行新永和分行',
  },
  {
    bankCode: '004',
    code: '2455',
    name: '臺灣銀行南新莊分行',
  },
  {
    bankCode: '004',
    code: '2477',
    name: '臺灣銀行新明分行',
  },
  {
    bankCode: '004',
    code: '2488',
    name: '臺灣銀行六家分行',
  },
  {
    bankCode: '004',
    code: '2499',
    name: '臺灣銀行北臺中分行',
  },
  {
    bankCode: '004',
    code: '2525',
    name: '臺灣銀行嘉南分行',
  },
  {
    bankCode: '004',
    code: '2536',
    name: '臺灣銀行南都分行',
  },
  {
    bankCode: '004',
    code: '2558',
    name: '臺灣銀行北高雄分行',
  },
  {
    bankCode: '004',
    code: '2569',
    name: '臺灣銀行成功分行',
  },
  {
    bankCode: '004',
    code: '2570',
    name: '臺灣銀行北花蓮分行',
  },
  {
    bankCode: '004',
    code: '2709',
    name: '臺灣銀行新湖分行',
  },
  {
    bankCode: '004',
    code: '2710',
    name: '臺灣銀行五福分行',
  },
  {
    bankCode: '004',
    code: '2721',
    name: '臺灣銀行六甲頂分行',
  },
  {
    bankCode: '004',
    code: '2776',
    name: '臺灣銀行上海分行',
  },
  {
    bankCode: '004',
    code: '2787',
    name: '臺灣銀行中都分行',
  },
  {
    bankCode: '004',
    code: '2798',
    name: '臺灣銀行臺北國際機場分行',
  },
  {
    bankCode: '004',
    code: '2802',
    name: '新莊副都心分行',
  },
  {
    bankCode: '004',
    code: '2813',
    name: '臺灣銀行孟買代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2824',
    name: '臺灣銀行雪梨分行',
  },
  {
    bankCode: '004',
    code: '2835',
    name: '臺灣銀行仁武分行',
  },
  {
    bankCode: '004',
    code: '2846',
    name: '臺灣銀行上海嘉定支行',
  },
  {
    bankCode: '004',
    code: '2868',
    name: '臺灣銀行仰光代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2879',
    name: '臺灣銀行廣州分行',
  },
  {
    bankCode: '004',
    code: '2880',
    name: '臺灣銀行福州分行',
  },
  {
    bankCode: '004',
    code: '2891',
    name: '臺灣銀行臺中國際機場分行',
  },
  {
    bankCode: '004',
    code: '2905',
    name: '臺中精密園區分行',
  },
  {
    bankCode: '004',
    code: '2916',
    name: '臺灣銀行胡志明市代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2927',
    name: '臺灣銀行曼谷代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2949',
    name: '臺灣銀行馬尼拉代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2950',
    name: '臺灣銀行矽谷代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2961',
    name: '臺灣銀行法蘭克福代表人辦事處',
  },
  {
    bankCode: '004',
    code: '2972',
    name: '臺灣銀行亞矽創新分行',
  },
  {
    bankCode: '005',
    code: '0027',
    name: '臺灣土地銀行基隆分行',
  },
  {
    bankCode: '005',
    code: '0038',
    name: '臺灣土地銀行中和分行',
  },
  {
    bankCode: '005',
    code: '0049',
    name: '臺灣土地銀行南港分行',
  },
  {
    bankCode: '005',
    code: '0050',
    name: '臺灣土地銀行台北分行',
  },
  {
    bankCode: '005',
    code: '0061',
    name: '臺灣土地銀行民權分行',
  },
  {
    bankCode: '005',
    code: '0072',
    name: '臺灣土地銀行古亭分行',
  },
  {
    bankCode: '005',
    code: '0083',
    name: '臺灣土地銀行長安分行',
  },
  {
    bankCode: '005',
    code: '0094',
    name: '臺灣土地銀行士林分行',
  },
  {
    bankCode: '005',
    code: '0108',
    name: '臺灣土地銀行三重分行',
  },
  {
    bankCode: '005',
    code: '0119',
    name: '臺灣土地銀行宜蘭分行',
  },
  {
    bankCode: '005',
    code: '0120',
    name: '臺灣土地銀行羅東分行',
  },
  {
    bankCode: '005',
    code: '0131',
    name: '臺灣土地銀行桃園分行',
  },
  {
    bankCode: '005',
    code: '0142',
    name: '臺灣土地銀行中壢分行',
  },
  {
    bankCode: '005',
    code: '0153',
    name: '臺灣土地銀行石門分行',
  },
  {
    bankCode: '005',
    code: '0164',
    name: '臺灣土地銀行新竹分行',
  },
  {
    bankCode: '005',
    code: '0175',
    name: '臺灣土地銀行竹東分行',
  },
  {
    bankCode: '005',
    code: '0186',
    name: '臺灣土地銀行花蓮分行',
  },
  {
    bankCode: '005',
    code: '0197',
    name: '臺灣土地銀行玉里分行',
  },
  {
    bankCode: '005',
    code: '0201',
    name: '臺灣土地銀行苗栗分行',
  },
  {
    bankCode: '005',
    code: '0212',
    name: '臺灣土地銀行頭份分行',
  },
  {
    bankCode: '005',
    code: '0223',
    name: '臺灣土地銀行豐原分行',
  },
  {
    bankCode: '005',
    code: '0234',
    name: '臺灣土地銀行大甲分行',
  },
  {
    bankCode: '005',
    code: '0245',
    name: '臺灣土地銀行台中分行',
  },
  {
    bankCode: '005',
    code: '0256',
    name: '臺灣土地銀行南投分行',
  },
  {
    bankCode: '005',
    code: '0267',
    name: '臺灣土地銀行員林分行',
  },
  {
    bankCode: '005',
    code: '0278',
    name: '臺灣土地銀行斗六分行',
  },
  {
    bankCode: '005',
    code: '0289',
    name: '臺灣土地銀行北港分行',
  },
  {
    bankCode: '005',
    code: '0290',
    name: '臺灣土地銀行嘉義分行',
  },
  {
    bankCode: '005',
    code: '0304',
    name: '臺灣土地銀行新營分行',
  },
  {
    bankCode: '005',
    code: '0315',
    name: '臺灣土地銀行永康分行',
  },
  {
    bankCode: '005',
    code: '0326',
    name: '臺灣土地銀行台南分行',
  },
  {
    bankCode: '005',
    code: '0337',
    name: '臺灣土地銀行高雄分行',
  },
  {
    bankCode: '005',
    code: '0348',
    name: '臺灣土地銀行岡山分行',
  },
  {
    bankCode: '005',
    code: '0359',
    name: '臺灣土地銀行美濃分行',
  },
  {
    bankCode: '005',
    code: '0360',
    name: '臺灣土地銀行屏東分行',
  },
  {
    bankCode: '005',
    code: '0371',
    name: '臺灣土地銀行臺東分行',
  },
  {
    bankCode: '005',
    code: '0382',
    name: '臺灣土地銀行青年分行',
  },
  {
    bankCode: '005',
    code: '0393',
    name: '臺灣土地銀行金門分行',
  },
  {
    bankCode: '005',
    code: '0407',
    name: '臺灣土地銀行澎湖分行',
  },
  {
    bankCode: '005',
    code: '0418',
    name: '臺灣土地銀行營業部',
  },
  {
    bankCode: '005',
    code: '0452',
    name: '臺灣土地銀行和平分行',
  },
  {
    bankCode: '005',
    code: '0463',
    name: '臺灣土地銀行潮州分行',
  },
  {
    bankCode: '005',
    code: '0474',
    name: '臺灣土地銀行彰化分行',
  },
  {
    bankCode: '005',
    code: '0485',
    name: '臺灣土地銀行中山分行',
  },
  {
    bankCode: '005',
    code: '0496',
    name: '臺灣土地銀行永和分行',
  },
  {
    bankCode: '005',
    code: '0500',
    name: '臺灣土地銀行板橋分行',
  },
  {
    bankCode: '005',
    code: '0511',
    name: '臺灣土地銀行鳳山分行',
  },
  {
    bankCode: '005',
    code: '0522',
    name: '臺灣土地銀行湖口分行',
  },
  {
    bankCode: '005',
    code: '0533',
    name: '臺灣土地銀行蘇澳分行',
  },
  {
    bankCode: '005',
    code: '0544',
    name: '臺灣土地銀行新興分行',
  },
  {
    bankCode: '005',
    code: '0555',
    name: '臺灣土地銀行西台中分行',
  },
  {
    bankCode: '005',
    code: '0566',
    name: '臺灣土地銀行虎尾分行',
  },
  {
    bankCode: '005',
    code: '0577',
    name: '臺灣土地銀行仁愛分行',
  },
  {
    bankCode: '005',
    code: '0588',
    name: '臺灣土地銀行忠孝分行',
  },
  {
    bankCode: '005',
    code: '0599',
    name: '臺灣土地銀行中正分行',
  },
  {
    bankCode: '005',
    code: '0614',
    name: '臺灣土地銀行新店分行',
  },
  {
    bankCode: '005',
    code: '0625',
    name: '臺灣土地銀行北台南分行',
  },
  {
    bankCode: '005',
    code: '0636',
    name: '臺灣土地銀行松山分行',
  },
  {
    bankCode: '005',
    code: '0647',
    name: '臺灣土地銀行內湖分行',
  },
  {
    bankCode: '005',
    code: '0658',
    name: '臺灣土地銀行三民分行',
  },
  {
    bankCode: '005',
    code: '0669',
    name: '臺灣土地銀行民雄分行',
  },
  {
    bankCode: '005',
    code: '0670',
    name: '臺灣土地銀行大社分行',
  },
  {
    bankCode: '005',
    code: '0692',
    name: '臺灣土地銀行前鎮分行',
  },
  {
    bankCode: '005',
    code: '0706',
    name: '臺灣土地銀行路竹分行',
  },
  {
    bankCode: '005',
    code: '0717',
    name: '臺灣土地銀行五甲分行',
  },
  {
    bankCode: '005',
    code: '0728',
    name: '臺灣土地銀行太平分行',
  },
  {
    bankCode: '005',
    code: '0739',
    name: '臺灣土地銀行正濱分行',
  },
  {
    bankCode: '005',
    code: '0740',
    name: '臺灣土地銀行敦化分行',
  },
  {
    bankCode: '005',
    code: '0751',
    name: '臺灣土地銀行信託部',
  },
  {
    bankCode: '005',
    code: '0762',
    name: '臺灣土地銀行蘆洲分行',
  },
  {
    bankCode: '005',
    code: '0773',
    name: '臺灣土地銀行北臺中分行',
  },
  {
    bankCode: '005',
    code: '0784',
    name: '臺灣土地銀行苓雅分行',
  },
  {
    bankCode: '005',
    code: '0795',
    name: '臺灣土地銀行信義分行',
  },
  {
    bankCode: '005',
    code: '0809',
    name: '臺灣土地銀行土城分行',
  },
  {
    bankCode: '005',
    code: '0810',
    name: '臺灣土地銀行淡水分行',
  },
  {
    bankCode: '005',
    code: '0821',
    name: '臺灣土地銀行草屯分行',
  },
  {
    bankCode: '005',
    code: '0832',
    name: '臺灣土地銀行東台南分行',
  },
  {
    bankCode: '005',
    code: '0843',
    name: '臺灣土地銀行通霄分行',
  },
  {
    bankCode: '005',
    code: '0854',
    name: '臺灣土地銀行學甲分行',
  },
  {
    bankCode: '005',
    code: '0865',
    name: '臺灣土地銀行新莊分行',
  },
  {
    bankCode: '005',
    code: '0876',
    name: '臺灣土地銀行雙和分行',
  },
  {
    bankCode: '005',
    code: '0887',
    name: '臺灣土地銀行國外部',
  },
  {
    bankCode: '005',
    code: '0898',
    name: '臺灣土地銀行白河分行',
  },
  {
    bankCode: '005',
    code: '0902',
    name: '臺灣土地銀行復興分行',
  },
  {
    bankCode: '005',
    code: '0913',
    name: '臺灣土地銀行平鎮分行',
  },
  {
    bankCode: '005',
    code: '0924',
    name: '臺灣土地銀行國際金融業務分行',
  },
  {
    bankCode: '005',
    code: '0935',
    name: '臺灣土地銀行文山分行',
  },
  {
    bankCode: '005',
    code: '0946',
    name: '臺灣土地銀行中港分行',
  },
  {
    bankCode: '005',
    code: '0957',
    name: '臺灣土地銀行東板橋分行',
  },
  {
    bankCode: '005',
    code: '0968',
    name: '臺灣土地銀行南崁分行',
  },
  {
    bankCode: '005',
    code: '0979',
    name: '臺灣土地銀行建國分行',
  },
  {
    bankCode: '005',
    code: '0980',
    name: '臺灣土地銀行樹林分行',
  },
  {
    bankCode: '005',
    code: '0991',
    name: '臺灣土地銀行東台北分行',
  },
  {
    bankCode: '005',
    code: '1002',
    name: '臺灣土地銀行西三重分行',
  },
  {
    bankCode: '005',
    code: '1013',
    name: '臺灣土地銀行南台中分行',
  },
  {
    bankCode: '005',
    code: '1024',
    name: '臺灣土地銀行長春分行',
  },
  {
    bankCode: '005',
    code: '1035',
    name: '臺灣土地銀行東新竹分行',
  },
  {
    bankCode: '005',
    code: '1046',
    name: '臺灣土地銀行新市分行',
  },
  {
    bankCode: '005',
    code: '1057',
    name: '臺灣土地銀行博愛分行',
  },
  {
    bankCode: '005',
    code: '1068',
    name: '臺灣土地銀行中崙分行',
  },
  {
    bankCode: '005',
    code: '1079',
    name: '臺灣土地銀行華江分行',
  },
  {
    bankCode: '005',
    code: '1080',
    name: '臺灣土地銀行竹北分行',
  },
  {
    bankCode: '005',
    code: '1091',
    name: '臺灣土地銀行安平分行',
  },
  {
    bankCode: '005',
    code: '1105',
    name: '臺灣土地銀行嘉興分行',
  },
  {
    bankCode: '005',
    code: '1116',
    name: '臺灣土地銀行南新莊分行',
  },
  {
    bankCode: '005',
    code: '1127',
    name: '臺灣土地銀行三峽分行',
  },
  {
    bankCode: '005',
    code: '1138',
    name: '臺灣土地銀行沙鹿分行',
  },
  {
    bankCode: '005',
    code: '1149',
    name: '臺灣土地銀行南桃園分行',
  },
  {
    bankCode: '005',
    code: '1150',
    name: '臺灣土地銀行汐止分行',
  },
  {
    bankCode: '005',
    code: '1161',
    name: '臺灣土地銀行萬華分行',
  },
  {
    bankCode: '005',
    code: '1172',
    name: '臺灣土地銀行小港分行',
  },
  {
    bankCode: '005',
    code: '1183',
    name: '臺灣土地銀行新工分行',
  },
  {
    bankCode: '005',
    code: '1194',
    name: '臺灣土地銀行烏日分行',
  },
  {
    bankCode: '005',
    code: '1208',
    name: '臺灣土地銀行西湖分行',
  },
  {
    bankCode: '005',
    code: '1219',
    name: '臺灣土地銀行八德分行',
  },
  {
    bankCode: '005',
    code: '1220',
    name: '臺灣土地銀行北屯分行',
  },
  {
    bankCode: '005',
    code: '1231',
    name: '臺灣土地銀行大安分行',
  },
  {
    bankCode: '005',
    code: '1242',
    name: '臺灣土地銀行北中壢分行',
  },
  {
    bankCode: '005',
    code: '1253',
    name: '臺灣土地銀行高樹分行',
  },
  {
    bankCode: '005',
    code: '1264',
    name: '臺灣土地銀行枋寮分行',
  },
  {
    bankCode: '005',
    code: '1286',
    name: '臺灣土地銀行金城分行',
  },
  {
    bankCode: '005',
    code: '1297',
    name: '臺灣土地銀行光復分行',
  },
  {
    bankCode: '005',
    code: '1301',
    name: '臺灣土地銀行左營分行',
  },
  {
    bankCode: '005',
    code: '1312',
    name: '臺灣土地銀行北桃園分行',
  },
  {
    bankCode: '005',
    code: '1323',
    name: '臺灣土地銀行東港分行',
  },
  {
    bankCode: '005',
    code: '1334',
    name: '臺灣土地銀行天母分行',
  },
  {
    bankCode: '005',
    code: '1345',
    name: '臺灣土地銀行泰山分行',
  },
  {
    bankCode: '005',
    code: '1356',
    name: '臺灣土地銀行中科分行',
  },
  {
    bankCode: '005',
    code: '1367',
    name: '臺灣土地銀行大園分行',
  },
  {
    bankCode: '005',
    code: '1378',
    name: '臺灣土地銀行楊梅分行',
  },
  {
    bankCode: '005',
    code: '1389',
    name: '臺灣土地銀行東門分行',
  },
  {
    bankCode: '005',
    code: '1404',
    name: '臺灣土地銀行城東分行',
  },
  {
    bankCode: '005',
    code: '1415',
    name: '臺灣土地銀行松南分行',
  },
  {
    bankCode: '005',
    code: '1426',
    name: '臺灣土地銀行福興分行',
  },
  {
    bankCode: '005',
    code: '1437',
    name: '臺灣土地銀行林口分行',
  },
  {
    bankCode: '005',
    code: '1448',
    name: '臺灣土地銀行西屯分行',
  },
  {
    bankCode: '005',
    code: '1459',
    name: '臺灣土地銀行內壢分行',
  },
  {
    bankCode: '005',
    code: '1460',
    name: '臺灣土地銀行竹南分行',
  },
  {
    bankCode: '005',
    code: '1471',
    name: '臺灣土地銀行安南分行',
  },
  {
    bankCode: '005',
    code: '1482',
    name: '臺灣土地銀行汐科分行',
  },
  {
    bankCode: '005',
    code: '1493',
    name: '臺灣土地銀行楠梓分行',
  },
  {
    bankCode: '005',
    code: '1507',
    name: '臺灣土地銀行大里分行',
  },
  {
    bankCode: '005',
    code: '1518',
    name: '臺灣土地銀行大灣分行',
  },
  {
    bankCode: '005',
    code: '1530',
    name: '臺灣土地銀行大發分行',
  },
  {
    bankCode: '005',
    code: '1552',
    name: '臺灣土地銀行圓山分行',
  },
  {
    bankCode: '005',
    code: '1563',
    name: '臺灣土地銀行工研院分行',
  },
  {
    bankCode: '005',
    code: '1574',
    name: '臺灣土地銀行北三重分行',
  },
  {
    bankCode: '005',
    code: '1585',
    name: '臺灣土地銀行圓通分行',
  },
  {
    bankCode: '005',
    code: '1600',
    name: '臺灣土地銀行大直分行',
  },
  {
    bankCode: '005',
    code: '1611',
    name: '臺灣土地銀行南屯分行',
  },
  {
    bankCode: '005',
    code: '1622',
    name: '臺灣土地銀行證券部',
  },
  {
    bankCode: '005',
    code: '1633',
    name: '臺灣土地銀行寶中分行',
  },
  {
    bankCode: '005',
    code: '1644',
    name: '臺灣土地銀行中清分行',
  },
  {
    bankCode: '005',
    code: '1655',
    name: '臺灣土地銀行南京東路分行',
  },
  {
    bankCode: '005',
    code: '1666',
    name: '臺灣土地銀行仁武分行',
  },
  {
    bankCode: '005',
    code: '5011',
    name: '臺灣土地銀行洛杉磯分行',
  },
  {
    bankCode: '005',
    code: '5022',
    name: '臺灣土地銀行香港分行',
  },
  {
    bankCode: '005',
    code: '5033',
    name: '臺灣土地銀行新加坡分行',
  },
  {
    bankCode: '005',
    code: '5044',
    name: '臺灣土地銀行上海分行',
  },
  {
    bankCode: '005',
    code: '5066',
    name: '臺灣土地銀行紐約分行',
  },
  {
    bankCode: '005',
    code: '5077',
    name: '臺灣土地銀行天津分行',
  },
  {
    bankCode: '005',
    code: '5088',
    name: '臺灣土地銀行武漢分行',
  },
  {
    bankCode: '006',
    code: '0017',
    name: '合作金庫商業銀行財務部',
  },
  {
    bankCode: '006',
    code: '0028',
    name: '合作金庫商業銀行館前分行',
  },
  {
    bankCode: '006',
    code: '0039',
    name: '合作金庫商業銀行西門分行',
  },
  {
    bankCode: '006',
    code: '0040',
    name: '合作金庫商業銀行延平分行',
  },
  {
    bankCode: '006',
    code: '0051',
    name: '合作金庫商業銀行大稻埕分行',
  },
  {
    bankCode: '006',
    code: '0062',
    name: '合作金庫商業銀行東門分行',
  },
  {
    bankCode: '006',
    code: '0073',
    name: '合作金庫商業銀行松山分行',
  },
  {
    bankCode: '006',
    code: '0084',
    name: '合作金庫商業銀行新店分行',
  },
  {
    bankCode: '006',
    code: '0095',
    name: '合作金庫商業銀行永和分行',
  },
  {
    bankCode: '006',
    code: '0109',
    name: '合作金庫商業銀行三重分行',
  },
  {
    bankCode: '006',
    code: '0110',
    name: '合作金庫商業銀行板橋分行',
  },
  {
    bankCode: '006',
    code: '0121',
    name: '合作金庫商業銀行基隆分行',
  },
  {
    bankCode: '006',
    code: '0132',
    name: '合作金庫商業銀行宜蘭分行',
  },
  {
    bankCode: '006',
    code: '0143',
    name: '合作金庫商業銀行蘇澳分行',
  },
  {
    bankCode: '006',
    code: '0154',
    name: '合作金庫商業銀行桃園分行',
  },
  {
    bankCode: '006',
    code: '0165',
    name: '合作金庫商業銀行中壢分行',
  },
  {
    bankCode: '006',
    code: '0176',
    name: '合作金庫商業銀行新竹分行',
  },
  {
    bankCode: '006',
    code: '0187',
    name: '合作金庫商業銀行苗栗分行',
  },
  {
    bankCode: '006',
    code: '0198',
    name: '合作金庫商業銀行頭份分行',
  },
  {
    bankCode: '006',
    code: '0202',
    name: '合作金庫商業銀行豐原分行',
  },
  {
    bankCode: '006',
    code: '0213',
    name: '合作金庫商業銀行沙鹿分行',
  },
  {
    bankCode: '006',
    code: '0224',
    name: '合作金庫商業銀行台中分行',
  },
  {
    bankCode: '006',
    code: '0235',
    name: '合作金庫商業銀行彰化分行',
  },
  {
    bankCode: '006',
    code: '0246',
    name: '合作金庫商業銀行員林分行',
  },
  {
    bankCode: '006',
    code: '0257',
    name: '合作金庫商業銀行南投分行',
  },
  {
    bankCode: '006',
    code: '0268',
    name: '合作金庫商業銀行斗六分行',
  },
  {
    bankCode: '006',
    code: '0279',
    name: '合作金庫商業銀行北港分行',
  },
  {
    bankCode: '006',
    code: '0280',
    name: '合作金庫商業銀行嘉義分行',
  },
  {
    bankCode: '006',
    code: '0291',
    name: '合作金庫商業銀行新營分行',
  },
  {
    bankCode: '006',
    code: '0305',
    name: '合作金庫商業銀行台南分行',
  },
  {
    bankCode: '006',
    code: '0316',
    name: '合作金庫商業銀行成功分行',
  },
  {
    bankCode: '006',
    code: '0327',
    name: '合作金庫商業銀行鳳山分行',
  },
  {
    bankCode: '006',
    code: '0338',
    name: '合作金庫商業銀行岡山分行',
  },
  {
    bankCode: '006',
    code: '0349',
    name: '合作金庫商業銀行高雄分行',
  },
  {
    bankCode: '006',
    code: '0350',
    name: '合作金庫商業銀行新興分行',
  },
  {
    bankCode: '006',
    code: '0361',
    name: '合作金庫商業銀行屏東分行',
  },
  {
    bankCode: '006',
    code: '0372',
    name: '合作金庫商業銀行潮州分行',
  },
  {
    bankCode: '006',
    code: '0383',
    name: '合作金庫商業銀行花蓮分行',
  },
  {
    bankCode: '006',
    code: '0394',
    name: '合作金庫商業銀行台東分行',
  },
  {
    bankCode: '006',
    code: '0408',
    name: '合作金庫商業銀行澎湖分行',
  },
  {
    bankCode: '006',
    code: '0419',
    name: '合作金庫商業銀行南京東路分行',
  },
  {
    bankCode: '006',
    code: '0420',
    name: '合作金庫商業銀行北高雄分行',
  },
  {
    bankCode: '006',
    code: '0431',
    name: '合作金庫商業銀行大同分行',
  },
  {
    bankCode: '006',
    code: '0453',
    name: '合作金庫商業銀行忠孝分行',
  },
  {
    bankCode: '006',
    code: '0464',
    name: '合作金庫商業銀行景美分行',
  },
  {
    bankCode: '006',
    code: '0475',
    name: '合作金庫商業銀行士林分行',
  },
  {
    bankCode: '006',
    code: '0486',
    name: '合作金庫商業銀行汐止分行',
  },
  {
    bankCode: '006',
    code: '0497',
    name: '合作金庫商業銀行新莊分行',
  },
  {
    bankCode: '006',
    code: '0501',
    name: '合作金庫商業銀行中興分行',
  },
  {
    bankCode: '006',
    code: '0512',
    name: '合作金庫商業銀行苓雅分行',
  },
  {
    bankCode: '006',
    code: '0523',
    name: '合作金庫商業銀行業務發展部',
  },
  {
    bankCode: '006',
    code: '0534',
    name: '合作金庫商業銀行法遵暨法務部',
  },
  {
    bankCode: '006',
    code: '0545',
    name: '合作金庫商業銀行台北分行',
  },
  {
    bankCode: '006',
    code: '0556',
    name: '合作金庫商業銀行個人金融部',
  },
  {
    bankCode: '006',
    code: '0567',
    name: '合作金庫商業銀行營業部',
  },
  {
    bankCode: '006',
    code: '0578',
    name: '合作金庫商業銀行南豐原分行',
  },
  {
    bankCode: '006',
    code: '0589',
    name: '合作金庫商業銀行羅東分行',
  },
  {
    bankCode: '006',
    code: '0590',
    name: '合作金庫商業銀行三民分行',
  },
  {
    bankCode: '006',
    code: '0604',
    name: '合作金庫商業銀行城東分行',
  },
  {
    bankCode: '006',
    code: '0615',
    name: '合作金庫商業銀行佳里分行',
  },
  {
    bankCode: '006',
    code: '0626',
    name: '合作金庫商業銀行中和分行',
  },
  {
    bankCode: '006',
    code: '0637',
    name: '合作金庫商業銀行南高雄分行',
  },
  {
    bankCode: '006',
    code: '0648',
    name: '合作金庫商業銀行南嘉義分行',
  },
  {
    bankCode: '006',
    code: '0659',
    name: '合作金庫商業銀行竹東分行',
  },
  {
    bankCode: '006',
    code: '0660',
    name: '合作金庫商業銀行林口文化分行',
  },
  {
    bankCode: '006',
    code: '0671',
    name: '合作金庫商業銀行東三重分行',
  },
  {
    bankCode: '006',
    code: '0682',
    name: '合作金庫商業銀行南興分行',
  },
  {
    bankCode: '006',
    code: '0693',
    name: '合作金庫商業銀行五權分行',
  },
  {
    bankCode: '006',
    code: '0707',
    name: '合作金庫商業銀行埔里分行',
  },
  {
    bankCode: '006',
    code: '0718',
    name: '合作金庫商業銀行大順分行',
  },
  {
    bankCode: '006',
    code: '0729',
    name: '合作金庫商業銀行南勢角分行',
  },
  {
    bankCode: '006',
    code: '0730',
    name: '合作金庫商業銀行朴子分行',
  },
  {
    bankCode: '006',
    code: '0763',
    name: '合作金庫商業銀行大安分行',
  },
  {
    bankCode: '006',
    code: '0774',
    name: '合作金庫商業銀行民權分行',
  },
  {
    bankCode: '006',
    code: '0785',
    name: '合作金庫商業銀行東高雄分行',
  },
  {
    bankCode: '006',
    code: '0796',
    name: '合作金庫商業銀行東台北分行',
  },
  {
    bankCode: '006',
    code: '0800',
    name: '合作金庫商業銀行城內分行',
  },
  {
    bankCode: '006',
    code: '0811',
    name: '合作金庫商業銀行建國分行',
  },
  {
    bankCode: '006',
    code: '0822',
    name: '合作金庫商業銀行圓山分行',
  },
  {
    bankCode: '006',
    code: '0833',
    name: '合作金庫商業銀行信義分行',
  },
  {
    bankCode: '006',
    code: '0844',
    name: '合作金庫商業銀行長春分行',
  },
  {
    bankCode: '006',
    code: '0855',
    name: '合作金庫商業銀行仁愛分行',
  },
  {
    bankCode: '006',
    code: '0866',
    name: '合作金庫商業銀行玉成分行',
  },
  {
    bankCode: '006',
    code: '0877',
    name: '合作金庫商業銀行古亭分行',
  },
  {
    bankCode: '006',
    code: '0888',
    name: '合作金庫商業銀行長安分行',
  },
  {
    bankCode: '006',
    code: '0899',
    name: '合作金庫商業銀行松興分行',
  },
  {
    bankCode: '006',
    code: '0903',
    name: '合作金庫商業銀行民族分行',
  },
  {
    bankCode: '006',
    code: '0914',
    name: '合作金庫商業銀行復興分行',
  },
  {
    bankCode: '006',
    code: '0925',
    name: '合作金庫商業銀行雙連分行',
  },
  {
    bankCode: '006',
    code: '0936',
    name: '合作金庫商業銀行民生分行',
  },
  {
    bankCode: '006',
    code: '0947',
    name: '合作金庫商業銀行新生分行',
  },
  {
    bankCode: '006',
    code: '0958',
    name: '合作金庫商業銀行松江分行',
  },
  {
    bankCode: '006',
    code: '0969',
    name: '合作金庫商業銀行永吉分行',
  },
  {
    bankCode: '006',
    code: '0981',
    name: '合作金庫商業銀行東新莊分行',
  },
  {
    bankCode: '006',
    code: '0992',
    name: '合作金庫商業銀行蘆洲分行',
  },
  {
    bankCode: '006',
    code: '1003',
    name: '合作金庫商業銀行前金分行',
  },
  {
    bankCode: '006',
    code: '1014',
    name: '合作金庫商業銀行成大分行',
  },
  {
    bankCode: '006',
    code: '1025',
    name: '合作金庫商業銀行大里分行',
  },
  {
    bankCode: '006',
    code: '1036',
    name: '合作金庫商業銀行海山分行',
  },
  {
    bankCode: '006',
    code: '1047',
    name: '合作金庫商業銀行信託部',
  },
  {
    bankCode: '006',
    code: '1069',
    name: '合作金庫商業銀行國際金融業務分行',
  },
  {
    bankCode: '006',
    code: '1070',
    name: '合作金庫商業銀行南台中分行',
  },
  {
    bankCode: '006',
    code: '1081',
    name: '合作金庫商業銀行埔墘分行',
  },
  {
    bankCode: '006',
    code: '1092',
    name: '合作金庫商業銀行慈文分行',
  },
  {
    bankCode: '006',
    code: '1106',
    name: '合作金庫商業銀行北寧分行',
  },
  {
    bankCode: '006',
    code: '1117',
    name: '合作金庫商業銀行迴龍分行',
  },
  {
    bankCode: '006',
    code: '1128',
    name: '合作金庫商業銀行太平分行',
  },
  {
    bankCode: '006',
    code: '1139',
    name: '合作金庫商業銀行彰營分行',
  },
  {
    bankCode: '006',
    code: '1140',
    name: '合作金庫商業銀行彰儲分行',
  },
  {
    bankCode: '006',
    code: '1151',
    name: '合作金庫商業銀行虎尾分行',
  },
  {
    bankCode: '006',
    code: '1162',
    name: '合作金庫商業銀行南屯分行',
  },
  {
    bankCode: '006',
    code: '1173',
    name: '合作金庫商業銀行西台中分行',
  },
  {
    bankCode: '006',
    code: '1184',
    name: '合作金庫商業銀行溪湖分行',
  },
  {
    bankCode: '006',
    code: '1195',
    name: '合作金庫商業銀行烏日分行',
  },
  {
    bankCode: '006',
    code: '1209',
    name: '合作金庫商業銀行和美分行',
  },
  {
    bankCode: '006',
    code: '1210',
    name: '合作金庫商業銀行南桃園分行',
  },
  {
    bankCode: '006',
    code: '1221',
    name: '合作金庫商業銀行屏南分行',
  },
  {
    bankCode: '006',
    code: '1232',
    name: '合作金庫商業銀行東台南分行',
  },
  {
    bankCode: '006',
    code: '1243',
    name: '合作金庫商業銀行北新竹分行',
  },
  {
    bankCode: '006',
    code: '1254',
    name: '合作金庫商業銀行復旦分行',
  },
  {
    bankCode: '006',
    code: '1265',
    name: '合作金庫商業銀行竹山分行',
  },
  {
    bankCode: '006',
    code: '1276',
    name: '合作金庫商業銀行前鎮分行',
  },
  {
    bankCode: '006',
    code: '1287',
    name: '合作金庫商業銀行灣內分行',
  },
  {
    bankCode: '006',
    code: '1298',
    name: '合作金庫商業銀行路竹分行',
  },
  {
    bankCode: '006',
    code: '1302',
    name: '合作金庫商業銀行憲德分行',
  },
  {
    bankCode: '006',
    code: '1313',
    name: '合作金庫商業銀行竹北分行',
  },
  {
    bankCode: '006',
    code: '1324',
    name: '合作金庫商業銀行北新分行',
  },
  {
    bankCode: '006',
    code: '1335',
    name: '合作金庫商業銀行五洲分行',
  },
  {
    bankCode: '006',
    code: '1346',
    name: '合作金庫商業銀行台大分行',
  },
  {
    bankCode: '006',
    code: '1368',
    name: '合作金庫商業銀行龜山分行',
  },
  {
    bankCode: '006',
    code: '1379',
    name: '合作金庫商業銀行大溪分行',
  },
  {
    bankCode: '006',
    code: '1380',
    name: '合作金庫商業銀行龍潭分行',
  },
  {
    bankCode: '006',
    code: '1391',
    name: '合作金庫商業銀行中原分行',
  },
  {
    bankCode: '006',
    code: '1405',
    name: '合作金庫商業銀行三興分行',
  },
  {
    bankCode: '006',
    code: '1427',
    name: '合作金庫商業銀行石牌分行',
  },
  {
    bankCode: '006',
    code: '1438',
    name: '合作金庫商業銀行西屯分行',
  },
  {
    bankCode: '006',
    code: '1449',
    name: '合作金庫商業銀行雙和分行',
  },
  {
    bankCode: '006',
    code: '1450',
    name: '合作金庫商業銀行土城分行',
  },
  {
    bankCode: '006',
    code: '1461',
    name: '合作金庫商業銀行光華分行',
  },
  {
    bankCode: '006',
    code: '1472',
    name: '合作金庫商業銀行北台南分行',
  },
  {
    bankCode: '006',
    code: '1483',
    name: '合作金庫商業銀行興鳳分行',
  },
  {
    bankCode: '006',
    code: '1494',
    name: '合作金庫商業銀行北屯分行',
  },
  {
    bankCode: '006',
    code: '1508',
    name: '合作金庫商業銀行一心路分行',
  },
  {
    bankCode: '006',
    code: '1519',
    name: '合作金庫商業銀行三峽分行',
  },
  {
    bankCode: '006',
    code: '1520',
    name: '合作金庫商業銀行北嘉義分行',
  },
  {
    bankCode: '006',
    code: '1531',
    name: '合作金庫商業銀行永康分行',
  },
  {
    bankCode: '006',
    code: '1542',
    name: '合作金庫商業銀行平鎮分行',
  },
  {
    bankCode: '006',
    code: '1553',
    name: '合作金庫商業銀行大發分行',
  },
  {
    bankCode: '006',
    code: '1564',
    name: '合作金庫商業銀行內湖分行',
  },
  {
    bankCode: '006',
    code: '1575',
    name: '合作金庫商業銀行光復分行',
  },
  {
    bankCode: '006',
    code: '1586',
    name: '合作金庫商業銀行二重分行',
  },
  {
    bankCode: '006',
    code: '1601',
    name: '合作金庫商業銀行北台中分行',
  },
  {
    bankCode: '006',
    code: '1656',
    name: '合作金庫商業銀行軍功分行',
  },
  {
    bankCode: '006',
    code: '1715',
    name: '合作金庫商業銀行永安分行',
  },
  {
    bankCode: '006',
    code: '1726',
    name: '合作金庫商業銀行中權分行',
  },
  {
    bankCode: '006',
    code: '1759',
    name: '合作金庫商業銀行太原分行',
  },
  {
    bankCode: '006',
    code: '1760',
    name: '合作金庫商業銀行松竹分行',
  },
  {
    bankCode: '006',
    code: '1852',
    name: '合作金庫商業銀行中清分行',
  },
  {
    bankCode: '006',
    code: '1885',
    name: '合作金庫商業銀行建成分行',
  },
  {
    bankCode: '006',
    code: '1900',
    name: '合作金庫商業銀行朝馬分行',
  },
  {
    bankCode: '006',
    code: '1966',
    name: '合作金庫商業銀行東台中分行',
  },
  {
    bankCode: '006',
    code: '1988',
    name: '合作金庫商業銀行美村分行',
  },
  {
    bankCode: '006',
    code: '2000',
    name: '合作金庫商業銀行黎明分行',
  },
  {
    bankCode: '006',
    code: '2033',
    name: '合作金庫商業銀行昌平分行',
  },
  {
    bankCode: '006',
    code: '2044',
    name: '合作金庫商業銀行精武分行',
  },
  {
    bankCode: '006',
    code: '2055',
    name: '合作金庫商業銀行文心分行',
  },
  {
    bankCode: '006',
    code: '2077',
    name: '合作金庫商業銀行神岡分行',
  },
  {
    bankCode: '006',
    code: '3030',
    name: '合作金庫商業銀行大竹分行',
  },
  {
    bankCode: '006',
    code: '3074',
    name: '合作金庫商業銀行林內分行',
  },
  {
    bankCode: '006',
    code: '3100',
    name: '合作金庫商業銀行南港分行',
  },
  {
    bankCode: '006',
    code: '3111',
    name: '合作金庫商業銀行伸港分行',
  },
  {
    bankCode: '006',
    code: '3122',
    name: '合作金庫商業銀行五股分行',
  },
  {
    bankCode: '006',
    code: '3133',
    name: '合作金庫商業銀行樹林分行',
  },
  {
    bankCode: '006',
    code: '3144',
    name: '合作金庫商業銀行信用卡部',
  },
  {
    bankCode: '006',
    code: '3155',
    name: '合作金庫商業銀行林口分行',
  },
  {
    bankCode: '006',
    code: '3166',
    name: '合作金庫商業銀行左營分行',
  },
  {
    bankCode: '006',
    code: '3177',
    name: '合作金庫商業銀行泰山分行',
  },
  {
    bankCode: '006',
    code: '3199',
    name: '合作金庫商業銀行大坪林分行',
  },
  {
    bankCode: '006',
    code: '3373',
    name: '合作金庫商業銀行鶯歌分行',
  },
  {
    bankCode: '006',
    code: '3395',
    name: '合作金庫商業銀行鹿港分行',
  },
  {
    bankCode: '006',
    code: '3409',
    name: '合作金庫商業銀行新樹分行',
  },
  {
    bankCode: '006',
    code: '3410',
    name: '合作金庫商業銀行六家分行',
  },
  {
    bankCode: '006',
    code: '3421',
    name: '合作金庫商業銀行大雅分行',
  },
  {
    bankCode: '006',
    code: '3443',
    name: '合作金庫商業銀行八德分行',
  },
  {
    bankCode: '006',
    code: '3465',
    name: '合作金庫商業銀行鼓山分行',
  },
  {
    bankCode: '006',
    code: '3476',
    name: '合作金庫商業銀行大社分行',
  },
  {
    bankCode: '006',
    code: '3498',
    name: '合作金庫商業銀行逢甲分行',
  },
  {
    bankCode: '006',
    code: '3502',
    name: '合作金庫商業銀行立德分行',
  },
  {
    bankCode: '006',
    code: '3513',
    name: '合作金庫商業銀行林園分行',
  },
  {
    bankCode: '006',
    code: '3524',
    name: '合作金庫商業銀行高雄科技園區分行',
  },
  {
    bankCode: '006',
    code: '3535',
    name: '合作金庫商業銀行蘆竹分行',
  },
  {
    bankCode: '006',
    code: '3546',
    name: '合作金庫商業銀行北中和分行',
  },
  {
    bankCode: '006',
    code: '3557',
    name: '合作金庫商業銀行新湖分行',
  },
  {
    bankCode: '006',
    code: '3568',
    name: '合作金庫商業銀行丹鳳分行',
  },
  {
    bankCode: '006',
    code: '3580',
    name: '合作金庫商業銀行旗山分行',
  },
  {
    bankCode: '006',
    code: '3591',
    name: '合作金庫商業銀行大園分行',
  },
  {
    bankCode: '006',
    code: '3605',
    name: '合作金庫商業銀行南土城分行',
  },
  {
    bankCode: '006',
    code: '3616',
    name: '合作金庫商業銀行潭子分行',
  },
  {
    bankCode: '006',
    code: '3627',
    name: '合作金庫商業銀行后里分行',
  },
  {
    bankCode: '006',
    code: '3638',
    name: '合作金庫商業銀行長庚分行',
  },
  {
    bankCode: '006',
    code: '3649',
    name: '合作金庫商業銀行楠梓分行',
  },
  {
    bankCode: '006',
    code: '5012',
    name: '合作金庫商業銀行自強分行',
  },
  {
    bankCode: '006',
    code: '5023',
    name: '合作金庫商業銀行中山分行',
  },
  {
    bankCode: '006',
    code: '5034',
    name: '合作金庫商業銀行敦南分行',
  },
  {
    bankCode: '006',
    code: '5056',
    name: '合作金庫商業銀行世貿分行',
  },
  {
    bankCode: '006',
    code: '5078',
    name: '合作金庫商業銀行光復南路分行',
  },
  {
    bankCode: '006',
    code: '5089',
    name: '合作金庫商業銀行北士林分行',
  },
  {
    bankCode: '006',
    code: '5090',
    name: '合作金庫商業銀行信維分行',
  },
  {
    bankCode: '006',
    code: '5104',
    name: '合作金庫商業銀行西湖分行',
  },
  {
    bankCode: '006',
    code: '5115',
    name: '合作金庫商業銀行大湖分行',
  },
  {
    bankCode: '006',
    code: '5137',
    name: '合作金庫商業銀行國醫中心分行',
  },
  {
    bankCode: '006',
    code: '5159',
    name: '合作金庫商業銀行南門分行',
  },
  {
    bankCode: '006',
    code: '5160',
    name: '合作金庫商業銀行新中分行',
  },
  {
    bankCode: '006',
    code: '5171',
    name: '合作金庫商業銀行中港分行',
  },
  {
    bankCode: '006',
    code: '5182',
    name: '合作金庫商業銀行衛道分行',
  },
  {
    bankCode: '006',
    code: '5193',
    name: '合作金庫商業銀行忠明南路分行',
  },
  {
    bankCode: '006',
    code: '5207',
    name: '合作金庫商業銀行東基隆分行',
  },
  {
    bankCode: '006',
    code: '5218',
    name: '合作金庫商業銀行赤崁分行',
  },
  {
    bankCode: '006',
    code: '5229',
    name: '合作金庫商業銀行府城分行',
  },
  {
    bankCode: '006',
    code: '5230',
    name: '合作金庫商業銀行開元分行',
  },
  {
    bankCode: '006',
    code: '5241',
    name: '合作金庫商業銀行港都分行',
  },
  {
    bankCode: '006',
    code: '5252',
    name: '合作金庫商業銀行七賢分行',
  },
  {
    bankCode: '006',
    code: '5274',
    name: '合作金庫商業銀行十全分行',
  },
  {
    bankCode: '006',
    code: '5285',
    name: '合作金庫商業銀行九如分行',
  },
  {
    bankCode: '006',
    code: '5296',
    name: '合作金庫商業銀行小港分行',
  },
  {
    bankCode: '006',
    code: '5300',
    name: '合作金庫商業銀行北三峽分行',
  },
  {
    bankCode: '006',
    code: '5311',
    name: '合作金庫商業銀行板新分行',
  },
  {
    bankCode: '006',
    code: '5322',
    name: '合作金庫商業銀行南三重分行',
  },
  {
    bankCode: '006',
    code: '5355',
    name: '合作金庫商業銀行寶橋分行',
  },
  {
    bankCode: '006',
    code: '5366',
    name: '合作金庫商業銀行新泰分行',
  },
  {
    bankCode: '006',
    code: '5377',
    name: '合作金庫商業銀行北土城分行',
  },
  {
    bankCode: '006',
    code: '5388',
    name: '合作金庫商業銀行南汐止分行',
  },
  {
    bankCode: '006',
    code: '5399',
    name: '合作金庫商業銀行北樹林分行',
  },
  {
    bankCode: '006',
    code: '5403',
    name: '合作金庫商業銀行五股工業區分行',
  },
  {
    bankCode: '006',
    code: '5414',
    name: '合作金庫商業銀行北羅東分行',
  },
  {
    bankCode: '006',
    code: '5425',
    name: '合作金庫商業銀行礁溪分行',
  },
  {
    bankCode: '006',
    code: '5436',
    name: '合作金庫商業銀行東桃園分行',
  },
  {
    bankCode: '006',
    code: '5447',
    name: '合作金庫商業銀行壢新分行',
  },
  {
    bankCode: '006',
    code: '5458',
    name: '合作金庫商業銀行南崁分行',
  },
  {
    bankCode: '006',
    code: '5470',
    name: '合作金庫商業銀行新明分行',
  },
  {
    bankCode: '006',
    code: '5481',
    name: '合作金庫商業銀行楊梅分行',
  },
  {
    bankCode: '006',
    code: '5492',
    name: '合作金庫商業銀行東台東分行',
  },
  {
    bankCode: '006',
    code: '5517',
    name: '合作金庫商業銀行東竹北分行',
  },
  {
    bankCode: '006',
    code: '5528',
    name: '合作金庫商業銀行北苗栗分行',
  },
  {
    bankCode: '006',
    code: '5539',
    name: '合作金庫商業銀行竹南分行',
  },
  {
    bankCode: '006',
    code: '5540',
    name: '合作金庫商業銀行豐中分行',
  },
  {
    bankCode: '006',
    code: '5551',
    name: '合作金庫商業銀行北大里分行',
  },
  {
    bankCode: '006',
    code: '5562',
    name: '合作金庫商業銀行東沙鹿分行',
  },
  {
    bankCode: '006',
    code: '5573',
    name: '合作金庫商業銀行草屯分行',
  },
  {
    bankCode: '006',
    code: '5584',
    name: '合作金庫商業銀行集集分行',
  },
  {
    bankCode: '006',
    code: '5595',
    name: '合作金庫商業銀行東埔里分行',
  },
  {
    bankCode: '006',
    code: '5609',
    name: '合作金庫商業銀行員新分行',
  },
  {
    bankCode: '006',
    code: '5610',
    name: '合作金庫商業銀行南彰化分行',
  },
  {
    bankCode: '006',
    code: '5621',
    name: '合作金庫商業銀行北斗分行',
  },
  {
    bankCode: '006',
    code: '5632',
    name: '合作金庫商業銀行竹塹分行',
  },
  {
    bankCode: '006',
    code: '5643',
    name: '合作金庫商業銀行新竹科學園區分行',
  },
  {
    bankCode: '006',
    code: '5665',
    name: '合作金庫商業銀行雲林分行',
  },
  {
    bankCode: '006',
    code: '5687',
    name: '合作金庫商業銀行北朴子分行',
  },
  {
    bankCode: '006',
    code: '5698',
    name: '合作金庫商業銀行北新營分行',
  },
  {
    bankCode: '006',
    code: '5702',
    name: '合作金庫商業銀行仁德分行',
  },
  {
    bankCode: '006',
    code: '5713',
    name: '合作金庫商業銀行南永康分行',
  },
  {
    bankCode: '006',
    code: '5735',
    name: '合作金庫商業銀行鳳松分行',
  },
  {
    bankCode: '006',
    code: '5746',
    name: '合作金庫商業銀行北岡山分行',
  },
  {
    bankCode: '006',
    code: '5757',
    name: '合作金庫商業銀行美濃分行',
  },
  {
    bankCode: '006',
    code: '5768',
    name: '合作金庫商業銀行大樹分行',
  },
  {
    bankCode: '006',
    code: '5816',
    name: '合作金庫商業銀行東港分行',
  },
  {
    bankCode: '006',
    code: '5827',
    name: '合作金庫商業銀行萬丹分行',
  },
  {
    bankCode: '006',
    code: '5838',
    name: '合作金庫商業銀行枋寮分行',
  },
  {
    bankCode: '006',
    code: '5849',
    name: '合作金庫商業銀行東嘉義分行',
  },
  {
    bankCode: '006',
    code: '5850',
    name: '合作金庫商業銀行北花蓮分行',
  },
  {
    bankCode: '006',
    code: '5919',
    name: '合作金庫商業銀行大直分行',
  },
  {
    bankCode: '006',
    code: '5942',
    name: '合作金庫商業銀行水湳分行',
  },
  {
    bankCode: '006',
    code: '6064',
    name: '合作金庫商業銀行仁美分行',
  },
  {
    bankCode: '006',
    code: '6097',
    name: '合作金庫商業銀行社皮分行',
  },
  {
    bankCode: '006',
    code: '6123',
    name: '合作金庫商業銀行港湖分行',
  },
  {
    bankCode: '006',
    code: '6868',
    name: '合作金庫商業銀行保險代理部',
  },
  {
    bankCode: '006',
    code: '9009',
    name: '合作金庫商業銀行馬尼拉分行',
  },
  {
    bankCode: '006',
    code: '9021',
    name: '合作金庫商業銀行五甲分行',
  },
  {
    bankCode: '006',
    code: '9043',
    name: '合作金庫商業銀行淡水分行',
  },
  {
    bankCode: '006',
    code: '9054',
    name: '合作金庫商業銀行(子行)-臺灣聯合銀行',
  },
  {
    bankCode: '006',
    code: '9065',
    name: '合作金庫商業銀行香港分行',
  },
  {
    bankCode: '006',
    code: '9076',
    name: '合作金庫商業銀行北京代表人辦事處',
  },
  {
    bankCode: '006',
    code: '9087',
    name: '合作金庫商業銀行雪梨分行',
  },
  {
    bankCode: '006',
    code: '9098',
    name: '合作金庫商業銀行蘇州分行',
  },
  {
    bankCode: '006',
    code: '9102',
    name: '合作金庫商業銀行蘇州高新支行',
  },
  {
    bankCode: '006',
    code: '9113',
    name: '合作金庫商業銀行天津分行',
  },
  {
    bankCode: '006',
    code: '9124',
    name: '合作金庫商業銀行福州分行',
  },
  {
    bankCode: '006',
    code: '9135',
    name: '合作金庫商業銀行金邊分行德他拉支行',
  },
  {
    bankCode: '006',
    code: '9146',
    name: '合作金庫商業銀行金邊分行菩森芷支行',
  },
  {
    bankCode: '006',
    code: '9157',
    name: '合作金庫商業銀行紐約分行',
  },
  {
    bankCode: '006',
    code: '9168',
    name: '合作金庫商業銀行金邊分行暹粒支行',
  },
  {
    bankCode: '006',
    code: '9179',
    name: '合作金庫商業銀行仰光代表人辦事處',
  },
  {
    bankCode: '006',
    code: '9180',
    name: '合作金庫商業銀行長沙分行',
  },
  {
    bankCode: '006',
    code: '9191',
    name: '合作金庫商業銀行金邊分行永盛支行',
  },
  {
    bankCode: '006',
    code: '9205',
    name: '合作金庫商業銀行金邊分行西哈努克支行',
  },
  {
    bankCode: '006',
    code: '9951',
    name: '合作金庫商業銀行金邊分行市中心支行',
  },
  {
    bankCode: '006',
    code: '9962',
    name: '合作金庫商業銀行墨爾本分行',
  },
  {
    bankCode: '006',
    code: '9973',
    name: '合作金庫商業銀行金邊分行',
  },
  {
    bankCode: '006',
    code: '9984',
    name: '合作金庫商業銀行洛杉磯分行',
  },
  {
    bankCode: '006',
    code: '9995',
    name: '合作金庫商業銀行西雅圖分行',
  },
  {
    bankCode: '007',
    code: '0731',
    name: '第一商業銀行信託處',
  },
  {
    bankCode: '007',
    code: '0937',
    name: '第一商業銀行營業部',
  },
  {
    bankCode: '007',
    code: '0948',
    name: '第一商業銀行安和分行',
  },
  {
    bankCode: '007',
    code: '0959',
    name: '第一商業銀行國際金融業務分行',
  },
  {
    bankCode: '007',
    code: '1015',
    name: '第一商業銀行南港分行',
  },
  {
    bankCode: '007',
    code: '1026',
    name: '第一商業銀行西門分行',
  },
  {
    bankCode: '007',
    code: '1037',
    name: '第一商業銀行忠孝路分行',
  },
  {
    bankCode: '007',
    code: '1059',
    name: '第一商業銀行東湖分行',
  },
  {
    bankCode: '007',
    code: '1060',
    name: '第一商業銀行景美分行',
  },
  {
    bankCode: '007',
    code: '1071',
    name: '第一商業銀行大直分行',
  },
  {
    bankCode: '007',
    code: '1118',
    name: '第一商業銀行大稻埕分行',
  },
  {
    bankCode: '007',
    code: '1130',
    name: '第一商業銀行信維分行',
  },
  {
    bankCode: '007',
    code: '1211',
    name: '第一商業銀行建成分行',
  },
  {
    bankCode: '007',
    code: '1299',
    name: '第一商業銀行華山分行',
  },
  {
    bankCode: '007',
    code: '1314',
    name: '第一商業銀行大同分行',
  },
  {
    bankCode: '007',
    code: '1336',
    name: '第一商業銀行新生分行',
  },
  {
    bankCode: '007',
    code: '1358',
    name: '第一商業銀行劍潭分行',
  },
  {
    bankCode: '007',
    code: '1406',
    name: '第一商業銀行圓山分行',
  },
  {
    bankCode: '007',
    code: '1417',
    name: '第一商業銀行中山分行',
  },
  {
    bankCode: '007',
    code: '1428',
    name: '第一商業銀行中崙分行',
  },
  {
    bankCode: '007',
    code: '1439',
    name: '第一商業銀行南京東路分行',
  },
  {
    bankCode: '007',
    code: '1440',
    name: '第一商業銀行城東分行',
  },
  {
    bankCode: '007',
    code: '1451',
    name: '第一商業銀行民生分行',
  },
  {
    bankCode: '007',
    code: '1462',
    name: '第一商業銀行松江分行',
  },
  {
    bankCode: '007',
    code: '1473',
    name: '第一商業銀行民權分行',
  },
  {
    bankCode: '007',
    code: '1484',
    name: '第一商業銀行八德分行',
  },
  {
    bankCode: '007',
    code: '1495',
    name: '第一商業銀行長春分行',
  },
  {
    bankCode: '007',
    code: '1509',
    name: '第一商業銀行內湖分行',
  },
  {
    bankCode: '007',
    code: '1510',
    name: '第一商業銀行松山分行',
  },
  {
    bankCode: '007',
    code: '1521',
    name: '第一商業銀行延吉分行',
  },
  {
    bankCode: '007',
    code: '1532',
    name: '第一商業銀行光復分行',
  },
  {
    bankCode: '007',
    code: '1554',
    name: '第一商業銀行興雅分行',
  },
  {
    bankCode: '007',
    code: '1576',
    name: '第一商業銀行永春分行',
  },
  {
    bankCode: '007',
    code: '1587',
    name: '第一商業銀行內科園區分行',
  },
  {
    bankCode: '007',
    code: '1598',
    name: '第一商業銀行吉林分行',
  },
  {
    bankCode: '007',
    code: '1602',
    name: '第一商業銀行仁愛分行',
  },
  {
    bankCode: '007',
    code: '1613',
    name: '第一商業銀行大安分行',
  },
  {
    bankCode: '007',
    code: '1624',
    name: '第一商業銀行信義分行',
  },
  {
    bankCode: '007',
    code: '1635',
    name: '第一商業銀行復興分行',
  },
  {
    bankCode: '007',
    code: '1646',
    name: '第一商業銀行敦化分行',
  },
  {
    bankCode: '007',
    code: '1657',
    name: '第一商業銀行仁和分行',
  },
  {
    bankCode: '007',
    code: '1668',
    name: '第一商業銀行世貿分行',
  },
  {
    bankCode: '007',
    code: '1679',
    name: '第一商業銀行木柵分行',
  },
  {
    bankCode: '007',
    code: '1680',
    name: '第一商業銀行松貿分行',
  },
  {
    bankCode: '007',
    code: '1691',
    name: '第一商業銀行新湖分行',
  },
  {
    bankCode: '007',
    code: '1716',
    name: '第一商業銀行古亭分行',
  },
  {
    bankCode: '007',
    code: '1727',
    name: '第一商業銀行南門分行',
  },
  {
    bankCode: '007',
    code: '1738',
    name: '第一商業銀行公館分行',
  },
  {
    bankCode: '007',
    code: '1761',
    name: '第一商業銀行和平分行',
  },
  {
    bankCode: '007',
    code: '1819',
    name: '第一商業銀行萬華分行',
  },
  {
    bankCode: '007',
    code: '1831',
    name: '第一商業銀行雙園分行',
  },
  {
    bankCode: '007',
    code: '1901',
    name: '第一商業銀行天母分行',
  },
  {
    bankCode: '007',
    code: '1912',
    name: '第一商業銀行北投分行',
  },
  {
    bankCode: '007',
    code: '1923',
    name: '第一商業銀行士林分行',
  },
  {
    bankCode: '007',
    code: '1934',
    name: '第一商業銀行建國分行',
  },
  {
    bankCode: '007',
    code: '1945',
    name: '第一商業銀行萬隆分行',
  },
  {
    bankCode: '007',
    code: '1956',
    name: '第一商業銀行石牌分行',
  },
  {
    bankCode: '007',
    code: '2012',
    name: '第一商業銀行板橋分行',
  },
  {
    bankCode: '007',
    code: '2023',
    name: '第一商業銀行華江分行',
  },
  {
    bankCode: '007',
    code: '2034',
    name: '第一商業銀行樹林分行',
  },
  {
    bankCode: '007',
    code: '2056',
    name: '第一商業銀行土城分行',
  },
  {
    bankCode: '007',
    code: '2067',
    name: '第一商業銀行江子翠分行',
  },
  {
    bankCode: '007',
    code: '2078',
    name: '第一商業銀行北土城分行',
  },
  {
    bankCode: '007',
    code: '2089',
    name: '第一商業銀行林口工二分行',
  },
  {
    bankCode: '007',
    code: '2115',
    name: '第一商業銀行三重埔分行',
  },
  {
    bankCode: '007',
    code: '2126',
    name: '第一商業銀行長泰分行',
  },
  {
    bankCode: '007',
    code: '2137',
    name: '第一商業銀行蘆洲分行',
  },
  {
    bankCode: '007',
    code: '2148',
    name: '第一商業銀行頭前分行',
  },
  {
    bankCode: '007',
    code: '2159',
    name: '第一商業銀行五股分行',
  },
  {
    bankCode: '007',
    code: '2160',
    name: '第一商業銀行重陽分行',
  },
  {
    bankCode: '007',
    code: '2171',
    name: '第一商業銀行五股工業區分行',
  },
  {
    bankCode: '007',
    code: '2182',
    name: '第一商業銀行淡水分行',
  },
  {
    bankCode: '007',
    code: '2218',
    name: '第一商業銀行新店分行',
  },
  {
    bankCode: '007',
    code: '2229',
    name: '第一商業銀行大坪林分行',
  },
  {
    bankCode: '007',
    code: '2300',
    name: '第一商業銀行泰山分行',
  },
  {
    bankCode: '007',
    code: '2311',
    name: '第一商業銀行新莊分行',
  },
  {
    bankCode: '007',
    code: '2322',
    name: '第一商業銀行鶯歌分行',
  },
  {
    bankCode: '007',
    code: '2333',
    name: '第一商業銀行中和分行',
  },
  {
    bankCode: '007',
    code: '2344',
    name: '第一商業銀行永和分行',
  },
  {
    bankCode: '007',
    code: '2355',
    name: '第一商業銀行雙和分行',
  },
  {
    bankCode: '007',
    code: '2366',
    name: '第一商業銀行連城分行',
  },
  {
    bankCode: '007',
    code: '2377',
    name: '第一商業銀行瑞芳分行',
  },
  {
    bankCode: '007',
    code: '2388',
    name: '第一商業銀行埔墘分行',
  },
  {
    bankCode: '007',
    code: '2399',
    name: '第一商業銀行丹鳳分行',
  },
  {
    bankCode: '007',
    code: '2414',
    name: '第一商業銀行基隆分行',
  },
  {
    bankCode: '007',
    code: '2436',
    name: '第一商業銀行哨船頭分行',
  },
  {
    bankCode: '007',
    code: '2458',
    name: '第一商業銀行汐止分行',
  },
  {
    bankCode: '007',
    code: '2469',
    name: '第一商業銀行汐科分行',
  },
  {
    bankCode: '007',
    code: '2470',
    name: '第一商業銀行幸福分行',
  },
  {
    bankCode: '007',
    code: '2517',
    name: '第一商業銀行宜蘭分行',
  },
  {
    bankCode: '007',
    code: '2610',
    name: '第一商業銀行羅東分行',
  },
  {
    bankCode: '007',
    code: '2621',
    name: '第一商業銀行蘇澳分行',
  },
  {
    bankCode: '007',
    code: '2713',
    name: '第一商業銀行桃園分行',
  },
  {
    bankCode: '007',
    code: '2724',
    name: '第一商業銀行北桃分行',
  },
  {
    bankCode: '007',
    code: '2791',
    name: '第一商業銀行大湳分行',
  },
  {
    bankCode: '007',
    code: '2805',
    name: '第一商業銀行內壢分行',
  },
  {
    bankCode: '007',
    code: '2816',
    name: '第一商業銀行中壢分行',
  },
  {
    bankCode: '007',
    code: '2827',
    name: '第一商業銀行西壢分行',
  },
  {
    bankCode: '007',
    code: '2838',
    name: '第一商業銀行平鎮分行',
  },
  {
    bankCode: '007',
    code: '2849',
    name: '第一商業銀行大園分行',
  },
  {
    bankCode: '007',
    code: '2850',
    name: '第一商業銀行南崁分行',
  },
  {
    bankCode: '007',
    code: '2872',
    name: '第一商業銀行迴龍分行',
  },
  {
    bankCode: '007',
    code: '2908',
    name: '第一商業銀行林口分行',
  },
  {
    bankCode: '007',
    code: '2919',
    name: '第一商業銀行大溪分行',
  },
  {
    bankCode: '007',
    code: '2920',
    name: '第一商業銀行龍潭分行',
  },
  {
    bankCode: '007',
    code: '3019',
    name: '第一商業銀行新竹分行',
  },
  {
    bankCode: '007',
    code: '3020',
    name: '第一商業銀行東門分行',
  },
  {
    bankCode: '007',
    code: '3031',
    name: '第一商業銀行竹科分行',
  },
  {
    bankCode: '007',
    code: '3112',
    name: '第一商業銀行竹東分行',
  },
  {
    bankCode: '007',
    code: '3123',
    name: '第一商業銀行關西分行',
  },
  {
    bankCode: '007',
    code: '3134',
    name: '第一商業銀行竹北分行',
  },
  {
    bankCode: '007',
    code: '3215',
    name: '第一商業銀行苗栗分行',
  },
  {
    bankCode: '007',
    code: '3318',
    name: '第一商業銀行竹南分行',
  },
  {
    bankCode: '007',
    code: '3329',
    name: '第一商業銀行頭份分行',
  },
  {
    bankCode: '007',
    code: '4016',
    name: '第一商業銀行台中分行',
  },
  {
    bankCode: '007',
    code: '4027',
    name: '第一商業銀行南台中分行',
  },
  {
    bankCode: '007',
    code: '4038',
    name: '第一商業銀行北台中分行',
  },
  {
    bankCode: '007',
    code: '4049',
    name: '第一商業銀行中港分行',
  },
  {
    bankCode: '007',
    code: '4050',
    name: '第一商業銀行北屯分行',
  },
  {
    bankCode: '007',
    code: '4061',
    name: '第一商業銀行進化分行',
  },
  {
    bankCode: '007',
    code: '4072',
    name: '第一商業銀行南屯分行',
  },
  {
    bankCode: '007',
    code: '4119',
    name: '第一商業銀行豐原分行',
  },
  {
    bankCode: '007',
    code: '4120',
    name: '第一商業銀行大里分行',
  },
  {
    bankCode: '007',
    code: '4153',
    name: '第一商業銀行中科分行',
  },
  {
    bankCode: '007',
    code: '4212',
    name: '第一商業銀行東勢分行',
  },
  {
    bankCode: '007',
    code: '4223',
    name: '第一商業銀行沙鹿分行',
  },
  {
    bankCode: '007',
    code: '4234',
    name: '第一商業銀行大甲分行',
  },
  {
    bankCode: '007',
    code: '4245',
    name: '第一商業銀行太平分行',
  },
  {
    bankCode: '007',
    code: '4256',
    name: '第一商業銀行清水分行',
  },
  {
    bankCode: '007',
    code: '4267',
    name: '第一商業銀行大雅分行',
  },
  {
    bankCode: '007',
    code: '4315',
    name: '第一商業銀行南投分行',
  },
  {
    bankCode: '007',
    code: '4418',
    name: '第一商業銀行草屯分行',
  },
  {
    bankCode: '007',
    code: '4429',
    name: '第一商業銀行埔里分行',
  },
  {
    bankCode: '007',
    code: '4511',
    name: '第一商業銀行彰化分行',
  },
  {
    bankCode: '007',
    code: '4614',
    name: '第一商業銀行員林分行',
  },
  {
    bankCode: '007',
    code: '4625',
    name: '第一商業銀行鹿港分行',
  },
  {
    bankCode: '007',
    code: '4636',
    name: '第一商業銀行溪湖分行',
  },
  {
    bankCode: '007',
    code: '4647',
    name: '第一商業銀行北斗分行',
  },
  {
    bankCode: '007',
    code: '4717',
    name: '第一商業銀行和美分行',
  },
  {
    bankCode: '007',
    code: '5013',
    name: '第一商業銀行嘉義分行',
  },
  {
    bankCode: '007',
    code: '5035',
    name: '第一商業銀行興嘉分行',
  },
  {
    bankCode: '007',
    code: '5116',
    name: '第一商業銀行朴子分行',
  },
  {
    bankCode: '007',
    code: '5219',
    name: '第一商業銀行斗六分行',
  },
  {
    bankCode: '007',
    code: '5312',
    name: '第一商業銀行北港分行',
  },
  {
    bankCode: '007',
    code: '5323',
    name: '第一商業銀行西螺分行',
  },
  {
    bankCode: '007',
    code: '5334',
    name: '第一商業銀行虎尾分行',
  },
  {
    bankCode: '007',
    code: '6010',
    name: '第一商業銀行台南分行',
  },
  {
    bankCode: '007',
    code: '6043',
    name: '第一商業銀行富強分行',
  },
  {
    bankCode: '007',
    code: '6054',
    name: '第一商業銀行赤崁分行',
  },
  {
    bankCode: '007',
    code: '6065',
    name: '第一商業銀行竹溪分行',
  },
  {
    bankCode: '007',
    code: '6076',
    name: '第一商業銀行金城分行',
  },
  {
    bankCode: '007',
    code: '6087',
    name: '第一商業銀行安南分行',
  },
  {
    bankCode: '007',
    code: '6113',
    name: '第一商業銀行新營分行',
  },
  {
    bankCode: '007',
    code: '6216',
    name: '第一商業銀行鹽水分行',
  },
  {
    bankCode: '007',
    code: '6227',
    name: '第一商業銀行麻豆分行',
  },
  {
    bankCode: '007',
    code: '6238',
    name: '第一商業銀行善化分行',
  },
  {
    bankCode: '007',
    code: '6249',
    name: '第一商業銀行佳里分行',
  },
  {
    bankCode: '007',
    code: '6250',
    name: '第一商業銀行新化分行',
  },
  {
    bankCode: '007',
    code: '6261',
    name: '第一商業銀行大灣分行',
  },
  {
    bankCode: '007',
    code: '6283',
    name: '第一商業銀行南科園區分行',
  },
  {
    bankCode: '007',
    code: '6294',
    name: '第一商業銀行歸仁分行',
  },
  {
    bankCode: '007',
    code: '6308',
    name: '第一商業銀行永康分行',
  },
  {
    bankCode: '007',
    code: '7017',
    name: '第一商業銀行高雄分行',
  },
  {
    bankCode: '007',
    code: '7028',
    name: '第一商業銀行鹽埕分行',
  },
  {
    bankCode: '007',
    code: '7039',
    name: '第一商業銀行新興分行',
  },
  {
    bankCode: '007',
    code: '7040',
    name: '第一商業銀行三民分行',
  },
  {
    bankCode: '007',
    code: '7051',
    name: '第一商業銀行苓雅分行',
  },
  {
    bankCode: '007',
    code: '7062',
    name: '第一商業銀行左營分行',
  },
  {
    bankCode: '007',
    code: '7073',
    name: '第一商業銀行楠梓分行',
  },
  {
    bankCode: '007',
    code: '7084',
    name: '第一商業銀行五福分行',
  },
  {
    bankCode: '007',
    code: '7095',
    name: '第一商業銀行十全分行',
  },
  {
    bankCode: '007',
    code: '7109',
    name: '第一商業銀行前鎮分行',
  },
  {
    bankCode: '007',
    code: '7110',
    name: '第一商業銀行灣內分行',
  },
  {
    bankCode: '007',
    code: '7121',
    name: '第一商業銀行博愛分行',
  },
  {
    bankCode: '007',
    code: '7143',
    name: '第一商業銀行小港分行',
  },
  {
    bankCode: '007',
    code: '7202',
    name: '第一商業銀行五甲分行',
  },
  {
    bankCode: '007',
    code: '7213',
    name: '第一商業銀行鳳山分行',
  },
  {
    bankCode: '007',
    code: '7305',
    name: '第一商業銀行路竹分行',
  },
  {
    bankCode: '007',
    code: '7316',
    name: '第一商業銀行岡山分行',
  },
  {
    bankCode: '007',
    code: '7327',
    name: '第一商業銀行旗山分行',
  },
  {
    bankCode: '007',
    code: '7338',
    name: '第一商業銀行林園分行',
  },
  {
    bankCode: '007',
    code: '7419',
    name: '第一商業銀行屏東分行',
  },
  {
    bankCode: '007',
    code: '7523',
    name: '第一商業銀行東港分行',
  },
  {
    bankCode: '007',
    code: '7534',
    name: '第一商業銀行恆春分行',
  },
  {
    bankCode: '007',
    code: '7785',
    name: '第一商業銀行梓本分行',
  },
  {
    bankCode: '007',
    code: '7855',
    name: '第一商業銀行萬巒分行',
  },
  {
    bankCode: '007',
    code: '8014',
    name: '第一商業銀行花蓮分行',
  },
  {
    bankCode: '007',
    code: '8117',
    name: '第一商業銀行台東分行',
  },
  {
    bankCode: '007',
    code: '8210',
    name: '第一商業銀行澎湖分行',
  },
  {
    bankCode: '007',
    code: '8438',
    name: '第一商業銀行上海分行自貿區支行',
  },
  {
    bankCode: '007',
    code: '8829',
    name: '第一商業銀行金邊分行中洲支行',
  },
  {
    bankCode: '007',
    code: '8830',
    name: '第一商業銀行金邊分行奧林匹克支行',
  },
  {
    bankCode: '007',
    code: '8841',
    name: '第一商業銀行金邊分行桑園支行',
  },
  {
    bankCode: '007',
    code: '8852',
    name: '第一商業銀行金邊分行堆谷支行',
  },
  {
    bankCode: '007',
    code: '8863',
    name: '第一商業銀行金邊分行水淨華支行',
  },
  {
    bankCode: '007',
    code: '8874',
    name: '第一商業銀行金邊分行永盛支行',
  },
  {
    bankCode: '007',
    code: '8885',
    name: '第一商業銀行金邊分行暹粒支行',
  },
  {
    bankCode: '007',
    code: '9011',
    name: '第一商業銀行關島分行',
  },
  {
    bankCode: '007',
    code: '9022',
    name: '第一商業銀行紐約分行',
  },
  {
    bankCode: '007',
    code: '9033',
    name: '第一商業銀行洛杉磯分行',
  },
  {
    bankCode: '007',
    code: '9044',
    name: '第一商業銀行美國第一銀行',
  },
  {
    bankCode: '007',
    code: '9055',
    name: '第一商銀美國第一銀行工業市分行',
  },
  {
    bankCode: '007',
    code: '9066',
    name: '第一商銀美國第一銀行矽谷分行',
  },
  {
    bankCode: '007',
    code: '9077',
    name: '第一商銀美國第一銀行爾灣分行',
  },
  {
    bankCode: '007',
    code: '9088',
    name: '第一商業銀行溫哥華分行',
  },
  {
    bankCode: '007',
    code: '9099',
    name: '第一商業銀行多倫多分行',
  },
  {
    bankCode: '007',
    code: '9114',
    name: '第一商業銀行新加坡分行',
  },
  {
    bankCode: '007',
    code: '9136',
    name: '第一商業銀行曼谷代表辦事處',
  },
  {
    bankCode: '007',
    code: '9147',
    name: '第一商業銀行河內市分行',
  },
  {
    bankCode: '007',
    code: '9158',
    name: '第一商業銀行仰光代表辦事處',
  },
  {
    bankCode: '007',
    code: '9181',
    name: '第一商業銀行金邊分行',
  },
  {
    bankCode: '007',
    code: '9206',
    name: '第一商業銀行胡志明市分行',
  },
  {
    bankCode: '007',
    code: '9217',
    name: '第一商業銀行倫敦分行',
  },
  {
    bankCode: '007',
    code: '9239',
    name: '第一商業銀行馬尼拉分行',
  },
  {
    bankCode: '007',
    code: '9284',
    name: '第一商業銀行永珍分行',
  },
  {
    bankCode: '007',
    code: '9309',
    name: '第一商銀美國第一銀行佛利蒙分行',
  },
  {
    bankCode: '007',
    code: '9413',
    name: '第一商業銀行香港分行',
  },
  {
    bankCode: '007',
    code: '9424',
    name: '第一商業銀行上海分行',
  },
  {
    bankCode: '007',
    code: '9457',
    name: '第一商業銀行澳門分行',
  },
  {
    bankCode: '007',
    code: '9468',
    name: '第一商業銀行成都分行',
  },
  {
    bankCode: '007',
    code: '9480',
    name: '第一商業銀行廈門分行',
  },
  {
    bankCode: '007',
    code: '9516',
    name: '第一商業銀行東京分行',
  },
  {
    bankCode: '007',
    code: '9527',
    name: '第一商業銀行美國第一銀行奇諾崗分行',
  },
  {
    bankCode: '007',
    code: '9620',
    name: '第一商業銀行布里斯本分行',
  },
  {
    bankCode: '007',
    code: '9996',
    name: '第一商業銀行美國第一銀行亞凱迪亞分行',
  },
  {
    bankCode: '008',
    code: '0069',
    name: '華南商業銀行信託部',
  },
  {
    bankCode: '008',
    code: '0709',
    name: '華南商業銀行國際金融業務分行',
  },
  {
    bankCode: '008',
    code: '0765',
    name: '華南商業銀行個金行銷部',
  },
  {
    bankCode: '008',
    code: '1005',
    name: '華南商業銀行營業部',
  },
  {
    bankCode: '008',
    code: '1016',
    name: '華南商業銀行儲蓄分行',
  },
  {
    bankCode: '008',
    code: '1027',
    name: '華南商業銀行國際金融部',
  },
  {
    bankCode: '008',
    code: '1038',
    name: '華南商業銀行城內分行',
  },
  {
    bankCode: '008',
    code: '1049',
    name: '華南商業銀行大稻埕分行',
  },
  {
    bankCode: '008',
    code: '1050',
    name: '華南商業銀行建成分行',
  },
  {
    bankCode: '008',
    code: '1061',
    name: '華南商業銀行中山分行',
  },
  {
    bankCode: '008',
    code: '1072',
    name: '華南商業銀行圓山分行',
  },
  {
    bankCode: '008',
    code: '1083',
    name: '華南商業銀行城東分行',
  },
  {
    bankCode: '008',
    code: '1094',
    name: '華南商業銀行西門分行',
  },
  {
    bankCode: '008',
    code: '1108',
    name: '華南商業銀行南松山分行',
  },
  {
    bankCode: '008',
    code: '1119',
    name: '華南商業銀行仁愛路分行',
  },
  {
    bankCode: '008',
    code: '1120',
    name: '華南商業銀行南京東路分行',
  },
  {
    bankCode: '008',
    code: '1131',
    name: '華南商業銀行新生分行',
  },
  {
    bankCode: '008',
    code: '1142',
    name: '華南商業銀行大同分行',
  },
  {
    bankCode: '008',
    code: '1153',
    name: '華南商業銀行松山分行',
  },
  {
    bankCode: '008',
    code: '1164',
    name: '華南商業銀行中崙分行',
  },
  {
    bankCode: '008',
    code: '1175',
    name: '華南商業銀行台北南門分行',
  },
  {
    bankCode: '008',
    code: '1186',
    name: '華南商業銀行公館分行',
  },
  {
    bankCode: '008',
    code: '1197',
    name: '華南商業銀行信義分行',
  },
  {
    bankCode: '008',
    code: '1201',
    name: '華南商業銀行忠孝東路分行',
  },
  {
    bankCode: '008',
    code: '1212',
    name: '華南商業銀行和平分行',
  },
  {
    bankCode: '008',
    code: '1223',
    name: '華南商業銀行雙園分行',
  },
  {
    bankCode: '008',
    code: '1234',
    name: '華南商業銀行士林分行',
  },
  {
    bankCode: '008',
    code: '1245',
    name: '華南商業銀行東台北分行',
  },
  {
    bankCode: '008',
    code: '1256',
    name: '華南商業銀行大安分行',
  },
  {
    bankCode: '008',
    code: '1267',
    name: '華南商業銀行民生分行',
  },
  {
    bankCode: '008',
    code: '1278',
    name: '華南商業銀行復興分行',
  },
  {
    bankCode: '008',
    code: '1289',
    name: '華南商業銀行龍江分行',
  },
  {
    bankCode: '008',
    code: '1290',
    name: '華南商業銀行永吉分行',
  },
  {
    bankCode: '008',
    code: '1304',
    name: '華南商業銀行敦化分行',
  },
  {
    bankCode: '008',
    code: '1326',
    name: '華南商業銀行大直分行',
  },
  {
    bankCode: '008',
    code: '1337',
    name: '華南商業銀行敦和分行',
  },
  {
    bankCode: '008',
    code: '1348',
    name: '華南商業銀行東湖分行',
  },
  {
    bankCode: '008',
    code: '1360',
    name: '華南商業銀行東興分行',
  },
  {
    bankCode: '008',
    code: '1371',
    name: '華南商業銀行北南港分行',
  },
  {
    bankCode: '008',
    code: '1382',
    name: '華南商業銀行木柵分行',
  },
  {
    bankCode: '008',
    code: '1393',
    name: '華南商業銀行板橋文化分行',
  },
  {
    bankCode: '008',
    code: '1430',
    name: '華南商業銀行南內湖分行',
  },
  {
    bankCode: '008',
    code: '1452',
    name: '華南商業銀行長安分行',
  },
  {
    bankCode: '008',
    code: '1474',
    name: '華南商業銀行懷生分行',
  },
  {
    bankCode: '008',
    code: '1485',
    name: '華南商業銀行中華路分行',
  },
  {
    bankCode: '008',
    code: '1496',
    name: '華南商業銀行信維分行',
  },
  {
    bankCode: '008',
    code: '1511',
    name: '華南商業銀行埔墘分行',
  },
  {
    bankCode: '008',
    code: '1522',
    name: '華南商業銀行石牌分行',
  },
  {
    bankCode: '008',
    code: '1533',
    name: '華南商業銀行瑞祥分行',
  },
  {
    bankCode: '008',
    code: '1544',
    name: '華南商業銀行台大分行',
  },
  {
    bankCode: '008',
    code: '1566',
    name: '華南商業銀行世貿分行',
  },
  {
    bankCode: '008',
    code: '1577',
    name: '華南商業銀行萬華分行',
  },
  {
    bankCode: '008',
    code: '1588',
    name: '華南商業銀行南港分行',
  },
  {
    bankCode: '008',
    code: '1599',
    name: '華南商業銀行華江分行',
  },
  {
    bankCode: '008',
    code: '1603',
    name: '華南商業銀行板橋分行',
  },
  {
    bankCode: '008',
    code: '1614',
    name: '華南商業銀行三重分行',
  },
  {
    bankCode: '008',
    code: '1625',
    name: '華南商業銀行北三重分行',
  },
  {
    bankCode: '008',
    code: '1636',
    name: '華南商業銀行新莊分行',
  },
  {
    bankCode: '008',
    code: '1647',
    name: '華南商業銀行永和分行',
  },
  {
    bankCode: '008',
    code: '1658',
    name: '華南商業銀行中和分行',
  },
  {
    bankCode: '008',
    code: '1669',
    name: '華南商業銀行新店分行',
  },
  {
    bankCode: '008',
    code: '1670',
    name: '華南商業銀行淡水分行',
  },
  {
    bankCode: '008',
    code: '1681',
    name: '華南商業銀行汐止分行',
  },
  {
    bankCode: '008',
    code: '1692',
    name: '華南商業銀行南永和分行',
  },
  {
    bankCode: '008',
    code: '1706',
    name: '華南商業銀行西三重分行',
  },
  {
    bankCode: '008',
    code: '1717',
    name: '華南商業銀行南三重分行',
  },
  {
    bankCode: '008',
    code: '1728',
    name: '華南商業銀行雙和分行',
  },
  {
    bankCode: '008',
    code: '1739',
    name: '華南商業銀行新泰分行',
  },
  {
    bankCode: '008',
    code: '1740',
    name: '華南商業銀行二重分行',
  },
  {
    bankCode: '008',
    code: '1751',
    name: '華南商業銀行板新分行',
  },
  {
    bankCode: '008',
    code: '1762',
    name: '華南商業銀行五股分行',
  },
  {
    bankCode: '008',
    code: '1784',
    name: '華南商業銀行北投分行',
  },
  {
    bankCode: '008',
    code: '1795',
    name: '華南商業銀行西湖分行',
  },
  {
    bankCode: '008',
    code: '1809',
    name: '華南商業銀行積穗分行',
  },
  {
    bankCode: '008',
    code: '1821',
    name: '華南商業銀行福和分行',
  },
  {
    bankCode: '008',
    code: '1832',
    name: '華南商業銀行南勢角分行',
  },
  {
    bankCode: '008',
    code: '1843',
    name: '華南商業銀行北蘆洲分行',
  },
  {
    bankCode: '008',
    code: '1854',
    name: '華南商業銀行蘆洲分行',
  },
  {
    bankCode: '008',
    code: '1865',
    name: '華南商業銀行土城分行',
  },
  {
    bankCode: '008',
    code: '1876',
    name: '華南商業銀行北新分行',
  },
  {
    bankCode: '008',
    code: '1898',
    name: '華南商業銀行天母分行',
  },
  {
    bankCode: '008',
    code: '1902',
    name: '華南商業銀行內湖分行',
  },
  {
    bankCode: '008',
    code: '1913',
    name: '華南商業銀行樹林分行',
  },
  {
    bankCode: '008',
    code: '1924',
    name: '華南商業銀行樟樹灣分行',
  },
  {
    bankCode: '008',
    code: '1935',
    name: '華南商業銀行泰山分行',
  },
  {
    bankCode: '008',
    code: '1946',
    name: '華南商業銀行三峽分行',
  },
  {
    bankCode: '008',
    code: '1957',
    name: '華南商業銀行文山分行',
  },
  {
    bankCode: '008',
    code: '1968',
    name: '華南商業銀行鶯歌分行',
  },
  {
    bankCode: '008',
    code: '1979',
    name: '華南商業銀行北新莊分行',
  },
  {
    bankCode: '008',
    code: '1980',
    name: '華南商業銀行北土城分行',
  },
  {
    bankCode: '008',
    code: '1991',
    name: '華南商業銀行林口站前分行',
  },
  {
    bankCode: '008',
    code: '2002',
    name: '華南商業銀行基隆分行',
  },
  {
    bankCode: '008',
    code: '2013',
    name: '華南商業銀行基隆港口分行',
  },
  {
    bankCode: '008',
    code: '2116',
    name: '華南商業銀行七堵分行',
  },
  {
    bankCode: '008',
    code: '2208',
    name: '華南商業銀行羅東分行',
  },
  {
    bankCode: '008',
    code: '2219',
    name: '華南商業銀行宜蘭分行',
  },
  {
    bankCode: '008',
    code: '2404',
    name: '華南商業銀行桃園分行',
  },
  {
    bankCode: '008',
    code: '2415',
    name: '華南商業銀行中壢分行',
  },
  {
    bankCode: '008',
    code: '2426',
    name: '華南商業銀行楊梅分行',
  },
  {
    bankCode: '008',
    code: '2437',
    name: '華南商業銀行壢昌分行',
  },
  {
    bankCode: '008',
    code: '2448',
    name: '華南商業銀行北桃園分行',
  },
  {
    bankCode: '008',
    code: '2459',
    name: '華南商業銀行南崁分行',
  },
  {
    bankCode: '008',
    code: '2460',
    name: '華南商業銀行平鎮分行',
  },
  {
    bankCode: '008',
    code: '2471',
    name: '華南商業銀行八德分行',
  },
  {
    bankCode: '008',
    code: '2482',
    name: '華南商業銀行龜山分行',
  },
  {
    bankCode: '008',
    code: '2493',
    name: '華南商業銀行龍潭分行',
  },
  {
    bankCode: '008',
    code: '2507',
    name: '華南商業銀行大溪分行',
  },
  {
    bankCode: '008',
    code: '2518',
    name: '華南商業銀行內壢分行',
  },
  {
    bankCode: '008',
    code: '2529',
    name: '華南商業銀行林口分行',
  },
  {
    bankCode: '008',
    code: '2600',
    name: '華南商業銀行觀音分行',
  },
  {
    bankCode: '008',
    code: '2622',
    name: '華南商業銀行大園分行',
  },
  {
    bankCode: '008',
    code: '3009',
    name: '華南商業銀行新竹分行',
  },
  {
    bankCode: '008',
    code: '3010',
    name: '華南商業銀行竹東分行',
  },
  {
    bankCode: '008',
    code: '3021',
    name: '華南商業銀行竹科分行',
  },
  {
    bankCode: '008',
    code: '3102',
    name: '華南商業銀行新豐分行',
  },
  {
    bankCode: '008',
    code: '3135',
    name: '華南商業銀行六家分行',
  },
  {
    bankCode: '008',
    code: '3205',
    name: '華南商業銀行竹南分行',
  },
  {
    bankCode: '008',
    code: '3216',
    name: '華南商業銀行頭份分行',
  },
  {
    bankCode: '008',
    code: '3227',
    name: '華南商業銀行苗栗分行',
  },
  {
    bankCode: '008',
    code: '3238',
    name: '華南商業銀行竹北分行',
  },
  {
    bankCode: '008',
    code: '3515',
    name: '華南商業銀行大眾分行',
  },
  {
    bankCode: '008',
    code: '4006',
    name: '華南商業銀行豐原分行',
  },
  {
    bankCode: '008',
    code: '4017',
    name: '華南商業銀行東勢分行',
  },
  {
    bankCode: '008',
    code: '4028',
    name: '華南商業銀行清水分行',
  },
  {
    bankCode: '008',
    code: '4039',
    name: '華南商業銀行西豐原分行',
  },
  {
    bankCode: '008',
    code: '4202',
    name: '華南商業銀行台中分行',
  },
  {
    bankCode: '008',
    code: '4224',
    name: '華南商業銀行南台中分行',
  },
  {
    bankCode: '008',
    code: '4235',
    name: '華南商業銀行北台中分行',
  },
  {
    bankCode: '008',
    code: '4246',
    name: '華南商業銀行台中港路分行',
  },
  {
    bankCode: '008',
    code: '4257',
    name: '華南商業銀行大里分行',
  },
  {
    bankCode: '008',
    code: '4268',
    name: '華南商業銀行水湳分行',
  },
  {
    bankCode: '008',
    code: '4279',
    name: '華南商業銀行五權分行',
  },
  {
    bankCode: '008',
    code: '4291',
    name: '華南商業銀行大甲分行',
  },
  {
    bankCode: '008',
    code: '4305',
    name: '華南商業銀行太平分行',
  },
  {
    bankCode: '008',
    code: '4316',
    name: '華南商業銀行中科分行',
  },
  {
    bankCode: '008',
    code: '4512',
    name: '華南商業銀行沙鹿分行',
  },
  {
    bankCode: '008',
    code: '5003',
    name: '華南商業銀行草屯分行',
  },
  {
    bankCode: '008',
    code: '5014',
    name: '華南商業銀行南投分行',
  },
  {
    bankCode: '008',
    code: '5209',
    name: '華南商業銀行彰化分行',
  },
  {
    bankCode: '008',
    code: '5210',
    name: '華南商業銀行和美分行',
  },
  {
    bankCode: '008',
    code: '5221',
    name: '華南商業銀行員林分行',
  },
  {
    bankCode: '008',
    code: '5232',
    name: '華南商業銀行鹿港分行',
  },
  {
    bankCode: '008',
    code: '5243',
    name: '華南商業銀行溪湖分行',
  },
  {
    bankCode: '008',
    code: '5405',
    name: '華南商業銀行斗六分行',
  },
  {
    bankCode: '008',
    code: '5416',
    name: '華南商業銀行虎尾分行',
  },
  {
    bankCode: '008',
    code: '5427',
    name: '華南商業銀行西螺分行',
  },
  {
    bankCode: '008',
    code: '6000',
    name: '華南商業銀行嘉義分行',
  },
  {
    bankCode: '008',
    code: '6011',
    name: '華南商業銀行嘉南分行',
  },
  {
    bankCode: '008',
    code: '6022',
    name: '華南商業銀行朴子分行',
  },
  {
    bankCode: '008',
    code: '6206',
    name: '華南商業銀行新營分行',
  },
  {
    bankCode: '008',
    code: '6217',
    name: '華南商業銀行麻豆分行',
  },
  {
    bankCode: '008',
    code: '6228',
    name: '華南商業銀行永康分行',
  },
  {
    bankCode: '008',
    code: '6402',
    name: '華南商業銀行台南分行',
  },
  {
    bankCode: '008',
    code: '6424',
    name: '華南商業銀行東台南分行',
  },
  {
    bankCode: '008',
    code: '6435',
    name: '華南商業銀行西台南分行',
  },
  {
    bankCode: '008',
    code: '6446',
    name: '華南商業銀行北台南分行',
  },
  {
    bankCode: '008',
    code: '6457',
    name: '華南商業銀行南都分行',
  },
  {
    bankCode: '008',
    code: '6468',
    name: '華南商業銀行安南分行',
  },
  {
    bankCode: '008',
    code: '6479',
    name: '華南商業銀行仁德分行',
  },
  {
    bankCode: '008',
    code: '6480',
    name: '華南商業銀行新市分行',
  },
  {
    bankCode: '008',
    code: '6815',
    name: '華南商業銀行金華分行',
  },
  {
    bankCode: '008',
    code: '7007',
    name: '華南商業銀行高雄分行',
  },
  {
    bankCode: '008',
    code: '7018',
    name: '華南商業銀行東苓分行',
  },
  {
    bankCode: '008',
    code: '7029',
    name: '華南商業銀行新興分行',
  },
  {
    bankCode: '008',
    code: '7030',
    name: '華南商業銀行高雄三民分行',
  },
  {
    bankCode: '008',
    code: '7041',
    name: '華南商業銀行苓雅分行',
  },
  {
    bankCode: '008',
    code: '7052',
    name: '華南商業銀行前鎮分行',
  },
  {
    bankCode: '008',
    code: '7063',
    name: '華南商業銀行高雄博愛分行',
  },
  {
    bankCode: '008',
    code: '7074',
    name: '華南商業銀行南高雄分行',
  },
  {
    bankCode: '008',
    code: '7085',
    name: '華南商業銀行東高雄分行',
  },
  {
    bankCode: '008',
    code: '7096',
    name: '華南商業銀行大昌分行',
  },
  {
    bankCode: '008',
    code: '7100',
    name: '華南商業銀行北高雄分行',
  },
  {
    bankCode: '008',
    code: '7111',
    name: '華南商業銀行楠梓分行',
  },
  {
    bankCode: '008',
    code: '7122',
    name: '華南商業銀行左營分行',
  },
  {
    bankCode: '008',
    code: '7199',
    name: '華南商業銀行岡山分行',
  },
  {
    bankCode: '008',
    code: '7203',
    name: '華南商業銀行鳳山分行',
  },
  {
    bankCode: '008',
    code: '7214',
    name: '華南商業銀行路竹分行',
  },
  {
    bankCode: '008',
    code: '7225',
    name: '華南商業銀行仁武分行',
  },
  {
    bankCode: '008',
    code: '7513',
    name: '華南商業銀行籬仔內分行',
  },
  {
    bankCode: '008',
    code: '7524',
    name: '華南商業銀行五甲分行',
  },
  {
    bankCode: '008',
    code: '7535',
    name: '華南商業銀行光華分行',
  },
  {
    bankCode: '008',
    code: '7605',
    name: '華南商業銀行小港分行',
  },
  {
    bankCode: '008',
    code: '7650',
    name: '華南商業銀行高雄桂林分行',
  },
  {
    bankCode: '008',
    code: '8004',
    name: '華南商業銀行屏東分行',
  },
  {
    bankCode: '008',
    code: '8015',
    name: '華南商業銀行內埔分行',
  },
  {
    bankCode: '008',
    code: '8026',
    name: '華南商業銀行潮州分行',
  },
  {
    bankCode: '008',
    code: '8130',
    name: '華南商業銀行佳冬分行',
  },
  {
    bankCode: '008',
    code: '8200',
    name: '華南商業銀行花蓮分行',
  },
  {
    bankCode: '008',
    code: '8303',
    name: '華南商業銀行台東分行',
  },
  {
    bankCode: '008',
    code: '8886',
    name: '華南商業銀行營運總部分行',
  },
  {
    bankCode: '008',
    code: '9012',
    name: '華南商業銀行洛杉磯分行',
  },
  {
    bankCode: '008',
    code: '9023',
    name: '華南商業銀行紐約分行',
  },
  {
    bankCode: '008',
    code: '9034',
    name: '華南商業銀行倫敦分行',
  },
  {
    bankCode: '008',
    code: '9056',
    name: '華南商業銀行香港分行',
  },
  {
    bankCode: '008',
    code: '9078',
    name: '華南商業銀行新加坡分行',
  },
  {
    bankCode: '008',
    code: '9090',
    name: '華南商業銀行深圳分行',
  },
  {
    bankCode: '008',
    code: '9104',
    name: '華南商業銀行胡志明市分行',
  },
  {
    bankCode: '008',
    code: '9126',
    name: '華南商業銀行河內代表辦事處',
  },
  {
    bankCode: '008',
    code: '9137',
    name: '華南商業銀行澳門分行',
  },
  {
    bankCode: '008',
    code: '9148',
    name: '華南商業銀行雪梨分行',
  },
  {
    bankCode: '008',
    code: '9159',
    name: '華南商業銀行深圳寶安支行',
  },
  {
    bankCode: '008',
    code: '9160',
    name: '華南商業銀行上海分行',
  },
  {
    bankCode: '008',
    code: '9171',
    name: '華南商業銀行福州分行',
  },
  {
    bankCode: '008',
    code: '9182',
    name: '華南商業銀行菲律賓馬尼拉分行',
  },
  {
    bankCode: '008',
    code: '9193',
    name: '華南商業銀行仰光代表人辦事處',
  },
  {
    bankCode: '009',
    code: '0888',
    name: '彰銀商業銀行有限公司',
  },
  {
    bankCode: '009',
    code: '1094',
    name: '彰化商業銀行信託處',
  },
  {
    bankCode: '009',
    code: '2026',
    name: '彰化商業銀行新加坡分行',
  },
  {
    bankCode: '009',
    code: '2033',
    name: '彰銀商業銀行有限公司昆山分行',
  },
  {
    bankCode: '009',
    code: '2040',
    name: '彰化商業銀行股份有限公司馬尼拉分行',
  },
  {
    bankCode: '009',
    code: '2057',
    name: '彰銀商業銀行有限公司昆山花橋支行',
  },
  {
    bankCode: '009',
    code: '2071',
    name: '彰銀商業銀行有限公司東莞分行',
  },
  {
    bankCode: '009',
    code: '2088',
    name: '彰銀商業銀行有限公司福州分行',
  },
  {
    bankCode: '009',
    code: '2095',
    name: '彰化商業銀行仰光代表人辦事處',
  },
  {
    bankCode: '009',
    code: '2113',
    name: '彰化商業銀行國際營運處',
  },
  {
    bankCode: '009',
    code: '2120',
    name: '彰化商業銀行國際金融業務分行',
  },
  {
    bankCode: '009',
    code: '2144',
    name: '彰化商業銀行紐約分行',
  },
  {
    bankCode: '009',
    code: '2151',
    name: '彰化商業銀行洛杉磯分行',
  },
  {
    bankCode: '009',
    code: '2168',
    name: '彰化商業銀行東京分行',
  },
  {
    bankCode: '009',
    code: '2175',
    name: '彰化商業銀行倫敦分行',
  },
  {
    bankCode: '009',
    code: '2199',
    name: '彰化商業銀行香港分行',
  },
  {
    bankCode: '009',
    code: '2200',
    name: '彰化商業銀行總行營業部',
  },
  {
    bankCode: '009',
    code: '2606',
    name: '彰銀商業銀行有限公司南京分行',
  },
  {
    bankCode: '009',
    code: '3003',
    name: '彰化商業銀行吉林分行',
  },
  {
    bankCode: '009',
    code: '3010',
    name: '彰化商業銀行城內分行',
  },
  {
    bankCode: '009',
    code: '4004',
    name: '彰化商業銀行北台中分行',
  },
  {
    bankCode: '009',
    code: '4011',
    name: '彰化商業銀行南台中分行',
  },
  {
    bankCode: '009',
    code: '4028',
    name: '彰化商業銀行北屯分行',
  },
  {
    bankCode: '009',
    code: '4035',
    name: '彰化商業銀行水湳分行',
  },
  {
    bankCode: '009',
    code: '4042',
    name: '彰化商業銀行南屯分行',
  },
  {
    bankCode: '009',
    code: '4059',
    name: '彰化商業銀行台中分行',
  },
  {
    bankCode: '009',
    code: '4108',
    name: '彰化商業銀行基隆分行',
  },
  {
    bankCode: '009',
    code: '4115',
    name: '彰化商業銀行仁愛分行',
  },
  {
    bankCode: '009',
    code: '4122',
    name: '彰化商業銀行東基隆分行',
  },
  {
    bankCode: '009',
    code: '4202',
    name: '彰化商業銀行宜蘭分行',
  },
  {
    bankCode: '009',
    code: '4219',
    name: '彰化商業銀行羅東分行',
  },
  {
    bankCode: '009',
    code: '5005',
    name: '彰化商業銀行北門分行',
  },
  {
    bankCode: '009',
    code: '5012',
    name: '彰化商業銀行台北分行',
  },
  {
    bankCode: '009',
    code: '5029',
    name: '彰化商業銀行萬華分行',
  },
  {
    bankCode: '009',
    code: '5036',
    name: '彰化商業銀行西門分行',
  },
  {
    bankCode: '009',
    code: '5043',
    name: '彰化商業銀行永樂分行',
  },
  {
    bankCode: '009',
    code: '5050',
    name: '彰化商業銀行建成分行',
  },
  {
    bankCode: '009',
    code: '5067',
    name: '彰化商業銀行大同分行',
  },
  {
    bankCode: '009',
    code: '5074',
    name: '彰化商業銀行承德分行',
  },
  {
    bankCode: '009',
    code: '5081',
    name: '彰化商業銀行中山北路分行',
  },
  {
    bankCode: '009',
    code: '5109',
    name: '彰化商業銀行東門分行',
  },
  {
    bankCode: '009',
    code: '5116',
    name: '彰化商業銀行古亭分行',
  },
  {
    bankCode: '009',
    code: '5123',
    name: '彰化商業銀行五分埔分行',
  },
  {
    bankCode: '009',
    code: '5130',
    name: '彰化商業銀行大安分行',
  },
  {
    bankCode: '009',
    code: '5147',
    name: '彰化商業銀行城東分行',
  },
  {
    bankCode: '009',
    code: '5154',
    name: '彰化商業銀行中崙分行',
  },
  {
    bankCode: '009',
    code: '5161',
    name: '彰化商業銀行雙園分行',
  },
  {
    bankCode: '009',
    code: '5178',
    name: '彰化商業銀行士林分行',
  },
  {
    bankCode: '009',
    code: '5185',
    name: '彰化商業銀行總部分行',
  },
  {
    bankCode: '009',
    code: '5192',
    name: '彰化商業銀行松山分行',
  },
  {
    bankCode: '009',
    code: '5203',
    name: '彰化商業銀行忠孝東路分行',
  },
  {
    bankCode: '009',
    code: '5210',
    name: '彰化商業銀行信義分行',
  },
  {
    bankCode: '009',
    code: '5227',
    name: '彰化商業銀行東台北分行',
  },
  {
    bankCode: '009',
    code: '5234',
    name: '彰化商業銀行民生分行',
  },
  {
    bankCode: '009',
    code: '5241',
    name: '彰化商業銀行西松分行',
  },
  {
    bankCode: '009',
    code: '5258',
    name: '彰化商業銀行復興分行',
  },
  {
    bankCode: '009',
    code: '5265',
    name: '彰化商業銀行台北世貿中心分行',
  },
  {
    bankCode: '009',
    code: '5272',
    name: '彰化商業銀行敦化分行',
  },
  {
    bankCode: '009',
    code: '5289',
    name: '彰化商業銀行建國分行',
  },
  {
    bankCode: '009',
    code: '5296',
    name: '彰化商業銀行內湖分行',
  },
  {
    bankCode: '009',
    code: '5307',
    name: '彰化商業銀行天母分行',
  },
  {
    bankCode: '009',
    code: '5314',
    name: '彰化商業銀行中正分行',
  },
  {
    bankCode: '009',
    code: '5321',
    name: '彰化商業銀行仁和分行',
  },
  {
    bankCode: '009',
    code: '5338',
    name: '彰化商業銀行永春分行',
  },
  {
    bankCode: '009',
    code: '5345',
    name: '彰化商業銀行光隆分行',
  },
  {
    bankCode: '009',
    code: '5352',
    name: '彰化商業銀行木柵分行',
  },
  {
    bankCode: '009',
    code: '5369',
    name: '彰化商業銀行新湖分行',
  },
  {
    bankCode: '009',
    code: '5376',
    name: '彰化商業銀行東湖分行',
  },
  {
    bankCode: '009',
    code: '5383',
    name: '彰化商業銀行南港科學園區分行',
  },
  {
    bankCode: '009',
    code: '5390',
    name: '彰化商業銀行北投分行',
  },
  {
    bankCode: '009',
    code: '5401',
    name: '彰化商業銀行和平分行',
  },
  {
    bankCode: '009',
    code: '5418',
    name: '彰化商業銀行東興分行',
  },
  {
    bankCode: '009',
    code: '5425',
    name: '彰化商業銀行龍潭分行',
  },
  {
    bankCode: '009',
    code: '5432',
    name: '彰化商業銀行汐科分行',
  },
  {
    bankCode: '009',
    code: '5456',
    name: '彰化商業銀行新樹分行',
  },
  {
    bankCode: '009',
    code: '5463',
    name: '彰化商業銀行立德分行',
  },
  {
    bankCode: '009',
    code: '5470',
    name: '彰化商業銀行泰山分行',
  },
  {
    bankCode: '009',
    code: '5487',
    name: '彰化商業銀行五股工業區分行',
  },
  {
    bankCode: '009',
    code: '5494',
    name: '彰化商業銀行南新莊分行',
  },
  {
    bankCode: '009',
    code: '5505',
    name: '彰化商業銀行三重埔分行',
  },
  {
    bankCode: '009',
    code: '5512',
    name: '彰化商業銀行北三重埔分行',
  },
  {
    bankCode: '009',
    code: '5529',
    name: '彰化商業銀行新店分行',
  },
  {
    bankCode: '009',
    code: '5536',
    name: '彰化商業銀行永和分行',
  },
  {
    bankCode: '009',
    code: '5543',
    name: '彰化商業銀行瑞芳分行',
  },
  {
    bankCode: '009',
    code: '5550',
    name: '彰化商業銀行新莊分行',
  },
  {
    bankCode: '009',
    code: '5567',
    name: '彰化商業銀行樹林分行',
  },
  {
    bankCode: '009',
    code: '5574',
    name: '彰化商業銀行板橋分行',
  },
  {
    bankCode: '009',
    code: '5581',
    name: '彰化商業銀行三峽分行',
  },
  {
    bankCode: '009',
    code: '5598',
    name: '彰化商業銀行福和分行',
  },
  {
    bankCode: '009',
    code: '5609',
    name: '彰化商業銀行光復分行',
  },
  {
    bankCode: '009',
    code: '5616',
    name: '彰化商業銀行東三重分行',
  },
  {
    bankCode: '009',
    code: '5623',
    name: '彰化商業銀行北新分行',
  },
  {
    bankCode: '009',
    code: '5630',
    name: '彰化商業銀行南三重分行',
  },
  {
    bankCode: '009',
    code: '5647',
    name: '彰化商業銀行中和分行',
  },
  {
    bankCode: '009',
    code: '5654',
    name: '彰化商業銀行西三重分行',
  },
  {
    bankCode: '009',
    code: '5661',
    name: '彰化商業銀行汐止分行',
  },
  {
    bankCode: '009',
    code: '5678',
    name: '彰化商業銀行雙和分行',
  },
  {
    bankCode: '009',
    code: '5685',
    name: '彰化商業銀行淡水分行',
  },
  {
    bankCode: '009',
    code: '5692',
    name: '彰化商業銀行楊梅分行',
  },
  {
    bankCode: '009',
    code: '5703',
    name: '彰化商業銀行桃園分行',
  },
  {
    bankCode: '009',
    code: '5710',
    name: '彰化商業銀行中壢分行',
  },
  {
    bankCode: '009',
    code: '5727',
    name: '彰化商業銀行新竹分行',
  },
  {
    bankCode: '009',
    code: '5734',
    name: '彰化商業銀行竹東分行',
  },
  {
    bankCode: '009',
    code: '5741',
    name: '彰化商業銀行苗栗分行',
  },
  {
    bankCode: '009',
    code: '5758',
    name: '彰化商業銀行新竹科學園區分行',
  },
  {
    bankCode: '009',
    code: '5765',
    name: '彰化商業銀行北中壢分行',
  },
  {
    bankCode: '009',
    code: '5772',
    name: '彰化商業銀行八德分行',
  },
  {
    bankCode: '009',
    code: '5789',
    name: '彰化商業銀行竹南分行',
  },
  {
    bankCode: '009',
    code: '5796',
    name: '彰化商業銀行南崁分行',
  },
  {
    bankCode: '009',
    code: '5807',
    name: '彰化商業銀行苑裡分行',
  },
  {
    bankCode: '009',
    code: '5814',
    name: '彰化商業銀行大甲分行',
  },
  {
    bankCode: '009',
    code: '5821',
    name: '彰化商業銀行清水分行',
  },
  {
    bankCode: '009',
    code: '5838',
    name: '彰化商業銀行豐原分行',
  },
  {
    bankCode: '009',
    code: '5845',
    name: '彰化商業銀行東勢分行',
  },
  {
    bankCode: '009',
    code: '5852',
    name: '彰化商業銀行霧峰分行',
  },
  {
    bankCode: '009',
    code: '5869',
    name: '彰化商業銀行大雅分行',
  },
  {
    bankCode: '009',
    code: '5876',
    name: '彰化商業銀行沙鹿分行',
  },
  {
    bankCode: '009',
    code: '5890',
    name: '彰化商業銀行太平分行',
  },
  {
    bankCode: '009',
    code: '5901',
    name: '彰化商業銀行草屯分行',
  },
  {
    bankCode: '009',
    code: '5918',
    name: '彰化商業銀行南投分行',
  },
  {
    bankCode: '009',
    code: '5925',
    name: '彰化商業銀行埔里分行',
  },
  {
    bankCode: '009',
    code: '5932',
    name: '彰化商業銀行水裡坑分行',
  },
  {
    bankCode: '009',
    code: '5963',
    name: '彰化商業銀行大肚分行',
  },
  {
    bankCode: '009',
    code: '5987',
    name: '彰化商業銀行竹北分行',
  },
  {
    bankCode: '009',
    code: '6006',
    name: '彰化商業銀行彰化分行',
  },
  {
    bankCode: '009',
    code: '6013',
    name: '彰化商業銀行鹿港分行',
  },
  {
    bankCode: '009',
    code: '6020',
    name: '彰化商業銀行員林分行',
  },
  {
    bankCode: '009',
    code: '6037',
    name: '彰化商業銀行溪湖分行',
  },
  {
    bankCode: '009',
    code: '6044',
    name: '彰化商業銀行北斗分行',
  },
  {
    bankCode: '009',
    code: '6051',
    name: '彰化商業銀行西螺分行',
  },
  {
    bankCode: '009',
    code: '6068',
    name: '彰化商業銀行和美分行',
  },
  {
    bankCode: '009',
    code: '6075',
    name: '彰化商業銀行大里分行',
  },
  {
    bankCode: '009',
    code: '6099',
    name: '彰化商業銀行二林分行',
  },
  {
    bankCode: '009',
    code: '6100',
    name: '彰化商業銀行斗六分行',
  },
  {
    bankCode: '009',
    code: '6117',
    name: '彰化商業銀行斗南分行',
  },
  {
    bankCode: '009',
    code: '6124',
    name: '彰化商業銀行虎尾分行',
  },
  {
    bankCode: '009',
    code: '6131',
    name: '彰化商業銀行北港分行',
  },
  {
    bankCode: '009',
    code: '6204',
    name: '彰化商業銀行大林分行',
  },
  {
    bankCode: '009',
    code: '6211',
    name: '彰化商業銀行嘉義分行',
  },
  {
    bankCode: '009',
    code: '6228',
    name: '彰化商業銀行東嘉義分行',
  },
  {
    bankCode: '009',
    code: '6235',
    name: '彰化商業銀行新營分行',
  },
  {
    bankCode: '009',
    code: '6242',
    name: '彰化商業銀行永康分行',
  },
  {
    bankCode: '009',
    code: '6266',
    name: '彰化商業銀行歸仁分行',
  },
  {
    bankCode: '009',
    code: '6402',
    name: '彰化商業銀行台南分行',
  },
  {
    bankCode: '009',
    code: '6419',
    name: '彰化商業銀行延平分行',
  },
  {
    bankCode: '009',
    code: '6426',
    name: '彰化商業銀行西台南分行',
  },
  {
    bankCode: '009',
    code: '6433',
    name: '彰化商業銀行東台南分行',
  },
  {
    bankCode: '009',
    code: '6440',
    name: '彰化商業銀行南台南分行',
  },
  {
    bankCode: '009',
    code: '6457',
    name: '彰化商業銀行安南分行',
  },
  {
    bankCode: '009',
    code: '6506',
    name: '彰化商業銀行旗山分行',
  },
  {
    bankCode: '009',
    code: '6513',
    name: '彰化商業銀行岡山分行',
  },
  {
    bankCode: '009',
    code: '6520',
    name: '彰化商業銀行鳳山分行',
  },
  {
    bankCode: '009',
    code: '8119',
    name: '彰化商業銀行高雄分行',
  },
  {
    bankCode: '009',
    code: '8126',
    name: '彰化商業銀行七賢分行',
  },
  {
    bankCode: '009',
    code: '8133',
    name: '彰化商業銀行鹽埕分行',
  },
  {
    bankCode: '009',
    code: '8140',
    name: '彰化商業銀行東高雄分行',
  },
  {
    bankCode: '009',
    code: '8157',
    name: '彰化商業銀行南高雄分行',
  },
  {
    bankCode: '009',
    code: '8164',
    name: '彰化商業銀行北高雄分行',
  },
  {
    bankCode: '009',
    code: '8171',
    name: '彰化商業銀行三民分行',
  },
  {
    bankCode: '009',
    code: '8195',
    name: '彰化商業銀行前鎮分行',
  },
  {
    bankCode: '009',
    code: '8206',
    name: '彰化商業銀行九如路分行',
  },
  {
    bankCode: '009',
    code: '8213',
    name: '彰化商業銀行新興分行',
  },
  {
    bankCode: '009',
    code: '8220',
    name: '彰化商業銀行苓雅分行',
  },
  {
    bankCode: '009',
    code: '8237',
    name: '彰化商業銀行大順分行',
  },
  {
    bankCode: '009',
    code: '8244',
    name: '彰化商業銀行博愛分行',
  },
  {
    bankCode: '009',
    code: '8251',
    name: '彰化商業銀行左營分行',
  },
  {
    bankCode: '009',
    code: '8300',
    name: '彰化商業銀行屏東分行',
  },
  {
    bankCode: '009',
    code: '8317',
    name: '彰化商業銀行東港分行',
  },
  {
    bankCode: '009',
    code: '8324',
    name: '彰化商業銀行潮州分行',
  },
  {
    bankCode: '009',
    code: '8348',
    name: '彰化商業銀行恆春分行',
  },
  {
    bankCode: '009',
    code: '8404',
    name: '彰化商業銀行花蓮分行',
  },
  {
    bankCode: '009',
    code: '8508',
    name: '彰化商業銀行台東分行',
  },
  {
    bankCode: '009',
    code: '9269',
    name: '彰化商業銀行思源分行',
  },
  {
    bankCode: '009',
    code: '9283',
    name: '彰化商業銀行土城分行',
  },
  {
    bankCode: '009',
    code: '9290',
    name: '彰化商業銀行北桃園分行',
  },
  {
    bankCode: '009',
    code: '9301',
    name: '彰化商業銀行新明分行',
  },
  {
    bankCode: '009',
    code: '9318',
    name: '彰化商業銀行埔心分行',
  },
  {
    bankCode: '009',
    code: '9332',
    name: '彰化商業銀行西屯分行',
  },
  {
    bankCode: '009',
    code: '9349',
    name: '彰化商業銀行大發分行',
  },
  {
    bankCode: '009',
    code: '9356',
    name: '彰化商業銀行東林口分行',
  },
  {
    bankCode: '009',
    code: '9363',
    name: '彰化商業銀行新林口分行',
  },
  {
    bankCode: '009',
    code: '9523',
    name: '彰化商業銀行土庫分行',
  },
  {
    bankCode: '009',
    code: '9547',
    name: '彰化商業銀行路竹分行',
  },
  {
    bankCode: '009',
    code: '9554',
    name: '彰化商業銀行蘇澳分行',
  },
  {
    bankCode: '009',
    code: '9561',
    name: '彰化商業銀行北台南分行',
  },
  {
    bankCode: '009',
    code: '9603',
    name: '彰化商業銀行潭子分行',
  },
  {
    bankCode: '009',
    code: '9610',
    name: '彰化商業銀行北嘉義分行',
  },
  {
    bankCode: '009',
    code: '9627',
    name: '彰化商業銀行北新竹分行',
  },
  {
    bankCode: '009',
    code: '9634',
    name: '彰化商業銀行建興分行',
  },
  {
    bankCode: '009',
    code: '9641',
    name: '彰化商業銀行三和路分行',
  },
  {
    bankCode: '009',
    code: '9658',
    name: '彰化商業銀行吉成分行',
  },
  {
    bankCode: '009',
    code: '9689',
    name: '彰化商業銀行林口分行',
  },
  {
    bankCode: '009',
    code: '9696',
    name: '彰化商業銀行江翠分行',
  },
  {
    bankCode: '009',
    code: '9714',
    name: '彰化商業銀行長安東路分行',
  },
  {
    bankCode: '009',
    code: '9721',
    name: '彰化商業銀行晴光分行',
  },
  {
    bankCode: '009',
    code: '9738',
    name: '彰化商業銀行大直分行',
  },
  {
    bankCode: '009',
    code: '9752',
    name: '彰化商業銀行松江分行',
  },
  {
    bankCode: '009',
    code: '9790',
    name: '彰化商業銀行西內湖分行',
  },
  {
    bankCode: '009',
    code: '9801',
    name: '彰化商業銀行南港分行',
  },
  {
    bankCode: '009',
    code: '9818',
    name: '彰化商業銀行中港分行',
  },
  {
    bankCode: '009',
    code: '9832',
    name: '彰化商業銀行蘆洲分行',
  },
  {
    bankCode: '009',
    code: '9849',
    name: '彰化商業銀行中華路分行',
  },
  {
    bankCode: '011',
    code: '0026',
    name: '上海商業儲蓄銀行營業部',
  },
  {
    bankCode: '011',
    code: '0037',
    name: '上海商業儲蓄銀行儲蓄部分行',
  },
  {
    bankCode: '011',
    code: '0048',
    name: '上海商業儲蓄銀行高雄分行',
  },
  {
    bankCode: '011',
    code: '0059',
    name: '上海商業儲蓄銀行國外部',
  },
  {
    bankCode: '011',
    code: '0060',
    name: '上海商業儲蓄銀行城中分行',
  },
  {
    bankCode: '011',
    code: '0082',
    name: '上海商業儲蓄銀行台中分行',
  },
  {
    bankCode: '011',
    code: '0093',
    name: '上海商業儲蓄銀行東台北分行',
  },
  {
    bankCode: '011',
    code: '0107',
    name: '上海商業儲蓄銀行台南分行',
  },
  {
    bankCode: '011',
    code: '0118',
    name: '上海商業儲蓄銀行桃園分行',
  },
  {
    bankCode: '011',
    code: '0129',
    name: '上海商業儲蓄銀行北高雄分行',
  },
  {
    bankCode: '011',
    code: '0130',
    name: '上海商業儲蓄銀行三重分行',
  },
  {
    bankCode: '011',
    code: '0141',
    name: '上海商業儲蓄銀行板橋分行',
  },
  {
    bankCode: '011',
    code: '0152',
    name: '上海商業儲蓄銀行永和分行',
  },
  {
    bankCode: '011',
    code: '0163',
    name: '上海商業儲蓄銀行員林分行',
  },
  {
    bankCode: '011',
    code: '0174',
    name: '上海商業儲蓄銀行信託部',
  },
  {
    bankCode: '011',
    code: '0185',
    name: '上海商業儲蓄銀行信義分行',
  },
  {
    bankCode: '011',
    code: '0196',
    name: '上海商業儲蓄銀行民生分行',
  },
  {
    bankCode: '011',
    code: '0200',
    name: '上海商業儲蓄銀行忠孝分行',
  },
  {
    bankCode: '011',
    code: '0211',
    name: '上海商業儲蓄銀行龍山分行',
  },
  {
    bankCode: '011',
    code: '0222',
    name: '上海商業儲蓄銀行內湖分行',
  },
  {
    bankCode: '011',
    code: '0233',
    name: '上海商業儲蓄銀行中山分行',
  },
  {
    bankCode: '011',
    code: '0244',
    name: '上海商業儲蓄銀行仁愛分行',
  },
  {
    bankCode: '011',
    code: '0255',
    name: '上海商業儲蓄銀行新莊分行',
  },
  {
    bankCode: '011',
    code: '0266',
    name: '上海商業儲蓄銀行中壢分行',
  },
  {
    bankCode: '011',
    code: '0277',
    name: '上海商業儲蓄銀行國際金融業務分行',
  },
  {
    bankCode: '011',
    code: '0288',
    name: '上海商業儲蓄銀行松山分行',
  },
  {
    bankCode: '011',
    code: '0299',
    name: '上海商業儲蓄銀行新店分行',
  },
  {
    bankCode: '011',
    code: '0303',
    name: '上海商業儲蓄銀行前金分行',
  },
  {
    bankCode: '011',
    code: '0314',
    name: '上海商業儲蓄銀行松南分行',
  },
  {
    bankCode: '011',
    code: '0325',
    name: '上海商業儲蓄銀行蘆洲分行',
  },
  {
    bankCode: '011',
    code: '0336',
    name: '上海商業儲蓄銀行中和分行',
  },
  {
    bankCode: '011',
    code: '0347',
    name: '上海商業儲蓄銀行新竹分行',
  },
  {
    bankCode: '011',
    code: '0358',
    name: '上海商業儲蓄銀行中港分行',
  },
  {
    bankCode: '011',
    code: '0369',
    name: '上海商業儲蓄銀行士林分行',
  },
  {
    bankCode: '011',
    code: '0370',
    name: '上海商業儲蓄銀行東台南分行',
  },
  {
    bankCode: '011',
    code: '0381',
    name: '上海商業儲蓄銀行永康分行',
  },
  {
    bankCode: '011',
    code: '0392',
    name: '上海商業儲蓄銀行北三重分行',
  },
  {
    bankCode: '011',
    code: '0406',
    name: '上海商業儲蓄銀行南京東路分行',
  },
  {
    bankCode: '011',
    code: '0417',
    name: '上海商業儲蓄銀行大里分行',
  },
  {
    bankCode: '011',
    code: '0428',
    name: '上海商業儲蓄銀行土城分行',
  },
  {
    bankCode: '011',
    code: '0439',
    name: '上海商業儲蓄銀行世貿分行',
  },
  {
    bankCode: '011',
    code: '0440',
    name: '上海商業儲蓄銀行承德分行',
  },
  {
    bankCode: '011',
    code: '0451',
    name: '上海商業儲蓄銀行汐止分行',
  },
  {
    bankCode: '011',
    code: '0462',
    name: '上海商業儲蓄銀行屏東分行',
  },
  {
    bankCode: '011',
    code: '0473',
    name: '上海商業儲蓄銀行三民分行',
  },
  {
    bankCode: '011',
    code: '0484',
    name: '上海商業儲蓄銀行華江分行',
  },
  {
    bankCode: '011',
    code: '0495',
    name: '上海商業儲蓄銀行豐原分行',
  },
  {
    bankCode: '011',
    code: '0509',
    name: '上海商業儲蓄銀行鳳山分行',
  },
  {
    bankCode: '011',
    code: '0510',
    name: '上海商業儲蓄銀行天母分行',
  },
  {
    bankCode: '011',
    code: '0521',
    name: '上海商業儲蓄銀行樹林分行',
  },
  {
    bankCode: '011',
    code: '0532',
    name: '上海商業儲蓄銀行基隆分行',
  },
  {
    bankCode: '011',
    code: '0543',
    name: '上海商業儲蓄銀行楊梅分行',
  },
  {
    bankCode: '011',
    code: '0554',
    name: '上海商業儲蓄銀行內湖科技園區分行',
  },
  {
    bankCode: '011',
    code: '0565',
    name: '上海商業儲蓄銀行北中和分行',
  },
  {
    bankCode: '011',
    code: '0576',
    name: '上海商業儲蓄銀行西湖分行',
  },
  {
    bankCode: '011',
    code: '0598',
    name: '上海商業儲蓄銀行二重分行',
  },
  {
    bankCode: '011',
    code: '0602',
    name: '上海商業儲蓄銀行延平分行',
  },
  {
    bankCode: '011',
    code: '0613',
    name: '上海商業儲蓄銀行南崁分行',
  },
  {
    bankCode: '011',
    code: '0624',
    name: '上海商業儲蓄銀行南港分行',
  },
  {
    bankCode: '011',
    code: '0635',
    name: '上海商業儲蓄銀行北新竹分行',
  },
  {
    bankCode: '011',
    code: '0646',
    name: '上海商業儲蓄銀行香港分行',
  },
  {
    bankCode: '011',
    code: '0657',
    name: '上海商業儲蓄銀行宜蘭分行',
  },
  {
    bankCode: '011',
    code: '0668',
    name: '上海商業儲蓄銀行文山分行',
  },
  {
    bankCode: '011',
    code: '0679',
    name: '上海商業儲蓄銀行越南同奈分行',
  },
  {
    bankCode: '011',
    code: '0680',
    name: '上海商業儲蓄銀行敦北分行',
  },
  {
    bankCode: '011',
    code: '0691',
    name: '上海商業儲蓄銀行東高雄分行',
  },
  {
    bankCode: '011',
    code: '0705',
    name: '上海商業儲蓄銀行竹北分行',
  },
  {
    bankCode: '011',
    code: '0716',
    name: '上海商業儲蓄銀行松江分行',
  },
  {
    bankCode: '011',
    code: '0727',
    name: '上海商業儲蓄銀行市政分行',
  },
  {
    bankCode: '011',
    code: '0738',
    name: '上海商業儲蓄銀行觀音分行',
  },
  {
    bankCode: '011',
    code: '0749',
    name: '上海商業儲蓄銀行北桃園分行',
  },
  {
    bankCode: '011',
    code: '0750',
    name: '上海商業儲蓄銀行丹鳳分行',
  },
  {
    bankCode: '011',
    code: '0761',
    name: '上海商業儲蓄銀行北新莊分行',
  },
  {
    bankCode: '011',
    code: '0772',
    name: '上海商業儲蓄銀行南屯分行',
  },
  {
    bankCode: '011',
    code: '0783',
    name: '上海商業儲蓄銀行新加坡分行',
  },
  {
    bankCode: '011',
    code: '0794',
    name: '上海商業儲蓄銀行林口分行',
  },
  {
    bankCode: '011',
    code: '0808',
    name: '上海商業儲蓄銀行竹科分行',
  },
  {
    bankCode: '011',
    code: '0819',
    name: '上海商業儲蓄銀行永吉分行',
  },
  {
    bankCode: '011',
    code: '8712',
    name: '上海商業儲蓄銀行泰國曼谷代表人辦事處',
  },
  {
    bankCode: '011',
    code: '8723',
    name: '上海商業儲蓄銀行柬埔寨代表人辦事處',
  },
  {
    bankCode: '011',
    code: '8734',
    name: '上海商業儲蓄銀行印尼雅加達代表人辦事處',
  },
  {
    bankCode: '011',
    code: '9007',
    name: '香港上海商業銀行有限公司',
  },
  {
    bankCode: '011',
    code: '9281',
    name: '香港上海商業銀行中環總行',
  },
  {
    bankCode: '011',
    code: '9292',
    name: '香港上海商業銀行旺角分行',
  },
  {
    bankCode: '011',
    code: '9306',
    name: '香港上海商業銀行銅鑼灣分行',
  },
  {
    bankCode: '011',
    code: '9317',
    name: '香港上海商業銀行西環分行',
  },
  {
    bankCode: '011',
    code: '9328',
    name: '香港上海商業銀行總統分行',
  },
  {
    bankCode: '011',
    code: '9339',
    name: '香港上海商業銀行荃灣分行',
  },
  {
    bankCode: '011',
    code: '9340',
    name: '香港上海商業銀行深水埗分行',
  },
  {
    bankCode: '011',
    code: '9351',
    name: '香港上海商業銀行尖沙咀分行',
  },
  {
    bankCode: '011',
    code: '9362',
    name: '香港上海商業銀行美孚新邨(第一期)分行',
  },
  {
    bankCode: '011',
    code: '9373',
    name: '香港上海商業銀行窩打老道分行',
  },
  {
    bankCode: '011',
    code: '9384',
    name: '香港上海商業銀行北角分行',
  },
  {
    bankCode: '011',
    code: '9395',
    name: '香港上海商業銀行坪石邨分行',
  },
  {
    bankCode: '011',
    code: '9409',
    name: '香港上海商業銀行新蒲崗分行',
  },
  {
    bankCode: '011',
    code: '9410',
    name: '香港上海商業銀行美孚新邨(第四期)分行',
  },
  {
    bankCode: '011',
    code: '9421',
    name: '香港上海商業銀行佐敦道分行',
  },
  {
    bankCode: '011',
    code: '9432',
    name: '香港上海商業銀行觀塘分行',
  },
  {
    bankCode: '011',
    code: '9443',
    name: '香港上海商業銀行葵涌分行',
  },
  {
    bankCode: '011',
    code: '9454',
    name: '香港上海商業銀行德士古道分行',
  },
  {
    bankCode: '011',
    code: '9465',
    name: '香港上海商業銀行上環分行',
  },
  {
    bankCode: '011',
    code: '9476',
    name: '香港上海商業銀行土瓜灣分行',
  },
  {
    bankCode: '011',
    code: '9487',
    name: '香港上海商業銀行筲箕灣分行',
  },
  {
    bankCode: '011',
    code: '9498',
    name: '香港上海商業銀行香港仔分行',
  },
  {
    bankCode: '011',
    code: '9502',
    name: '香港上海商業銀行灣仔分行',
  },
  {
    bankCode: '011',
    code: '9513',
    name: '香港上海商業銀行元朗分行',
  },
  {
    bankCode: '011',
    code: '9524',
    name: '香港上海商業銀行太古城分行',
  },
  {
    bankCode: '011',
    code: '9535',
    name: '香港上海商業銀行東尖沙咀分行',
  },
  {
    bankCode: '011',
    code: '9546',
    name: '香港上海商業銀行九龍塘分行',
  },
  {
    bankCode: '011',
    code: '9557',
    name: '香港上海商業銀行維多利中心分行',
  },
  {
    bankCode: '011',
    code: '9579',
    name: '香港上海商業銀行軒尼詩道分行',
  },
  {
    bankCode: '011',
    code: '9580',
    name: '香港上海商業銀行九龍灣分行',
  },
  {
    bankCode: '011',
    code: '9591',
    name: '香港上海商業銀行黃埔花園分行',
  },
  {
    bankCode: '011',
    code: '9605',
    name: '香港上海商業銀行荔枝角分行',
  },
  {
    bankCode: '011',
    code: '9616',
    name: '香港上海商業銀行三藩市分行',
  },
  {
    bankCode: '011',
    code: '9627',
    name: '香港上海商業銀行倫敦分行',
  },
  {
    bankCode: '011',
    code: '9638',
    name: '香港上海商業銀行紐約分行',
  },
  {
    bankCode: '011',
    code: '9649',
    name: '香港上海商業銀行洛杉磯分行',
  },
  {
    bankCode: '011',
    code: '9661',
    name: '香港上海商業銀行深圳分行',
  },
  {
    bankCode: '011',
    code: '9672',
    name: '香港上海商業銀行上海分行',
  },
  {
    bankCode: '011',
    code: '9683',
    name: '香港上海商業銀行上海自貿試驗區支行',
  },
  {
    bankCode: '011',
    code: '9719',
    name: '香港上海商業銀行沙田分行',
  },
  {
    bankCode: '011',
    code: '9720',
    name: '香港上海商業銀行屯門分行',
  },
  {
    bankCode: '011',
    code: '9731',
    name: '香港上海商業銀行上水分行',
  },
  {
    bankCode: '011',
    code: '9742',
    name: '香港上海商業銀行馬鞍山分行',
  },
  {
    bankCode: '011',
    code: '9764',
    name: '香港上海商業銀行小西灣分行',
  },
  {
    bankCode: '011',
    code: '9775',
    name: '香港上海商業銀行嘉湖山莊分行',
  },
  {
    bankCode: '011',
    code: '9812',
    name: '香港上海商業銀行將軍澳分行',
  },
  {
    bankCode: '011',
    code: '9823',
    name: '香港上海商業銀行東涌分行',
  },
  {
    bankCode: '011',
    code: '9834',
    name: '香港上海商業銀行大埔分行',
  },
  {
    bankCode: '011',
    code: '9856',
    name: '香港上海商業銀行黃大仙分行',
  },
  {
    bankCode: '011',
    code: '9867',
    name: '香港上海商業銀行麼地道分行',
  },
  {
    bankCode: '011',
    code: '9889',
    name: '香港上海商業銀行干諾道分行',
  },
  {
    bankCode: '012',
    code: '2009',
    name: '台北富邦商業銀行營業部',
  },
  {
    bankCode: '012',
    code: '2032',
    name: '台北富邦商業銀行長安東路分行',
  },
  {
    bankCode: '012',
    code: '2102',
    name: '台北富邦商業銀行公庫處',
  },
  {
    bankCode: '012',
    code: '2205',
    name: '台北富邦商業銀行城東分行',
  },
  {
    bankCode: '012',
    code: '2504',
    name: '台北富邦商業銀行信託部',
  },
  {
    bankCode: '012',
    code: '3006',
    name: '台北富邦商業銀行士林分行',
  },
  {
    bankCode: '012',
    code: '3017',
    name: '台北富邦商業銀行士東分行',
  },
  {
    bankCode: '012',
    code: '3039',
    name: '台北富邦商業銀行玉成分行',
  },
  {
    bankCode: '012',
    code: '3040',
    name: '台北富邦商業銀行福港分行',
  },
  {
    bankCode: '012',
    code: '3051',
    name: '台北富邦商業銀行忠孝分行',
  },
  {
    bankCode: '012',
    code: '3109',
    name: '台北富邦商業銀行延平分行',
  },
  {
    bankCode: '012',
    code: '3202',
    name: '台北富邦商業銀行木柵分行',
  },
  {
    bankCode: '012',
    code: '3408',
    name: '台北富邦商業銀行八德分行',
  },
  {
    bankCode: '012',
    code: '3419',
    name: '台北富邦商業銀行松南分行',
  },
  {
    bankCode: '012',
    code: '3420',
    name: '台北富邦商業銀行永吉分行',
  },
  {
    bankCode: '012',
    code: '3501',
    name: '台北富邦商業銀行中山分行',
  },
  {
    bankCode: '012',
    code: '3604',
    name: '台北富邦商業銀行北投分行',
  },
  {
    bankCode: '012',
    code: '3615',
    name: '台北富邦商業銀行石牌分行',
  },
  {
    bankCode: '012',
    code: '3707',
    name: '台北富邦商業銀行大安分行',
  },
  {
    bankCode: '012',
    code: '3800',
    name: '台北富邦商業銀行大同分行',
  },
  {
    bankCode: '012',
    code: '3903',
    name: '台北富邦商業銀行古亭分行',
  },
  {
    bankCode: '012',
    code: '4003',
    name: '台北富邦商業銀行雙園分行',
  },
  {
    bankCode: '012',
    code: '4014',
    name: '台北富邦商業銀行萬華分行',
  },
  {
    bankCode: '012',
    code: '4106',
    name: '台北富邦商業銀行建成分行',
  },
  {
    bankCode: '012',
    code: '4117',
    name: '台北富邦商業銀行市府分行',
  },
  {
    bankCode: '012',
    code: '4209',
    name: '台北富邦商業銀行南港分行',
  },
  {
    bankCode: '012',
    code: '4302',
    name: '台北富邦商業銀行景美分行',
  },
  {
    bankCode: '012',
    code: '4313',
    name: '台北富邦商業銀行興隆分行',
  },
  {
    bankCode: '012',
    code: '4405',
    name: '台北富邦商業銀行內湖分行',
  },
  {
    bankCode: '012',
    code: '4427',
    name: '台北富邦商業銀行文德分行',
  },
  {
    bankCode: '012',
    code: '4508',
    name: '台北富邦商業銀行敦化分行',
  },
  {
    bankCode: '012',
    code: '4542',
    name: '台北富邦商業銀行民生分行',
  },
  {
    bankCode: '012',
    code: '4601',
    name: '台北富邦商業銀行信義分行',
  },
  {
    bankCode: '012',
    code: '4612',
    name: '台北富邦商業銀行莊敬分行',
  },
  {
    bankCode: '012',
    code: '4623',
    name: '台北富邦商業銀行東門分行',
  },
  {
    bankCode: '012',
    code: '4704',
    name: '台北富邦商業銀行松江分行',
  },
  {
    bankCode: '012',
    code: '4807',
    name: '台北富邦商業銀行和平分行',
  },
  {
    bankCode: '012',
    code: '5103',
    name: '台北富邦商業銀行南門分行',
  },
  {
    bankCode: '012',
    code: '5309',
    name: '台北富邦商業銀行西松分行',
  },
  {
    bankCode: '012',
    code: '5505',
    name: '台北富邦商業銀行桂林分行',
  },
  {
    bankCode: '012',
    code: '5608',
    name: '台北富邦商業銀行國際金融業務分行',
  },
  {
    bankCode: '012',
    code: '5701',
    name: '台北富邦商業銀行敦和分行',
  },
  {
    bankCode: '012',
    code: '5804',
    name: '台北富邦商業銀行臨沂分行',
  },
  {
    bankCode: '012',
    code: '5907',
    name: '台北富邦商業銀行中崙分行',
  },
  {
    bankCode: '012',
    code: '6007',
    name: '台北富邦商業銀行基隆路分行',
  },
  {
    bankCode: '012',
    code: '6100',
    name: '台北富邦商業銀行師大分行',
  },
  {
    bankCode: '012',
    code: '6203',
    name: '台北富邦商業銀行永春分行',
  },
  {
    bankCode: '012',
    code: '6214',
    name: '台北富邦商業銀行懷生分行',
  },
  {
    bankCode: '012',
    code: '6306',
    name: '台北富邦商業銀行民權分行',
  },
  {
    bankCode: '012',
    code: '6502',
    name: '台北富邦商業銀行社子分行',
  },
  {
    bankCode: '012',
    code: '6605',
    name: '台北富邦商業銀行港都分行',
  },
  {
    bankCode: '012',
    code: '6683',
    name: '台北富邦商業銀行西湖分行',
  },
  {
    bankCode: '012',
    code: '6719',
    name: '台北富邦商業銀行中港分行',
  },
  {
    bankCode: '012',
    code: '6720',
    name: '台北富邦商業銀行新莊分行',
  },
  {
    bankCode: '012',
    code: '6731',
    name: '台北富邦商業銀行桃園分行',
  },
  {
    bankCode: '012',
    code: '6742',
    name: '台北富邦商業銀行台南分行',
  },
  {
    bankCode: '012',
    code: '6775',
    name: '台北富邦商業銀行埔墘分行',
  },
  {
    bankCode: '012',
    code: '6786',
    name: '台北富邦商業銀行北中壢分行',
  },
  {
    bankCode: '012',
    code: '6797',
    name: '台北富邦商業銀行三重分行',
  },
  {
    bankCode: '012',
    code: '6801',
    name: '台北富邦商業銀行豐原分行',
  },
  {
    bankCode: '012',
    code: '6812',
    name: '台北富邦商業銀行中和分行',
  },
  {
    bankCode: '012',
    code: '6823',
    name: '台北富邦商業銀行鼓山分行',
  },
  {
    bankCode: '012',
    code: '6845',
    name: '台北富邦商業銀行風城分行',
  },
  {
    bankCode: '012',
    code: '6856',
    name: '台北富邦商業銀行彰化分行',
  },
  {
    bankCode: '012',
    code: '6867',
    name: '台北富邦商業銀行東湖分行',
  },
  {
    bankCode: '012',
    code: '6878',
    name: '台北富邦商業銀行永和分行',
  },
  {
    bankCode: '012',
    code: '6889',
    name: '台北富邦商業銀行岡山簡易型分行',
  },
  {
    bankCode: '012',
    code: '6890',
    name: '台北富邦商業銀行台北101分行',
  },
  {
    bankCode: '012',
    code: '7026',
    name: '台北富邦商業銀行南京東路分行',
  },
  {
    bankCode: '012',
    code: '7037',
    name: '台北富邦商業銀行敦北分行',
  },
  {
    bankCode: '012',
    code: '7048',
    name: '台北富邦商業銀行仁愛分行',
  },
  {
    bankCode: '012',
    code: '7059',
    name: '台北富邦商業銀行高雄分行',
  },
  {
    bankCode: '012',
    code: '7060',
    name: '台北富邦商業銀行中正分行',
  },
  {
    bankCode: '012',
    code: '7071',
    name: '台北富邦商業銀行台中分行',
  },
  {
    bankCode: '012',
    code: '7093',
    name: '台北富邦商業銀行松山分行',
  },
  {
    bankCode: '012',
    code: '7107',
    name: '台北富邦商業銀行土城分行',
  },
  {
    bankCode: '012',
    code: '7118',
    name: '台北富邦商業銀行東寧分行',
  },
  {
    bankCode: '012',
    code: '7129',
    name: '台北富邦商業銀行鳳山分行',
  },
  {
    bankCode: '012',
    code: '7130',
    name: '台北富邦商業銀行中壢分行',
  },
  {
    bankCode: '012',
    code: '7152',
    name: '台北富邦商業銀行安和分行',
  },
  {
    bankCode: '012',
    code: '7163',
    name: '台北富邦商業銀行正義分行',
  },
  {
    bankCode: '012',
    code: '7174',
    name: '台北富邦商業銀行大湳分行',
  },
  {
    bankCode: '012',
    code: '7185',
    name: '台北富邦商業銀行嘉義分行',
  },
  {
    bankCode: '012',
    code: '7211',
    name: '台北富邦商業銀行板橋分行',
  },
  {
    bankCode: '012',
    code: '7222',
    name: '台北富邦商業銀行北台中分行',
  },
  {
    bankCode: '012',
    code: '7233',
    name: '台北富邦商業銀行三民分行',
  },
  {
    bankCode: '012',
    code: '7244',
    name: '台北富邦商業銀行建國分行',
  },
  {
    bankCode: '012',
    code: '7255',
    name: '台北富邦商業銀行新竹分行',
  },
  {
    bankCode: '012',
    code: '7266',
    name: '台北富邦商業銀行新店分行',
  },
  {
    bankCode: '012',
    code: '7277',
    name: '台北富邦商業銀行天母分行',
  },
  {
    bankCode: '012',
    code: '7288',
    name: '台北富邦商業銀行汐止分行',
  },
  {
    bankCode: '012',
    code: '7303',
    name: '台北富邦商業銀行永康分行',
  },
  {
    bankCode: '012',
    code: '7314',
    name: '台北富邦商業銀行城中分行',
  },
  {
    bankCode: '012',
    code: '7336',
    name: '台北富邦商業銀行五股分行',
  },
  {
    bankCode: '012',
    code: '7347',
    name: '台北富邦商業銀行新營分行',
  },
  {
    bankCode: '012',
    code: '7358',
    name: '台北富邦商業銀行屏東分行',
  },
  {
    bankCode: '012',
    code: '7369',
    name: '台北富邦商業銀行前鎮分行',
  },
  {
    bankCode: '012',
    code: '7370',
    name: '台北富邦商業銀行敦南分行',
  },
  {
    bankCode: '012',
    code: '7381',
    name: '台北富邦商業銀行保生分行',
  },
  {
    bankCode: '012',
    code: '7392',
    name: '台北富邦商業銀行員林分行',
  },
  {
    bankCode: '012',
    code: '7406',
    name: '台北富邦商業銀行羅東分行',
  },
  {
    bankCode: '012',
    code: '7417',
    name: '台北富邦商業銀行瑞湖分行',
  },
  {
    bankCode: '012',
    code: '7451',
    name: '台北富邦商業銀行花蓮分行',
  },
  {
    bankCode: '012',
    code: '7462',
    name: '台北富邦商業銀行竹北分行',
  },
  {
    bankCode: '012',
    code: '7473',
    name: '台北富邦商業銀行南台中分行',
  },
  {
    bankCode: '012',
    code: '7484',
    name: '台北富邦商業銀行博愛分行',
  },
  {
    bankCode: '012',
    code: '7495',
    name: '台北富邦商業銀行蘆洲分行',
  },
  {
    bankCode: '012',
    code: '7509',
    name: '台北富邦商業銀行華江分行',
  },
  {
    bankCode: '012',
    code: '7510',
    name: '台北富邦商業銀行大直分行',
  },
  {
    bankCode: '012',
    code: '7521',
    name: '台北富邦商業銀行樹林分行',
  },
  {
    bankCode: '012',
    code: '7532',
    name: '台北富邦商業銀行基隆分行',
  },
  {
    bankCode: '012',
    code: '7543',
    name: '台北富邦商業銀行竹科分行',
  },
  {
    bankCode: '012',
    code: '7554',
    name: '台北富邦商業銀行林口簡易型分行',
  },
  {
    bankCode: '012',
    code: '7565',
    name: '台北富邦商業銀行新板分行',
  },
  {
    bankCode: '012',
    code: '7576',
    name: '台北富邦商業銀行三峽分行',
  },
  {
    bankCode: '012',
    code: '7587',
    name: '台北富邦商業銀行南崁分行',
  },
  {
    bankCode: '012',
    code: '7598',
    name: '台北富邦商業銀行東台南分行',
  },
  {
    bankCode: '012',
    code: '7602',
    name: '台北富邦商業銀行左營分行',
  },
  {
    bankCode: '012',
    code: '7613',
    name: '台北富邦商業銀行大里分行',
  },
  {
    bankCode: '012',
    code: '7624',
    name: '台北富邦商業銀行得和分行',
  },
  {
    bankCode: '012',
    code: '7635',
    name: '台北富邦商業銀行斗六分行',
  },
  {
    bankCode: '012',
    code: '7646',
    name: '台北富邦商業銀行國美分行',
  },
  {
    bankCode: '012',
    code: '7657',
    name: '台北富邦商業銀行南勢角分行',
  },
  {
    bankCode: '012',
    code: '7668',
    name: '台北富邦商業銀行北屯分行',
  },
  {
    bankCode: '012',
    code: '7679',
    name: '台北富邦商業銀行淡水分行',
  },
  {
    bankCode: '012',
    code: '7680',
    name: '台北富邦商業銀行西屯分行',
  },
  {
    bankCode: '012',
    code: '7691',
    name: '台北富邦商業銀行北新分行',
  },
  {
    bankCode: '012',
    code: '7705',
    name: '台北富邦商業銀行市政分行',
  },
  {
    bankCode: '012',
    code: '7716',
    name: '台北富邦商業銀行北新莊分行',
  },
  {
    bankCode: '012',
    code: '7727',
    name: '台北富邦商業銀行大雅簡易型分行',
  },
  {
    bankCode: '012',
    code: '9307',
    name: '台北富邦商業銀行新加坡分行',
  },
  {
    bankCode: '012',
    code: '9503',
    name: '台北富邦商業銀行香港分行',
  },
  {
    bankCode: '012',
    code: '9606',
    name: '台北富邦商業銀行平陽分行',
  },
  {
    bankCode: '012',
    code: '9628',
    name: '台北富邦商業銀行河內分行',
  },
  {
    bankCode: '012',
    code: '9639',
    name: '台北富邦商業銀行胡志明市分行',
  },
  {
    bankCode: '012',
    code: '9710',
    name: '台北富邦商業銀行子行富邦華一銀行重慶分行',
  },
  {
    bankCode: '012',
    code: '9721',
    name: '台北富邦商業銀行子行富邦華一銀行廣州分行',
  },
  {
    bankCode: '012',
    code: '9732',
    name: '台北富邦商業銀行子行富邦華一銀行西安分行',
  },
  {
    bankCode: '012',
    code: '9743',
    name: '台北富邦商業銀行子行富邦華一銀行武漢分行',
  },
  {
    bankCode: '012',
    code: '9754',
    name: '台北富邦商業銀行子行富邦華一銀行蘇州昆山支行',
  },
  {
    bankCode: '012',
    code: '9765',
    name: '台北富邦商業銀行子行富邦華一銀行成都分行',
  },
  {
    bankCode: '012',
    code: '9776',
    name: '台北富邦商業銀行子行富邦華一銀行北京分行',
  },
  {
    bankCode: '012',
    code: '9787',
    name: '台北富邦商業銀行子行富邦華一銀行上海外灘支行',
  },
  {
    bankCode: '012',
    code: '9798',
    name: '台北富邦商業銀行子行富邦華一銀行深圳前海支行',
  },
  {
    bankCode: '012',
    code: '9802',
    name: '台北富邦商業銀行子行富邦華一銀行',
  },
  {
    bankCode: '012',
    code: '9813',
    name: '台北富邦商業銀行子行富邦華一銀行上海虹橋支行',
  },
  {
    bankCode: '012',
    code: '9824',
    name: '台北富邦商業銀行子行富邦華一銀行上海徐匯支行',
  },
  {
    bankCode: '012',
    code: '9835',
    name: '台北富邦商業銀行子行富邦華一銀行上海世紀大道支行',
  },
  {
    bankCode: '012',
    code: '9846',
    name: '台北富邦商業銀行子行富邦華一銀行上海松江支行',
  },
  {
    bankCode: '012',
    code: '9857',
    name: '台北富邦商業銀行子行富邦華一銀行深圳分行',
  },
  {
    bankCode: '012',
    code: '9868',
    name: '台北富邦商業銀行子行富邦華一銀行上海閔行支行',
  },
  {
    bankCode: '012',
    code: '9879',
    name: '台北富邦商業銀行子行富邦華一銀行天津分行',
  },
  {
    bankCode: '012',
    code: '9880',
    name: '台北富邦商業銀行子行富邦華一銀行上海陸家嘴支行',
  },
  {
    bankCode: '012',
    code: '9891',
    name: '台北富邦商業銀行子行富邦華一銀行上海新天地支行',
  },
  {
    bankCode: '012',
    code: '9916',
    name: '台北富邦商業銀行子行富邦華一銀行上海靜安支行',
  },
  {
    bankCode: '012',
    code: '9927',
    name: '台北富邦商業銀行子行富邦華一銀行天津自貿試驗區支行',
  },
  {
    bankCode: '012',
    code: '9938',
    name: '台北富邦商業銀行子行富邦華一銀行蘇州分行',
  },
  {
    bankCode: '012',
    code: '9949',
    name: '台北富邦商業銀行子行富邦華一銀行上海長寧支行',
  },
  {
    bankCode: '012',
    code: '9950',
    name: '台北富邦商業銀行子行富邦華一銀行上海自由貿易試驗區支行',
  },
  {
    bankCode: '012',
    code: '9961',
    name: '台北富邦商業銀行子行富邦華一銀行上海日月光支行',
  },
  {
    bankCode: '012',
    code: '9972',
    name: '台北富邦商業銀行子行富邦華一銀行南京分行',
  },
  {
    bankCode: '013',
    code: '0017',
    name: '國泰世華商業銀行館前分行',
  },
  {
    bankCode: '013',
    code: '0028',
    name: '國泰世華商業銀行環球交易服務部',
  },
  {
    bankCode: '013',
    code: '0039',
    name: '國泰世華商業銀行南京東路分行',
  },
  {
    bankCode: '013',
    code: '0040',
    name: '國泰世華商業銀行信託部',
  },
  {
    bankCode: '013',
    code: '0051',
    name: '國泰世華商業銀行高雄分行',
  },
  {
    bankCode: '013',
    code: '0062',
    name: '國泰世華商業銀行台中分行',
  },
  {
    bankCode: '013',
    code: '0073',
    name: '國泰世華商業銀行台北分行',
  },
  {
    bankCode: '013',
    code: '0095',
    name: '國泰世華商業銀行永和分行',
  },
  {
    bankCode: '013',
    code: '0109',
    name: '國泰世華商業銀行台南分行',
  },
  {
    bankCode: '013',
    code: '0110',
    name: '國泰世華商業銀行忠孝分行',
  },
  {
    bankCode: '013',
    code: '0121',
    name: '國泰世華商業銀行天母分行',
  },
  {
    bankCode: '013',
    code: '0132',
    name: '國泰世華商業銀行西台中分行',
  },
  {
    bankCode: '013',
    code: '0143',
    name: '國泰世華商業銀行東高雄分行',
  },
  {
    bankCode: '013',
    code: '0154',
    name: '國泰世華商業銀行信義分行',
  },
  {
    bankCode: '013',
    code: '0165',
    name: '國泰世華商業銀行光復分行',
  },
  {
    bankCode: '013',
    code: '0176',
    name: '國泰世華商業銀行板橋分行',
  },
  {
    bankCode: '013',
    code: '0187',
    name: '國泰世華商業銀行復興分行',
  },
  {
    bankCode: '013',
    code: '0198',
    name: '國泰世華商業銀行民權分行',
  },
  {
    bankCode: '013',
    code: '0202',
    name: '國泰世華商業銀行大安分行',
  },
  {
    bankCode: '013',
    code: '0213',
    name: '國泰世華商業銀行三重分行',
  },
  {
    bankCode: '013',
    code: '0224',
    name: '國泰世華商業銀行中壢分行',
  },
  {
    bankCode: '013',
    code: '0235',
    name: '國泰世華商業銀行員林分行',
  },
  {
    bankCode: '013',
    code: '0246',
    name: '國泰世華商業銀行新店分行',
  },
  {
    bankCode: '013',
    code: '0257',
    name: '國泰世華商業銀行新莊分行',
  },
  {
    bankCode: '013',
    code: '0268',
    name: '國泰世華商業銀行鳳山分行',
  },
  {
    bankCode: '013',
    code: '0279',
    name: '國泰世華商業銀行安和分行',
  },
  {
    bankCode: '013',
    code: '0280',
    name: '國泰世華商業銀行松江分行',
  },
  {
    bankCode: '013',
    code: '0291',
    name: '國泰世華商業銀行苓雅分行',
  },
  {
    bankCode: '013',
    code: '0305',
    name: '國泰世華商業銀行古亭分行',
  },
  {
    bankCode: '013',
    code: '0316',
    name: '國泰世華商業銀行建成分行',
  },
  {
    bankCode: '013',
    code: '0327',
    name: '國泰世華商業銀行東門分行',
  },
  {
    bankCode: '013',
    code: '0338',
    name: '國泰世華商業銀行國際金融業務分行',
  },
  {
    bankCode: '013',
    code: '0349',
    name: '國泰世華商業銀行桃園分行',
  },
  {
    bankCode: '013',
    code: '0350',
    name: '國泰世華商業銀行豐原分行',
  },
  {
    bankCode: '013',
    code: '0361',
    name: '國泰世華商業銀行嘉義分行',
  },
  {
    bankCode: '013',
    code: '0372',
    name: '國泰世華商業銀行松山分行',
  },
  {
    bankCode: '013',
    code: '0383',
    name: '國泰世華商業銀行前金分行',
  },
  {
    bankCode: '013',
    code: '0394',
    name: '國泰世華商業銀行北三重分行',
  },
  {
    bankCode: '013',
    code: '0408',
    name: '國泰世華商業銀行新竹分行',
  },
  {
    bankCode: '013',
    code: '0419',
    name: '國泰世華商業銀行永康分行',
  },
  {
    bankCode: '013',
    code: '0420',
    name: '國泰世華商業銀行中山分行',
  },
  {
    bankCode: '013',
    code: '0431',
    name: '國泰世華商業銀行埔墘分行',
  },
  {
    bankCode: '013',
    code: '0442',
    name: '國泰世華商業銀行新生分行',
  },
  {
    bankCode: '013',
    code: '0453',
    name: '國泰世華商業銀行中和分行',
  },
  {
    bankCode: '013',
    code: '0464',
    name: '國泰世華商業銀行清水分行',
  },
  {
    bankCode: '013',
    code: '0475',
    name: '國泰世華商業銀行彰化分行',
  },
  {
    bankCode: '013',
    code: '0486',
    name: '國泰世華商業銀行敦北分行',
  },
  {
    bankCode: '013',
    code: '0497',
    name: '國泰世華商業銀行中正分行',
  },
  {
    bankCode: '013',
    code: '0501',
    name: '國泰世華商業銀行五權分行',
  },
  {
    bankCode: '013',
    code: '0512',
    name: '國泰世華商業銀行東台南分行',
  },
  {
    bankCode: '013',
    code: '0523',
    name: '國泰世華商業銀行新興分行',
  },
  {
    bankCode: '013',
    code: '0534',
    name: '國泰世華商業銀行敦南分行',
  },
  {
    bankCode: '013',
    code: '0545',
    name: '國泰世華商業銀行後埔分行',
  },
  {
    bankCode: '013',
    code: '0556',
    name: '國泰世華商業銀行蘆洲分行',
  },
  {
    bankCode: '013',
    code: '0567',
    name: '國泰世華商業銀行西門分行',
  },
  {
    bankCode: '013',
    code: '0578',
    name: '國泰世華商業銀行三民分行',
  },
  {
    bankCode: '013',
    code: '0590',
    name: '國泰世華商業銀行前鎮分行',
  },
  {
    bankCode: '013',
    code: '0604',
    name: '國泰世華商業銀行土城分行',
  },
  {
    bankCode: '013',
    code: '0615',
    name: '國泰世華商業銀行南高雄分行',
  },
  {
    bankCode: '013',
    code: '0626',
    name: '國泰世華商業銀行大同分行',
  },
  {
    bankCode: '013',
    code: '0637',
    name: '國泰世華商業銀行成功分行',
  },
  {
    bankCode: '013',
    code: '0648',
    name: '國泰世華商業銀行中港分行',
  },
  {
    bankCode: '013',
    code: '0659',
    name: '國泰世華商業銀行世貿分行',
  },
  {
    bankCode: '013',
    code: '0660',
    name: '國泰世華商業銀行北桃園分行',
  },
  {
    bankCode: '013',
    code: '0671',
    name: '國泰世華商業銀行善化分行',
  },
  {
    bankCode: '013',
    code: '0682',
    name: '國泰世華商業銀行士林分行',
  },
  {
    bankCode: '013',
    code: '0693',
    name: '國泰世華商業銀行雙和分行',
  },
  {
    bankCode: '013',
    code: '0707',
    name: '國泰世華商業銀行二重分行',
  },
  {
    bankCode: '013',
    code: '0729',
    name: '國泰世華商業銀行花蓮分行',
  },
  {
    bankCode: '013',
    code: '0730',
    name: '國泰世華商業銀行內湖分行',
  },
  {
    bankCode: '013',
    code: '0741',
    name: '國泰世華商業銀行華江分行',
  },
  {
    bankCode: '013',
    code: '0752',
    name: '國泰世華商業銀行竹科分行',
  },
  {
    bankCode: '013',
    code: '0763',
    name: '國泰世華商業銀行南門分行',
  },
  {
    bankCode: '013',
    code: '0774',
    name: '國泰世華商業銀行八德分行',
  },
  {
    bankCode: '013',
    code: '0785',
    name: '國泰世華商業銀行永春分行',
  },
  {
    bankCode: '013',
    code: '0796',
    name: '國泰世華商業銀行萬華分行',
  },
  {
    bankCode: '013',
    code: '1014',
    name: '國泰世華商業銀行屏東分行',
  },
  {
    bankCode: '013',
    code: '1025',
    name: '國泰世華商業銀行台東分行',
  },
  {
    bankCode: '013',
    code: '1036',
    name: '國泰世華商業銀行文山分行',
  },
  {
    bankCode: '013',
    code: '1047',
    name: '國泰世華商業銀行新樹分行',
  },
  {
    bankCode: '013',
    code: '1058',
    name: '國泰世華商業銀行宜蘭分行',
  },
  {
    bankCode: '013',
    code: '1069',
    name: '國泰世華商業銀行南港分行',
  },
  {
    bankCode: '013',
    code: '1070',
    name: '國泰世華商業銀行斗六分行',
  },
  {
    bankCode: '013',
    code: '1081',
    name: '國泰世華商業銀行南投分行',
  },
  {
    bankCode: '013',
    code: '1092',
    name: '國泰世華商業銀行汐止分行',
  },
  {
    bankCode: '013',
    code: '1106',
    name: '國泰世華商業銀行大直分行',
  },
  {
    bankCode: '013',
    code: '1117',
    name: '國泰世華商業銀行左營分行',
  },
  {
    bankCode: '013',
    code: '1128',
    name: '國泰世華商業銀行新營分行',
  },
  {
    bankCode: '013',
    code: '1139',
    name: '國泰世華商業銀行大甲分行',
  },
  {
    bankCode: '013',
    code: '1140',
    name: '國泰世華商業銀行苗栗分行',
  },
  {
    bankCode: '013',
    code: '1151',
    name: '國泰世華商業銀行北投分行',
  },
  {
    bankCode: '013',
    code: '1162',
    name: '國泰世華商業銀行臨安分行',
  },
  {
    bankCode: '013',
    code: '1173',
    name: '國泰世華商業銀行幸福分行',
  },
  {
    bankCode: '013',
    code: '1184',
    name: '國泰世華商業銀行華山分行',
  },
  {
    bankCode: '013',
    code: '1195',
    name: '國泰世華商業銀行東湖分行',
  },
  {
    bankCode: '013',
    code: '1209',
    name: '國泰世華商業銀行岡山分行',
  },
  {
    bankCode: '013',
    code: '1210',
    name: '國泰世華商業銀行臨沂分行',
  },
  {
    bankCode: '013',
    code: '1221',
    name: '國泰世華商業銀行新湖分行',
  },
  {
    bankCode: '013',
    code: '1232',
    name: '國泰世華商業銀行中崙分行',
  },
  {
    bankCode: '013',
    code: '1243',
    name: '國泰世華商業銀行基隆分行',
  },
  {
    bankCode: '013',
    code: '1254',
    name: '國泰世華商業銀行樹林分行',
  },
  {
    bankCode: '013',
    code: '1276',
    name: '國泰世華商業銀行淡水分行',
  },
  {
    bankCode: '013',
    code: '1287',
    name: '國泰世華商業銀行連城分行',
  },
  {
    bankCode: '013',
    code: '1298',
    name: '國泰世華商業銀行石牌分行',
  },
  {
    bankCode: '013',
    code: '1302',
    name: '國泰世華商業銀行南內湖分行',
  },
  {
    bankCode: '013',
    code: '1313',
    name: '國泰世華商業銀行景美分行',
  },
  {
    bankCode: '013',
    code: '1324',
    name: '國泰世華商業銀行大坪林分行',
  },
  {
    bankCode: '013',
    code: '1335',
    name: '國泰世華商業銀行丹鳳分行',
  },
  {
    bankCode: '013',
    code: '1346',
    name: '國泰世華商業銀行林口分行',
  },
  {
    bankCode: '013',
    code: '1357',
    name: '國泰世華商業銀行南崁分行',
  },
  {
    bankCode: '013',
    code: '1368',
    name: '國泰世華商業銀行東林口分行',
  },
  {
    bankCode: '013',
    code: '2011',
    name: '國泰世華商業銀行仁愛分行',
  },
  {
    bankCode: '013',
    code: '2022',
    name: '國泰世華商業銀行大昌分行',
  },
  {
    bankCode: '013',
    code: '2033',
    name: '國泰世華商業銀行民生分行',
  },
  {
    bankCode: '013',
    code: '2044',
    name: '國泰世華商業銀行篤行分行',
  },
  {
    bankCode: '013',
    code: '2055',
    name: '國泰世華商業銀行板東分行',
  },
  {
    bankCode: '013',
    code: '2066',
    name: '國泰世華商業銀行桃興分行',
  },
  {
    bankCode: '013',
    code: '2099',
    name: '國泰世華商業銀行嘉泰分行',
  },
  {
    bankCode: '013',
    code: '2103',
    name: '國泰世華商業銀行竹城分行',
  },
  {
    bankCode: '013',
    code: '2114',
    name: '國泰世華商業銀行忠誠分行',
  },
  {
    bankCode: '013',
    code: '2125',
    name: '國泰世華商業銀行敦化分行',
  },
  {
    bankCode: '013',
    code: '2147',
    name: '國泰世華商業銀行新泰分行',
  },
  {
    bankCode: '013',
    code: '2158',
    name: '國泰世華商業銀行文心分行',
  },
  {
    bankCode: '013',
    code: '2169',
    name: '國泰世華商業銀行福和分行',
  },
  {
    bankCode: '013',
    code: '2170',
    name: '國泰世華商業銀行四維分行',
  },
  {
    bankCode: '013',
    code: '2181',
    name: '國泰世華商業銀行營業部',
  },
  {
    bankCode: '013',
    code: '2206',
    name: '國泰世華商業銀行重新分行',
  },
  {
    bankCode: '013',
    code: '2217',
    name: '國泰世華商業銀行北中壢分行',
  },
  {
    bankCode: '013',
    code: '2228',
    name: '國泰世華商業銀行城東分行',
  },
  {
    bankCode: '013',
    code: '2239',
    name: '國泰世華商業銀行建國分行',
  },
  {
    bankCode: '013',
    code: '2251',
    name: '國泰世華商業銀行學府分行',
  },
  {
    bankCode: '013',
    code: '2262',
    name: '國泰世華商業銀行北新分行',
  },
  {
    bankCode: '013',
    code: '2273',
    name: '國泰世華商業銀行信安分行',
  },
  {
    bankCode: '013',
    code: '2295',
    name: '國泰世華商業銀行文德分行',
  },
  {
    bankCode: '013',
    code: '2321',
    name: '國泰世華商業銀行中台中分行',
  },
  {
    bankCode: '013',
    code: '2332',
    name: '國泰世華商業銀行水湳分行',
  },
  {
    bankCode: '013',
    code: '2343',
    name: '國泰世華商業銀行市政分行',
  },
  {
    bankCode: '013',
    code: '2354',
    name: '國泰世華商業銀行東台中分行',
  },
  {
    bankCode: '013',
    code: '2365',
    name: '國泰世華商業銀行昌平分行',
  },
  {
    bankCode: '013',
    code: '2376',
    name: '國泰世華商業銀行健行分行',
  },
  {
    bankCode: '013',
    code: '2398',
    name: '國泰世華商業銀行西屯分行',
  },
  {
    bankCode: '013',
    code: '2402',
    name: '國泰世華商業銀行南屯分行',
  },
  {
    bankCode: '013',
    code: '2413',
    name: '國泰世華商業銀行崇德分行',
  },
  {
    bankCode: '013',
    code: '2457',
    name: '國泰世華商業銀行香山分行',
  },
  {
    bankCode: '013',
    code: '2468',
    name: '國泰世華商業銀行竹北分行',
  },
  {
    bankCode: '013',
    code: '2480',
    name: '國泰世華商業銀行同德分行',
  },
  {
    bankCode: '013',
    code: '2527',
    name: '國泰世華商業銀行秀水分行',
  },
  {
    bankCode: '013',
    code: '2549',
    name: '國泰世華商業銀行彰美分行',
  },
  {
    bankCode: '013',
    code: '2550',
    name: '國泰世華商業銀行太平分行',
  },
  {
    bankCode: '013',
    code: '2561',
    name: '國泰世華商業銀行沙鹿分行',
  },
  {
    bankCode: '013',
    code: '2583',
    name: '國泰世華商業銀行大里分行',
  },
  {
    bankCode: '013',
    code: '2608',
    name: '國泰世華商業銀行逢甲分行',
  },
  {
    bankCode: '013',
    code: '2619',
    name: '國泰世華商業銀行大雅分行',
  },
  {
    bankCode: '013',
    code: '2620',
    name: '國泰世華商業銀行潭子分行',
  },
  {
    bankCode: '013',
    code: '2631',
    name: '國泰世華商業銀行光華分行',
  },
  {
    bankCode: '013',
    code: '2642',
    name: '國泰世華商業銀行西松分行',
  },
  {
    bankCode: '013',
    code: '2653',
    name: '國泰世華商業銀行蘭雅分行',
  },
  {
    bankCode: '013',
    code: '2664',
    name: '國泰世華商業銀行永平分行',
  },
  {
    bankCode: '013',
    code: '2675',
    name: '國泰世華商業銀行和平分行',
  },
  {
    bankCode: '013',
    code: '2686',
    name: '國泰世華商業銀行慶城分行',
  },
  {
    bankCode: '013',
    code: '2697',
    name: '國泰世華商業銀行瑞湖分行',
  },
  {
    bankCode: '013',
    code: '2701',
    name: '國泰世華商業銀行文昌分行',
  },
  {
    bankCode: '013',
    code: '2712',
    name: '國泰世華商業銀行正義分行',
  },
  {
    bankCode: '013',
    code: '2723',
    name: '國泰世華商業銀行新板分行',
  },
  {
    bankCode: '013',
    code: '2734',
    name: '國泰世華商業銀行永貞分行',
  },
  {
    bankCode: '013',
    code: '2778',
    name: '國泰世華商業銀行明誠分行',
  },
  {
    bankCode: '013',
    code: '9010',
    name: '國泰世華商業銀行納閩島分行',
  },
  {
    bankCode: '013',
    code: '9021',
    name: '國泰世華商業銀行馬尼拉分行',
  },
  {
    bankCode: '013',
    code: '9032',
    name: '國泰世華商業銀行曼谷代表人辦事處',
  },
  {
    bankCode: '013',
    code: '9043',
    name: '國泰世華商業銀行新加坡分行',
  },
  {
    bankCode: '013',
    code: '9054',
    name: '世越銀行',
  },
  {
    bankCode: '013',
    code: '9065',
    name: '國泰世華銀行(中國)有限公司上海分行',
  },
  {
    bankCode: '013',
    code: '9205',
    name: '國泰世華商業銀行香港分行',
  },
  {
    bankCode: '013',
    code: '9249',
    name: '國泰世華銀行(柬埔寨)股份有限公司森速分行',
  },
  {
    bankCode: '013',
    code: '9250',
    name: '國泰世華銀行(中國)有限公司',
  },
  {
    bankCode: '013',
    code: '9261',
    name: '國泰世華銀行(柬埔寨)股份有限公司宋仁芷分行',
  },
  {
    bankCode: '013',
    code: '9272',
    name: '國泰世華銀行(柬埔寨)股份有限公司舊運動場分行',
  },
  {
    bankCode: '013',
    code: '9283',
    name: '國泰世華銀行(中國)有限公司深圳分行',
  },
  {
    bankCode: '013',
    code: '9294',
    name: '國泰世華銀行(柬埔寨)股份有限公司鐵橋頭分行',
  },
  {
    bankCode: '013',
    code: '9308',
    name: '國泰世華銀行(柬埔寨)股份有限公司中洲分行',
  },
  {
    bankCode: '013',
    code: '9319',
    name: '國泰世華銀行(柬埔寨)股份有限公司興利分行',
  },
  {
    bankCode: '013',
    code: '9320',
    name: '國泰世華銀行(中國)有限公司上海嘉定支行',
  },
  {
    bankCode: '013',
    code: '9331',
    name: '世越銀行會安分行',
  },
  {
    bankCode: '013',
    code: '9342',
    name: '國泰世華銀行(柬埔寨)股份有限公司巴域分行',
  },
  {
    bankCode: '013',
    code: '9353',
    name: '國泰世華銀行(柬埔寨)股份有限公司磅針分行',
  },
  {
    bankCode: '013',
    code: '9364',
    name: '國泰世華銀行(柬埔寨)股份有限公司馬德望分行',
  },
  {
    bankCode: '013',
    code: '9375',
    name: '國泰世華商業銀行印尼雅加達代表人辦事處',
  },
  {
    bankCode: '013',
    code: '9386',
    name: '國泰世華商業銀行永珍分行',
  },
  {
    bankCode: '013',
    code: '9397',
    name: '國泰世華銀行(中國)有限公司青島分行',
  },
  {
    bankCode: '013',
    code: '9401',
    name: '國泰世華商業銀行緬甸仰光代表人辦事處',
  },
  {
    bankCode: '013',
    code: '9412',
    name: '國泰世華銀行(中國)有限公司上海自貿試驗區支行',
  },
  {
    bankCode: '013',
    code: '9423',
    name: '國泰世華銀行(中國)有限公司上海閔行支行',
  },
  {
    bankCode: '013',
    code: '9526',
    name: '國泰世華銀行(柬埔寨)股份有限公司Monivong Exchange Office',
  },
  {
    bankCode: '013',
    code: '9537',
    name: '國泰世華銀行(柬埔寨)股份有限公司暹粒分行',
  },
  {
    bankCode: '013',
    code: '9548',
    name: '國泰世華銀行(柬埔寨)股份有限公司西哈努克市分行',
  },
  {
    bankCode: '013',
    code: '9559',
    name: '國泰世華銀行(柬埔寨)股份有限公司朱德奔分行',
  },
  {
    bankCode: '013',
    code: '9560',
    name: '國泰世華銀行(柬埔寨)股份有限公司尼赫魯分行',
  },
  {
    bankCode: '013',
    code: '9571',
    name: '國泰世華銀行(柬埔寨)股份有限公司毛澤東分行',
  },
  {
    bankCode: '013',
    code: '9582',
    name: '世越銀行濱城分行',
  },
  {
    bankCode: '013',
    code: '9593',
    name: '國泰世華銀行(柬埔寨)股份有限公司',
  },
  {
    bankCode: '013',
    code: '9607',
    name: '世越銀行河內分行CIPUTRA P2支行',
  },
  {
    bankCode: '013',
    code: '9618',
    name: '世越銀行峴港分行黃耀支行',
  },
  {
    bankCode: '013',
    code: '9629',
    name: '世越銀行海防分行鴻龐支行',
  },
  {
    bankCode: '013',
    code: '9630',
    name: '世越銀行棟多分行安和支行',
  },
  {
    bankCode: '013',
    code: '9641',
    name: '世越銀行棟多分行吳權支行',
  },
  {
    bankCode: '013',
    code: '9652',
    name: '世越銀行河內分行陳仁宗支行',
  },
  {
    bankCode: '013',
    code: '9685',
    name: '世越銀行新平分行李常傑支行',
  },
  {
    bankCode: '013',
    code: '9700',
    name: '世越銀行同奈分行展鵬支行',
  },
  {
    bankCode: '013',
    code: '9711',
    name: '世越銀行河內分行黎仲晉支行',
  },
  {
    bankCode: '013',
    code: '9733',
    name: '世越銀行天龍分行',
  },
  {
    bankCode: '013',
    code: '9744',
    name: '世越銀行芹苴分行興利支行',
  },
  {
    bankCode: '013',
    code: '9755',
    name: '世越銀行堤岸分行平新支行',
  },
  {
    bankCode: '013',
    code: '9777',
    name: '世越銀行河內分行李太祖支行',
  },
  {
    bankCode: '013',
    code: '9788',
    name: '世越銀行棟多分行黎鴻鋒支行',
  },
  {
    bankCode: '013',
    code: '9799',
    name: '世越銀行峴港分行雄王支行',
  },
  {
    bankCode: '013',
    code: '9803',
    name: '世越銀行美亭分行',
  },
  {
    bankCode: '013',
    code: '9814',
    name: '世越銀行平陽分行美福支行',
  },
  {
    bankCode: '013',
    code: '9825',
    name: '世越銀行新平分行',
  },
  {
    bankCode: '013',
    code: '9847',
    name: '世越銀行堤岸分行',
  },
  {
    bankCode: '013',
    code: '9858',
    name: '世越銀行堤岸分行富美興支行',
  },
  {
    bankCode: '013',
    code: '9869',
    name: '世越銀行峴港分行',
  },
  {
    bankCode: '013',
    code: '9870',
    name: '世越銀行海防分行Nomura支行',
  },
  {
    bankCode: '013',
    code: '9881',
    name: '世越銀行河內分行CIPUTRA G02支行',
  },
  {
    bankCode: '013',
    code: '9892',
    name: '世越銀行同奈分行仁澤支行',
  },
  {
    bankCode: '013',
    code: '9906',
    name: '國泰世華商業銀行吉隆坡行銷服務處',
  },
  {
    bankCode: '013',
    code: '9917',
    name: '世越銀行棟多分行',
  },
  {
    bankCode: '013',
    code: '9928',
    name: '世越銀行同奈分行',
  },
  {
    bankCode: '013',
    code: '9939',
    name: '世越銀行海防分行',
  },
  {
    bankCode: '013',
    code: '9940',
    name: '世越銀行芹苴分行',
  },
  {
    bankCode: '013',
    code: '9951',
    name: '世越銀行平陽分行',
  },
  {
    bankCode: '013',
    code: '9962',
    name: '世越銀行河內分行',
  },
  {
    bankCode: '013',
    code: '9973',
    name: '國泰世華商業銀行茱萊分行',
  },
  {
    bankCode: '013',
    code: '9984',
    name: '國泰世華商業銀行胡志明市代表人辦事處',
  },
  {
    bankCode: '013',
    code: '9995',
    name: '國泰世華商業銀行河內代表人辦事處',
  },
  {
    bankCode: '015',
    code: '0019',
    name: '業務部',
  },
  {
    bankCode: '015',
    code: '0031',
    name: '中國輸出入銀行高雄分行',
  },
  {
    bankCode: '015',
    code: '0042',
    name: '中國輸出入銀行台中分行',
  },
  {
    bankCode: '015',
    code: '0053',
    name: '中國輸出入銀行國際金融業務分行',
  },
  {
    bankCode: '015',
    code: '0064',
    name: '中國輸出入銀行新竹分行',
  },
  {
    bankCode: '015',
    code: '0075',
    name: '財務部',
  },
  {
    bankCode: '015',
    code: '0086',
    name: '中國輸出入銀行台南分行',
  },
  {
    bankCode: '015',
    code: '9986',
    name: '中國輸出入銀行泰國曼谷代表人辦事處',
  },
  {
    bankCode: '016',
    code: '1017',
    name: '高雄銀行營業部',
  },
  {
    bankCode: '016',
    code: '1028',
    name: '高雄銀行公庫部',
  },
  {
    bankCode: '016',
    code: '1039',
    name: '高雄銀行岡山本洲分行',
  },
  {
    bankCode: '016',
    code: '1040',
    name: '高雄銀行國外部',
  },
  {
    bankCode: '016',
    code: '1051',
    name: '高雄銀行信託部',
  },
  {
    bankCode: '016',
    code: '2003',
    name: '高雄銀行鳳山分行',
  },
  {
    bankCode: '016',
    code: '2025',
    name: '高雄銀行前金分行',
  },
  {
    bankCode: '016',
    code: '2036',
    name: '高雄銀行三民分行',
  },
  {
    bankCode: '016',
    code: '2081',
    name: '高雄銀行左營分行',
  },
  {
    bankCode: '016',
    code: '2106',
    name: '高雄銀行小港分行',
  },
  {
    bankCode: '016',
    code: '2117',
    name: '高雄銀行桃園分行',
  },
  {
    bankCode: '016',
    code: '2128',
    name: '高雄銀行前鎮分行',
  },
  {
    bankCode: '016',
    code: '2139',
    name: '高雄銀行右昌分行',
  },
  {
    bankCode: '016',
    code: '2140',
    name: '高雄銀行灣內分行',
  },
  {
    bankCode: '016',
    code: '2151',
    name: '高雄銀行屏東分行',
  },
  {
    bankCode: '016',
    code: '2162',
    name: '高雄銀行桂林分行',
  },
  {
    bankCode: '016',
    code: '2173',
    name: '高雄銀行北屯分行',
  },
  {
    bankCode: '016',
    code: '2184',
    name: '高雄銀行楠梓分行',
  },
  {
    bankCode: '016',
    code: '2195',
    name: '高雄銀行鼓山分行',
  },
  {
    bankCode: '016',
    code: '2209',
    name: '高雄銀行建國分行',
  },
  {
    bankCode: '016',
    code: '2210',
    name: '高雄銀行九如分行',
  },
  {
    bankCode: '016',
    code: '2221',
    name: '高雄銀行中壢分行',
  },
  {
    bankCode: '016',
    code: '2232',
    name: '高雄銀行草衙分行',
  },
  {
    bankCode: '016',
    code: '2243',
    name: '高雄銀行板橋分行',
  },
  {
    bankCode: '016',
    code: '2254',
    name: '高雄銀行台南分行',
  },
  {
    bankCode: '016',
    code: '2265',
    name: '高雄銀行三多分行',
  },
  {
    bankCode: '016',
    code: '2276',
    name: '高雄銀行大發分行',
  },
  {
    bankCode: '016',
    code: '2287',
    name: '高雄銀行大直分行',
  },
  {
    bankCode: '016',
    code: '2298',
    name: '高雄銀行台中分行',
  },
  {
    bankCode: '016',
    code: '2302',
    name: '高雄銀行國際金融業務分行',
  },
  {
    bankCode: '016',
    code: '2313',
    name: '高雄銀行旗津簡易型分行',
  },
  {
    bankCode: '016',
    code: '2324',
    name: '高雄銀行南高雄分行',
  },
  {
    bankCode: '016',
    code: '2335',
    name: '高雄銀行大里分行',
  },
  {
    bankCode: '016',
    code: '2346',
    name: '高雄銀行新竹分行',
  },
  {
    bankCode: '016',
    code: '2357',
    name: '高雄銀行市府分行',
  },
  {
    bankCode: '016',
    code: '2379',
    name: '高雄銀行中和分行',
  },
  {
    bankCode: '016',
    code: '2380',
    name: '高雄銀行台北分行',
  },
  {
    bankCode: '016',
    code: '2405',
    name: '高雄銀行明誠分行',
  },
  {
    bankCode: '016',
    code: '2416',
    name: '高雄銀行北高雄分行',
  },
  {
    bankCode: '016',
    code: '2450',
    name: '高雄銀行博愛分行',
  },
  {
    bankCode: '017',
    code: '0022',
    name: '兆豐國際商業銀行港都分行',
  },
  {
    bankCode: '017',
    code: '0033',
    name: '兆豐國際商業銀行楠梓分行',
  },
  {
    bankCode: '017',
    code: '0044',
    name: '兆豐國際商業銀行台中分行',
  },
  {
    bankCode: '017',
    code: '0055',
    name: '兆豐國際商業銀行忠孝分行',
  },
  {
    bankCode: '017',
    code: '0066',
    name: '兆豐國際商業銀行府城分行',
  },
  {
    bankCode: '017',
    code: '0077',
    name: '兆豐國際商業銀行國外部',
  },
  {
    bankCode: '017',
    code: '0088',
    name: '兆豐國際商業銀行台北復興分行',
  },
  {
    bankCode: '017',
    code: '0103',
    name: '兆豐國際商業銀行蘭雅分行',
  },
  {
    bankCode: '017',
    code: '0125',
    name: '兆豐國際商業銀行三重分行',
  },
  {
    bankCode: '017',
    code: '0136',
    name: '兆豐國際商業銀行新興分行',
  },
  {
    bankCode: '017',
    code: '0147',
    name: '兆豐國際商業銀行桃園分行',
  },
  {
    bankCode: '017',
    code: '0158',
    name: '兆豐國際商業銀行中山分行',
  },
  {
    bankCode: '017',
    code: '0169',
    name: '兆豐國際商銀高雄加工出口區分行',
  },
  {
    bankCode: '017',
    code: '0170',
    name: '兆豐國際商業銀行城中分行',
  },
  {
    bankCode: '017',
    code: '0181',
    name: '兆豐國際商業銀行北彰化分行',
  },
  {
    bankCode: '017',
    code: '0192',
    name: '兆豐國際商業銀行安和分行',
  },
  {
    bankCode: '017',
    code: '0206',
    name: '兆豐國際商業銀行竹科新安分行',
  },
  {
    bankCode: '017',
    code: '0217',
    name: '兆豐國際商業銀行天母分行',
  },
  {
    bankCode: '017',
    code: '0228',
    name: '兆豐國際商業銀行嘉義分行',
  },
  {
    bankCode: '017',
    code: '0239',
    name: '兆豐國際商業銀行花蓮分行',
  },
  {
    bankCode: '017',
    code: '0240',
    name: '兆豐國際商業銀行信託處',
  },
  {
    bankCode: '017',
    code: '0251',
    name: '兆豐國際商銀國際金融業務分行',
  },
  {
    bankCode: '017',
    code: '0262',
    name: '兆豐國際商業銀行北新竹分行',
  },
  {
    bankCode: '017',
    code: '0273',
    name: '兆豐國際商業銀行板南分行',
  },
  {
    bankCode: '017',
    code: '0284',
    name: '兆豐國際商業銀行潭子分行',
  },
  {
    bankCode: '017',
    code: '0295',
    name: '兆豐國際商銀桃園國際機場分行',
  },
  {
    bankCode: '017',
    code: '0309',
    name: '兆豐國際商業銀行南台北分行',
  },
  {
    bankCode: '017',
    code: '0310',
    name: '兆豐國際商業銀行敦南分行',
  },
  {
    bankCode: '017',
    code: '0321',
    name: '兆豐國際商業銀行員林分行',
  },
  {
    bankCode: '017',
    code: '0343',
    name: '兆豐國際商業銀行永和分行',
  },
  {
    bankCode: '017',
    code: '0354',
    name: '兆豐國際商業銀行豐原分行',
  },
  {
    bankCode: '017',
    code: '0365',
    name: '兆豐國際商業銀行民生分行',
  },
  {
    bankCode: '017',
    code: '0376',
    name: '兆豐國際商業銀行北台中分行',
  },
  {
    bankCode: '017',
    code: '0387',
    name: '兆豐國際商業銀行三多分行',
  },
  {
    bankCode: '017',
    code: '0398',
    name: '兆豐國際商業銀行中壢分行',
  },
  {
    bankCode: '017',
    code: '0402',
    name: '兆豐國際商業銀行三民分行',
  },
  {
    bankCode: '017',
    code: '0413',
    name: '兆豐國際商業銀行新莊分行',
  },
  {
    bankCode: '017',
    code: '0424',
    name: '兆豐國際商業銀行松南分行',
  },
  {
    bankCode: '017',
    code: '0435',
    name: '兆豐國際商業銀行大同分行',
  },
  {
    bankCode: '017',
    code: '0446',
    name: '兆豐國際商業銀行南台中分行',
  },
  {
    bankCode: '017',
    code: '0457',
    name: '兆豐國際商業銀行鳳山分行',
  },
  {
    bankCode: '017',
    code: '0468',
    name: '兆豐國際商業銀行新店分行',
  },
  {
    bankCode: '017',
    code: '0479',
    name: '兆豐國際商業銀行東高雄分行',
  },
  {
    bankCode: '017',
    code: '0480',
    name: '兆豐國際商業銀行信義分行',
  },
  {
    bankCode: '017',
    code: '0491',
    name: '兆豐國際商業銀行基隆分行',
  },
  {
    bankCode: '017',
    code: '0505',
    name: '兆豐國際商業銀行永康分行',
  },
  {
    bankCode: '017',
    code: '0516',
    name: '兆豐國際商業銀行內湖分行',
  },
  {
    bankCode: '017',
    code: '0527',
    name: '兆豐國際商業銀行岡山分行',
  },
  {
    bankCode: '017',
    code: '0538',
    name: '兆豐國際商業銀行屏東分行',
  },
  {
    bankCode: '017',
    code: '0550',
    name: '兆豐國際商業銀行松山機場分行',
  },
  {
    bankCode: '017',
    code: '0561',
    name: '兆豐國際商業銀行土城分行',
  },
  {
    bankCode: '017',
    code: '0572',
    name: '兆豐國際商業銀行大稻埕分行',
  },
  {
    bankCode: '017',
    code: '0583',
    name: '兆豐國際商業銀行頭份分行',
  },
  {
    bankCode: '017',
    code: '0594',
    name: '兆豐國際商業銀行苓雅分行',
  },
  {
    bankCode: '017',
    code: '0608',
    name: '兆豐國際商業銀行沙鹿分行',
  },
  {
    bankCode: '017',
    code: '0619',
    name: '兆豐國際商業銀行八德分行',
  },
  {
    bankCode: '017',
    code: '0620',
    name: '兆豐國際商業銀行宜蘭分行',
  },
  {
    bankCode: '017',
    code: '0631',
    name: '兆豐國際商業銀行斗六分行',
  },
  {
    bankCode: '017',
    code: '0642',
    name: '兆豐國際商業銀行南投分行',
  },
  {
    bankCode: '017',
    code: '0653',
    name: '兆豐國際商業銀行東台南分行',
  },
  {
    bankCode: '017',
    code: '0664',
    name: '兆豐國際商銀高雄國際機場分行',
  },
  {
    bankCode: '017',
    code: '0675',
    name: '兆豐國際商業銀行東內湖分行',
  },
  {
    bankCode: '017',
    code: '0686',
    name: '兆豐國際商業銀行太平分行',
  },
  {
    bankCode: '017',
    code: '0697',
    name: '兆豐國際商業銀行中和分行',
  },
  {
    bankCode: '017',
    code: '0701',
    name: '兆豐國際商業銀行南京東路分行',
  },
  {
    bankCode: '017',
    code: '0712',
    name: '兆豐國際商業銀行東台中分行',
  },
  {
    bankCode: '017',
    code: '0723',
    name: '兆豐國際商業銀行北高雄分行',
  },
  {
    bankCode: '017',
    code: '0745',
    name: '兆豐國際商業銀行南港分行',
  },
  {
    bankCode: '017',
    code: '0756',
    name: '兆豐國際商業銀行竹南科學園區分行',
  },
  {
    bankCode: '017',
    code: '0767',
    name: '兆豐國際商業銀行中科分行',
  },
  {
    bankCode: '017',
    code: '0778',
    name: '兆豐國際商業銀行大甲分行',
  },
  {
    bankCode: '017',
    code: '0789',
    name: '兆豐國際商業銀行成功簡易型分行',
  },
  {
    bankCode: '017',
    code: '0790',
    name: '兆豐國際商業銀行金門分行',
  },
  {
    bankCode: '017',
    code: '0804',
    name: '兆豐國際商業銀行南崁分行',
  },
  {
    bankCode: '017',
    code: '0815',
    name: '兆豐國際商業銀行中鋼簡易型分行',
  },
  {
    bankCode: '017',
    code: '0837',
    name: '兆豐國際商業銀行榮總分行',
  },
  {
    bankCode: '017',
    code: '0860',
    name: '兆豐國際商銀駐外交部簡易型分行',
  },
  {
    bankCode: '017',
    code: '1030',
    name: '兆豐國際商業銀行仁武分行',
  },
  {
    bankCode: '017',
    code: '1166',
    name: '兆豐國際商銀高雄漁港簡易型分行',
  },
  {
    bankCode: '017',
    code: '2015',
    name: '兆豐國際商業銀行金控總部分行',
  },
  {
    bankCode: '017',
    code: '2026',
    name: '兆豐國際商業銀行台北分行',
  },
  {
    bankCode: '017',
    code: '2037',
    name: '兆豐國際商業銀行新竹分行',
  },
  {
    bankCode: '017',
    code: '2048',
    name: '兆豐國際商業銀行中台中分行',
  },
  {
    bankCode: '017',
    code: '2059',
    name: '兆豐國際商業銀行高雄分行',
  },
  {
    bankCode: '017',
    code: '2060',
    name: '兆豐國際商業銀行板橋分行',
  },
  {
    bankCode: '017',
    code: '2071',
    name: '兆豐國際商業銀行桃興分行',
  },
  {
    bankCode: '017',
    code: '2082',
    name: '兆豐國際商業銀行竹北分行',
  },
  {
    bankCode: '017',
    code: '2107',
    name: '兆豐國際商業銀行敦化分行',
  },
  {
    bankCode: '017',
    code: '2129',
    name: '兆豐國際商業銀行嘉興分行',
  },
  {
    bankCode: '017',
    code: '2130',
    name: '兆豐國際商業銀行台南分行',
  },
  {
    bankCode: '017',
    code: '2141',
    name: '兆豐國際商業銀行寶成分行',
  },
  {
    bankCode: '017',
    code: '2152',
    name: '兆豐國際商業銀行竹科竹村分行',
  },
  {
    bankCode: '017',
    code: '2163',
    name: '兆豐國際商業銀行世貿分行',
  },
  {
    bankCode: '017',
    code: '2196',
    name: '兆豐國際商業銀行南三重分行',
  },
  {
    bankCode: '017',
    code: '2200',
    name: '兆豐國際商業銀行南彰化分行',
  },
  {
    bankCode: '017',
    code: '2266',
    name: '兆豐國際商業銀行城東分行',
  },
  {
    bankCode: '017',
    code: '2277',
    name: '兆豐國際商業銀行五福分行',
  },
  {
    bankCode: '017',
    code: '2288',
    name: '兆豐國際商業銀行羅東分行',
  },
  {
    bankCode: '017',
    code: '2299',
    name: '兆豐國際商業銀行大安分行',
  },
  {
    bankCode: '017',
    code: '2314',
    name: '兆豐國際商業銀行城北分行',
  },
  {
    bankCode: '017',
    code: '2325',
    name: '兆豐國際商業銀行后里分行',
  },
  {
    bankCode: '017',
    code: '2336',
    name: '兆豐國際商業銀行鹿港分行',
  },
  {
    bankCode: '017',
    code: '2347',
    name: '兆豐國際商業銀行圓山分行',
  },
  {
    bankCode: '017',
    code: '2358',
    name: '兆豐國際商業銀行思源分行',
  },
  {
    bankCode: '017',
    code: '2369',
    name: '兆豐國際商業銀行北中壢分行',
  },
  {
    bankCode: '017',
    code: '2370',
    name: '兆豐國際商業銀行內湖科學園區分行',
  },
  {
    bankCode: '017',
    code: '2381',
    name: '兆豐國際商業銀行雙和分行',
  },
  {
    bankCode: '017',
    code: '2406',
    name: '兆豐國際商業銀行衡陽分行',
  },
  {
    bankCode: '017',
    code: '2417',
    name: '兆豐國際商業銀行大里分行',
  },
  {
    bankCode: '017',
    code: '2428',
    name: '兆豐國際商業銀行台南科學園區分行',
  },
  {
    bankCode: '017',
    code: '8006',
    name: '兆豐國際商業銀行紐約分行',
  },
  {
    bankCode: '017',
    code: '8017',
    name: '兆豐國際商業銀行芝加哥分行',
  },
  {
    bankCode: '017',
    code: '8028',
    name: '兆豐國際商業銀行洛杉磯分行',
  },
  {
    bankCode: '017',
    code: '8039',
    name: '兆豐國際商業銀行巴拿馬分行',
  },
  {
    bankCode: '017',
    code: '8213',
    name: '兆豐國際商業銀行大眾股份有限公司曼谷總行',
  },
  {
    bankCode: '017',
    code: '8224',
    name: '兆豐國際商業銀行東京分行',
  },
  {
    bankCode: '017',
    code: '8235',
    name: '兆豐國際商業銀行大阪分行',
  },
  {
    bankCode: '017',
    code: '8246',
    name: '兆豐國際商業銀行新加坡分行',
  },
  {
    bankCode: '017',
    code: '8257',
    name: '兆豐國際商業銀行馬尼拉分行',
  },
  {
    bankCode: '017',
    code: '8280',
    name: '兆豐國際商業銀行胡志明市分行',
  },
  {
    bankCode: '017',
    code: '8291',
    name: '兆豐國際商業銀行納閩分行',
  },
  {
    bankCode: '017',
    code: '8305',
    name: '兆豐國際商業銀行 蘇州分行',
  },
  {
    bankCode: '017',
    code: '8327',
    name: '兆豐國際商業銀行金邊分行',
  },
  {
    bankCode: '017',
    code: '8338',
    name: '兆豐國際商業銀行金邊機場支行',
  },
  {
    bankCode: '017',
    code: '8349',
    name: '兆豐國際商業銀行蘇州吳江支行',
  },
  {
    bankCode: '017',
    code: '8350',
    name: '兆豐國際商業銀行金邊奧林匹克支行',
  },
  {
    bankCode: '017',
    code: '8361',
    name: '兆豐國際商業銀行寧波分行',
  },
  {
    bankCode: '017',
    code: '8372',
    name: '兆豐國際商業銀行金邊堆谷支行',
  },
  {
    bankCode: '017',
    code: '8383',
    name: '兆豐國際商業銀行昆山支行',
  },
  {
    bankCode: '017',
    code: '8408',
    name: '兆豐國際商業銀行緬甸仰光代表處',
  },
  {
    bankCode: '017',
    code: '8464',
    name: '兆豐國際商業銀行雪梨分行',
  },
  {
    bankCode: '017',
    code: '8475',
    name: '兆豐國際商業銀行布里斯本分行',
  },
  {
    bankCode: '017',
    code: '8486',
    name: '兆豐國際商業銀行墨爾本分行',
  },
  {
    bankCode: '017',
    code: '8497',
    name: '兆豐國際商業銀行倫敦分行',
  },
  {
    bankCode: '017',
    code: '8615',
    name: '兆豐國際商業銀行巴黎分行',
  },
  {
    bankCode: '017',
    code: '8626',
    name: '兆豐國際商業銀行阿姆斯特丹分行',
  },
  {
    bankCode: '017',
    code: '8763',
    name: '兆豐國際商業銀行多倫多分行',
  },
  {
    bankCode: '017',
    code: '8774',
    name: '兆豐國際商業銀行溫哥華分行',
  },
  {
    bankCode: '017',
    code: '8822',
    name: '兆豐國際商業銀行大眾股份有限公司春武里分行',
  },
  {
    bankCode: '017',
    code: '8833',
    name: '兆豐國際商業銀行大眾股份有限公司　挽那分行',
  },
  {
    bankCode: '017',
    code: '8844',
    name: '兆豐國際商業銀行大眾股份有限公司羅勇分行',
  },
  {
    bankCode: '017',
    code: '8947',
    name: '兆豐國際商銀吉隆坡行銷辦事處',
  },
  {
    bankCode: '017',
    code: '8958',
    name: '兆豐國際商業銀行香港分行',
  },
  {
    bankCode: '017',
    code: '8981',
    name: '兆豐國際商業銀行矽谷分行',
  },
  {
    bankCode: '017',
    code: '8992',
    name: '兆豐國際商業銀行孟買代表人辦事處',
  },
  {
    bankCode: '017',
    code: '9014',
    name: '兆豐國際商業銀行大眾股份有限公司萬磅分行',
  },
  {
    bankCode: '021',
    code: '0018',
    name: '花旗(台灣)商業銀行營業部',
  },
  {
    bankCode: '021',
    code: '0030',
    name: '花旗(台灣)商業銀行高雄分行',
  },
  {
    bankCode: '021',
    code: '0041',
    name: '花旗(台灣)商業銀行台中分行',
  },
  {
    bankCode: '021',
    code: '0052',
    name: '花旗(台灣)商業銀行新竹分行',
  },
  {
    bankCode: '021',
    code: '0063',
    name: '花旗(台灣)商業銀行台南分行',
  },
  {
    bankCode: '021',
    code: '0074',
    name: '花旗(台灣)商業銀行桃園分行',
  },
  {
    bankCode: '021',
    code: '0085',
    name: '花旗(台灣)商業銀行松江分行',
  },
  {
    bankCode: '021',
    code: '0096',
    name: '花旗(台灣)商業銀行板橋分行',
  },
  {
    bankCode: '021',
    code: '0100',
    name: '花旗(台灣)商業銀行文心分行',
  },
  {
    bankCode: '021',
    code: '0111',
    name: '花旗(台灣)商業銀行信義分行',
  },
  {
    bankCode: '021',
    code: '0122',
    name: '花旗(台灣)商業銀行天母分行',
  },
  {
    bankCode: '021',
    code: '0133',
    name: '花旗(台灣)商業銀行建成分行',
  },
  {
    bankCode: '021',
    code: '0144',
    name: '花旗(台灣)商業銀行中山分行',
  },
  {
    bankCode: '021',
    code: '0166',
    name: '花旗(台灣)商業銀行永福分行',
  },
  {
    bankCode: '021',
    code: '0177',
    name: '花旗(台灣)商業銀行港都分行',
  },
  {
    bankCode: '021',
    code: '0188',
    name: '花旗(台灣)商業銀行中港分行',
  },
  {
    bankCode: '021',
    code: '0199',
    name: '花旗(台灣)商業銀行襄陽分行',
  },
  {
    bankCode: '021',
    code: '0203',
    name: '花旗(台灣)商業銀行復興分行',
  },
  {
    bankCode: '021',
    code: '0214',
    name: '花旗(台灣)商業銀行新興分行',
  },
  {
    bankCode: '021',
    code: '0225',
    name: '花旗(台灣)商業銀行基隆分行',
  },
  {
    bankCode: '021',
    code: '0236',
    name: '花旗(台灣)商業銀行北桃園分行',
  },
  {
    bankCode: '021',
    code: '0247',
    name: '花旗(台灣)商業銀行永和分行',
  },
  {
    bankCode: '021',
    code: '0258',
    name: '花旗(台灣)商業銀行豐原分行',
  },
  {
    bankCode: '021',
    code: '0269',
    name: '花旗(台灣)商業銀行民權分行',
  },
  {
    bankCode: '021',
    code: '0281',
    name: '花旗(台灣)商業銀行苓雅分行',
  },
  {
    bankCode: '021',
    code: '0292',
    name: '花旗(台灣)商業銀行松山分行',
  },
  {
    bankCode: '021',
    code: '0306',
    name: '花旗(台灣)商業銀行三重分行',
  },
  {
    bankCode: '021',
    code: '0317',
    name: '花旗(台灣)商業銀行員林分行',
  },
  {
    bankCode: '021',
    code: '0328',
    name: '花旗(台灣)商業銀行士林分行',
  },
  {
    bankCode: '021',
    code: '0340',
    name: '花旗(台灣)商業銀行中壢分行',
  },
  {
    bankCode: '021',
    code: '0351',
    name: '花旗(台灣)商業銀行大安分行',
  },
  {
    bankCode: '021',
    code: '0362',
    name: '花旗(台灣)商業銀行竹城分行',
  },
  {
    bankCode: '021',
    code: '0373',
    name: '花旗(台灣)商業銀行嘉義分行',
  },
  {
    bankCode: '021',
    code: '0384',
    name: '花旗(台灣)商業銀行北台中分行',
  },
  {
    bankCode: '021',
    code: '0395',
    name: '花旗(台灣)商業銀行北高雄分行',
  },
  {
    bankCode: '021',
    code: '0409',
    name: '花旗(台灣)商業銀行新莊分行',
  },
  {
    bankCode: '021',
    code: '0410',
    name: '花旗(台灣)商業銀行民生分行',
  },
  {
    bankCode: '021',
    code: '0421',
    name: '花旗(台灣)商業銀行彰化分行',
  },
  {
    bankCode: '021',
    code: '0443',
    name: '花旗(台灣)商業銀行新店分行',
  },
  {
    bankCode: '021',
    code: '0465',
    name: '花旗(台灣)商業銀行高美館分行',
  },
  {
    bankCode: '021',
    code: '0476',
    name: '花旗(台灣)商業銀行南京分行',
  },
  {
    bankCode: '021',
    code: '0502',
    name: '花旗(台灣)商業銀行中正分行',
  },
  {
    bankCode: '021',
    code: '0513',
    name: '花旗(台灣)商業銀行永康分行',
  },
  {
    bankCode: '021',
    code: '0524',
    name: '花旗(台灣)商業銀行羅東分行',
  },
  {
    bankCode: '021',
    code: '0535',
    name: '花旗(台灣)商業銀行敦化分行',
  },
  {
    bankCode: '021',
    code: '0579',
    name: '花旗(台灣)商業銀行內湖分行',
  },
  {
    bankCode: '021',
    code: '0580',
    name: '花旗(台灣)商業銀行南港分行',
  },
  {
    bankCode: '021',
    code: '0627',
    name: '花旗(台灣)商業銀行斗六分行',
  },
  {
    bankCode: '021',
    code: '0650',
    name: '花旗(台灣)商業銀行土城分行',
  },
  {
    bankCode: '021',
    code: '0683',
    name: '花旗(台灣)商業銀行國際金融業務分行',
  },
  {
    bankCode: '021',
    code: '0694',
    name: '花旗(台灣)商業銀行信託業務專責部門',
  },
  {
    bankCode: '048',
    code: '0011',
    name: '王道商業銀行股份有限公司總行營業部',
  },
  {
    bankCode: '048',
    code: '0022',
    name: '王道商業銀行股份有限公司信義威秀分行',
  },
  {
    bankCode: '048',
    code: '0033',
    name: '王道商業銀行股份有限公司高雄分行',
  },
  {
    bankCode: '048',
    code: '0055',
    name: '王道商業銀行股份有限公司台中分行',
  },
  {
    bankCode: '048',
    code: '0066',
    name: '王道商業銀行股份有限公司新竹分行',
  },
  {
    bankCode: '048',
    code: '0077',
    name: '王道商業銀行股份有限公司忠孝敦化分行',
  },
  {
    bankCode: '048',
    code: '0088',
    name: '王道商業銀行股份有限公司國際金融業務分行',
  },
  {
    bankCode: '048',
    code: '9896',
    name: '王道商業銀行股份有限公司美國華信銀行Milpitas分行',
  },
  {
    bankCode: '048',
    code: '9900',
    name: '王道商業銀行股份有限公司美國華信銀行Pasadena分行',
  },
  {
    bankCode: '048',
    code: '9911',
    name: '王道商業銀行股份有限公司天津代表處',
  },
  {
    bankCode: '048',
    code: '9922',
    name: '王道商業銀行股份有限公司美國華信銀行Industry分行',
  },
  {
    bankCode: '048',
    code: '9933',
    name: '王道商業銀行股份有限公司美國華信銀行Arcadia分行',
  },
  {
    bankCode: '048',
    code: '9944',
    name: '王道商業銀行股份有限公司美國華信銀行Cupertino分行',
  },
  {
    bankCode: '048',
    code: '9955',
    name: '王道商業銀行股份有限公司美國華信銀行Cerritos分行',
  },
  {
    bankCode: '048',
    code: '9966',
    name: '王道商業銀行股份有限公司美國華信銀行Irvine分行',
  },
  {
    bankCode: '048',
    code: '9977',
    name: '王道商業銀行股份有限公司美國華信銀行Alhambra分行',
  },
  {
    bankCode: '048',
    code: '9988',
    name: '王道商業銀行股份有限公司香港分行',
  },
  {
    bankCode: '048',
    code: '9999',
    name: '王道商業銀行股份有限公司美國華信銀行(EverTrust Bank)',
  },
  {
    bankCode: '050',
    code: '0027',
    name: '臺灣中小企業銀行中和分行',
  },
  {
    bankCode: '050',
    code: '0038',
    name: '臺灣中小企業銀行博愛分行',
  },
  {
    bankCode: '050',
    code: '0049',
    name: '臺灣中小企業銀行北桃園分行',
  },
  {
    bankCode: '050',
    code: '0050',
    name: '臺灣中小企業銀行南崁分行',
  },
  {
    bankCode: '050',
    code: '0061',
    name: '臺灣中小企業銀行西屯分行',
  },
  {
    bankCode: '050',
    code: '0072',
    name: '臺灣中小企業銀行忠明分行',
  },
  {
    bankCode: '050',
    code: '0094',
    name: '臺灣中小企業銀行金門分行',
  },
  {
    bankCode: '050',
    code: '0108',
    name: '臺灣中小企業銀行營業部',
  },
  {
    bankCode: '050',
    code: '0119',
    name: '臺灣中小企業銀行大雅分行',
  },
  {
    bankCode: '050',
    code: '0120',
    name: '臺灣中小企業銀行仁大分行',
  },
  {
    bankCode: '050',
    code: '0201',
    name: '臺灣中小企業銀行仁愛分行',
  },
  {
    bankCode: '050',
    code: '0212',
    name: '臺灣中小企業銀行松山分行',
  },
  {
    bankCode: '050',
    code: '0223',
    name: '臺灣中小企業銀行建成分行',
  },
  {
    bankCode: '050',
    code: '0234',
    name: '臺灣中小企業銀行士林分行',
  },
  {
    bankCode: '050',
    code: '0245',
    name: '臺灣中小企業銀行永和分行',
  },
  {
    bankCode: '050',
    code: '0256',
    name: '臺灣中小企業銀行新店分行',
  },
  {
    bankCode: '050',
    code: '0267',
    name: '臺灣中小企業銀行新莊分行',
  },
  {
    bankCode: '050',
    code: '0278',
    name: '臺灣中小企業銀行化成分行',
  },
  {
    bankCode: '050',
    code: '0304',
    name: '臺灣中小企業銀行信託部',
  },
  {
    bankCode: '050',
    code: '0359',
    name: '臺灣中小企業銀行證券部',
  },
  {
    bankCode: '050',
    code: '0407',
    name: '臺灣中小企業銀行松江分行',
  },
  {
    bankCode: '050',
    code: '0418',
    name: '臺灣中小企業銀行國際部',
  },
  {
    bankCode: '050',
    code: '0500',
    name: '臺灣中小企業銀行台北分行',
  },
  {
    bankCode: '050',
    code: '0603',
    name: '臺灣中小企業銀行萬華分行',
  },
  {
    bankCode: '050',
    code: '0614',
    name: '臺灣中小企業銀行南台北分行',
  },
  {
    bankCode: '050',
    code: '0706',
    name: '臺灣中小企業銀行復興分行',
  },
  {
    bankCode: '050',
    code: '0809',
    name: '臺灣中小企業銀行中山分行',
  },
  {
    bankCode: '050',
    code: '0080',
    name: '臺灣中小企業銀行建國分行',
  },
  {
    bankCode: '050',
    code: '0821',
    name: '臺灣中小企業銀行內湖分行',
  },
  {
    bankCode: '050',
    code: '0902',
    name: '臺灣中小企業銀行南京東路分行',
  },
  {
    bankCode: '050',
    code: '1002',
    name: '臺灣中小企業銀行忠孝分行',
  },
  {
    bankCode: '050',
    code: '1024',
    name: '臺灣中小企業銀行世貿分行',
  },
  {
    bankCode: '050',
    code: '1035',
    name: '臺灣中小企業銀行永春分行',
  },
  {
    bankCode: '050',
    code: '1057',
    name: '臺灣中小企業銀行南港分行',
  },
  {
    bankCode: '050',
    code: '1105',
    name: '臺灣中小企業銀行松南分行',
  },
  {
    bankCode: '050',
    code: '1116',
    name: '臺灣中小企業銀行東湖分行',
  },
  {
    bankCode: '050',
    code: '1208',
    name: '臺灣中小企業銀行大安分行',
  },
  {
    bankCode: '050',
    code: '1219',
    name: '臺灣中小企業銀行雙和分行',
  },
  {
    bankCode: '050',
    code: '1220',
    name: '臺灣中小企業銀行錦和分行',
  },
  {
    bankCode: '050',
    code: '1301',
    name: '臺灣中小企業銀行五股分行',
  },
  {
    bankCode: '050',
    code: '1312',
    name: '臺灣中小企業銀行林口分行',
  },
  {
    bankCode: '050',
    code: '1323',
    name: '臺灣中小企業銀行東林口分行',
  },
  {
    bankCode: '050',
    code: '1404',
    name: '臺灣中小企業銀行板橋分行',
  },
  {
    bankCode: '050',
    code: '1415',
    name: '臺灣中小企業銀行樹林分行',
  },
  {
    bankCode: '050',
    code: '1426',
    name: '臺灣中小企業銀行土城分行',
  },
  {
    bankCode: '050',
    code: '1437',
    name: '臺灣中小企業銀行迴龍分行',
  },
  {
    bankCode: '050',
    code: '1448',
    name: '臺灣中小企業銀行汐止分行',
  },
  {
    bankCode: '050',
    code: '1482',
    name: '臺灣中小企業銀行三峽分行',
  },
  {
    bankCode: '050',
    code: '1507',
    name: '臺灣中小企業銀行基隆分行',
  },
  {
    bankCode: '050',
    code: '1518',
    name: '臺灣中小企業銀行埔墘分行',
  },
  {
    bankCode: '050',
    code: '1529',
    name: '臺灣中小企業銀行北三重分行',
  },
  {
    bankCode: '050',
    code: '1530',
    name: '臺灣中小企業銀行南三重分行',
  },
  {
    bankCode: '050',
    code: '1541',
    name: '臺灣中小企業銀行蘆洲分行',
  },
  {
    bankCode: '050',
    code: '1600',
    name: '臺灣中小企業銀行宜蘭分行',
  },
  {
    bankCode: '050',
    code: '1703',
    name: '臺灣中小企業銀行羅東分行',
  },
  {
    bankCode: '050',
    code: '1714',
    name: '臺灣中小企業銀行蘇澳分行',
  },
  {
    bankCode: '050',
    code: '2906',
    name: '臺灣中小企業銀行楊梅分行',
  },
  {
    bankCode: '050',
    code: '2917',
    name: '臺灣中小企業銀行湖口分行',
  },
  {
    bankCode: '050',
    code: '3006',
    name: '臺灣中小企業銀行桃園分行',
  },
  {
    bankCode: '050',
    code: '3017',
    name: '臺灣中小企業銀行大園分行',
  },
  {
    bankCode: '050',
    code: '3028',
    name: '臺灣中小企業銀行大溪分行',
  },
  {
    bankCode: '050',
    code: '3109',
    name: '臺灣中小企業銀行中壢分行',
  },
  {
    bankCode: '050',
    code: '3110',
    name: '臺灣中小企業銀行內壢分行',
  },
  {
    bankCode: '050',
    code: '3121',
    name: '臺灣中小企業銀行新明分行',
  },
  {
    bankCode: '050',
    code: '3132',
    name: '臺灣中小企業銀行東桃園分行',
  },
  {
    bankCode: '050',
    code: '3154',
    name: '臺灣中小企業銀行新屋分行',
  },
  {
    bankCode: '050',
    code: '3202',
    name: '臺灣中小企業銀行新竹分行',
  },
  {
    bankCode: '050',
    code: '3213',
    name: '臺灣中小企業銀行竹北分行',
  },
  {
    bankCode: '050',
    code: '3224',
    name: '臺灣中小企業銀行竹科分行',
  },
  {
    bankCode: '050',
    code: '3305',
    name: '臺灣中小企業銀行八德分行',
  },
  {
    bankCode: '050',
    code: '3327',
    name: '臺灣中小企業銀行龍潭分行',
  },
  {
    bankCode: '050',
    code: '3408',
    name: '臺灣中小企業銀行竹東分行',
  },
  {
    bankCode: '050',
    code: '3501',
    name: '臺灣中小企業銀行竹南分行',
  },
  {
    bankCode: '050',
    code: '3512',
    name: '臺灣中小企業銀行頭份分行',
  },
  {
    bankCode: '050',
    code: '3604',
    name: '臺灣中小企業銀行苗栗分行',
  },
  {
    bankCode: '050',
    code: '4601',
    name: '臺灣中小企業銀行豐原分行',
  },
  {
    bankCode: '050',
    code: '4704',
    name: '臺灣中小企業銀行太平分行',
  },
  {
    bankCode: '050',
    code: '4807',
    name: '臺灣中小企業銀行大甲分行',
  },
  {
    bankCode: '050',
    code: '4829',
    name: '臺灣中小企業銀行沙鹿分行',
  },
  {
    bankCode: '050',
    code: '4830',
    name: '臺灣中小企業銀行烏日分行',
  },
  {
    bankCode: '050',
    code: '4900',
    name: '臺灣中小企業銀行台中分行',
  },
  {
    bankCode: '050',
    code: '4911',
    name: '臺灣中小企業銀行民權分行',
  },
  {
    bankCode: '050',
    code: '5000',
    name: '臺灣中小企業銀行興中分行',
  },
  {
    bankCode: '050',
    code: '5011',
    name: '臺灣中小企業銀行北屯分行',
  },
  {
    bankCode: '050',
    code: '5103',
    name: '臺灣中小企業銀行南投分行',
  },
  {
    bankCode: '050',
    code: '5114',
    name: '臺灣中小企業銀行草屯分行',
  },
  {
    bankCode: '050',
    code: '5206',
    name: '臺灣中小企業銀行埔里分行',
  },
  {
    bankCode: '050',
    code: '5217',
    name: '臺灣中小企業銀行潭子分行',
  },
  {
    bankCode: '050',
    code: '5309',
    name: '臺灣中小企業銀行竹山分行',
  },
  {
    bankCode: '050',
    code: '5402',
    name: '臺灣中小企業銀行彰化分行',
  },
  {
    bankCode: '050',
    code: '5413',
    name: '臺灣中小企業銀行和美分行',
  },
  {
    bankCode: '050',
    code: '5505',
    name: '臺灣中小企業銀行員林分行',
  },
  {
    bankCode: '050',
    code: '5608',
    name: '臺灣中小企業銀行北斗分行',
  },
  {
    bankCode: '050',
    code: '5619',
    name: '臺灣中小企業銀行二林分行',
  },
  {
    bankCode: '050',
    code: '6605',
    name: '臺灣中小企業銀行斗六分行',
  },
  {
    bankCode: '050',
    code: '6708',
    name: '臺灣中小企業銀行北港分行',
  },
  {
    bankCode: '050',
    code: '6719',
    name: '臺灣中小企業銀行虎尾分行',
  },
  {
    bankCode: '050',
    code: '6801',
    name: '臺灣中小企業銀行嘉義分行',
  },
  {
    bankCode: '050',
    code: '6812',
    name: '臺灣中小企業銀行民雄分行',
  },
  {
    bankCode: '050',
    code: '6867',
    name: '臺灣中小企業銀行嘉新分行',
  },
  {
    bankCode: '050',
    code: '6904',
    name: '臺灣中小企業銀行新營分行',
  },
  {
    bankCode: '050',
    code: '6915',
    name: '臺灣中小企業銀行開元分行',
  },
  {
    bankCode: '050',
    code: '7004',
    name: '臺灣中小企業銀行永康分行',
  },
  {
    bankCode: '050',
    code: '7015',
    name: '臺灣中小企業銀行學甲分行',
  },
  {
    bankCode: '050',
    code: '7026',
    name: '臺灣中小企業銀行善化分行',
  },
  {
    bankCode: '050',
    code: '7037',
    name: '臺灣中小企業銀行永大分行',
  },
  {
    bankCode: '050',
    code: '7107',
    name: '臺灣中小企業銀行台南分行',
  },
  {
    bankCode: '050',
    code: '7118',
    name: '臺灣中小企業銀行仁德分行',
  },
  {
    bankCode: '050',
    code: '7200',
    name: '臺灣中小企業銀行成功分行',
  },
  {
    bankCode: '050',
    code: '7211',
    name: '臺灣中小企業銀行東台南分行',
  },
  {
    bankCode: '050',
    code: '7303',
    name: '臺灣中小企業銀行安平分行',
  },
  {
    bankCode: '050',
    code: '7602',
    name: '臺灣中小企業銀行花蓮分行',
  },
  {
    bankCode: '050',
    code: '7705',
    name: '臺灣中小企業銀行台東分行',
  },
  {
    bankCode: '050',
    code: '8207',
    name: '臺灣中小企業銀行東高雄分行',
  },
  {
    bankCode: '050',
    code: '8300',
    name: '臺灣中小企業銀行岡山分行',
  },
  {
    bankCode: '050',
    code: '8403',
    name: '臺灣中小企業銀行北鳳山分行',
  },
  {
    bankCode: '050',
    code: '8414',
    name: '臺灣中小企業銀行苓雅分行',
  },
  {
    bankCode: '050',
    code: '8506',
    name: '臺灣中小企業銀行高雄分行',
  },
  {
    bankCode: '050',
    code: '8517',
    name: '臺灣中小企業銀行北高雄分行',
  },
  {
    bankCode: '050',
    code: '8528',
    name: '臺灣中小企業銀行大昌分行',
  },
  {
    bankCode: '050',
    code: '8539',
    name: '臺灣中小企業銀行前鎮分行',
  },
  {
    bankCode: '050',
    code: '8609',
    name: '臺灣中小企業銀行九如分行',
  },
  {
    bankCode: '050',
    code: '8702',
    name: '臺灣中小企業銀行三民分行',
  },
  {
    bankCode: '050',
    code: '8805',
    name: '臺灣中小企業銀行鳳山分行',
  },
  {
    bankCode: '050',
    code: '8816',
    name: '臺灣中小企業銀行大發分行',
  },
  {
    bankCode: '050',
    code: '8908',
    name: '臺灣中小企業銀行屏東分行',
  },
  {
    bankCode: '050',
    code: '8919',
    name: '臺灣中小企業銀行小港分行',
  },
  {
    bankCode: '050',
    code: '8920',
    name: '臺灣中小企業銀行潮州分行',
  },
  {
    bankCode: '050',
    code: '8931',
    name: '臺灣中小企業銀行國際金融業務分行',
  },
  {
    bankCode: '050',
    code: '9008',
    name: '臺灣中小企業銀行洛杉磯分行',
  },
  {
    bankCode: '050',
    code: '9019',
    name: '臺灣中小企業銀行香港分行',
  },
  {
    bankCode: '050',
    code: '9020',
    name: '臺灣中小企業銀行雪梨分行',
  },
  {
    bankCode: '050',
    code: '9053',
    name: '臺灣中小企業銀行上海分行',
  },
  {
    bankCode: '050',
    code: '9064',
    name: '臺灣中小企業銀行布里斯本分行',
  },
  {
    bankCode: '050',
    code: '9075',
    name: '臺灣中小企業銀行紐約分行',
  },
  {
    bankCode: '050',
    code: '9086',
    name: '臺灣中小企業銀行武漢分行',
  },
  {
    bankCode: '050',
    code: '9101',
    name: '臺灣中小企業銀行東京分行',
  },
  {
    bankCode: '050',
    code: '9503',
    name: '臺灣中小企業銀行仰光代表人辦事處',
  },
  {
    bankCode: '052',
    code: '0041',
    name: '渣打國際商業銀行中壢分行',
  },
  {
    bankCode: '052',
    code: '0052',
    name: '渣打國際商業銀行竹東分行',
  },
  {
    bankCode: '052',
    code: '0063',
    name: '渣打國際商業銀行竹南分行',
  },
  {
    bankCode: '052',
    code: '0074',
    name: '渣打國際商業銀行苗栗分行',
  },
  {
    bankCode: '052',
    code: '0096',
    name: '渣打國際商業銀行頭份分行',
  },
  {
    bankCode: '052',
    code: '0111',
    name: '渣打國際商業銀行楊梅分行',
  },
  {
    bankCode: '052',
    code: '0122',
    name: '渣打國際商業銀行新屋分行',
  },
  {
    bankCode: '052',
    code: '0133',
    name: '渣打國際商業銀行湖口分行',
  },
  {
    bankCode: '052',
    code: '0144',
    name: '渣打國際商業銀行苑裡分行',
  },
  {
    bankCode: '052',
    code: '0166',
    name: '渣打國際商業銀行龍潭分行',
  },
  {
    bankCode: '052',
    code: '0177',
    name: '渣打國際商業銀行竹北分行',
  },
  {
    bankCode: '052',
    code: '0199',
    name: '渣打國際商業銀行三民分行',
  },
  {
    bankCode: '052',
    code: '0203',
    name: '渣打國際商業銀行內壢分行',
  },
  {
    bankCode: '052',
    code: '0214',
    name: '渣打國際商業銀行八德分行',
  },
  {
    bankCode: '052',
    code: '0225',
    name: '渣打國際商業銀行新明分行',
  },
  {
    bankCode: '052',
    code: '0247',
    name: '渣打國際商業銀行公館分行',
  },
  {
    bankCode: '052',
    code: '0269',
    name: '渣打國際商業銀行後龍分行',
  },
  {
    bankCode: '052',
    code: '0270',
    name: '渣打國際商業銀行龜山分行',
  },
  {
    bankCode: '052',
    code: '0281',
    name: '渣打國際商業銀行南崁分行',
  },
  {
    bankCode: '052',
    code: '0317',
    name: '渣打國際商業銀行大樹林分行',
  },
  {
    bankCode: '052',
    code: '0328',
    name: '渣打國際商業銀行光復分行',
  },
  {
    bankCode: '052',
    code: '0351',
    name: '渣打國際商業銀行龍岡分行',
  },
  {
    bankCode: '052',
    code: '0362',
    name: '渣打國際商業銀行山子頂分行',
  },
  {
    bankCode: '052',
    code: '0373',
    name: '渣打國際商業銀行埔心分行',
  },
  {
    bankCode: '052',
    code: '0384',
    name: '渣打國際商業銀行新豐分行',
  },
  {
    bankCode: '052',
    code: '0454',
    name: '渣打國際商業銀行中正分行',
  },
  {
    bankCode: '052',
    code: '0476',
    name: '渣打國際商業銀行環北分行',
  },
  {
    bankCode: '052',
    code: '0513',
    name: '渣打國際商業銀行新興分行',
  },
  {
    bankCode: '052',
    code: '0524',
    name: '渣打國際商業銀行新社分行',
  },
  {
    bankCode: '052',
    code: '0546',
    name: '渣打國際商業銀行科學園區分行',
  },
  {
    bankCode: '052',
    code: '0579',
    name: '渣打國際商業銀行北新竹分行',
  },
  {
    bankCode: '052',
    code: '0591',
    name: '渣打國際商業銀行平鎮分行',
  },
  {
    bankCode: '052',
    code: '0649',
    name: '渣打國際商業銀行東內壢分行',
  },
  {
    bankCode: '052',
    code: '0650',
    name: '渣打國際商業銀行信託部',
  },
  {
    bankCode: '052',
    code: '0661',
    name: '渣打國際商業銀行國際金融業務分行',
  },
  {
    bankCode: '052',
    code: '0672',
    name: '渣打國際商業銀行101分行',
  },
  {
    bankCode: '052',
    code: '0683',
    name: '渣打國際商業銀行公西分行',
  },
  {
    bankCode: '052',
    code: '0708',
    name: '渣打國際商業銀行莊敬分行',
  },
  {
    bankCode: '052',
    code: '0719',
    name: '渣打國際商業銀行板橋分行',
  },
  {
    bankCode: '052',
    code: '0731',
    name: '渣打國際商業銀行豐原分行',
  },
  {
    bankCode: '052',
    code: '0742',
    name: '渣打國際商業銀行文心分行',
  },
  {
    bankCode: '052',
    code: '0753',
    name: '渣打國際商業銀行內湖分行',
  },
  {
    bankCode: '052',
    code: '0764',
    name: '渣打國際商業銀行九如分行',
  },
  {
    bankCode: '052',
    code: '0775',
    name: '渣打國際商業銀行台南分行',
  },
  {
    bankCode: '052',
    code: '0797',
    name: '渣打國際商業銀行南屯分行',
  },
  {
    bankCode: '052',
    code: '0812',
    name: '渣打國際商業銀行東寧分行',
  },
  {
    bankCode: '052',
    code: '0823',
    name: '渣打國際商業銀行東海分行',
  },
  {
    bankCode: '052',
    code: '0878',
    name: '渣打國際商業銀行北屯分行',
  },
  {
    bankCode: '052',
    code: '0889',
    name: '渣打國際商業銀行西屯分行',
  },
  {
    bankCode: '052',
    code: '0926',
    name: '渣打國際商業銀行彰化分行',
  },
  {
    bankCode: '052',
    code: '0959',
    name: '渣打國際商業銀行營業部',
  },
  {
    bankCode: '052',
    code: '0960',
    name: '渣打國際商業銀行北高雄分行',
  },
  {
    bankCode: '052',
    code: '0971',
    name: '渣打國際商業銀行台中分行',
  },
  {
    bankCode: '052',
    code: '0982',
    name: '渣打國際商業銀行高雄分行',
  },
  {
    bankCode: '052',
    code: '1015',
    name: '渣打國際商業銀行復興分行',
  },
  {
    bankCode: '052',
    code: '1037',
    name: '渣打國際商業銀行中清分行',
  },
  {
    bankCode: '052',
    code: '1060',
    name: '渣打國際商業銀三多分行',
  },
  {
    bankCode: '052',
    code: '1071',
    name: '渣打國際商業銀行東台南分行',
  },
  {
    bankCode: '052',
    code: '1093',
    name: '渣打國際商業銀行南京分行',
  },
  {
    bankCode: '052',
    code: '1118',
    name: '渣打國際商業銀行信義分行',
  },
  {
    bankCode: '052',
    code: '1129',
    name: '渣打國際商業銀行東台北分行',
  },
  {
    bankCode: '052',
    code: '1141',
    name: '渣打國際商業銀行敦化分行',
  },
  {
    bankCode: '052',
    code: '1152',
    name: '渣打國際商業銀行天母分行',
  },
  {
    bankCode: '052',
    code: '1163',
    name: '渣打國際商業銀行仁愛分行',
  },
  {
    bankCode: '052',
    code: '1185',
    name: '渣打國際商業銀行中山分行',
  },
  {
    bankCode: '052',
    code: '1196',
    name: '渣打國際商業銀行古亭分行',
  },
  {
    bankCode: '052',
    code: '1200',
    name: '渣打國際商業銀行大直分行',
  },
  {
    bankCode: '052',
    code: '1211',
    name: '渣打國際商業銀行金山分行',
  },
  {
    bankCode: '053',
    code: '0019',
    name: '台中商業銀行中正分行',
  },
  {
    bankCode: '053',
    code: '0020',
    name: '台中商業銀行營業部',
  },
  {
    bankCode: '053',
    code: '0042',
    name: '台中商業銀行南台中分行',
  },
  {
    bankCode: '053',
    code: '0053',
    name: '台中商業銀行霧峰分行',
  },
  {
    bankCode: '053',
    code: '0064',
    name: '台中商業銀行大甲分行',
  },
  {
    bankCode: '053',
    code: '0075',
    name: '台中商業銀行沙鹿分行',
  },
  {
    bankCode: '053',
    code: '0086',
    name: '台中商業銀行豐原分行',
  },
  {
    bankCode: '053',
    code: '0097',
    name: '台中商業銀行東勢分行',
  },
  {
    bankCode: '053',
    code: '0101',
    name: '台中商業銀行彰化分行',
  },
  {
    bankCode: '053',
    code: '0112',
    name: '台中商業銀行溪湖分行',
  },
  {
    bankCode: '053',
    code: '0123',
    name: '台中商業銀行員林分行',
  },
  {
    bankCode: '053',
    code: '0134',
    name: '台中商業銀行田中分行',
  },
  {
    bankCode: '053',
    code: '0145',
    name: '台中商業銀行北斗分行',
  },
  {
    bankCode: '053',
    code: '0156',
    name: '台中商業銀行二林分行',
  },
  {
    bankCode: '053',
    code: '0167',
    name: '台中商業銀行南投分行',
  },
  {
    bankCode: '053',
    code: '0189',
    name: '台中商業銀行草屯分行',
  },
  {
    bankCode: '053',
    code: '0190',
    name: '台中商業銀行竹山分行',
  },
  {
    bankCode: '053',
    code: '0204',
    name: '台中商業銀行埔里分行',
  },
  {
    bankCode: '053',
    code: '0215',
    name: '台中商業銀行鹿港分行',
  },
  {
    bankCode: '053',
    code: '0226',
    name: '台中商業銀行西台中分行',
  },
  {
    bankCode: '053',
    code: '0237',
    name: '台中商業銀行清水分行',
  },
  {
    bankCode: '053',
    code: '0248',
    name: '台中商業銀行東豐原分行',
  },
  {
    bankCode: '053',
    code: '0259',
    name: '台中商業銀行烏日分行',
  },
  {
    bankCode: '053',
    code: '0271',
    name: '台中商業銀行北台中分行',
  },
  {
    bankCode: '053',
    code: '0318',
    name: '台中商業銀行和美分行',
  },
  {
    bankCode: '053',
    code: '0330',
    name: '台中商業銀行西屯分行',
  },
  {
    bankCode: '053',
    code: '0341',
    name: '台中商業銀行太平分行',
  },
  {
    bankCode: '053',
    code: '0363',
    name: '台中商業銀行大雅分行',
  },
  {
    bankCode: '053',
    code: '0374',
    name: '台中商業銀行后里分行',
  },
  {
    bankCode: '053',
    code: '0385',
    name: '台中商業銀行潭子分行',
  },
  {
    bankCode: '053',
    code: '0396',
    name: '台中商業銀行社頭分行',
  },
  {
    bankCode: '053',
    code: '0400',
    name: '台中商業銀行永靖分行',
  },
  {
    bankCode: '053',
    code: '0411',
    name: '台中商業銀行花壇分行',
  },
  {
    bankCode: '053',
    code: '0422',
    name: '台中商業銀行秀水分行',
  },
  {
    bankCode: '053',
    code: '0444',
    name: '台中商業銀行南屯分行',
  },
  {
    bankCode: '053',
    code: '0455',
    name: '台中商業銀行大肚分行',
  },
  {
    bankCode: '053',
    code: '0466',
    name: '台中商業銀行神岡分行',
  },
  {
    bankCode: '053',
    code: '0477',
    name: '台中商業銀行內新分行',
  },
  {
    bankCode: '053',
    code: '0488',
    name: '台中商業銀行伸港分行',
  },
  {
    bankCode: '053',
    code: '0499',
    name: '台中商業銀行北太平分行',
  },
  {
    bankCode: '053',
    code: '0503',
    name: '台中商業銀行台中港分行',
  },
  {
    bankCode: '053',
    code: '0514',
    name: '台中商業銀行北員林分行',
  },
  {
    bankCode: '053',
    code: '0525',
    name: '台中商業銀行南陽分行',
  },
  {
    bankCode: '053',
    code: '0536',
    name: '台中商業銀行左營分行',
  },
  {
    bankCode: '053',
    code: '0570',
    name: '台中商業銀行埤頭分行',
  },
  {
    bankCode: '053',
    code: '0581',
    name: '台中商業銀行四民分行',
  },
  {
    bankCode: '053',
    code: '0592',
    name: '台中商業銀行軍功分行',
  },
  {
    bankCode: '053',
    code: '0628',
    name: '台中商業銀行信託部',
  },
  {
    bankCode: '053',
    code: '0639',
    name: '台中商業銀行北屯分行',
  },
  {
    bankCode: '053',
    code: '0662',
    name: '台中商業銀行埔心分行',
  },
  {
    bankCode: '053',
    code: '0673',
    name: '台中商業銀行國外部',
  },
  {
    bankCode: '053',
    code: '0684',
    name: '台中商業銀行台北分行',
  },
  {
    bankCode: '053',
    code: '0710',
    name: '台中商業銀行松山分行',
  },
  {
    bankCode: '053',
    code: '0721',
    name: '台中商業銀行三重分行',
  },
  {
    bankCode: '053',
    code: '0732',
    name: '台中商業銀行高雄分行',
  },
  {
    bankCode: '053',
    code: '0754',
    name: '台中商業銀行龍井分行',
  },
  {
    bankCode: '053',
    code: '0776',
    name: '台中商業銀行林口分行',
  },
  {
    bankCode: '053',
    code: '0787',
    name: '台中商業銀行虎尾分行',
  },
  {
    bankCode: '053',
    code: '0798',
    name: '台中商業銀行苑裡分行',
  },
  {
    bankCode: '053',
    code: '0802',
    name: '台中商業銀行國際金融業務分行',
  },
  {
    bankCode: '053',
    code: '0813',
    name: '台中商業銀行斗南分行',
  },
  {
    bankCode: '053',
    code: '0824',
    name: '台中商業銀行竹南分行',
  },
  {
    bankCode: '053',
    code: '0846',
    name: '台中商業銀行內湖分行',
  },
  {
    bankCode: '053',
    code: '0857',
    name: '台中商業銀行鳳山分行',
  },
  {
    bankCode: '053',
    code: '0868',
    name: '台中商業銀行板橋分行',
  },
  {
    bankCode: '053',
    code: '0880',
    name: '台中商業銀行新莊分行',
  },
  {
    bankCode: '053',
    code: '0891',
    name: '台中商業銀行民雄分行',
  },
  {
    bankCode: '053',
    code: '0905',
    name: '台中商業銀行桃園分行',
  },
  {
    bankCode: '053',
    code: '0916',
    name: '台中商業銀行永康分行',
  },
  {
    bankCode: '053',
    code: '0927',
    name: '台中商業銀行竹北分行',
  },
  {
    bankCode: '053',
    code: '0938',
    name: '台中商業銀行南崁分行',
  },
  {
    bankCode: '053',
    code: '0949',
    name: '台中商業銀行新竹分行',
  },
  {
    bankCode: '053',
    code: '0950',
    name: '台中商業銀行內壢分行',
  },
  {
    bankCode: '053',
    code: '0961',
    name: '台中商業銀行新豐分行',
  },
  {
    bankCode: '053',
    code: '0972',
    name: '台中商業銀行大園分行',
  },
  {
    bankCode: '053',
    code: '0983',
    name: '台中商業銀行中壢分行',
  },
  {
    bankCode: '053',
    code: '1005',
    name: '台中商業銀行楊梅分行',
  },
  {
    bankCode: '053',
    code: '1016',
    name: '台中商業銀行土城分行',
  },
  {
    bankCode: '053',
    code: '1027',
    name: '台中商業銀行財富管理部',
  },
  {
    bankCode: '053',
    code: '1038',
    name: '台中商業銀行復興分行',
  },
  {
    bankCode: '053',
    code: '1050',
    name: '台中商業銀行中山分行',
  },
  {
    bankCode: '053',
    code: '1061',
    name: '台中商業銀行大同分行',
  },
  {
    bankCode: '053',
    code: '1072',
    name: '台中商業銀行台南分行',
  },
  {
    bankCode: '053',
    code: '1083',
    name: '台中商業銀行新港分行',
  },
  {
    bankCode: '053',
    code: '1094',
    name: '台中商業銀行新店分行',
  },
  {
    bankCode: '053',
    code: '1108',
    name: '台中商業銀行燕巢分行',
  },
  {
    bankCode: '053',
    code: '9986',
    name: '台中商業銀行馬來西亞納閩分行吉隆坡行銷服務處',
  },
  {
    bankCode: '053',
    code: '9997',
    name: '台中商業銀行馬來西亞納閩分行',
  },
  {
    bankCode: '054',
    code: '0010',
    name: '京城商業銀行營業部',
  },
  {
    bankCode: '054',
    code: '0032',
    name: '京城商業銀行台南分行',
  },
  {
    bankCode: '054',
    code: '0043',
    name: '京城商業銀行嘉義分行',
  },
  {
    bankCode: '054',
    code: '0054',
    name: '京城商業銀行新營分行',
  },
  {
    bankCode: '054',
    code: '0065',
    name: '京城商業銀行鹽水分行',
  },
  {
    bankCode: '054',
    code: '0076',
    name: '京城商業銀行虎尾分行',
  },
  {
    bankCode: '054',
    code: '0087',
    name: '京城商業銀行斗六分行',
  },
  {
    bankCode: '054',
    code: '0098',
    name: '京城商業銀行民雄分行',
  },
  {
    bankCode: '054',
    code: '0102',
    name: '京城商業銀行北港分行',
  },
  {
    bankCode: '054',
    code: '0113',
    name: '京城商業銀行麻豆分行',
  },
  {
    bankCode: '054',
    code: '0124',
    name: '京城商業銀行朴子分行',
  },
  {
    bankCode: '054',
    code: '0135',
    name: '京城商業銀行佳里分行',
  },
  {
    bankCode: '054',
    code: '0146',
    name: '京城商業銀行梅山分行',
  },
  {
    bankCode: '054',
    code: '0157',
    name: '京城商業銀行斗南分行',
  },
  {
    bankCode: '054',
    code: '0180',
    name: '京城商業銀行東台南分行',
  },
  {
    bankCode: '054',
    code: '0227',
    name: '京城商業銀行西螺分行',
  },
  {
    bankCode: '054',
    code: '0249',
    name: '京城商業銀行善化分行',
  },
  {
    bankCode: '054',
    code: '0250',
    name: '京城商業銀行學甲分行',
  },
  {
    bankCode: '054',
    code: '0272',
    name: '京城商業銀行開元分行',
  },
  {
    bankCode: '054',
    code: '0283',
    name: '京城商業銀行永康分行',
  },
  {
    bankCode: '054',
    code: '0294',
    name: '京城商業銀行新市分行',
  },
  {
    bankCode: '054',
    code: '0308',
    name: '京城商業銀行仁德分行',
  },
  {
    bankCode: '054',
    code: '0319',
    name: '京城商業銀行六甲分行',
  },
  {
    bankCode: '054',
    code: '0320',
    name: '京城商業銀行安南分行',
  },
  {
    bankCode: '054',
    code: '0331',
    name: '京城商業銀行中埔分行',
  },
  {
    bankCode: '054',
    code: '0342',
    name: '京城商業銀行崙背分行',
  },
  {
    bankCode: '054',
    code: '0353',
    name: '京城商業銀行西港分行',
  },
  {
    bankCode: '054',
    code: '0364',
    name: '京城商業銀行新化分行',
  },
  {
    bankCode: '054',
    code: '0375',
    name: '京城商業銀行竹崎分行',
  },
  {
    bankCode: '054',
    code: '0386',
    name: '京城商業銀行信託部',
  },
  {
    bankCode: '054',
    code: '0397',
    name: '京城商業銀行安和分行',
  },
  {
    bankCode: '054',
    code: '0401',
    name: '京城商業銀行新興分行',
  },
  {
    bankCode: '054',
    code: '0412',
    name: '京城商業銀行中華分行',
  },
  {
    bankCode: '054',
    code: '0434',
    name: '京城商業銀行白河分行',
  },
  {
    bankCode: '054',
    code: '0445',
    name: '京城商業銀行興業分行',
  },
  {
    bankCode: '054',
    code: '0467',
    name: '京城商業銀行水上分行',
  },
  {
    bankCode: '054',
    code: '0489',
    name: '京城商業銀行府城分行',
  },
  {
    bankCode: '054',
    code: '0504',
    name: '京城商業銀行歸仁分行',
  },
  {
    bankCode: '054',
    code: '0515',
    name: '京城商業銀行鹽行分行',
  },
  {
    bankCode: '054',
    code: '0537',
    name: '京城商業銀行台北分行',
  },
  {
    bankCode: '054',
    code: '0548',
    name: '京城商業銀行大林分行',
  },
  {
    bankCode: '054',
    code: '0607',
    name: '京城商業銀行關廟分行',
  },
  {
    bankCode: '054',
    code: '0641',
    name: '京城商業銀行太保分行',
  },
  {
    bankCode: '054',
    code: '0652',
    name: '京城商業銀行蘆洲分行',
  },
  {
    bankCode: '054',
    code: '0663',
    name: '京城商業銀行玉井分行',
  },
  {
    bankCode: '054',
    code: '0674',
    name: '京城商業銀行國外部',
  },
  {
    bankCode: '054',
    code: '0685',
    name: '京城商業銀行國際金融業務分行',
  },
  {
    bankCode: '054',
    code: '0696',
    name: '京城商業銀行高雄分行',
  },
  {
    bankCode: '054',
    code: '0700',
    name: '京城商業銀行台中分行',
  },
  {
    bankCode: '054',
    code: '0711',
    name: '京城商業銀行內湖分行',
  },
  {
    bankCode: '054',
    code: '0744',
    name: '京城商業銀行桃園分行',
  },
  {
    bankCode: '054',
    code: '0755',
    name: '京城商業銀行雙和分行',
  },
  {
    bankCode: '054',
    code: '0766',
    name: '京城商業銀行岡山分行',
  },
  {
    bankCode: '054',
    code: '0777',
    name: '京城商業銀行中正分行',
  },
  {
    bankCode: '054',
    code: '0788',
    name: '京城商業銀行忠孝分行',
  },
  {
    bankCode: '054',
    code: '0799',
    name: '京城商業銀行北高雄分行',
  },
  {
    bankCode: '054',
    code: '0814',
    name: '京城商業銀行板橋分行',
  },
  {
    bankCode: '054',
    code: '0825',
    name: '京城商業銀行文心分行',
  },
  {
    bankCode: '054',
    code: '0836',
    name: '京城商業銀行松山分行',
  },
  {
    bankCode: '054',
    code: '0847',
    name: '京城商業銀行新莊分行',
  },
  {
    bankCode: '054',
    code: '0858',
    name: '京城商業銀行新竹分行',
  },
  {
    bankCode: '054',
    code: '0869',
    name: '京城商業銀行中壢分行',
  },
  {
    bankCode: '054',
    code: '0870',
    name: '京城商業銀行新店分行',
  },
  {
    bankCode: '054',
    code: '0881',
    name: '京城商業銀行南崁分行',
  },
  {
    bankCode: '054',
    code: '0892',
    name: '京城商業銀行大里分行',
  },
  {
    bankCode: '054',
    code: '0906',
    name: '京城商業銀行楠梓分行',
  },
  {
    bankCode: '054',
    code: '0917',
    name: '京城商業銀行彰化分行',
  },
  {
    bankCode: '054',
    code: '0928',
    name: '京城商業銀行東新竹分行',
  },
  {
    bankCode: '054',
    code: '0939',
    name: '京城商業銀行裕農分行',
  },
  {
    bankCode: '081',
    code: '0016',
    name: '滙豐(台灣)商業銀行台北分行',
  },
  {
    bankCode: '081',
    code: '0027',
    name: '滙豐(台灣)商業銀行高雄分行',
  },
  {
    bankCode: '081',
    code: '0038',
    name: '滙豐(台灣)商業銀行國際金融業務分行',
  },
  {
    bankCode: '081',
    code: '0049',
    name: '滙豐(台灣)商業銀行台中分行',
  },
  {
    bankCode: '081',
    code: '0050',
    name: '滙豐(台灣)商業銀行台南分行',
  },
  {
    bankCode: '081',
    code: '0061',
    name: '滙豐(台灣)商業銀行板橋分行',
  },
  {
    bankCode: '081',
    code: '0072',
    name: '滙豐(台灣)商業銀行桃園分行',
  },
  {
    bankCode: '081',
    code: '0083',
    name: '滙豐(台灣)商業銀行建國分行',
  },
  {
    bankCode: '081',
    code: '0094',
    name: '滙豐(台灣)商業銀行天母分行',
  },
  {
    bankCode: '081',
    code: '0108',
    name: '滙豐(台灣)商業銀行東門分行',
  },
  {
    bankCode: '081',
    code: '0120',
    name: '滙豐(台灣)商業銀行光復分行',
  },
  {
    bankCode: '081',
    code: '0164',
    name: '滙豐(台灣)商業銀行新板分行',
  },
  {
    bankCode: '081',
    code: '0186',
    name: '滙豐(台灣)商業銀行古亭分行',
  },
  {
    bankCode: '081',
    code: '0197',
    name: '滙豐(台灣)商業銀行民生分行',
  },
  {
    bankCode: '081',
    code: '0201',
    name: '滙豐(台灣)商業銀行南港分行',
  },
  {
    bankCode: '081',
    code: '0212',
    name: '滙豐(台灣)商業銀行林口分行',
  },
  {
    bankCode: '081',
    code: '0223',
    name: '滙豐(台灣)商業銀行新竹分行',
  },
  {
    bankCode: '081',
    code: '0234',
    name: '滙豐(台灣)商業銀行松江分行',
  },
  {
    bankCode: '081',
    code: '0304',
    name: '滙豐(台灣)商業銀行安和分行',
  },
  {
    bankCode: '081',
    code: '0315',
    name: '滙豐(台灣)商業銀行中壢分行',
  },
  {
    bankCode: '081',
    code: '0326',
    name: '滙豐(台灣)商業銀行仁愛分行',
  },
  {
    bankCode: '081',
    code: '0337',
    name: '滙豐(台灣)商業銀行敦北分行',
  },
  {
    bankCode: '081',
    code: '0360',
    name: '滙豐(台灣)商業銀行內湖分行',
  },
  {
    bankCode: '081',
    code: '0382',
    name: '滙豐(台灣)商業銀行復興分行',
  },
  {
    bankCode: '081',
    code: '0511',
    name: '滙豐(台灣)商業銀行國美分行',
  },
  {
    bankCode: '081',
    code: '0522',
    name: '滙豐(台灣)商業銀行敦南分行',
  },
  {
    bankCode: '081',
    code: '0533',
    name: '滙豐(台灣)商業銀行大興分行',
  },
  {
    bankCode: '081',
    code: '0566',
    name: '滙豐(台灣)商業銀行大直分行',
  },
  {
    bankCode: '081',
    code: '0577',
    name: '滙豐(台灣)商業銀行士林分行',
  },
  {
    bankCode: '081',
    code: '0588',
    name: '滙豐(台灣)商業銀行蘆洲分行',
  },
  {
    bankCode: '081',
    code: '0599',
    name: '滙豐(台灣)商業銀行崇德分行',
  },
  {
    bankCode: '101',
    code: '0011',
    name: '瑞興商業銀行營業部',
  },
  {
    bankCode: '101',
    code: '0020',
    name: '瑞興商業銀行民生分行',
  },
  {
    bankCode: '101',
    code: '0039',
    name: '瑞興商業銀行建成分行',
  },
  {
    bankCode: '101',
    code: '0048',
    name: '瑞興商業銀行大橋分行',
  },
  {
    bankCode: '101',
    code: '0057',
    name: '瑞興商業銀行南京東路分行',
  },
  {
    bankCode: '101',
    code: '0066',
    name: '瑞興商業銀行昆明分行',
  },
  {
    bankCode: '101',
    code: '0075',
    name: '瑞興商業銀行長安分行',
  },
  {
    bankCode: '101',
    code: '0084',
    name: '瑞興商業銀行永吉分行',
  },
  {
    bankCode: '101',
    code: '0093',
    name: '瑞興商業銀行和平東路分行',
  },
  {
    bankCode: '101',
    code: '0109',
    name: '瑞興商業銀行石牌分行',
  },
  {
    bankCode: '101',
    code: '0118',
    name: '瑞興商業銀行內湖分行',
  },
  {
    bankCode: '101',
    code: '0127',
    name: '瑞興商業銀行成功簡易型分行',
  },
  {
    bankCode: '101',
    code: '0136',
    name: '瑞興商業銀行古亭分行',
  },
  {
    bankCode: '101',
    code: '0145',
    name: '瑞興商業銀行景美分行',
  },
  {
    bankCode: '101',
    code: '0154',
    name: '瑞興商業銀行南港分行',
  },
  {
    bankCode: '101',
    code: '0163',
    name: '瑞興商業銀行信義簡易型分行',
  },
  {
    bankCode: '101',
    code: '0172',
    name: '瑞興商業銀行萬華分行',
  },
  {
    bankCode: '101',
    code: '0181',
    name: '瑞興商業銀行士林分行',
  },
  {
    bankCode: '101',
    code: '0190',
    name: '瑞興商業銀行松山簡易型分行',
  },
  {
    bankCode: '101',
    code: '0206',
    name: '瑞興商業銀行城內分行',
  },
  {
    bankCode: '101',
    code: '0215',
    name: '瑞興商業銀行桃園分行',
  },
  {
    bankCode: '101',
    code: '0224',
    name: '瑞興商業銀行中和分行',
  },
  {
    bankCode: '101',
    code: '0242',
    name: '瑞興商業銀行信託部',
  },
  {
    bankCode: '101',
    code: '0251',
    name: '瑞興商業銀行國外部',
  },
  {
    bankCode: '101',
    code: '0260',
    name: '瑞興商業銀行國際金融業務分行',
  },
  {
    bankCode: '102',
    code: '0010',
    name: '華泰商業銀行營業部',
  },
  {
    bankCode: '102',
    code: '0029',
    name: '華泰商業銀行迪化街分行',
  },
  {
    bankCode: '102',
    code: '0038',
    name: '華泰商業銀行建成分行',
  },
  {
    bankCode: '102',
    code: '0047',
    name: '華泰商業銀行大同分行',
  },
  {
    bankCode: '102',
    code: '0056',
    name: '華泰商業銀行中山分行',
  },
  {
    bankCode: '102',
    code: '0065',
    name: '華泰商業銀行大安分行',
  },
  {
    bankCode: '102',
    code: '0074',
    name: '華泰商業銀行松山分行',
  },
  {
    bankCode: '102',
    code: '0083',
    name: '華泰商業銀行古亭分行',
  },
  {
    bankCode: '102',
    code: '0092',
    name: '華泰商業銀行士林分行',
  },
  {
    bankCode: '102',
    code: '0108',
    name: '華泰商業銀行內湖分行',
  },
  {
    bankCode: '102',
    code: '0117',
    name: '華泰商業銀行信義分行',
  },
  {
    bankCode: '102',
    code: '0126',
    name: '華泰商業銀行永吉分行',
  },
  {
    bankCode: '102',
    code: '0135',
    name: '華泰商業銀行和平分行',
  },
  {
    bankCode: '102',
    code: '0144',
    name: '華泰商業銀行光復分行',
  },
  {
    bankCode: '102',
    code: '0153',
    name: '華泰商業銀行文山分行',
  },
  {
    bankCode: '102',
    code: '0171',
    name: '華泰商業銀行石牌分行',
  },
  {
    bankCode: '102',
    code: '0180',
    name: '華泰商業銀行萬華分行',
  },
  {
    bankCode: '102',
    code: '0199',
    name: '華泰商業銀行桃園分行',
  },
  {
    bankCode: '102',
    code: '0205',
    name: '華泰商業銀行松德分行',
  },
  {
    bankCode: '102',
    code: '0214',
    name: '華泰商業銀行新莊分行',
  },
  {
    bankCode: '102',
    code: '0223',
    name: '華泰商業銀行中和分行',
  },
  {
    bankCode: '102',
    code: '0232',
    name: '華泰商業銀行板橋分行',
  },
  {
    bankCode: '102',
    code: '0241',
    name: '華泰商業銀行南京東路分行',
  },
  {
    bankCode: '102',
    code: '0250',
    name: '華泰商業銀行敦化分行',
  },
  {
    bankCode: '102',
    code: '0269',
    name: '華泰商業銀行新店分行',
  },
  {
    bankCode: '102',
    code: '0278',
    name: '華泰商業銀行中壢分行',
  },
  {
    bankCode: '102',
    code: '0287',
    name: '華泰商業銀行高雄分行',
  },
  {
    bankCode: '102',
    code: '0296',
    name: '華泰商業銀行三重分行',
  },
  {
    bankCode: '102',
    code: '0302',
    name: '華泰商業銀行總部分行',
  },
  {
    bankCode: '102',
    code: '0311',
    name: '華泰商業銀行國外部',
  },
  {
    bankCode: '102',
    code: '0320',
    name: '華泰商業銀行信託部',
  },
  {
    bankCode: '102',
    code: '0339',
    name: '華泰商業銀行國際金融業務分行',
  },
  {
    bankCode: '102',
    code: '0348',
    name: '華泰商業銀行台南分行',
  },
  {
    bankCode: '102',
    code: '0357',
    name: '華泰商業銀行北高雄分行',
  },
  {
    bankCode: '102',
    code: '0366',
    name: '華泰商業銀行台中分行',
  },
  {
    bankCode: '102',
    code: '0375',
    name: '華泰商業銀行彰化分行',
  },
  {
    bankCode: '102',
    code: '0384',
    name: '華泰商業銀行北台中分行',
  },
  {
    bankCode: '103',
    code: '0019',
    name: '臺灣新光商業銀行中正分行',
  },
  {
    bankCode: '103',
    code: '0028',
    name: '臺灣新光商業銀行東台北分行',
  },
  {
    bankCode: '103',
    code: '0037',
    name: '臺灣新光商業銀行龍山分行',
  },
  {
    bankCode: '103',
    code: '0046',
    name: '臺灣新光商業銀行西園分行',
  },
  {
    bankCode: '103',
    code: '0055',
    name: '臺灣新光商業銀行西門分行',
  },
  {
    bankCode: '103',
    code: '0064',
    name: '臺灣新光商業銀行大同分行',
  },
  {
    bankCode: '103',
    code: '0073',
    name: '臺灣新光商業銀行復興分行',
  },
  {
    bankCode: '103',
    code: '0082',
    name: '臺灣新光商業銀行忠孝分行',
  },
  {
    bankCode: '103',
    code: '0091',
    name: '臺灣新光商業銀行五常分行',
  },
  {
    bankCode: '103',
    code: '0107',
    name: '臺灣新光商業銀行城北分行',
  },
  {
    bankCode: '103',
    code: '0116',
    name: '臺灣新光商業銀行城內分行',
  },
  {
    bankCode: '103',
    code: '0125',
    name: '臺灣新光商業銀行館前簡易型分行',
  },
  {
    bankCode: '103',
    code: '0134',
    name: '臺灣新光商業銀行新金湖分行',
  },
  {
    bankCode: '103',
    code: '0143',
    name: '臺灣新光商業銀行慶城分行',
  },
  {
    bankCode: '103',
    code: '0152',
    name: '臺灣新光商業銀行內湖分行',
  },
  {
    bankCode: '103',
    code: '0161',
    name: '臺灣新光商業銀行世貿分行',
  },
  {
    bankCode: '103',
    code: '0170',
    name: '臺灣新光商業銀行松山分行',
  },
  {
    bankCode: '103',
    code: '0189',
    name: '臺灣新光商業銀行南港分行',
  },
  {
    bankCode: '103',
    code: '0198',
    name: '臺灣新光商業銀行林森北路分行',
  },
  {
    bankCode: '103',
    code: '0204',
    name: '臺灣新光商業銀行大安分行',
  },
  {
    bankCode: '103',
    code: '0213',
    name: '臺光新光商業銀行新竹分行',
  },
  {
    bankCode: '103',
    code: '0222',
    name: '臺灣新光商業銀行中壢分行',
  },
  {
    bankCode: '103',
    code: '0231',
    name: '臺灣新光商業銀行桃園分行',
  },
  {
    bankCode: '103',
    code: '0240',
    name: '臺灣新光商業銀行東三重分行',
  },
  {
    bankCode: '103',
    code: '0259',
    name: '臺灣新光商業銀行竹北分行',
  },
  {
    bankCode: '103',
    code: '0268',
    name: '臺灣新光商業銀行連城路分行',
  },
  {
    bankCode: '103',
    code: '0277',
    name: '臺灣新光商業銀行竹科分行',
  },
  {
    bankCode: '103',
    code: '0286',
    name: '臺灣新光商業銀行土城分行',
  },
  {
    bankCode: '103',
    code: '0295',
    name: '臺灣新光商業銀行蘆洲分行',
  },
  {
    bankCode: '103',
    code: '0301',
    name: '臺灣新光商業銀行建成分行',
  },
  {
    bankCode: '103',
    code: '0310',
    name: '臺灣新光商業銀行北三重分行',
  },
  {
    bankCode: '103',
    code: '0329',
    name: '臺灣新光商業銀行永和分行',
  },
  {
    bankCode: '103',
    code: '0338',
    name: '臺灣新光商業銀行新埔分行',
  },
  {
    bankCode: '103',
    code: '0347',
    name: '臺灣新光商業銀行台中分行',
  },
  {
    bankCode: '103',
    code: '0356',
    name: '臺灣新光商業銀行中港分行',
  },
  {
    bankCode: '103',
    code: '0365',
    name: '臺灣新光商業銀行左營華夏路分行',
  },
  {
    bankCode: '103',
    code: '0374',
    name: '臺灣新光商業銀行大甲分行',
  },
  {
    bankCode: '103',
    code: '0383',
    name: '臺灣新光商業銀行大墩分行',
  },
  {
    bankCode: '103',
    code: '0392',
    name: '臺灣新光商業銀行員林分行',
  },
  {
    bankCode: '103',
    code: '0408',
    name: '臺灣新光商業銀行南屯分行',
  },
  {
    bankCode: '103',
    code: '0417',
    name: '臺灣新光商業銀行東台南分行',
  },
  {
    bankCode: '103',
    code: '0426',
    name: '臺灣新光商業銀行大里分行',
  },
  {
    bankCode: '103',
    code: '0435',
    name: '臺灣新光商業銀行松竹分行',
  },
  {
    bankCode: '103',
    code: '0444',
    name: '臺灣新光商業銀行彰化分行',
  },
  {
    bankCode: '103',
    code: '0453',
    name: '臺灣新光商業銀行樹林分行',
  },
  {
    bankCode: '103',
    code: '0462',
    name: '臺灣新光商業銀行新板分行',
  },
  {
    bankCode: '103',
    code: '0471',
    name: '臺灣新光商業銀行古亭分行',
  },
  {
    bankCode: '103',
    code: '0480',
    name: '臺灣新光商業銀行士林分行',
  },
  {
    bankCode: '103',
    code: '0499',
    name: '臺灣新光商業銀行營業部',
  },
  {
    bankCode: '103',
    code: '0505',
    name: '臺灣新光商業銀行丹鳳分行',
  },
  {
    bankCode: '103',
    code: '0514',
    name: '臺灣新光商業銀行北投復興崗分行',
  },
  {
    bankCode: '103',
    code: '0523',
    name: '臺灣新光商業銀行新生南路分行',
  },
  {
    bankCode: '103',
    code: '0532',
    name: '臺灣新光商業銀行國外部',
  },
  {
    bankCode: '103',
    code: '0541',
    name: '臺灣新光商業銀行新營分行',
  },
  {
    bankCode: '103',
    code: '0550',
    name: '臺灣新光商業銀行天母簡易型分行',
  },
  {
    bankCode: '103',
    code: '0569',
    name: '臺灣新光商業銀行新店分行',
  },
  {
    bankCode: '103',
    code: '0578',
    name: '臺灣新光商業銀行大直分行',
  },
  {
    bankCode: '103',
    code: '0587',
    name: '臺灣新光商業銀行興隆簡易型分行',
  },
  {
    bankCode: '103',
    code: '0596',
    name: '臺灣新光商業銀行八德分行',
  },
  {
    bankCode: '103',
    code: '0611',
    name: '臺灣新光商業銀行長安分行',
  },
  {
    bankCode: '103',
    code: '0620',
    name: '臺灣新光商業銀行嘉義分行',
  },
  {
    bankCode: '103',
    code: '0648',
    name: '臺灣新光商業銀行鳳山分行',
  },
  {
    bankCode: '103',
    code: '0657',
    name: '臺灣新光商業銀行台南分行',
  },
  {
    bankCode: '103',
    code: '0666',
    name: '臺灣新光商業銀行北嘉義分行',
  },
  {
    bankCode: '103',
    code: '0675',
    name: '臺灣新光商業銀行斗六分行',
  },
  {
    bankCode: '103',
    code: '0684',
    name: '臺灣新光商業銀行竹南分行',
  },
  {
    bankCode: '103',
    code: '0693',
    name: '臺灣新光商業銀行花蓮分行',
  },
  {
    bankCode: '103',
    code: '0709',
    name: '臺灣新光商業銀行基隆分行',
  },
  {
    bankCode: '103',
    code: '0718',
    name: '臺灣新光商業銀行宜蘭分行',
  },
  {
    bankCode: '103',
    code: '0727',
    name: '臺灣新光商業銀行三峽分行',
  },
  {
    bankCode: '103',
    code: '0736',
    name: '臺灣新光商業銀行路竹分行',
  },
  {
    bankCode: '103',
    code: '0745',
    name: '臺灣新光商業銀行高雄分行',
  },
  {
    bankCode: '103',
    code: '0754',
    name: '臺灣新光商業銀行新莊分行',
  },
  {
    bankCode: '103',
    code: '0763',
    name: '臺灣新光商業銀行江子翠分行',
  },
  {
    bankCode: '103',
    code: '0772',
    name: '臺灣新光商業銀行林口分行',
  },
  {
    bankCode: '103',
    code: '0781',
    name: '臺灣新光商業銀行彌陀簡易型分行',
  },
  {
    bankCode: '103',
    code: '0790',
    name: '臺灣新光商業銀行岡山分行',
  },
  {
    bankCode: '103',
    code: '0806',
    name: '臺灣新光商業銀行北高雄分行',
  },
  {
    bankCode: '103',
    code: '0815',
    name: '臺灣新光商業銀行國際金融業務分行',
  },
  {
    bankCode: '103',
    code: '0824',
    name: '臺灣新光商業銀行小港分行',
  },
  {
    bankCode: '103',
    code: '0833',
    name: '臺灣新光商業銀行中華分行',
  },
  {
    bankCode: '103',
    code: '0842',
    name: '臺灣新光商業銀行承德分行',
  },
  {
    bankCode: '103',
    code: '0851',
    name: '臺灣新光商業銀行敦南分行',
  },
  {
    bankCode: '103',
    code: '0860',
    name: '臺灣新光商業銀行中和分行',
  },
  {
    bankCode: '103',
    code: '0879',
    name: '臺灣新光商業銀行南台中分行',
  },
  {
    bankCode: '103',
    code: '0888',
    name: '臺灣新光商業銀行水湳分行',
  },
  {
    bankCode: '103',
    code: '0897',
    name: '臺灣新光商業銀行北屯分行',
  },
  {
    bankCode: '103',
    code: '0903',
    name: '臺灣新光商業銀行西屯分行',
  },
  {
    bankCode: '103',
    code: '0912',
    name: '臺灣新光商業銀行向上分行',
  },
  {
    bankCode: '103',
    code: '0921',
    name: '臺灣新光商業銀行十甲分行',
  },
  {
    bankCode: '103',
    code: '0930',
    name: '臺灣新光商業銀行豐原分行',
  },
  {
    bankCode: '103',
    code: '0949',
    name: '臺灣新光商業銀行永安分行',
  },
  {
    bankCode: '103',
    code: '0958',
    name: '臺灣新光商業銀行屏東分行',
  },
  {
    bankCode: '103',
    code: '0967',
    name: '臺灣新光商業銀行東園分行',
  },
  {
    bankCode: '103',
    code: '0976',
    name: '臺灣新光商業銀行萬丹分行',
  },
  {
    bankCode: '103',
    code: '0985',
    name: '臺灣新光商業銀行七賢分行',
  },
  {
    bankCode: '103',
    code: '1003',
    name: '臺灣新光商業銀行汐止分行',
  },
  {
    bankCode: '103',
    code: '1012',
    name: '臺灣新光商業銀行桃北分行',
  },
  {
    bankCode: '103',
    code: '1021',
    name: '臺灣新光商業銀行東新竹分行',
  },
  {
    bankCode: '103',
    code: '1030',
    name: '臺灣新光商業銀行九如分行',
  },
  {
    bankCode: '103',
    code: '1049',
    name: '臺灣新光商業銀行永康分行',
  },
  {
    bankCode: '103',
    code: '1058',
    name: '臺灣新光商業銀行壢新分行',
  },
  {
    bankCode: '103',
    code: '1067',
    name: '臺灣新光商業銀行沙鹿分行',
  },
  {
    bankCode: '103',
    code: '1076',
    name: '臺灣新光商業銀行大雅分行',
  },
  {
    bankCode: '103',
    code: '1094',
    name: '臺灣新光商業銀行草屯分行',
  },
  {
    bankCode: '103',
    code: '1100',
    name: '臺灣新光商業銀行南東分行',
  },
  {
    bankCode: '103',
    code: '3249',
    name: '臺灣新光商業銀行信託部',
  },
  {
    bankCode: '103',
    code: '3425',
    name: '臺灣新光商業銀行緬甸仰光代表人辦事處',
  },
  {
    bankCode: '103',
    code: '9025',
    name: '臺灣新光商業銀行越南胡志明市代表人辦事處',
  },
  {
    bankCode: '103',
    code: '9036',
    name: '臺灣新光商業銀行香港分行',
  },
  {
    bankCode: '108',
    code: '0014',
    name: '陽信商業銀行營業部',
  },
  {
    bankCode: '108',
    code: '0023',
    name: '陽信商業銀行石牌分行',
  },
  {
    bankCode: '108',
    code: '0032',
    name: '陽信商業銀行北投分行',
  },
  {
    bankCode: '108',
    code: '0041',
    name: '陽信商業銀行社子分行',
  },
  {
    bankCode: '108',
    code: '0050',
    name: '陽信商業銀行士林分行',
  },
  {
    bankCode: '108',
    code: '0069',
    name: '陽信商業銀行大屯分行',
  },
  {
    bankCode: '108',
    code: '0078',
    name: '陽信商業銀行劍潭分行',
  },
  {
    bankCode: '108',
    code: '0087',
    name: '陽信商業銀行蘭雅分行',
  },
  {
    bankCode: '108',
    code: '0096',
    name: '陽信商業銀行天母分行',
  },
  {
    bankCode: '108',
    code: '0102',
    name: '陽信商業銀行社中分行',
  },
  {
    bankCode: '108',
    code: '0111',
    name: '陽信商業銀行吉林分行',
  },
  {
    bankCode: '108',
    code: '0120',
    name: '陽信商業銀行成功分行',
  },
  {
    bankCode: '108',
    code: '0139',
    name: '陽信商業銀行民生分行',
  },
  {
    bankCode: '108',
    code: '0148',
    name: '陽信商業銀行延吉分行',
  },
  {
    bankCode: '108',
    code: '0157',
    name: '陽信商業銀行木柵分行',
  },
  {
    bankCode: '108',
    code: '0166',
    name: '陽信商業銀行龍江分行',
  },
  {
    bankCode: '108',
    code: '0175',
    name: '陽信商業銀行南京分行',
  },
  {
    bankCode: '108',
    code: '0184',
    name: '陽信商業銀行景美分行',
  },
  {
    bankCode: '108',
    code: '0193',
    name: '陽信商業銀行中興分行',
  },
  {
    bankCode: '108',
    code: '0209',
    name: '陽信商業銀行信義分行',
  },
  {
    bankCode: '108',
    code: '0218',
    name: '陽信商業銀行中和分行',
  },
  {
    bankCode: '108',
    code: '0227',
    name: '陽信商業銀行永和分行',
  },
  {
    bankCode: '108',
    code: '0236',
    name: '陽信商業銀行蘆洲分行',
  },
  {
    bankCode: '108',
    code: '0245',
    name: '陽信商業銀行板橋分行',
  },
  {
    bankCode: '108',
    code: '0254',
    name: '陽信商業銀行信託部',
  },
  {
    bankCode: '108',
    code: '0263',
    name: '陽信商業銀行新和分行',
  },
  {
    bankCode: '108',
    code: '0272',
    name: '陽信商業銀行溪洲分行',
  },
  {
    bankCode: '108',
    code: '0281',
    name: '陽信商業銀行泰山分行',
  },
  {
    bankCode: '108',
    code: '0290',
    name: '陽信商業銀行新莊分行',
  },
  {
    bankCode: '108',
    code: '0306',
    name: '陽信商業銀行古亭分行',
  },
  {
    bankCode: '108',
    code: '0315',
    name: '陽信商業銀行三重分行',
  },
  {
    bankCode: '108',
    code: '0324',
    name: '陽信商業銀行大業分行',
  },
  {
    bankCode: '108',
    code: '0333',
    name: '陽信商業銀行雙和分行',
  },
  {
    bankCode: '108',
    code: '0342',
    name: '陽信商業銀行復興分行',
  },
  {
    bankCode: '108',
    code: '0351',
    name: '陽信商業銀行大安分行',
  },
  {
    bankCode: '108',
    code: '0360',
    name: '陽信商業銀行桃園分行',
  },
  {
    bankCode: '108',
    code: '0379',
    name: '陽信商業銀行新店分行',
  },
  {
    bankCode: '108',
    code: '0388',
    name: '陽信商業銀行國外部',
  },
  {
    bankCode: '108',
    code: '0397',
    name: '陽信商業銀行新福分行',
  },
  {
    bankCode: '108',
    code: '0403',
    name: '陽信商業銀行新竹分行',
  },
  {
    bankCode: '108',
    code: '0412',
    name: '陽信商業銀行員林分行',
  },
  {
    bankCode: '108',
    code: '0421',
    name: '陽信商業銀行花蓮分行',
  },
  {
    bankCode: '108',
    code: '0430',
    name: '陽信商業銀行精武分行',
  },
  {
    bankCode: '108',
    code: '0449',
    name: '陽信商業銀行社頭分行',
  },
  {
    bankCode: '108',
    code: '0458',
    name: '陽信商業銀行屏東分行',
  },
  {
    bankCode: '108',
    code: '0467',
    name: '陽信商業銀行和平分行',
  },
  {
    bankCode: '108',
    code: '0476',
    name: '陽信商業銀行高雄分行',
  },
  {
    bankCode: '108',
    code: '0485',
    name: '陽信商業銀行大同分行',
  },
  {
    bankCode: '108',
    code: '0494',
    name: '陽信商業銀行北屯分行',
  },
  {
    bankCode: '108',
    code: '0500',
    name: '陽信商業銀行嘉義分行',
  },
  {
    bankCode: '108',
    code: '0519',
    name: '陽信商業銀行新埔分行',
  },
  {
    bankCode: '108',
    code: '0528',
    name: '陽信商業銀行台南分行',
  },
  {
    bankCode: '108',
    code: '0555',
    name: '陽信商業銀行東寧分行',
  },
  {
    bankCode: '108',
    code: '0564',
    name: '陽信商業銀行中華分行',
  },
  {
    bankCode: '108',
    code: '0573',
    name: '陽信商業銀行健康分行',
  },
  {
    bankCode: '108',
    code: '0582',
    name: '陽信商業銀行台中分行',
  },
  {
    bankCode: '108',
    code: '0607',
    name: '陽信商業銀行西華分行',
  },
  {
    bankCode: '108',
    code: '0616',
    name: '陽信商業銀行安順分行',
  },
  {
    bankCode: '108',
    code: '0625',
    name: '陽信商業銀行國際金融業務分行',
  },
  {
    bankCode: '108',
    code: '0634',
    name: '陽信商業銀行左營分行',
  },
  {
    bankCode: '108',
    code: '0643',
    name: '陽信商業銀行向上分行',
  },
  {
    bankCode: '108',
    code: '0652',
    name: '陽信商業銀行內湖分行',
  },
  {
    bankCode: '108',
    code: '0661',
    name: '陽信商業銀行中壢分行',
  },
  {
    bankCode: '108',
    code: '0670',
    name: '陽信商業銀行五股分行',
  },
  {
    bankCode: '108',
    code: '0689',
    name: '陽信商業銀行林森分行',
  },
  {
    bankCode: '108',
    code: '0698',
    name: '陽信商業銀行立文分行',
  },
  {
    bankCode: '108',
    code: '0704',
    name: '陽信商業銀行新興分行',
  },
  {
    bankCode: '108',
    code: '0713',
    name: '陽信商業銀行青年分行',
  },
  {
    bankCode: '108',
    code: '0722',
    name: '陽信商業銀行三鳳分行',
  },
  {
    bankCode: '108',
    code: '0731',
    name: '陽信商業銀行四維分行',
  },
  {
    bankCode: '108',
    code: '0740',
    name: '陽信商業銀行大公分行',
  },
  {
    bankCode: '108',
    code: '0759',
    name: '陽信商業銀行大順分行',
  },
  {
    bankCode: '108',
    code: '0768',
    name: '陽信商業銀行海光分行',
  },
  {
    bankCode: '108',
    code: '0777',
    name: '陽信商業銀行前鎮分行',
  },
  {
    bankCode: '108',
    code: '0786',
    name: '陽信商業銀行平等分行',
  },
  {
    bankCode: '108',
    code: '0795',
    name: '陽信商業銀行基隆分行',
  },
  {
    bankCode: '108',
    code: '0801',
    name: '陽信商業銀行小港分行',
  },
  {
    bankCode: '108',
    code: '0810',
    name: '陽信商業銀行右昌分行',
  },
  {
    bankCode: '108',
    code: '0829',
    name: '陽信商業銀行汐止分行',
  },
  {
    bankCode: '108',
    code: '0838',
    name: '陽信商業銀行五甲分行',
  },
  {
    bankCode: '108',
    code: '0847',
    name: '陽信商業銀行鼎力分行',
  },
  {
    bankCode: '108',
    code: '0856',
    name: '陽信商業銀行楠梓分行',
  },
  {
    bankCode: '108',
    code: '0865',
    name: '陽信商業銀行旗山分行',
  },
  {
    bankCode: '108',
    code: '0874',
    name: '陽信商業銀行土城分行',
  },
  {
    bankCode: '108',
    code: '0883',
    name: '陽信商業銀行南桃園分行',
  },
  {
    bankCode: '108',
    code: '0917',
    name: '陽信商業銀行林園簡易型分行',
  },
  {
    bankCode: '108',
    code: '0926',
    name: '陽信商業銀行岡山分行',
  },
  {
    bankCode: '108',
    code: '0935',
    name: '陽信商業銀行仁德分行',
  },
  {
    bankCode: '108',
    code: '0944',
    name: '陽信商業銀行東桃園分行',
  },
  {
    bankCode: '108',
    code: '0953',
    name: '陽信商業銀行永康分行',
  },
  {
    bankCode: '108',
    code: '0971',
    name: '陽信商業銀行南港分行',
  },
  {
    bankCode: '108',
    code: '0980',
    name: '陽信商業銀行里港簡易型分行',
  },
  {
    bankCode: '108',
    code: '0999',
    name: '陽信商業銀行大里分行',
  },
  {
    bankCode: '108',
    code: '1017',
    name: '陽信商業銀行萬華分行',
  },
  {
    bankCode: '108',
    code: '1026',
    name: '陽信商業銀行臺北分行',
  },
  {
    bankCode: '108',
    code: '1035',
    name: '陽信商業銀行長安分行',
  },
  {
    bankCode: '108',
    code: '1053',
    name: '陽信商業銀行羅東分行',
  },
  {
    bankCode: '108',
    code: '1062',
    name: '陽信商業銀行竹北分行',
  },
  {
    bankCode: '108',
    code: '1071',
    name: '陽信商業銀行重新分行',
  },
  {
    bankCode: '108',
    code: '1080',
    name: '陽信商業銀行彰化分行',
  },
  {
    bankCode: '108',
    code: '1336',
    name: '陽信商業銀行苗栗分行',
  },
  {
    bankCode: '108',
    code: '1354',
    name: '陽信商業銀行龍井分行',
  },
  {
    bankCode: '108',
    code: '1363',
    name: '陽信商業銀行雲林分行',
  },
  {
    bankCode: '108',
    code: '1372',
    name: '陽信商業銀行南投分行',
  },
  {
    bankCode: '108',
    code: '1503',
    name: '陽信商業銀行臺東分行',
  },
  {
    bankCode: '108',
    code: '1512',
    name: '陽信商業銀行宜蘭分行',
  },
  {
    bankCode: '108',
    code: '1567',
    name: '陽信商業銀行林口分行',
  },
  {
    bankCode: '118',
    code: '0011',
    name: '板信商業銀行板橋分行',
  },
  {
    bankCode: '118',
    code: '0020',
    name: '板信商業銀行後埔分行',
  },
  {
    bankCode: '118',
    code: '0039',
    name: '板信商業銀行永和分行',
  },
  {
    bankCode: '118',
    code: '0048',
    name: '板信商業銀行埔墘分行',
  },
  {
    bankCode: '118',
    code: '0057',
    name: '板信商業銀行華江分行',
  },
  {
    bankCode: '118',
    code: '0066',
    name: '板信商業銀行民族分行',
  },
  {
    bankCode: '118',
    code: '0075',
    name: '板信商業銀行中和分行',
  },
  {
    bankCode: '118',
    code: '0084',
    name: '板信商業銀行土城分行',
  },
  {
    bankCode: '118',
    code: '0093',
    name: '板信商業銀行文化分行',
  },
  {
    bankCode: '118',
    code: '0109',
    name: '板信商業銀行大觀分行',
  },
  {
    bankCode: '118',
    code: '0118',
    name: '板信商業銀行興南分行',
  },
  {
    bankCode: '118',
    code: '0145',
    name: '板信商業銀行小港分行',
  },
  {
    bankCode: '118',
    code: '0163',
    name: '板信商業銀行新興分行',
  },
  {
    bankCode: '118',
    code: '0181',
    name: '板信商業銀行前鎮分行',
  },
  {
    bankCode: '118',
    code: '0206',
    name: '板信商業銀行陽明分行',
  },
  {
    bankCode: '118',
    code: '0215',
    name: '板信商業銀行高新莊分行',
  },
  {
    bankCode: '118',
    code: '0260',
    name: '板信商業銀行松江分行',
  },
  {
    bankCode: '118',
    code: '0279',
    name: '板信商業銀行信義分行',
  },
  {
    bankCode: '118',
    code: '0288',
    name: '板信商業銀行新莊分行',
  },
  {
    bankCode: '118',
    code: '0297',
    name: '板信商業銀行秀朗分行',
  },
  {
    bankCode: '118',
    code: '0303',
    name: '板信商業銀行桃園分行',
  },
  {
    bankCode: '118',
    code: '0312',
    name: '板信商業銀行三重分行',
  },
  {
    bankCode: '118',
    code: '0330',
    name: '板信商業銀行員山分行',
  },
  {
    bankCode: '118',
    code: '0349',
    name: '板信商業銀行桃鶯分行',
  },
  {
    bankCode: '118',
    code: '0358',
    name: '板信商業銀行民生分行',
  },
  {
    bankCode: '118',
    code: '0367',
    name: '板信商業銀行龍岡分行',
  },
  {
    bankCode: '118',
    code: '0376',
    name: '板信商業銀行信託部',
  },
  {
    bankCode: '118',
    code: '0385',
    name: '板信商業銀行樹林分行',
  },
  {
    bankCode: '118',
    code: '0394',
    name: '板信商業銀行金城分行',
  },
  {
    bankCode: '118',
    code: '0400',
    name: '板信商業銀行新竹分行',
  },
  {
    bankCode: '118',
    code: '0419',
    name: '板信商業銀行八德分行',
  },
  {
    bankCode: '118',
    code: '0428',
    name: '板信商業銀行台中分行',
  },
  {
    bankCode: '118',
    code: '0437',
    name: '板信商業銀行台南分行',
  },
  {
    bankCode: '118',
    code: '0446',
    name: '板信商業銀行新店分行',
  },
  {
    bankCode: '118',
    code: '0455',
    name: '板信商業銀行內湖分行',
  },
  {
    bankCode: '118',
    code: '0473',
    name: '板信商業銀行國外部',
  },
  {
    bankCode: '118',
    code: '0482',
    name: '板信商業銀行中正分行',
  },
  {
    bankCode: '118',
    code: '0491',
    name: '板信商業銀行國際金融業務分行',
  },
  {
    bankCode: '118',
    code: '0507',
    name: '板信商業銀行嘉義分行',
  },
  {
    bankCode: '118',
    code: '0598',
    name: '板信商業銀行蘆洲分行',
  },
  {
    bankCode: '118',
    code: '0604',
    name: '板信商業銀行羅東分行',
  },
  {
    bankCode: '118',
    code: '0613',
    name: '板信商業銀行北台中分行',
  },
  {
    bankCode: '118',
    code: '0622',
    name: '板信商業銀行成功分行',
  },
  {
    bankCode: '118',
    code: '0631',
    name: '板信商業銀行福和分行',
  },
  {
    bankCode: '118',
    code: '0659',
    name: '板信商業銀行營業部',
  },
  {
    bankCode: '118',
    code: '0668',
    name: '板信商業銀行瑞光分行',
  },
  {
    bankCode: '118',
    code: '0677',
    name: '板信商業銀行丹鳳分行',
  },
  {
    bankCode: '118',
    code: '0686',
    name: '板信商業銀行北新分行',
  },
  {
    bankCode: '118',
    code: '0695',
    name: '板信商業銀行艋舺分行',
  },
  {
    bankCode: '118',
    code: '0701',
    name: '板信商業銀行興隆分行',
  },
  {
    bankCode: '118',
    code: '0710',
    name: '板信商業銀行雙園分行',
  },
  {
    bankCode: '118',
    code: '0729',
    name: '板信商業銀行西門分行',
  },
  {
    bankCode: '118',
    code: '0738',
    name: '板信商業銀行古亭分行',
  },
  {
    bankCode: '118',
    code: '0747',
    name: '板信商業銀行安東分行',
  },
  {
    bankCode: '118',
    code: '0756',
    name: '板信商業銀行松山分行',
  },
  {
    bankCode: '118',
    code: '0765',
    name: '板信商業銀行士林分行',
  },
  {
    bankCode: '118',
    code: '0774',
    name: '板信商業銀行東湖分行',
  },
  {
    bankCode: '118',
    code: '0792',
    name: '板信商業銀行復興分行',
  },
  {
    bankCode: '118',
    code: '0808',
    name: '板信商業銀行民權分行',
  },
  {
    bankCode: '118',
    code: '0817',
    name: '板信商業銀行重慶分行',
  },
  {
    bankCode: '118',
    code: '0826',
    name: '板信商業銀行木柵分行',
  },
  {
    bankCode: '118',
    code: '0844',
    name: '板信商業銀行大直分行',
  },
  {
    bankCode: '118',
    code: '0853',
    name: '板信商業銀行萬大分行',
  },
  {
    bankCode: '118',
    code: '0871',
    name: '板信商業銀行保險代理部',
  },
  {
    bankCode: '118',
    code: '0880',
    name: '板信商業銀行南京東路分行',
  },
  {
    bankCode: '118',
    code: '0899',
    name: '板信商業銀行北桃園分行',
  },
  {
    bankCode: '118',
    code: '0905',
    name: '板信商業銀行環東分行',
  },
  {
    bankCode: '118',
    code: '0914',
    name: '板信商業銀行汐止分行',
  },
  {
    bankCode: '118',
    code: '0923',
    name: '板信商業銀行燕巢分行',
  },
  {
    bankCode: '147',
    code: '0013',
    name: '三信商業銀行台中分行',
  },
  {
    bankCode: '147',
    code: '0022',
    name: '三信商業銀行營業部',
  },
  {
    bankCode: '147',
    code: '0040',
    name: '三信商業銀行成功分行',
  },
  {
    bankCode: '147',
    code: '0059',
    name: '三信商業銀行西屯分行',
  },
  {
    bankCode: '147',
    code: '0068',
    name: '三信商業銀行國光分行',
  },
  {
    bankCode: '147',
    code: '0077',
    name: '三信商業銀行大智分行',
  },
  {
    bankCode: '147',
    code: '0086',
    name: '三信商業銀行林森分行',
  },
  {
    bankCode: '147',
    code: '0095',
    name: '三信商業銀行南門分行',
  },
  {
    bankCode: '147',
    code: '0101',
    name: '三信商業銀行進化分行',
  },
  {
    bankCode: '147',
    code: '0110',
    name: '三信商業銀行南屯分行',
  },
  {
    bankCode: '147',
    code: '0138',
    name: '三信商業銀行北屯分行',
  },
  {
    bankCode: '147',
    code: '0147',
    name: '三信商業銀行豐原分行',
  },
  {
    bankCode: '147',
    code: '0156',
    name: '三信商業銀行彰化分行',
  },
  {
    bankCode: '147',
    code: '0165',
    name: '三信商業銀行員林分行',
  },
  {
    bankCode: '147',
    code: '0183',
    name: '三信商業銀行台北分行',
  },
  {
    bankCode: '147',
    code: '0192',
    name: '三信商業銀行桃園分行',
  },
  {
    bankCode: '147',
    code: '0208',
    name: '三信商業銀行板橋分行',
  },
  {
    bankCode: '147',
    code: '0253',
    name: '三信商業銀行豐信分行',
  },
  {
    bankCode: '147',
    code: '0262',
    name: '三信商業銀行中山分行',
  },
  {
    bankCode: '147',
    code: '0299',
    name: '三信商業銀行台南分行',
  },
  {
    bankCode: '147',
    code: '0305',
    name: '三信商業銀行高雄分行',
  },
  {
    bankCode: '147',
    code: '0314',
    name: '三信商業銀行新莊分行',
  },
  {
    bankCode: '147',
    code: '0323',
    name: '三信商業銀行新竹分行',
  },
  {
    bankCode: '147',
    code: '0332',
    name: '三信商業銀行鳳山分行',
  },
  {
    bankCode: '147',
    code: '0341',
    name: '三信商業銀行大雅分行',
  },
  {
    bankCode: '147',
    code: '0350',
    name: '三信商業銀行橋頭分行',
  },
  {
    bankCode: '147',
    code: '0369',
    name: '三信商業銀行大肚分行',
  },
  {
    bankCode: '147',
    code: '0378',
    name: '三信商業銀行龍井分行',
  },
  {
    bankCode: '147',
    code: '0387',
    name: '三信商業銀行田中分行',
  },
  {
    bankCode: '147',
    code: '0396',
    name: '三信商業銀行太平分行',
  },
  {
    bankCode: '147',
    code: '0907',
    name: '三信商業銀行信託部',
  },
  {
    bankCode: '147',
    code: '0925',
    name: '三信商業銀行國外部',
  },
  {
    bankCode: '147',
    code: '0934',
    name: '三信商業銀行國際金融業務分行',
  },
  {
    bankCode: '700',
    code: '0010',
    name: '中華郵政股份有限公司郵政劃撥儲金',
  },
  {
    bankCode: '700',
    code: '0021',
    name: '中華郵政股份有限公司郵政存簿儲金',
  },
  {
    bankCode: '803',
    code: '0010',
    name: '聯邦商業銀行台北分行',
  },
  {
    bankCode: '803',
    code: '0021',
    name: '聯邦商業銀行營業部',
  },
  {
    bankCode: '803',
    code: '0032',
    name: '聯邦商業銀行桃園分行',
  },
  {
    bankCode: '803',
    code: '0043',
    name: '聯邦商業銀行台中分行',
  },
  {
    bankCode: '803',
    code: '0054',
    name: '聯邦商業銀行南京東路分行',
  },
  {
    bankCode: '803',
    code: '0065',
    name: '聯邦商業銀行中壢分行',
  },
  {
    bankCode: '803',
    code: '0076',
    name: '聯邦商業銀行三重分行',
  },
  {
    bankCode: '803',
    code: '0087',
    name: '聯邦商業銀行信託部',
  },
  {
    bankCode: '803',
    code: '0098',
    name: '聯邦商業銀行東台北分行',
  },
  {
    bankCode: '803',
    code: '0102',
    name: '聯邦商業銀行高雄分行',
  },
  {
    bankCode: '803',
    code: '0113',
    name: '聯邦商業銀行板橋分行',
  },
  {
    bankCode: '803',
    code: '0124',
    name: '聯邦商業銀行台南分行',
  },
  {
    bankCode: '803',
    code: '0135',
    name: '聯邦商業銀行員林分行',
  },
  {
    bankCode: '803',
    code: '0146',
    name: '聯邦商業銀行國外部',
  },
  {
    bankCode: '803',
    code: '0157',
    name: '聯邦商業銀行仁愛分行',
  },
  {
    bankCode: '803',
    code: '0168',
    name: '聯邦商業銀行南崁分行',
  },
  {
    bankCode: '803',
    code: '0179',
    name: '聯邦商業銀行新竹分行',
  },
  {
    bankCode: '803',
    code: '0180',
    name: '聯邦商業銀行蘆洲分行',
  },
  {
    bankCode: '803',
    code: '0191',
    name: '聯邦商業銀行國際金融業務分行',
  },
  {
    bankCode: '803',
    code: '0205',
    name: '聯邦商業銀行九如分行',
  },
  {
    bankCode: '803',
    code: '0216',
    name: '聯邦商業銀行雙和分行',
  },
  {
    bankCode: '803',
    code: '0227',
    name: '聯邦商業銀行迴龍分行',
  },
  {
    bankCode: '803',
    code: '0238',
    name: '聯邦商業銀行嘉義分行',
  },
  {
    bankCode: '803',
    code: '0249',
    name: '聯邦商業銀行公館分行',
  },
  {
    bankCode: '803',
    code: '0250',
    name: '聯邦商業銀行內壢分行',
  },
  {
    bankCode: '803',
    code: '0261',
    name: '聯邦商業銀行忠孝分行',
  },
  {
    bankCode: '803',
    code: '0272',
    name: '聯邦商業銀行新莊分行',
  },
  {
    bankCode: '803',
    code: '0283',
    name: '聯邦商業銀行鳳山分行',
  },
  {
    bankCode: '803',
    code: '0294',
    name: '聯邦商業銀行桃鶯分行',
  },
  {
    bankCode: '803',
    code: '0308',
    name: '聯邦商業銀行龍潭分行',
  },
  {
    bankCode: '803',
    code: '0319',
    name: '聯邦商業銀行新店分行',
  },
  {
    bankCode: '803',
    code: '0320',
    name: '聯邦商業銀行大直分行',
  },
  {
    bankCode: '803',
    code: '0331',
    name: '聯邦商業銀行中山簡易型分行',
  },
  {
    bankCode: '803',
    code: '0342',
    name: '聯邦商業銀行文心分行',
  },
  {
    bankCode: '803',
    code: '0353',
    name: '聯邦商業銀行健行分行',
  },
  {
    bankCode: '803',
    code: '0364',
    name: '聯邦商業銀行中和分行',
  },
  {
    bankCode: '803',
    code: '0375',
    name: '聯邦商業銀行內湖分行',
  },
  {
    bankCode: '803',
    code: '0386',
    name: '聯邦商業銀行大園分行',
  },
  {
    bankCode: '803',
    code: '0397',
    name: '聯邦商業銀行永和分行',
  },
  {
    bankCode: '803',
    code: '0401',
    name: '聯邦商業銀行中港簡易型分行',
  },
  {
    bankCode: '803',
    code: '0412',
    name: '聯邦商業銀行通化簡易型分行',
  },
  {
    bankCode: '803',
    code: '0423',
    name: '聯邦商業銀行士東分行',
  },
  {
    bankCode: '803',
    code: '0434',
    name: '聯邦商業銀行微風簡易型分行',
  },
  {
    bankCode: '803',
    code: '0445',
    name: '聯邦商業銀行長春分行',
  },
  {
    bankCode: '803',
    code: '0456',
    name: '聯邦商業銀行松江分行',
  },
  {
    bankCode: '803',
    code: '0467',
    name: '聯邦商業銀行大安分行',
  },
  {
    bankCode: '803',
    code: '0478',
    name: '聯邦商業銀行永吉分行',
  },
  {
    bankCode: '803',
    code: '0489',
    name: '聯邦商業銀行文林分行',
  },
  {
    bankCode: '803',
    code: '0490',
    name: '聯邦商業銀行東門分行',
  },
  {
    bankCode: '803',
    code: '0504',
    name: '聯邦商業銀行敦化分行',
  },
  {
    bankCode: '803',
    code: '0515',
    name: '聯邦商業銀行西湖分行',
  },
  {
    bankCode: '803',
    code: '0526',
    name: '聯邦商業銀行北投簡易型分行',
  },
  {
    bankCode: '803',
    code: '0537',
    name: '聯邦商業銀行北三重分行',
  },
  {
    bankCode: '803',
    code: '0548',
    name: '聯邦商業銀行後埔分行',
  },
  {
    bankCode: '803',
    code: '0559',
    name: '聯邦商業銀行北中和簡易型分行',
  },
  {
    bankCode: '803',
    code: '0560',
    name: '聯邦商業銀行富國分行',
  },
  {
    bankCode: '803',
    code: '0571',
    name: '聯邦商業銀行樹林分行',
  },
  {
    bankCode: '803',
    code: '0582',
    name: '聯邦商業銀行汐止分行',
  },
  {
    bankCode: '803',
    code: '0593',
    name: '聯邦商業銀行北桃園分行',
  },
  {
    bankCode: '803',
    code: '0607',
    name: '聯邦商業銀行北中壢分行',
  },
  {
    bankCode: '803',
    code: '0618',
    name: '聯邦商業銀行北台中分行',
  },
  {
    bankCode: '803',
    code: '0629',
    name: '聯邦商業銀行民權分行',
  },
  {
    bankCode: '803',
    code: '0630',
    name: '聯邦商業銀行西屯分行',
  },
  {
    bankCode: '803',
    code: '0641',
    name: '聯邦商業銀行興中分行',
  },
  {
    bankCode: '803',
    code: '0652',
    name: '聯邦商業銀行北屯分行',
  },
  {
    bankCode: '803',
    code: '0663',
    name: '聯邦商業銀行南員林分行',
  },
  {
    bankCode: '803',
    code: '0674',
    name: '聯邦商業銀行東嘉義分行',
  },
  {
    bankCode: '803',
    code: '0685',
    name: '聯邦商業銀行府城分行',
  },
  {
    bankCode: '803',
    code: '0696',
    name: '聯邦商業銀行豐原分行',
  },
  {
    bankCode: '803',
    code: '0700',
    name: '聯邦商業銀行富強分行',
  },
  {
    bankCode: '803',
    code: '0711',
    name: '聯邦商業銀行開元分行',
  },
  {
    bankCode: '803',
    code: '0722',
    name: '聯邦商業銀行南台南分行',
  },
  {
    bankCode: '803',
    code: '0733',
    name: '聯邦商業銀行苓雅分行',
  },
  {
    bankCode: '803',
    code: '0744',
    name: '聯邦商業銀行北高雄分行',
  },
  {
    bankCode: '803',
    code: '0755',
    name: '聯邦商業銀行三民分行',
  },
  {
    bankCode: '803',
    code: '0766',
    name: '聯邦商業銀行五甲分行',
  },
  {
    bankCode: '803',
    code: '0777',
    name: '聯邦商業銀行屏東分行',
  },
  {
    bankCode: '803',
    code: '0788',
    name: '聯邦商業銀行和平分行',
  },
  {
    bankCode: '803',
    code: '0799',
    name: '聯邦商業銀行永春分行',
  },
  {
    bankCode: '803',
    code: '0803',
    name: '聯邦商業銀行田心分行',
  },
  {
    bankCode: '803',
    code: '0814',
    name: '聯邦商業銀行安康分行',
  },
  {
    bankCode: '803',
    code: '0825',
    name: '聯邦商業銀行大竹分行',
  },
  {
    bankCode: '803',
    code: '0836',
    name: '聯邦商業銀行龜山分行',
  },
  {
    bankCode: '803',
    code: '0847',
    name: '聯邦商業銀行林口分行',
  },
  {
    bankCode: '803',
    code: '0858',
    name: '聯邦商業銀行五股分行',
  },
  {
    bankCode: '803',
    code: '0869',
    name: '聯邦商業銀行高榮分行',
  },
  {
    bankCode: '803',
    code: '0870',
    name: '聯邦商業銀行大業分行',
  },
  {
    bankCode: '803',
    code: '0881',
    name: '聯邦商業銀行蘆竹分行',
  },
  {
    bankCode: '803',
    code: '0892',
    name: '聯邦商業銀行土城分行',
  },
  {
    bankCode: '803',
    code: '0906',
    name: '聯邦商業銀行南桃園分行',
  },
  {
    bankCode: '803',
    code: '0917',
    name: '聯邦商業銀行集賢分行',
  },
  {
    bankCode: '803',
    code: '0928',
    name: '聯邦商業銀行三峽分行',
  },
  {
    bankCode: '803',
    code: '0939',
    name: '聯邦商業銀行東湖分行',
  },
  {
    bankCode: '803',
    code: '7019',
    name: '聯邦商業銀行越南胡志明市代表人辦事處',
  },
  {
    bankCode: '803',
    code: '7020',
    name: '聯邦商業銀行香港代表人辦事處',
  },
  {
    bankCode: '803',
    code: '9002',
    name: '聯邦商業銀行(香港)聯邦財務有限公司',
  },
  {
    bankCode: '805',
    code: '0012',
    name: '遠東國際商業銀行營業部',
  },
  {
    bankCode: '805',
    code: '0023',
    name: '遠東國際商業銀行台北襄陽分行',
  },
  {
    bankCode: '805',
    code: '0034',
    name: '遠東國際商業銀行台北逸仙分行',
  },
  {
    bankCode: '805',
    code: '0045',
    name: '遠東國際商業銀行桃園分行',
  },
  {
    bankCode: '805',
    code: '0056',
    name: '遠東國際商業銀行台中公益分行',
  },
  {
    bankCode: '805',
    code: '0067',
    name: '遠東國際商業銀行台南分行',
  },
  {
    bankCode: '805',
    code: '0078',
    name: '遠東國際商業銀行高雄五福分行',
  },
  {
    bankCode: '805',
    code: '0090',
    name: '遠東國際商業銀行板橋南雅分行',
  },
  {
    bankCode: '805',
    code: '0104',
    name: '遠東國際商業銀行新竹巨城分行',
  },
  {
    bankCode: '805',
    code: '0115',
    name: '遠東國際商業銀行高雄中正分行',
  },
  {
    bankCode: '805',
    code: '0126',
    name: '遠東國際商業銀行信託部',
  },
  {
    bankCode: '805',
    code: '0137',
    name: '遠東國際商業銀行國外部',
  },
  {
    bankCode: '805',
    code: '0148',
    name: '遠東國際商業銀行三重分行',
  },
  {
    bankCode: '805',
    code: '0159',
    name: '遠東國際商業銀行台北松江分行',
  },
  {
    bankCode: '805',
    code: '0160',
    name: '遠東國際商業銀行永康分行',
  },
  {
    bankCode: '805',
    code: '0171',
    name: '遠東國際商業銀行中壢分行',
  },
  {
    bankCode: '805',
    code: '0182',
    name: '遠東國際商業銀行國際金融分行',
  },
  {
    bankCode: '805',
    code: '0193',
    name: '遠東國際商業銀行永和分行',
  },
  {
    bankCode: '805',
    code: '0207',
    name: '遠東國際商業銀行台北東門分行',
  },
  {
    bankCode: '805',
    code: '0218',
    name: '遠東國際商業銀行高雄文化中心分行',
  },
  {
    bankCode: '805',
    code: '0229',
    name: '遠東國際商業銀行台中文心分行',
  },
  {
    bankCode: '805',
    code: '0230',
    name: '遠東國際商業銀行新竹科學園區分行',
  },
  {
    bankCode: '805',
    code: '0241',
    name: '遠東國際商業銀行桃園大興分行',
  },
  {
    bankCode: '805',
    code: '0252',
    name: '遠東國際商業銀行台北南門分行',
  },
  {
    bankCode: '805',
    code: '0263',
    name: '遠東國際商業銀行台北新莊分行',
  },
  {
    bankCode: '805',
    code: '0274',
    name: '遠東國際商業銀行台北松山分行',
  },
  {
    bankCode: '805',
    code: '0285',
    name: '遠東國際商業銀行新店分行',
  },
  {
    bankCode: '805',
    code: '0296',
    name: '遠東國際商業銀行台北重慶分行',
  },
  {
    bankCode: '805',
    code: '0300',
    name: '遠東國際商業銀行竹北分行',
  },
  {
    bankCode: '805',
    code: '0311',
    name: '遠東國際商業銀行台北忠孝分行',
  },
  {
    bankCode: '805',
    code: '0322',
    name: '遠東國際商業銀行林口分行',
  },
  {
    bankCode: '805',
    code: '0333',
    name: '遠東國際商業銀行板橋文化分行',
  },
  {
    bankCode: '805',
    code: '0344',
    name: '遠東國際商業銀行台中自由分行',
  },
  {
    bankCode: '805',
    code: '0355',
    name: '遠東國際商業銀行新莊富國分行',
  },
  {
    bankCode: '805',
    code: '0366',
    name: '遠東國際商業銀行台北永吉分行',
  },
  {
    bankCode: '805',
    code: '0388',
    name: '遠東國際商業銀行桃園大有分行',
  },
  {
    bankCode: '805',
    code: '0399',
    name: '遠東國際商業銀行台北金湖簡易型分行',
  },
  {
    bankCode: '805',
    code: '0403',
    name: '遠東國際商業銀行台北農安簡易型分行',
  },
  {
    bankCode: '805',
    code: '0414',
    name: '遠東國際商業銀行台北中山分行',
  },
  {
    bankCode: '805',
    code: '0425',
    name: '遠東國際商業銀行台北古亭分行',
  },
  {
    bankCode: '805',
    code: '0436',
    name: '遠東國際商業銀行台北信義分行',
  },
  {
    bankCode: '805',
    code: '0458',
    name: '遠東國際商業銀行蘆洲分行',
  },
  {
    bankCode: '805',
    code: '0469',
    name: '遠東國際商業銀行中和分行',
  },
  {
    bankCode: '805',
    code: '0470',
    name: '遠東國際商業銀行板橋中正分行',
  },
  {
    bankCode: '805',
    code: '0481',
    name: '遠東國際商業銀行新竹經國分行',
  },
  {
    bankCode: '805',
    code: '0492',
    name: '遠東國際商業銀行台中大雅分行',
  },
  {
    bankCode: '805',
    code: '0506',
    name: '遠東國際商業銀行彰化分行',
  },
  {
    bankCode: '805',
    code: '0517',
    name: '遠東國際商業銀行南投分行',
  },
  {
    bankCode: '805',
    code: '0528',
    name: '遠東國際商業銀行嘉義分行',
  },
  {
    bankCode: '805',
    code: '0540',
    name: '遠東國際商業銀行鳳山分行',
  },
  {
    bankCode: '805',
    code: '0562',
    name: '遠東國際商業銀行大里分行',
  },
  {
    bankCode: '805',
    code: '0573',
    name: '遠東國際商業銀行崇德分行',
  },
  {
    bankCode: '805',
    code: '0584',
    name: '遠東國際商業銀行板橋大遠百分行',
  },
  {
    bankCode: '805',
    code: '0595',
    name: '遠東國際商業銀行台北敦南分行',
  },
  {
    bankCode: '805',
    code: '0609',
    name: '遠東國際商業銀行雙和分行',
  },
  {
    bankCode: '805',
    code: '0610',
    name: '遠東國際商業銀行台北南京東路分行',
  },
  {
    bankCode: '805',
    code: '0621',
    name: '遠東國際商業銀行台北大稻埕分行',
  },
  {
    bankCode: '805',
    code: '0632',
    name: '遠東國際商業銀行石牌分行',
  },
  {
    bankCode: '805',
    code: '0643',
    name: '遠東國際商業銀行台北101簡易型分行',
  },
  {
    bankCode: '805',
    code: '9004',
    name: '遠東商銀香港分行',
  },
  {
    bankCode: '806',
    code: '0013',
    name: '元大商業銀行台中分行',
  },
  {
    bankCode: '806',
    code: '0024',
    name: '元大商業銀行文心分行',
  },
  {
    bankCode: '806',
    code: '0035',
    name: '元大商業銀行台北分行',
  },
  {
    bankCode: '806',
    code: '0046',
    name: '元大商業銀行沙鹿分行',
  },
  {
    bankCode: '806',
    code: '0057',
    name: '元大商業銀行豐原分行',
  },
  {
    bankCode: '806',
    code: '0068',
    name: '元大商業銀行彰化分行',
  },
  {
    bankCode: '806',
    code: '0079',
    name: '元大商業銀行員林分行',
  },
  {
    bankCode: '806',
    code: '0080',
    name: '元大商業銀行三重分行',
  },
  {
    bankCode: '806',
    code: '0091',
    name: '元大商業銀行平鎮分行',
  },
  {
    bankCode: '806',
    code: '0105',
    name: '元大商業銀行草屯分行',
  },
  {
    bankCode: '806',
    code: '0116',
    name: '元大商業銀行永康分行',
  },
  {
    bankCode: '806',
    code: '0138',
    name: '元大商業銀行信託部',
  },
  {
    bankCode: '806',
    code: '0149',
    name: '元大商業銀行國外部',
  },
  {
    bankCode: '806',
    code: '0150',
    name: '元大商業銀行景美分行',
  },
  {
    bankCode: '806',
    code: '0161',
    name: '元大商業銀行新竹分行',
  },
  {
    bankCode: '806',
    code: '0172',
    name: '元大商業銀行鹿港分行',
  },
  {
    bankCode: '806',
    code: '0183',
    name: '元大商業銀行斗信分行',
  },
  {
    bankCode: '806',
    code: '0194',
    name: '元大商業銀行嘉義分行',
  },
  {
    bankCode: '806',
    code: '0208',
    name: '元大商業銀行國際金融業務分行',
  },
  {
    bankCode: '806',
    code: '0219',
    name: '元大商業銀行南京東路分行',
  },
  {
    bankCode: '806',
    code: '0220',
    name: '元大商業銀行永和分行',
  },
  {
    bankCode: '806',
    code: '0231',
    name: '元大商業銀行復興分行',
  },
  {
    bankCode: '806',
    code: '0242',
    name: '元大商業銀行大里分行',
  },
  {
    bankCode: '806',
    code: '0253',
    name: '元大商業銀行博愛分行',
  },
  {
    bankCode: '806',
    code: '0264',
    name: '元大商業銀行苗栗分行',
  },
  {
    bankCode: '806',
    code: '0275',
    name: '元大商業銀行崇德分行',
  },
  {
    bankCode: '806',
    code: '0286',
    name: '元大商業銀行北斗分行',
  },
  {
    bankCode: '806',
    code: '0297',
    name: '元大商業銀行佳里分行',
  },
  {
    bankCode: '806',
    code: '0301',
    name: '元大商業銀行大甲分行',
  },
  {
    bankCode: '806',
    code: '0312',
    name: '元大商業銀行虎尾分行',
  },
  {
    bankCode: '806',
    code: '0334',
    name: '元大商業銀行士林分行',
  },
  {
    bankCode: '806',
    code: '0345',
    name: '元大商業銀行南崁分行',
  },
  {
    bankCode: '806',
    code: '0367',
    name: '元大商業銀行古亭分行',
  },
  {
    bankCode: '806',
    code: '0378',
    name: '元大商業銀行新莊分行',
  },
  {
    bankCode: '806',
    code: '0389',
    name: '元大商業銀行中壢分行',
  },
  {
    bankCode: '806',
    code: '0404',
    name: '元大商業銀行三民分行',
  },
  {
    bankCode: '806',
    code: '0415',
    name: '元大商業銀行城中分行',
  },
  {
    bankCode: '806',
    code: '0426',
    name: '元大商業銀行屏東分行',
  },
  {
    bankCode: '806',
    code: '0448',
    name: '元大商業銀行斗南分行',
  },
  {
    bankCode: '806',
    code: '0482',
    name: '元大商業銀行板橋分行',
  },
  {
    bankCode: '806',
    code: '0493',
    name: '元大商業銀行桃園分行',
  },
  {
    bankCode: '806',
    code: '0518',
    name: '元大商業銀行三多分行',
  },
  {
    bankCode: '806',
    code: '0529',
    name: '元大商業銀行東信分行',
  },
  {
    bankCode: '806',
    code: '0585',
    name: '元大商業銀行內湖分行',
  },
  {
    bankCode: '806',
    code: '0596',
    name: '元大商業銀行羅東分行',
  },
  {
    bankCode: '806',
    code: '0600',
    name: '元大商業銀行金門分行',
  },
  {
    bankCode: '806',
    code: '0611',
    name: '元大商業銀行台南分行',
  },
  {
    bankCode: '806',
    code: '0622',
    name: '元大商業銀行林口分行',
  },
  {
    bankCode: '806',
    code: '0633',
    name: '元大商業銀行竹北分行',
  },
  {
    bankCode: '806',
    code: '0688',
    name: '元大商業銀行府城分行',
  },
  {
    bankCode: '806',
    code: '0699',
    name: '元大商業銀行府東分行',
  },
  {
    bankCode: '806',
    code: '0806',
    name: '元大商業銀行開元分行',
  },
  {
    bankCode: '806',
    code: '0828',
    name: '元大商業銀行安和分行',
  },
  {
    bankCode: '806',
    code: '0839',
    name: '元大商業銀行中和分行',
  },
  {
    bankCode: '806',
    code: '0840',
    name: '元大商業銀行松江分行',
  },
  {
    bankCode: '806',
    code: '0851',
    name: '元大商業銀行竹科分行',
  },
  {
    bankCode: '806',
    code: '0862',
    name: '元大商業銀行天母分行',
  },
  {
    bankCode: '806',
    code: '0873',
    name: '元大商業銀行蘆洲分行',
  },
  {
    bankCode: '806',
    code: '0884',
    name: '元大商業銀行信義分行',
  },
  {
    bankCode: '806',
    code: '0895',
    name: '元大商業銀行中山北路分行',
  },
  {
    bankCode: '806',
    code: '0909',
    name: '元大商業銀行民生分行',
  },
  {
    bankCode: '806',
    code: '0910',
    name: '元大商業銀行新店分行',
  },
  {
    bankCode: '806',
    code: '0932',
    name: '元大商業銀行忠孝分行',
  },
  {
    bankCode: '806',
    code: '0943',
    name: '元大商業銀行桃興分行',
  },
  {
    bankCode: '806',
    code: '0954',
    name: '元大商業銀行中港分行',
  },
  {
    bankCode: '806',
    code: '0965',
    name: '元大商業銀行花蓮分行',
  },
  {
    bankCode: '806',
    code: '0976',
    name: '元大商業銀行承德分行',
  },
  {
    bankCode: '806',
    code: '0987',
    name: '元大商業銀行太平分行',
  },
  {
    bankCode: '806',
    code: '0998',
    name: '元大商業銀行營業部',
  },
  {
    bankCode: '806',
    code: '1009',
    name: '元大商業銀行土城分行',
  },
  {
    bankCode: '806',
    code: '1021',
    name: '元大商業銀行大同分行',
  },
  {
    bankCode: '806',
    code: '1032',
    name: '元大商業銀行松山分行',
  },
  {
    bankCode: '806',
    code: '1043',
    name: '元大商業銀行大安分行',
  },
  {
    bankCode: '806',
    code: '1076',
    name: '元大商業銀行北三重分行',
  },
  {
    bankCode: '806',
    code: '1087',
    name: '元大商業銀行上新莊分行',
  },
  {
    bankCode: '806',
    code: '1102',
    name: '元大商業銀行高雄分行',
  },
  {
    bankCode: '806',
    code: '1191',
    name: '元大商業銀行大統分行',
  },
  {
    bankCode: '806',
    code: '1205',
    name: '元大商業銀行雙和分行',
  },
  {
    bankCode: '806',
    code: '1216',
    name: '元大商業銀行北投分行',
  },
  {
    bankCode: '806',
    code: '1227',
    name: '元大商業銀行延平分行',
  },
  {
    bankCode: '806',
    code: '1238',
    name: '元大商業銀行文德分行',
  },
  {
    bankCode: '806',
    code: '1250',
    name: '元大商業銀行左營分行',
  },
  {
    bankCode: '806',
    code: '1261',
    name: '元大商業銀行埔墘分行',
  },
  {
    bankCode: '806',
    code: '1272',
    name: '元大商業銀行公館分行',
  },
  {
    bankCode: '806',
    code: '1283',
    name: '元大商業銀行新店中正分行',
  },
  {
    bankCode: '806',
    code: '1308',
    name: '元大商業銀行西門分行',
  },
  {
    bankCode: '806',
    code: '1319',
    name: '元大商業銀行樹林分行',
  },
  {
    bankCode: '806',
    code: '1320',
    name: '元大商業銀行光復分行',
  },
  {
    bankCode: '806',
    code: '1331',
    name: '元大商業銀行南港分行',
  },
  {
    bankCode: '806',
    code: '1342',
    name: '元大商業銀行苓雅分行',
  },
  {
    bankCode: '806',
    code: '1353',
    name: '元大商業銀行敦化分行',
  },
  {
    bankCode: '806',
    code: '1364',
    name: '元大商業銀行屏榮分行',
  },
  {
    bankCode: '806',
    code: '1375',
    name: '元大商業銀行前鎮中山分行',
  },
  {
    bankCode: '806',
    code: '1386',
    name: '元大商業銀行高鳳分行',
  },
  {
    bankCode: '806',
    code: '1397',
    name: '元大商業銀行北府分行',
  },
  {
    bankCode: '806',
    code: '1401',
    name: '元大商業銀行南嘉義分行',
  },
  {
    bankCode: '806',
    code: '1412',
    name: '元大商業銀行東台北分行',
  },
  {
    bankCode: '806',
    code: '1423',
    name: '元大商業銀行南新莊分行',
  },
  {
    bankCode: '806',
    code: '1434',
    name: '元大商業銀行新壢分行',
  },
  {
    bankCode: '806',
    code: '1445',
    name: '元大商業銀行水湳分行',
  },
  {
    bankCode: '806',
    code: '1456',
    name: '元大商業銀行大昌分行',
  },
  {
    bankCode: '806',
    code: '1467',
    name: '元大商業銀行華山分行',
  },
  {
    bankCode: '806',
    code: '1478',
    name: '元大商業銀行東板橋分行',
  },
  {
    bankCode: '806',
    code: '1489',
    name: '元大商業銀行沙鹿中山分行',
  },
  {
    bankCode: '806',
    code: '1490',
    name: '元大商業銀行十全分行',
  },
  {
    bankCode: '806',
    code: '1504',
    name: '元大商業銀行延吉分行',
  },
  {
    bankCode: '806',
    code: '1526',
    name: '元大商業銀行成功分行',
  },
  {
    bankCode: '806',
    code: '1548',
    name: '元大商業銀行右昌分行',
  },
  {
    bankCode: '806',
    code: '1559',
    name: '元大商業銀行前金分行',
  },
  {
    bankCode: '806',
    code: '1560',
    name: '元大商業銀行五甲分行',
  },
  {
    bankCode: '806',
    code: '1571',
    name: '元大商業銀行連城分行',
  },
  {
    bankCode: '806',
    code: '1582',
    name: '元大商業銀行新營分行',
  },
  {
    bankCode: '806',
    code: '1593',
    name: '元大商業銀行大和平分行',
  },
  {
    bankCode: '806',
    code: '1607',
    name: '元大商業銀行金華分行',
  },
  {
    bankCode: '806',
    code: '1618',
    name: '元大商業銀行瑞光分行',
  },
  {
    bankCode: '806',
    code: '1629',
    name: '元大商業銀行灣裡分行',
  },
  {
    bankCode: '806',
    code: '1630',
    name: '元大商業銀行安南分行',
  },
  {
    bankCode: '806',
    code: '1641',
    name: '元大商業銀行江翠分行',
  },
  {
    bankCode: '806',
    code: '1652',
    name: '元大商業銀行長庚分行',
  },
  {
    bankCode: '806',
    code: '1674',
    name: '元大商業銀行世貿分行',
  },
  {
    bankCode: '806',
    code: '1685',
    name: '元大商業銀行東新竹分行',
  },
  {
    bankCode: '806',
    code: '1696',
    name: '元大商業銀行汐止分行',
  },
  {
    bankCode: '806',
    code: '1700',
    name: '元大商業銀行忠誠分行',
  },
  {
    bankCode: '806',
    code: '1722',
    name: '元大商業銀行澄清分行',
  },
  {
    bankCode: '806',
    code: '1733',
    name: '元大商業銀行秀朗分行',
  },
  {
    bankCode: '806',
    code: '1744',
    name: '元大商業銀行小港分行',
  },
  {
    bankCode: '806',
    code: '1755',
    name: '元大商業銀行北桃園分行',
  },
  {
    bankCode: '806',
    code: '1766',
    name: '元大商業銀行永春分行',
  },
  {
    bankCode: '806',
    code: '1777',
    name: '元大商業銀行圓山分行',
  },
  {
    bankCode: '806',
    code: '1788',
    name: '元大商業銀行豐仁分行',
  },
  {
    bankCode: '806',
    code: '1799',
    name: '元大商業銀行彰興分行',
  },
  {
    bankCode: '806',
    code: '1814',
    name: '元大商業銀行大里德芳分行',
  },
  {
    bankCode: '806',
    code: '1825',
    name: '元大商業銀行北台中分行',
  },
  {
    bankCode: '806',
    code: '1836',
    name: '元大商業銀行旗津分行',
  },
  {
    bankCode: '806',
    code: '1858',
    name: '元大商業銀行鼓山分行',
  },
  {
    bankCode: '806',
    code: '1869',
    name: '元大商業銀行前鎮分行',
  },
  {
    bankCode: '806',
    code: '1870',
    name: '元大商業銀行明誠分行',
  },
  {
    bankCode: '806',
    code: '1881',
    name: '元大商業銀行中正分行',
  },
  {
    bankCode: '806',
    code: '1892',
    name: '元大商業銀行石牌分行',
  },
  {
    bankCode: '806',
    code: '1928',
    name: '元大商業銀行南門分行',
  },
  {
    bankCode: '806',
    code: '1939',
    name: '元大商業銀行新板分行',
  },
  {
    bankCode: '806',
    code: '1940',
    name: '元大商業銀行北新分行',
  },
  {
    bankCode: '806',
    code: '1951',
    name: '元大商業銀行南屯分行',
  },
  {
    bankCode: '806',
    code: '1962',
    name: '元大商業銀行中山分行',
  },
  {
    bankCode: '806',
    code: '1973',
    name: '元大商業銀行東門分行',
  },
  {
    bankCode: '806',
    code: '1984',
    name: '元大商業銀行金城分行',
  },
  {
    bankCode: '806',
    code: '1995',
    name: '元大商業銀行民族分行',
  },
  {
    bankCode: '806',
    code: '2006',
    name: '元大商業銀行頭份分行',
  },
  {
    bankCode: '806',
    code: '9016',
    name: 'Yuanta Savings Bank(Philippines)元大儲蓄銀行(菲律賓)',
  },
  {
    bankCode: '806',
    code: '9027',
    name: 'Yuanta Savings Bank(Philippines)-Alabang Branch',
  },
  {
    bankCode: '806',
    code: '9038',
    name: 'Yuanta Savings Bank(Philippines)-Ortigas Branch',
  },
  {
    bankCode: '806',
    code: '9049',
    name: '元大商業銀行緬甸仰光代表人辦事處',
  },
  {
    bankCode: '806',
    code: '9050',
    name: 'Yuanta Savings Bank (Korea)元大儲蓄銀行(韓國)',
  },
  {
    bankCode: '806',
    code: '9061',
    name: 'Yuanta Savings Bank -Euljiro Branch',
  },
  {
    bankCode: '806',
    code: '9072',
    name: '元大商業銀行香港分行',
  },
  {
    bankCode: '807',
    code: '0014',
    name: '永豐商業銀行世貿分行',
  },
  {
    bankCode: '807',
    code: '0025',
    name: '永豐商業銀行敦北分行',
  },
  {
    bankCode: '807',
    code: '0036',
    name: '永豐商業銀行台中分行',
  },
  {
    bankCode: '807',
    code: '0047',
    name: '永豐商業銀行高雄分行',
  },
  {
    bankCode: '807',
    code: '0058',
    name: '永豐商業銀行忠孝分行',
  },
  {
    bankCode: '807',
    code: '0069',
    name: '永豐商業銀行西松分行',
  },
  {
    bankCode: '807',
    code: '0070',
    name: '永豐商業銀行板新分行',
  },
  {
    bankCode: '807',
    code: '0081',
    name: '永豐商業銀行信託部',
  },
  {
    bankCode: '807',
    code: '0092',
    name: '永豐商業銀行敦南分行',
  },
  {
    bankCode: '807',
    code: '0106',
    name: '永豐商業銀行新泰分行',
  },
  {
    bankCode: '807',
    code: '0117',
    name: '永豐商業銀行桃園分行',
  },
  {
    bankCode: '807',
    code: '0128',
    name: '永豐商業銀行北台中分行',
  },
  {
    bankCode: '807',
    code: '0139',
    name: '永豐商業銀行台南分行',
  },
  {
    bankCode: '807',
    code: '0140',
    name: '永豐商業銀行國外部',
  },
  {
    bankCode: '807',
    code: '0151',
    name: '永豐商業銀行松江分行',
  },
  {
    bankCode: '807',
    code: '0162',
    name: '永豐商業銀行嘉義分行',
  },
  {
    bankCode: '807',
    code: '0173',
    name: '永豐商業銀行三民分行',
  },
  {
    bankCode: '807',
    code: '0184',
    name: '永豐商業銀行新竹分行',
  },
  {
    bankCode: '807',
    code: '0195',
    name: '永豐商業銀行三重分行',
  },
  {
    bankCode: '807',
    code: '0209',
    name: '永豐商業銀行國際金融業務分行',
  },
  {
    bankCode: '807',
    code: '0210',
    name: '永豐商業銀行台北分行',
  },
  {
    bankCode: '807',
    code: '0221',
    name: '永豐商業銀行彰化分行',
  },
  {
    bankCode: '807',
    code: '0232',
    name: '永豐商業銀行岡山分行',
  },
  {
    bankCode: '807',
    code: '0243',
    name: '永豐商業銀行中壢分行',
  },
  {
    bankCode: '807',
    code: '0254',
    name: '永豐商業銀行鳳山分行',
  },
  {
    bankCode: '807',
    code: '0276',
    name: '永豐商業銀行北新分行',
  },
  {
    bankCode: '807',
    code: '0287',
    name: '永豐商業銀行屏東分行',
  },
  {
    bankCode: '807',
    code: '0298',
    name: '永豐商業銀行北桃園分行',
  },
  {
    bankCode: '807',
    code: '0302',
    name: '永豐商業銀行學府分行',
  },
  {
    bankCode: '807',
    code: '0313',
    name: '永豐商業銀行南高雄分行',
  },
  {
    bankCode: '807',
    code: '0324',
    name: '永豐商業銀行光華分行',
  },
  {
    bankCode: '807',
    code: '0335',
    name: '永豐商業銀行東門分行',
  },
  {
    bankCode: '807',
    code: '0346',
    name: '永豐商業銀行天母分行',
  },
  {
    bankCode: '807',
    code: '0357',
    name: '永豐商業銀行東板橋分行',
  },
  {
    bankCode: '807',
    code: '0368',
    name: '永豐商業銀行東台南分行',
  },
  {
    bankCode: '807',
    code: '0379',
    name: '永豐商業銀行竹南分行',
  },
  {
    bankCode: '807',
    code: '0380',
    name: '永豐商業銀行南台中分行',
  },
  {
    bankCode: '807',
    code: '0391',
    name: '永豐商業銀行竹北自強分行',
  },
  {
    bankCode: '807',
    code: '0405',
    name: '永豐商業銀行永康分行',
  },
  {
    bankCode: '807',
    code: '0416',
    name: '永豐商業銀行中科分行',
  },
  {
    bankCode: '807',
    code: '0427',
    name: '永豐商業銀行北高雄分行',
  },
  {
    bankCode: '807',
    code: '0438',
    name: '永豐商業銀行金門分行',
  },
  {
    bankCode: '807',
    code: '0449',
    name: '永豐商業銀行興大分行',
  },
  {
    bankCode: '807',
    code: '0450',
    name: '永豐商業銀行中崙分行',
  },
  {
    bankCode: '807',
    code: '0461',
    name: '永豐商業銀行西湖分行',
  },
  {
    bankCode: '807',
    code: '0472',
    name: '永豐商業銀行豐原分行',
  },
  {
    bankCode: '807',
    code: '0483',
    name: '永豐商業銀行大里分行',
  },
  {
    bankCode: '807',
    code: '1011',
    name: '永豐商業銀行忠孝東路分行',
  },
  {
    bankCode: '807',
    code: '1033',
    name: '永豐商業銀行建成分行',
  },
  {
    bankCode: '807',
    code: '1044',
    name: '永豐商業銀行西門分行',
  },
  {
    bankCode: '807',
    code: '1055',
    name: '永豐商業銀行萬華分行',
  },
  {
    bankCode: '807',
    code: '1066',
    name: '永豐商業銀行興隆分行',
  },
  {
    bankCode: '807',
    code: '1077',
    name: '永豐商業銀行南門分行',
  },
  {
    bankCode: '807',
    code: '1088',
    name: '永豐商業銀行長安分行',
  },
  {
    bankCode: '807',
    code: '1099',
    name: '永豐商業銀行延平分行',
  },
  {
    bankCode: '807',
    code: '1103',
    name: '永豐商業銀行北投分行',
  },
  {
    bankCode: '807',
    code: '1114',
    name: '永豐商業銀行松山分行',
  },
  {
    bankCode: '807',
    code: '1125',
    name: '永豐商業銀行中山分行',
  },
  {
    bankCode: '807',
    code: '1136',
    name: '永豐商業銀行士林分行',
  },
  {
    bankCode: '807',
    code: '1158',
    name: '永豐商業銀行雙園分行',
  },
  {
    bankCode: '807',
    code: '1169',
    name: '永豐商業銀行永和分行',
  },
  {
    bankCode: '807',
    code: '1170',
    name: '永豐商業銀行板橋分行',
  },
  {
    bankCode: '807',
    code: '1181',
    name: '永豐商業銀行基隆分行',
  },
  {
    bankCode: '807',
    code: '1192',
    name: '永豐商業銀行羅東分行',
  },
  {
    bankCode: '807',
    code: '1206',
    name: '永豐商業銀行宜蘭分行',
  },
  {
    bankCode: '807',
    code: '1217',
    name: '永豐商業銀行營業部',
  },
  {
    bankCode: '807',
    code: '1228',
    name: '永豐商業銀行景美分行',
  },
  {
    bankCode: '807',
    code: '1239',
    name: '永豐商業銀行新莊分行',
  },
  {
    bankCode: '807',
    code: '1251',
    name: '永豐商業銀行汐止分行',
  },
  {
    bankCode: '807',
    code: '1262',
    name: '永豐商業銀行城中分行',
  },
  {
    bankCode: '807',
    code: '1273',
    name: '永豐商業銀行光復分行',
  },
  {
    bankCode: '807',
    code: '1284',
    name: '永豐商業銀行正義分行',
  },
  {
    bankCode: '807',
    code: '1295',
    name: '永豐商業銀行中和分行',
  },
  {
    bankCode: '807',
    code: '1310',
    name: '永豐商業銀行士東分行',
  },
  {
    bankCode: '807',
    code: '1321',
    name: '永豐商業銀行中港分行',
  },
  {
    bankCode: '807',
    code: '1332',
    name: '永豐商業銀行蘆洲分行',
  },
  {
    bankCode: '807',
    code: '1343',
    name: '永豐商業銀行內湖分行',
  },
  {
    bankCode: '807',
    code: '1354',
    name: '永豐商業銀行社子分行',
  },
  {
    bankCode: '807',
    code: '1365',
    name: '永豐商業銀行信義分行',
  },
  {
    bankCode: '807',
    code: '1376',
    name: '永豐商業銀行永春分行',
  },
  {
    bankCode: '807',
    code: '1387',
    name: '永豐商業銀行南三重分行',
  },
  {
    bankCode: '807',
    code: '1398',
    name: '永豐商業銀行積穗分行',
  },
  {
    bankCode: '807',
    code: '1402',
    name: '永豐商業銀行鶯歌分行',
  },
  {
    bankCode: '807',
    code: '1413',
    name: '永豐商業銀行新店分行',
  },
  {
    bankCode: '807',
    code: '1435',
    name: '永豐商業銀行西盛分行',
  },
  {
    bankCode: '807',
    code: '1446',
    name: '永豐商業銀行板橋忠孝分行',
  },
  {
    bankCode: '807',
    code: '1457',
    name: '永豐商業銀行思源分行',
  },
  {
    bankCode: '807',
    code: '1468',
    name: '永豐商業銀行土城分行',
  },
  {
    bankCode: '807',
    code: '1479',
    name: '永豐商業銀行三興分行',
  },
  {
    bankCode: '807',
    code: '1480',
    name: '永豐商業銀行龍江分行',
  },
  {
    bankCode: '807',
    code: '1491',
    name: '永豐商業銀行樹林分行',
  },
  {
    bankCode: '807',
    code: '1505',
    name: '永豐商業銀行五股分行',
  },
  {
    bankCode: '807',
    code: '1538',
    name: '永豐商業銀行松德分行',
  },
  {
    bankCode: '807',
    code: '1549',
    name: '永豐商業銀行東湖分行',
  },
  {
    bankCode: '807',
    code: '1550',
    name: '永豐商業銀行華江分行',
  },
  {
    bankCode: '807',
    code: '1561',
    name: '永豐商業銀行北三重分行',
  },
  {
    bankCode: '807',
    code: '1572',
    name: '永豐商業銀行蘭雅分行',
  },
  {
    bankCode: '807',
    code: '1583',
    name: '永豐商業銀行德惠分行',
  },
  {
    bankCode: '807',
    code: '1594',
    name: '永豐商業銀行迴龍分行',
  },
  {
    bankCode: '807',
    code: '1608',
    name: '永豐商業銀行仁愛分行',
  },
  {
    bankCode: '807',
    code: '1620',
    name: '永豐商業銀行和平分行',
  },
  {
    bankCode: '807',
    code: '1642',
    name: '永豐商業銀行重新分行',
  },
  {
    bankCode: '807',
    code: '1653',
    name: '永豐商業銀行中興分行',
  },
  {
    bankCode: '807',
    code: '1664',
    name: '永豐商業銀行海山分行',
  },
  {
    bankCode: '807',
    code: '1697',
    name: '永豐商業銀行南蘆洲分行',
  },
  {
    bankCode: '807',
    code: '1701',
    name: '永豐商業銀行江子翠分行',
  },
  {
    bankCode: '807',
    code: '1712',
    name: '永豐商業銀行民安分行',
  },
  {
    bankCode: '807',
    code: '1723',
    name: '永豐商業銀行苓雅分行',
  },
  {
    bankCode: '807',
    code: '1734',
    name: '永豐商業銀行林口忠孝分行',
  },
  {
    bankCode: '807',
    code: '1745',
    name: '永豐商業銀行板橋民族分行',
  },
  {
    bankCode: '807',
    code: '1756',
    name: '永豐商業銀行泰山分行',
  },
  {
    bankCode: '807',
    code: '1767',
    name: '永豐商業銀行花蓮分行',
  },
  {
    bankCode: '807',
    code: '1778',
    name: '永豐商業銀行南港分行',
  },
  {
    bankCode: '807',
    code: '1789',
    name: '永豐商業銀行深坑分行',
  },
  {
    bankCode: '807',
    code: '1790',
    name: '永豐商業銀行南崁分行',
  },
  {
    bankCode: '807',
    code: '1804',
    name: '永豐商業銀行北台南分行',
  },
  {
    bankCode: '807',
    code: '1815',
    name: '永豐商業銀行西屯分行',
  },
  {
    bankCode: '807',
    code: '1826',
    name: '永豐商業銀行汐止樟樹分行',
  },
  {
    bankCode: '807',
    code: '1837',
    name: '永豐商業銀行濟南路分行',
  },
  {
    bankCode: '807',
    code: '1859',
    name: '永豐商業銀行南桃園分行',
  },
  {
    bankCode: '807',
    code: '1860',
    name: '永豐商業銀行竹科分行',
  },
  {
    bankCode: '807',
    code: '1871',
    name: '永豐商業銀行員林分行',
  },
  {
    bankCode: '807',
    code: '1882',
    name: '永豐商業銀行楊梅分行',
  },
  {
    bankCode: '807',
    code: '1893',
    name: '永豐商業銀行內壢分行',
  },
  {
    bankCode: '807',
    code: '1907',
    name: '永豐商業銀行重慶北路分行',
  },
  {
    bankCode: '807',
    code: '1929',
    name: '永豐商業銀行大園分行',
  },
  {
    bankCode: '807',
    code: '1930',
    name: '永豐商業銀行竹北光明分行',
  },
  {
    bankCode: '807',
    code: '1963',
    name: '永豐商業銀行竹圍分行',
  },
  {
    bankCode: '807',
    code: '9017',
    name: '永豐商業銀行香港分行',
  },
  {
    bankCode: '807',
    code: '9028',
    name: '永豐商業銀行越南代表人辦事處',
  },
  {
    bankCode: '807',
    code: '9040',
    name: '永豐商業銀行洛杉磯分行',
  },
  {
    bankCode: '807',
    code: '9051',
    name: '永豐金(香港)財務有限公司',
  },
  {
    bankCode: '807',
    code: '9660',
    name: '永豐(香港)保險經紀有限公司',
  },
  {
    bankCode: '807',
    code: '9671',
    name: '永豐銀行(中國)有限公司',
  },
  {
    bankCode: '807',
    code: '9718',
    name: '永豐銀行（中國）有限公司廣州分行',
  },
  {
    bankCode: '807',
    code: '9729',
    name: '永豐銀行（中國）有限公司上海分行',
  },
  {
    bankCode: '807',
    code: '9800',
    name: '永豐商業銀行澳門分行',
  },
  {
    bankCode: '807',
    code: '9811',
    name: '永豐商業銀行九龍分行',
  },
  {
    bankCode: '807',
    code: '9844',
    name: '永豐商業銀行胡志明市分行',
  },
  {
    bankCode: '808',
    code: '0015',
    name: '玉山商業銀行營業部',
  },
  {
    bankCode: '808',
    code: '0026',
    name: '玉山商業銀行南京東路分行',
  },
  {
    bankCode: '808',
    code: '0048',
    name: '玉山商業銀行城東分行',
  },
  {
    bankCode: '808',
    code: '0059',
    name: '玉山商業銀行新莊分行',
  },
  {
    bankCode: '808',
    code: '0060',
    name: '玉山商業銀行新竹分行',
  },
  {
    bankCode: '808',
    code: '0071',
    name: '玉山商業銀行嘉義分行',
  },
  {
    bankCode: '808',
    code: '0082',
    name: '玉山商業銀行高雄分行',
  },
  {
    bankCode: '808',
    code: '0093',
    name: '玉山商業銀行信託部',
  },
  {
    bankCode: '808',
    code: '0107',
    name: '玉山商業銀行國際事務部',
  },
  {
    bankCode: '808',
    code: '0118',
    name: '玉山商業銀行基隆路分行',
  },
  {
    bankCode: '808',
    code: '0129',
    name: '玉山商業銀行雙和分行',
  },
  {
    bankCode: '808',
    code: '0130',
    name: '玉山商業銀行中壢分行',
  },
  {
    bankCode: '808',
    code: '0141',
    name: '玉山商業銀行文心分行',
  },
  {
    bankCode: '808',
    code: '0152',
    name: '玉山商業銀行台南分行',
  },
  {
    bankCode: '808',
    code: '0163',
    name: '玉山商業銀行天母分行',
  },
  {
    bankCode: '808',
    code: '0174',
    name: '玉山商業銀行埔墘分行',
  },
  {
    bankCode: '808',
    code: '0185',
    name: '玉山商業銀行桃園分行',
  },
  {
    bankCode: '808',
    code: '0196',
    name: '玉山商業銀行前鎮分行',
  },
  {
    bankCode: '808',
    code: '0200',
    name: '玉山銀行國際金融業務分行',
  },
  {
    bankCode: '808',
    code: '0211',
    name: '玉山商業銀行民生分行',
  },
  {
    bankCode: '808',
    code: '0222',
    name: '玉山商業銀行大里分行',
  },
  {
    bankCode: '808',
    code: '0233',
    name: '玉山商業銀行永康分行',
  },
  {
    bankCode: '808',
    code: '0244',
    name: '玉山商業銀行鳳山分行',
  },
  {
    bankCode: '808',
    code: '0255',
    name: '玉山商業銀行三和分行',
  },
  {
    bankCode: '808',
    code: '0266',
    name: '玉山商業銀行土城分行',
  },
  {
    bankCode: '808',
    code: '0277',
    name: '玉山商業銀行八德分行',
  },
  {
    bankCode: '808',
    code: '0288',
    name: '玉山商業銀行大墩分行',
  },
  {
    bankCode: '808',
    code: '0299',
    name: '玉山商業銀行七賢分行',
  },
  {
    bankCode: '808',
    code: '0303',
    name: '玉山商業銀行復興分行',
  },
  {
    bankCode: '808',
    code: '0314',
    name: '玉山商業銀行敦南分行',
  },
  {
    bankCode: '808',
    code: '0325',
    name: '玉山商業銀行三重分行',
  },
  {
    bankCode: '808',
    code: '0336',
    name: '玉山商業銀行彰化分行',
  },
  {
    bankCode: '808',
    code: '0347',
    name: '玉山商業銀行北高雄分行',
  },
  {
    bankCode: '808',
    code: '0358',
    name: '玉山商業銀行大雅分行',
  },
  {
    bankCode: '808',
    code: '0369',
    name: '玉山商業銀行楊梅分行',
  },
  {
    bankCode: '808',
    code: '0370',
    name: '玉山商業銀行樹林分行',
  },
  {
    bankCode: '808',
    code: '0381',
    name: '玉山商業銀行豐原分行',
  },
  {
    bankCode: '808',
    code: '0392',
    name: '玉山商業銀行斗六分行',
  },
  {
    bankCode: '808',
    code: '0406',
    name: '玉山商業銀行長春分行',
  },
  {
    bankCode: '808',
    code: '0417',
    name: '玉山商業銀行中山分行',
  },
  {
    bankCode: '808',
    code: '0428',
    name: '玉山商業銀行佳里分行',
  },
  {
    bankCode: '808',
    code: '0439',
    name: '玉山商業銀行中和分行',
  },
  {
    bankCode: '808',
    code: '0440',
    name: '玉山商業銀行竹南分行',
  },
  {
    bankCode: '808',
    code: '0451',
    name: '玉山商業銀行羅東分行',
  },
  {
    bankCode: '808',
    code: '0462',
    name: '玉山商業銀行內湖分行',
  },
  {
    bankCode: '808',
    code: '0473',
    name: '玉山商業銀行壢新分行',
  },
  {
    bankCode: '808',
    code: '0484',
    name: '玉山商業銀行板新分行',
  },
  {
    bankCode: '808',
    code: '0495',
    name: '玉山商業銀行光華分行',
  },
  {
    bankCode: '808',
    code: '0509',
    name: '玉山商業銀行東嘉義分行',
  },
  {
    bankCode: '808',
    code: '0510',
    name: '玉山商業銀行成功分行',
  },
  {
    bankCode: '808',
    code: '0521',
    name: '玉山商業銀行永和分行',
  },
  {
    bankCode: '808',
    code: '0532',
    name: '玉山商業銀行城中分行',
  },
  {
    bankCode: '808',
    code: '0543',
    name: '玉山商業銀行五股分行',
  },
  {
    bankCode: '808',
    code: '0554',
    name: '玉山商業銀行新店分行',
  },
  {
    bankCode: '808',
    code: '0565',
    name: '玉山商業銀行松山分行',
  },
  {
    bankCode: '808',
    code: '0576',
    name: '玉山商業銀行和平分行',
  },
  {
    bankCode: '808',
    code: '0587',
    name: '玉山商業銀行新板特區分行',
  },
  {
    bankCode: '808',
    code: '0598',
    name: '玉山商業銀行民權分行',
  },
  {
    bankCode: '808',
    code: '0602',
    name: '玉山商業銀行泰山分行',
  },
  {
    bankCode: '808',
    code: '0613',
    name: '玉山商業銀行南崁分行',
  },
  {
    bankCode: '808',
    code: '0624',
    name: '玉山商業銀行大順分行',
  },
  {
    bankCode: '808',
    code: '0635',
    name: '玉山商業銀行左營分行',
  },
  {
    bankCode: '808',
    code: '0646',
    name: '玉山商業銀行楠梓分行',
  },
  {
    bankCode: '808',
    code: '0657',
    name: '玉山商業銀行士林分行',
  },
  {
    bankCode: '808',
    code: '0668',
    name: '玉山商業銀行苓雅分行',
  },
  {
    bankCode: '808',
    code: '0679',
    name: '玉山商業銀行仁愛分行',
  },
  {
    bankCode: '808',
    code: '0680',
    name: '玉山商業銀行南屯分行',
  },
  {
    bankCode: '808',
    code: '0691',
    name: '玉山商業銀行木柵分行',
  },
  {
    bankCode: '808',
    code: '0705',
    name: '玉山商業銀行大昌分行',
  },
  {
    bankCode: '808',
    code: '0716',
    name: '玉山商業銀行台東分行',
  },
  {
    bankCode: '808',
    code: '0727',
    name: '玉山商業銀行澄清分行',
  },
  {
    bankCode: '808',
    code: '0738',
    name: '玉山商業銀行小港分行',
  },
  {
    bankCode: '808',
    code: '0749',
    name: '玉山商業銀行北新莊分行',
  },
  {
    bankCode: '808',
    code: '0750',
    name: '玉山商業銀行竹北分行',
  },
  {
    bankCode: '808',
    code: '0761',
    name: '玉山商業銀行東台南分行',
  },
  {
    bankCode: '808',
    code: '0772',
    name: '玉山商業銀行集賢分行',
  },
  {
    bankCode: '808',
    code: '0783',
    name: '玉山商業銀行基隆分行',
  },
  {
    bankCode: '808',
    code: '0794',
    name: '玉山商業銀行岡山分行',
  },
  {
    bankCode: '808',
    code: '0808',
    name: '玉山商業銀行連城分行',
  },
  {
    bankCode: '808',
    code: '0819',
    name: '玉山商業銀行林園分行',
  },
  {
    bankCode: '808',
    code: '0820',
    name: '玉山商業銀行蘆洲分行',
  },
  {
    bankCode: '808',
    code: '0831',
    name: '玉山商業銀行後庄分行',
  },
  {
    bankCode: '808',
    code: '0842',
    name: '玉山商業銀行南桃園分行',
  },
  {
    bankCode: '808',
    code: '0853',
    name: '玉山商業銀行東三重分行',
  },
  {
    bankCode: '808',
    code: '0864',
    name: '玉山商業銀行北投分行',
  },
  {
    bankCode: '808',
    code: '0875',
    name: '玉山商業銀行忠孝分行',
  },
  {
    bankCode: '808',
    code: '0886',
    name: '玉山商業銀行林口分行',
  },
  {
    bankCode: '808',
    code: '0897',
    name: '玉山商業銀行東湖分行',
  },
  {
    bankCode: '808',
    code: '0901',
    name: '玉山商業銀行北新分行',
  },
  {
    bankCode: '808',
    code: '0912',
    name: '玉山商業銀行中崙分行',
  },
  {
    bankCode: '808',
    code: '0923',
    name: '玉山商業銀行建成分行',
  },
  {
    bankCode: '808',
    code: '0934',
    name: '玉山商業銀行屏東分行',
  },
  {
    bankCode: '808',
    code: '0945',
    name: '玉山商業銀行二重分行',
  },
  {
    bankCode: '808',
    code: '0956',
    name: '玉山商業銀行台北分行',
  },
  {
    bankCode: '808',
    code: '0967',
    name: '玉山商業銀行大安分行',
  },
  {
    bankCode: '808',
    code: '0978',
    name: '玉山商業銀行東港分行',
  },
  {
    bankCode: '808',
    code: '0989',
    name: '玉山商業銀行古亭分行',
  },
  {
    bankCode: '808',
    code: '0990',
    name: '玉山商業銀行草屯分行',
  },
  {
    bankCode: '808',
    code: '1001',
    name: '玉山商業銀行新營分行',
  },
  {
    bankCode: '808',
    code: '1012',
    name: '玉山商業銀行迴龍分行',
  },
  {
    bankCode: '808',
    code: '1023',
    name: '玉山商業銀行花蓮分行',
  },
  {
    bankCode: '808',
    code: '1034',
    name: '玉山商業銀行澎湖分行',
  },
  {
    bankCode: '808',
    code: '1045',
    name: '玉山商業銀行三峽分行',
  },
  {
    bankCode: '808',
    code: '1056',
    name: '玉山商業銀行松江分行',
  },
  {
    bankCode: '808',
    code: '1067',
    name: '玉山商業銀行金華分行',
  },
  {
    bankCode: '808',
    code: '1078',
    name: '玉山商業銀行光復分行',
  },
  {
    bankCode: '808',
    code: '1089',
    name: '玉山商業銀行新湖分行',
  },
  {
    bankCode: '808',
    code: '1090',
    name: '玉山商業銀行桃鶯分行',
  },
  {
    bankCode: '808',
    code: '1104',
    name: '玉山商業銀行員林分行',
  },
  {
    bankCode: '808',
    code: '1115',
    name: '玉山商業銀行永安分行',
  },
  {
    bankCode: '808',
    code: '1126',
    name: '玉山商業銀行新豐分行',
  },
  {
    bankCode: '808',
    code: '1137',
    name: '玉山商業銀行仁德分行',
  },
  {
    bankCode: '808',
    code: '1148',
    name: '玉山商業銀行泰和分行',
  },
  {
    bankCode: '808',
    code: '1159',
    name: '玉山商業銀行西屯分行',
  },
  {
    bankCode: '808',
    code: '1160',
    name: '玉山商業銀行南勢角分行',
  },
  {
    bankCode: '808',
    code: '1171',
    name: '玉山商業銀行板橋分行',
  },
  {
    bankCode: '808',
    code: '1182',
    name: '玉山商業銀行南港分行',
  },
  {
    bankCode: '808',
    code: '1193',
    name: '玉山商業銀行東門分行',
  },
  {
    bankCode: '808',
    code: '1207',
    name: '玉山商業銀行南土城分行',
  },
  {
    bankCode: '808',
    code: '1218',
    name: '玉山商業銀行朴子分行',
  },
  {
    bankCode: '808',
    code: '1229',
    name: '玉山商業銀行信義分行',
  },
  {
    bankCode: '808',
    code: '1230',
    name: '玉山商業銀行汐止分行',
  },
  {
    bankCode: '808',
    code: '1241',
    name: '玉山商業銀行新樹分行',
  },
  {
    bankCode: '808',
    code: '1252',
    name: '玉山商業銀行中工分行',
  },
  {
    bankCode: '808',
    code: '1263',
    name: '玉山商業銀行瑞光分行',
  },
  {
    bankCode: '808',
    code: '1274',
    name: '玉山商業銀行鹽行分行',
  },
  {
    bankCode: '808',
    code: '1285',
    name: '玉山商業銀行頭份分行',
  },
  {
    bankCode: '808',
    code: '1296',
    name: '玉山商業銀行後龍分行',
  },
  {
    bankCode: '808',
    code: '1300',
    name: '玉山商業銀行五權分行',
  },
  {
    bankCode: '808',
    code: '1311',
    name: '玉山商業銀行南永康分行',
  },
  {
    bankCode: '808',
    code: '1322',
    name: '玉山商業銀行藝文分行',
  },
  {
    bankCode: '808',
    code: '1333',
    name: '玉山商業銀行中原分行',
  },
  {
    bankCode: '808',
    code: '1344',
    name: '玉山商業銀行竹科分行',
  },
  {
    bankCode: '808',
    code: '1355',
    name: '玉山商業銀行太平分行',
  },
  {
    bankCode: '808',
    code: '1366',
    name: '玉山商業銀行台中分行',
  },
  {
    bankCode: '808',
    code: '1377',
    name: '玉山商業銀行六家分行',
  },
  {
    bankCode: '808',
    code: '1388',
    name: '玉山商業銀行北屯分行',
  },
  {
    bankCode: '808',
    code: '1399',
    name: '玉山商業銀行烏日分行',
  },
  {
    bankCode: '808',
    code: '1403',
    name: '玉山商業銀行安南分行',
  },
  {
    bankCode: '808',
    code: '1425',
    name: '玉山商業銀行沙鹿分行',
  },
  {
    bankCode: '808',
    code: '1436',
    name: '玉山商業銀行東林口分行',
  },
  {
    bankCode: '808',
    code: '1458',
    name: '玉山商業銀行南山廣場分行',
  },
  {
    bankCode: '808',
    code: '7003',
    name: '玉山銀行(中國)有限公司',
  },
  {
    bankCode: '808',
    code: '7014',
    name: '玉山銀行(中國)有限公司東莞分行',
  },
  {
    bankCode: '808',
    code: '7025',
    name: '玉山銀行(中國)有限公司東莞長安支行',
  },
  {
    bankCode: '808',
    code: '7036',
    name: '玉山銀行(中國)有限公司深圳分行',
  },
  {
    bankCode: '808',
    code: '7058',
    name: '玉山銀行(中國)有限公司廣州分行',
  },
  {
    bankCode: '808',
    code: '8000',
    name: '聯合商業銀行',
  },
  {
    bankCode: '808',
    code: '8011',
    name: '聯合商業銀行西哈努克分行',
  },
  {
    bankCode: '808',
    code: '8022',
    name: '聯合商業銀行暹粒分行',
  },
  {
    bankCode: '808',
    code: '8033',
    name: '聯合商業銀行馬德旺分行',
  },
  {
    bankCode: '808',
    code: '8055',
    name: '聯合商業銀行奧林匹克分行',
  },
  {
    bankCode: '808',
    code: '8066',
    name: '聯合商業銀行威夏蘇(干拉)分行',
  },
  {
    bankCode: '808',
    code: '8077',
    name: '聯合商業銀行鐵橋頭分行',
  },
  {
    bankCode: '808',
    code: '8088',
    name: '聯合商業銀行五洲分行',
  },
  {
    bankCode: '808',
    code: '8099',
    name: '聯合商業銀行堆谷分行',
  },
  {
    bankCode: '808',
    code: '8103',
    name: '聯合商業銀行德他拉分行',
  },
  {
    bankCode: '808',
    code: '8114',
    name: '聯合商業銀行德拉歐分行',
  },
  {
    bankCode: '808',
    code: '8125',
    name: '聯合商業銀行舊運動場分行',
  },
  {
    bankCode: '808',
    code: '8136',
    name: '聯合商業銀行上棉芷分行',
  },
  {
    bankCode: '808',
    code: '8147',
    name: '聯合商業銀行舊市場分行',
  },
  {
    bankCode: '808',
    code: '9007',
    name: '玉山商業銀行洛杉磯分行',
  },
  {
    bankCode: '808',
    code: '9018',
    name: '玉山商業銀行香港分行',
  },
  {
    bankCode: '808',
    code: '9052',
    name: '玉山商業銀行新加坡分行',
  },
  {
    bankCode: '808',
    code: '9100',
    name: '玉山銀行同奈分行',
  },
  {
    bankCode: '808',
    code: '9122',
    name: '玉山商業銀行雪梨分行',
  },
  {
    bankCode: '808',
    code: '9133',
    name: '玉山商業銀行仰光分行',
  },
  {
    bankCode: '808',
    code: '9155',
    name: '玉山銀行東京分行',
  },
  {
    bankCode: '808',
    code: '9166',
    name: '玉山商業銀行布里斯本分行',
  },
  {
    bankCode: '808',
    code: '9993',
    name: '玉山商業銀行河內代表人辦事處',
  },
  {
    bankCode: '809',
    code: '0016',
    name: '凱基商業銀行中山分行',
  },
  {
    bankCode: '809',
    code: '0027',
    name: '凱基商業銀行忠孝分行',
  },
  {
    bankCode: '809',
    code: '0038',
    name: '凱基商業銀行三重分行',
  },
  {
    bankCode: '809',
    code: '0049',
    name: '凱基商業銀行台中分行',
  },
  {
    bankCode: '809',
    code: '0050',
    name: '凱基商業銀行台南分行',
  },
  {
    bankCode: '809',
    code: '0061',
    name: '凱基商業銀行高雄分行',
  },
  {
    bankCode: '809',
    code: '0072',
    name: '凱基商業銀行城東分行',
  },
  {
    bankCode: '809',
    code: '0083',
    name: '凱基商業銀行信託部',
  },
  {
    bankCode: '809',
    code: '0094',
    name: '凱基商業銀行營業部',
  },
  {
    bankCode: '809',
    code: '0108',
    name: '凱基商業銀行板橋分行',
  },
  {
    bankCode: '809',
    code: '0119',
    name: '凱基商業銀行桃園分行',
  },
  {
    bankCode: '809',
    code: '0120',
    name: '凱基商業銀行中壢分行',
  },
  {
    bankCode: '809',
    code: '0131',
    name: '凱基商業銀行北高雄分行',
  },
  {
    bankCode: '809',
    code: '0142',
    name: '凱基商業銀行國外部',
  },
  {
    bankCode: '809',
    code: '0153',
    name: '凱基商業銀行新莊分行',
  },
  {
    bankCode: '809',
    code: '0164',
    name: '凱基商業銀行左營分行',
  },
  {
    bankCode: '809',
    code: '0175',
    name: '凱基商業銀行員林分行',
  },
  {
    bankCode: '809',
    code: '0186',
    name: '凱基商業銀行國際金融業務分行',
  },
  {
    bankCode: '809',
    code: '0197',
    name: '凱基商業銀行敦南分行',
  },
  {
    bankCode: '809',
    code: '0201',
    name: '凱基商業銀行松江分行',
  },
  {
    bankCode: '809',
    code: '0212',
    name: '凱基商業銀行蘆洲分行',
  },
  {
    bankCode: '809',
    code: '0223',
    name: '凱基商業銀行鳳山分行',
  },
  {
    bankCode: '809',
    code: '0234',
    name: '凱基商業銀行新竹分行',
  },
  {
    bankCode: '809',
    code: '0245',
    name: '凱基商業銀行松山分行',
  },
  {
    bankCode: '809',
    code: '0256',
    name: '凱基商業銀行土城分行',
  },
  {
    bankCode: '809',
    code: '0267',
    name: '凱基商業銀行中和分行',
  },
  {
    bankCode: '809',
    code: '0278',
    name: '凱基商業銀行赤崁分行',
  },
  {
    bankCode: '809',
    code: '0289',
    name: '凱基商業銀行基隆分行',
  },
  {
    bankCode: '809',
    code: '0304',
    name: '凱基商業銀行東門分行',
  },
  {
    bankCode: '809',
    code: '0315',
    name: '凱基商業銀行北門分行',
  },
  {
    bankCode: '809',
    code: '0326',
    name: '凱基商業銀行屏東分行',
  },
  {
    bankCode: '809',
    code: '0337',
    name: '凱基商業銀行雙和分行',
  },
  {
    bankCode: '809',
    code: '0348',
    name: '凱基商業銀行歸仁分行',
  },
  {
    bankCode: '809',
    code: '0359',
    name: '凱基商業銀行海東分行',
  },
  {
    bankCode: '809',
    code: '0371',
    name: '凱基商業銀行永康分行',
  },
  {
    bankCode: '809',
    code: '0393',
    name: '凱基商業銀行新店分行',
  },
  {
    bankCode: '809',
    code: '0407',
    name: '凱基商業銀行大安分行',
  },
  {
    bankCode: '809',
    code: '0429',
    name: '凱基商業銀行苗栗分行',
  },
  {
    bankCode: '809',
    code: '0430',
    name: '凱基商業銀行內湖分行',
  },
  {
    bankCode: '809',
    code: '0452',
    name: '凱基商業銀行花蓮分行',
  },
  {
    bankCode: '809',
    code: '0463',
    name: '凱基商業銀行繼光分行',
  },
  {
    bankCode: '809',
    code: '0474',
    name: '凱基商業銀行彰化分行',
  },
  {
    bankCode: '809',
    code: '0485',
    name: '凱基商業銀行豐原分行',
  },
  {
    bankCode: '809',
    code: '0511',
    name: '凱基商業銀行大里分行',
  },
  {
    bankCode: '809',
    code: '0522',
    name: '凱基商業銀行嘉義分行',
  },
  {
    bankCode: '809',
    code: '0577',
    name: '凱基商業銀行風城分行',
  },
  {
    bankCode: '809',
    code: '0588',
    name: '凱基商業銀行南大分行',
  },
  {
    bankCode: '809',
    code: '0599',
    name: '凱基商業銀行竹科分行',
  },
  {
    bankCode: '809',
    code: '0625',
    name: '凱基商業銀行台東分行',
  },
  {
    bankCode: '809',
    code: '0669',
    name: '凱基商業銀行羅東分行',
  },
  {
    bankCode: '809',
    code: '0670',
    name: '凱基商業銀行大直分行',
  },
  {
    bankCode: '809',
    code: '0681',
    name: '凱基商業銀行高美館分行',
  },
  {
    bankCode: '809',
    code: '0692',
    name: '凱基商業銀行市政分行',
  },
  {
    bankCode: '809',
    code: '0706',
    name: '凱基商業銀行藝文分行',
  },
  {
    bankCode: '809',
    code: '0717',
    name: '凱基商業銀行瑞光分行',
  },
  {
    bankCode: '809',
    code: '0728',
    name: '凱基商業銀行民生分行',
  },
  {
    bankCode: '810',
    code: '0021',
    name: '星展(台灣)商業銀行忠孝分行',
  },
  {
    bankCode: '810',
    code: '0043',
    name: '星展(台灣)商業銀行高雄分行',
  },
  {
    bankCode: '810',
    code: '0054',
    name: '星展(台灣)商業銀行桃園分行',
  },
  {
    bankCode: '810',
    code: '0065',
    name: '星展(台灣)商業銀行豐原分行',
  },
  {
    bankCode: '810',
    code: '0098',
    name: '星展(台灣)商業銀行台南分行',
  },
  {
    bankCode: '810',
    code: '0102',
    name: '星展(台灣)商業銀行大安分行',
  },
  {
    bankCode: '810',
    code: '0113',
    name: '星展(台灣)商業銀行華山分行',
  },
  {
    bankCode: '810',
    code: '0124',
    name: '星展(台灣)商業銀行太平分行',
  },
  {
    bankCode: '810',
    code: '0135',
    name: '星展(台灣)商業銀行中清分行',
  },
  {
    bankCode: '810',
    code: '0157',
    name: '星展(台灣)商業銀行三重分行',
  },
  {
    bankCode: '810',
    code: '0168',
    name: '星展(台灣)商業銀行蘆洲分行',
  },
  {
    bankCode: '810',
    code: '0179',
    name: '星展(台灣)商業銀行信義分行',
  },
  {
    bankCode: '810',
    code: '0180',
    name: '星展(台灣)商業銀行中港分行',
  },
  {
    bankCode: '810',
    code: '0191',
    name: '星展(台灣)商業銀行國際金融業務分行',
  },
  {
    bankCode: '810',
    code: '0205',
    name: '星展(台灣)商業銀行左營分行',
  },
  {
    bankCode: '810',
    code: '0216',
    name: '星展(台灣)商業銀行汐止分行',
  },
  {
    bankCode: '810',
    code: '0227',
    name: '星展(台灣)商業銀行天母分行',
  },
  {
    bankCode: '810',
    code: '0250',
    name: '星展(台灣)商業銀行新莊分行',
  },
  {
    bankCode: '810',
    code: '0261',
    name: '星展(台灣)商業銀行板橋分行',
  },
  {
    bankCode: '810',
    code: '0272',
    name: '星展(台灣)商業銀行中和分行',
  },
  {
    bankCode: '810',
    code: '0283',
    name: '星展(台灣)商業銀行楠梓分行',
  },
  {
    bankCode: '810',
    code: '0294',
    name: '星展(台灣)商業銀行民權分行',
  },
  {
    bankCode: '810',
    code: '0308',
    name: '星展(台灣)商業銀行苓雅分行',
  },
  {
    bankCode: '810',
    code: '0319',
    name: '星展(台灣)商業銀行東台南分行',
  },
  {
    bankCode: '810',
    code: '0320',
    name: '星展(台灣)商業銀行新店分行',
  },
  {
    bankCode: '810',
    code: '0331',
    name: '星展(台灣)商業銀行前鎮分行',
  },
  {
    bankCode: '810',
    code: '0342',
    name: '星展(台灣)商業銀行東新竹分行',
  },
  {
    bankCode: '810',
    code: '0364',
    name: '星展(台灣)商業銀行南京東路分行',
  },
  {
    bankCode: '810',
    code: '0375',
    name: '星展(台灣)商業銀行莒光分行',
  },
  {
    bankCode: '810',
    code: '0386',
    name: '星展(台灣)商業銀行中壢分行',
  },
  {
    bankCode: '810',
    code: '0397',
    name: '星展(台灣)商業銀行新竹分行',
  },
  {
    bankCode: '810',
    code: '0401',
    name: '星展(台灣)商業銀行大同分行',
  },
  {
    bankCode: '810',
    code: '0412',
    name: '星展(台灣)商業銀行敦南分行',
  },
  {
    bankCode: '810',
    code: '0423',
    name: '星展(台灣)商業銀行內湖分行',
  },
  {
    bankCode: '810',
    code: '0434',
    name: '信託業務專責部門',
  },
  {
    bankCode: '810',
    code: '0456',
    name: '星展(台灣)商業銀行松山分行',
  },
  {
    bankCode: '810',
    code: '0467',
    name: '星展(台灣)商業銀行松江分行',
  },
  {
    bankCode: '810',
    code: '0478',
    name: '星展(台灣)商業銀行松仁分行',
  },
  {
    bankCode: '810',
    code: '0489',
    name: '星展(台灣)商業銀行新站分行',
  },
  {
    bankCode: '810',
    code: '0490',
    name: '星展(台灣)商業銀行中正分行',
  },
  {
    bankCode: '810',
    code: '0504',
    name: '星展(台灣)商業銀行中興分行',
  },
  {
    bankCode: '810',
    code: '0559',
    name: '星展(台灣)商業銀行四維分行',
  },
  {
    bankCode: '810',
    code: '0858',
    name: '星展(台灣)商業銀行內湖科學園區分行',
  },
  {
    bankCode: '812',
    code: '0012',
    name: '台新國際商業銀行營業部',
  },
  {
    bankCode: '812',
    code: '0023',
    name: '台新國際商業銀行敦南分行',
  },
  {
    bankCode: '812',
    code: '0045',
    name: '台新國際商業銀行新生分行',
  },
  {
    bankCode: '812',
    code: '0056',
    name: '台新國際商業銀行新莊分行',
  },
  {
    bankCode: '812',
    code: '0067',
    name: '台新國際商業銀行桃園分行',
  },
  {
    bankCode: '812',
    code: '0078',
    name: '台新國際商業銀行台中分行',
  },
  {
    bankCode: '812',
    code: '0089',
    name: '台新國際商業銀行板橋分行',
  },
  {
    bankCode: '812',
    code: '0090',
    name: '台新國際商業銀行高雄分行',
  },
  {
    bankCode: '812',
    code: '0104',
    name: '台新國際商業銀行台南分行',
  },
  {
    bankCode: '812',
    code: '0115',
    name: '台新國際商業銀行南京東路分行',
  },
  {
    bankCode: '812',
    code: '0126',
    name: '台新國際商業銀行中壢分行',
  },
  {
    bankCode: '812',
    code: '0137',
    name: '台新國際商業銀行信託部',
  },
  {
    bankCode: '812',
    code: '0148',
    name: '台新國際商業銀行國外部',
  },
  {
    bankCode: '812',
    code: '0159',
    name: '台新國際商業銀行苓雅分行',
  },
  {
    bankCode: '812',
    code: '0160',
    name: '台新國際商業銀行蘆洲分行',
  },
  {
    bankCode: '812',
    code: '0171',
    name: '台新國際商業銀行天母分行',
  },
  {
    bankCode: '812',
    code: '0182',
    name: '台新國際商業銀行大里分行',
  },
  {
    bankCode: '812',
    code: '0193',
    name: '台新國際商業銀行國際金融業務分行',
  },
  {
    bankCode: '812',
    code: '0207',
    name: '台新國際商業銀行中和分行',
  },
  {
    bankCode: '812',
    code: '0218',
    name: '台新國際商業銀行嘉義分行',
  },
  {
    bankCode: '812',
    code: '0229',
    name: '台新國際商業銀行豐原分行',
  },
  {
    bankCode: '812',
    code: '0230',
    name: '台新國際商業銀行花蓮分行',
  },
  {
    bankCode: '812',
    code: '0241',
    name: '台新國際商業銀行新竹分行',
  },
  {
    bankCode: '812',
    code: '0252',
    name: '台新國際商業銀行七賢分行',
  },
  {
    bankCode: '812',
    code: '0263',
    name: '台新國際商業銀行信義分行',
  },
  {
    bankCode: '812',
    code: '0274',
    name: '台新國際商業銀行北台中分行',
  },
  {
    bankCode: '812',
    code: '0285',
    name: '台新國際商業銀行三重分行',
  },
  {
    bankCode: '812',
    code: '0296',
    name: '台新國際商業銀行永福分行',
  },
  {
    bankCode: '812',
    code: '0300',
    name: '台新國際商業銀行屏東分行',
  },
  {
    bankCode: '812',
    code: '0311',
    name: '台新國際商業銀行大安分行',
  },
  {
    bankCode: '812',
    code: '0322',
    name: '台新國際商業銀行龍潭分行',
  },
  {
    bankCode: '812',
    code: '0333',
    name: '台新國際商業銀行崇德分行',
  },
  {
    bankCode: '812',
    code: '0344',
    name: '台新國際商業銀行金華分行',
  },
  {
    bankCode: '812',
    code: '0355',
    name: '台新國際商業銀行後甲分行',
  },
  {
    bankCode: '812',
    code: '0366',
    name: '台新國際商業銀行海佃分行',
  },
  {
    bankCode: '812',
    code: '0377',
    name: '台新國際商業銀行彰化分行',
  },
  {
    bankCode: '812',
    code: '0388',
    name: '台新國際商業銀行五甲分行',
  },
  {
    bankCode: '812',
    code: '0399',
    name: '台新國際商業銀行鳳山分行',
  },
  {
    bankCode: '812',
    code: '0403',
    name: '台新國際商業銀行古亭分行',
  },
  {
    bankCode: '812',
    code: '0414',
    name: '台新國際商業銀行建橋分行',
  },
  {
    bankCode: '812',
    code: '0436',
    name: '台新國際商業銀行民生分行',
  },
  {
    bankCode: '812',
    code: '0447',
    name: '台新國際商業銀行太平分行',
  },
  {
    bankCode: '812',
    code: '0458',
    name: '台新國際商業銀行和平分行',
  },
  {
    bankCode: '812',
    code: '0469',
    name: '台新國際商業銀行北高雄分行',
  },
  {
    bankCode: '812',
    code: '0470',
    name: '台新國際商業銀行南新莊分行',
  },
  {
    bankCode: '812',
    code: '0481',
    name: '台新國際商業銀行內湖分行',
  },
  {
    bankCode: '812',
    code: '0492',
    name: '台新國際商業銀行永和分行',
  },
  {
    bankCode: '812',
    code: '0517',
    name: '台新國際商業銀行逢甲分行',
  },
  {
    bankCode: '812',
    code: '0528',
    name: '台新國際商業銀行竹科分行',
  },
  {
    bankCode: '812',
    code: '0540',
    name: '台新國際商業銀行南屯分行',
  },
  {
    bankCode: '812',
    code: '0551',
    name: '台新國際商業銀行大直分行',
  },
  {
    bankCode: '812',
    code: '0562',
    name: '台新國際商業銀行南門分行',
  },
  {
    bankCode: '812',
    code: '0610',
    name: '台新國際商業銀行西門分行',
  },
  {
    bankCode: '812',
    code: '0621',
    name: '台新國際商業銀行敦北分行',
  },
  {
    bankCode: '812',
    code: '0632',
    name: '台新國際商業銀行忠孝分行',
  },
  {
    bankCode: '812',
    code: '0643',
    name: '台新國際商業銀行復興分行',
  },
  {
    bankCode: '812',
    code: '0654',
    name: '台新國際商業銀行板南分行',
  },
  {
    bankCode: '812',
    code: '0665',
    name: '台新國際商業銀行民權分行',
  },
  {
    bankCode: '812',
    code: '0676',
    name: '台新國際商業銀行三民分行',
  },
  {
    bankCode: '812',
    code: '0687',
    name: '台新國際商業銀行建北分行',
  },
  {
    bankCode: '812',
    code: '0698',
    name: '台新國際商業銀行三和分行',
  },
  {
    bankCode: '812',
    code: '0702',
    name: '台新國際商業銀行北新店分行',
  },
  {
    bankCode: '812',
    code: '0713',
    name: '台新國際商業銀行府城分行',
  },
  {
    bankCode: '812',
    code: '0724',
    name: '台新國際商業銀行東高雄分行',
  },
  {
    bankCode: '812',
    code: '0735',
    name: '台新國際商業銀行基隆路分行',
  },
  {
    bankCode: '812',
    code: '0746',
    name: '台新國際商業銀行新店分行',
  },
  {
    bankCode: '812',
    code: '0757',
    name: '台新國際商業銀行北桃園分行',
  },
  {
    bankCode: '812',
    code: '0768',
    name: '台新國際商業銀行大墩分行',
  },
  {
    bankCode: '812',
    code: '0779',
    name: '台新國際商業銀行延平分行',
  },
  {
    bankCode: '812',
    code: '0780',
    name: '台新國際商業銀行南崁分行',
  },
  {
    bankCode: '812',
    code: '0791',
    name: '台新國際商業銀行景平分行',
  },
  {
    bankCode: '812',
    code: '0805',
    name: '台新國際商業銀行文心分行',
  },
  {
    bankCode: '812',
    code: '0816',
    name: '台新國際商業銀行岡山分行',
  },
  {
    bankCode: '812',
    code: '0827',
    name: '台新國際商業銀行松江分行',
  },
  {
    bankCode: '812',
    code: '0838',
    name: '台新國際商業銀行大雅分行',
  },
  {
    bankCode: '812',
    code: '0849',
    name: '台新國際商業銀行汐止分行',
  },
  {
    bankCode: '812',
    code: '0850',
    name: '台新國際商業銀行成功分行',
  },
  {
    bankCode: '812',
    code: '0861',
    name: '台新國際商業銀行石牌分行',
  },
  {
    bankCode: '812',
    code: '0872',
    name: '台新國際商業銀行永康分行',
  },
  {
    bankCode: '812',
    code: '0883',
    name: '台新國際商業銀行南松山分行',
  },
  {
    bankCode: '812',
    code: '0894',
    name: '台新國際商業銀行淡水分行',
  },
  {
    bankCode: '812',
    code: '0908',
    name: '台新國際商業銀行東基隆分行',
  },
  {
    bankCode: '812',
    code: '0919',
    name: '台新國際商業銀行新板分行',
  },
  {
    bankCode: '812',
    code: '0920',
    name: '台新國際商業銀行北師分行',
  },
  {
    bankCode: '812',
    code: '0931',
    name: '台新國際商業銀行佳里分行',
  },
  {
    bankCode: '812',
    code: '0942',
    name: '台新國際商業銀行江翠分行',
  },
  {
    bankCode: '812',
    code: '0975',
    name: '台新國際商業銀行松德分行',
  },
  {
    bankCode: '812',
    code: '0986',
    name: '台新國際商業銀行北大分行',
  },
  {
    bankCode: '812',
    code: '0997',
    name: '台新國際商業銀行南港分行',
  },
  {
    bankCode: '812',
    code: '1008',
    name: '台新國際商業銀行關東橋分行',
  },
  {
    bankCode: '812',
    code: '1019',
    name: '台新國際商業銀行竹北分行',
  },
  {
    bankCode: '812',
    code: '1020',
    name: '台新國際商業銀行南寮分行',
  },
  {
    bankCode: '812',
    code: '1031',
    name: '台新國際商業銀行八德分行',
  },
  {
    bankCode: '812',
    code: '1042',
    name: '台新國際商業銀行員林分行',
  },
  {
    bankCode: '812',
    code: '1053',
    name: '台新國際商業銀行市府分行',
  },
  {
    bankCode: '812',
    code: '1064',
    name: '台新國際商業銀行右昌分行',
  },
  {
    bankCode: '812',
    code: '1075',
    name: '台新國際商業銀行沙鹿分行',
  },
  {
    bankCode: '812',
    code: '1086',
    name: '台新國際商業銀行竹南分行',
  },
  {
    bankCode: '812',
    code: '1097',
    name: '台新國際商業銀行羅東分行',
  },
  {
    bankCode: '812',
    code: '1101',
    name: '台新國際商業銀行東湖分行',
  },
  {
    bankCode: '812',
    code: '1112',
    name: '台新國際商業銀行文山分行',
  },
  {
    bankCode: '812',
    code: '1123',
    name: '台新國際商業銀行副都心分行',
  },
  {
    bankCode: '812',
    code: '1134',
    name: '台新國際商業銀行景美分行',
  },
  {
    bankCode: '812',
    code: '1145',
    name: '台新國際商業銀行雄科分行',
  },
  {
    bankCode: '812',
    code: '9004',
    name: '台新國際商銀香港分行',
  },
  {
    bankCode: '812',
    code: '9200',
    name: '台新國際商業銀行新加坡分行',
  },
  {
    bankCode: '812',
    code: '9222',
    name: '台新國際商業銀行布里斯本分行',
  },
  {
    bankCode: '812',
    code: '9233',
    name: '台新國際商業銀行東京分行',
  },
  {
    bankCode: '812',
    code: '9244',
    name: '緬甸仰光代表人辦事處',
  },
  {
    bankCode: '812',
    code: '9990',
    name: '越南胡志明市代表人辦事處',
  },
  {
    bankCode: '815',
    code: '0015',
    name: '日盛國際商業銀行營業部',
  },
  {
    bankCode: '815',
    code: '0026',
    name: '日盛國際商業銀行松江分行',
  },
  {
    bankCode: '815',
    code: '0037',
    name: '日盛國際商業銀行延平分行',
  },
  {
    bankCode: '815',
    code: '0048',
    name: '日盛國際商業銀行內湖分行',
  },
  {
    bankCode: '815',
    code: '0059',
    name: '日盛國際商業銀行桃園分行',
  },
  {
    bankCode: '815',
    code: '0060',
    name: '日盛國際商業銀行台中分行',
  },
  {
    bankCode: '815',
    code: '0071',
    name: '日盛國際商業銀行台南分行',
  },
  {
    bankCode: '815',
    code: '0082',
    name: '日盛國際商業銀行信託處',
  },
  {
    bankCode: '815',
    code: '0093',
    name: '日盛國際商業銀行高雄分行',
  },
  {
    bankCode: '815',
    code: '0107',
    name: '日盛國際商業銀行新莊分行',
  },
  {
    bankCode: '815',
    code: '0118',
    name: '日盛國際商業銀行中壢分行',
  },
  {
    bankCode: '815',
    code: '0129',
    name: '日盛國際商業銀行松山分行',
  },
  {
    bankCode: '815',
    code: '0130',
    name: '日盛國際商業銀行松南分行',
  },
  {
    bankCode: '815',
    code: '0141',
    name: '日盛國際商業銀行八德分行',
  },
  {
    bankCode: '815',
    code: '0152',
    name: '日盛國際商業銀行國外部',
  },
  {
    bankCode: '815',
    code: '0163',
    name: '日盛國際商業銀行板橋分行',
  },
  {
    bankCode: '815',
    code: '0174',
    name: '日盛國際商業銀行信義分行',
  },
  {
    bankCode: '815',
    code: '0185',
    name: '日盛國際商業銀行苓雅分行',
  },
  {
    bankCode: '815',
    code: '0196',
    name: '日盛國際商業銀行前金分行',
  },
  {
    bankCode: '815',
    code: '0200',
    name: '日盛國際商銀國際金融業務分行',
  },
  {
    bankCode: '815',
    code: '0211',
    name: '日盛國際商業銀行嘉義分行',
  },
  {
    bankCode: '815',
    code: '0222',
    name: '日盛國際商業銀行三重分行',
  },
  {
    bankCode: '815',
    code: '0233',
    name: '日盛國際商業銀行北台中分行',
  },
  {
    bankCode: '815',
    code: '0244',
    name: '日盛國際商業銀行雙和分行',
  },
  {
    bankCode: '815',
    code: '0255',
    name: '日盛國際商業銀行士林分行',
  },
  {
    bankCode: '815',
    code: '0266',
    name: '日盛國際商業銀行樹林分行',
  },
  {
    bankCode: '815',
    code: '0277',
    name: '日盛國際商業銀行北桃園分行',
  },
  {
    bankCode: '815',
    code: '0288',
    name: '日盛國際商業銀行新竹分行',
  },
  {
    bankCode: '815',
    code: '0299',
    name: '日盛國際商業銀行敦化分行',
  },
  {
    bankCode: '815',
    code: '0303',
    name: '日盛國際商業銀行北高雄分行',
  },
  {
    bankCode: '815',
    code: '0314',
    name: '日盛國際商業銀行新營分行',
  },
  {
    bankCode: '815',
    code: '0325',
    name: '日盛國際商業銀行頭份分行',
  },
  {
    bankCode: '815',
    code: '0336',
    name: '日盛國際商業銀行大里分行',
  },
  {
    bankCode: '815',
    code: '0347',
    name: '日盛國際商業銀行光復分行',
  },
  {
    bankCode: '815',
    code: '0358',
    name: '日盛國際商業銀行員林分行',
  },
  {
    bankCode: '815',
    code: '0369',
    name: '日盛國際商業銀行虎尾分行',
  },
  {
    bankCode: '815',
    code: '0370',
    name: '日盛國際商業銀行屏東分行',
  },
  {
    bankCode: '815',
    code: '0381',
    name: '日盛國際商業銀行南門分行',
  },
  {
    bankCode: '815',
    code: '0392',
    name: '日盛國際商業銀行大安分行',
  },
  {
    bankCode: '815',
    code: '0406',
    name: '日盛國際商業銀行敦北分行',
  },
  {
    bankCode: '815',
    code: '0417',
    name: '日盛國際商業銀行南京分行',
  },
  {
    bankCode: '815',
    code: '0428',
    name: '日盛國際商業銀行竹北分行',
  },
  {
    bankCode: '815',
    code: '0439',
    name: '日盛國際商業銀行安平分行',
  },
  {
    bankCode: '815',
    code: '0451',
    name: '日盛國際商業銀行新店分行',
  },
  {
    bankCode: '815',
    code: '0462',
    name: '日盛國際商業銀行土城分行',
  },
  {
    bankCode: '815',
    code: '0473',
    name: '日盛國際商業銀行南港分行',
  },
  {
    bankCode: '815',
    code: '0484',
    name: '日盛國際商業銀行蘆洲分行',
  },
  {
    bankCode: '815',
    code: '0815',
    name: '日盛國際商業銀行信用卡事業處',
  },
  {
    bankCode: '815',
    code: '9993',
    name: '日盛國際商業銀行香港代表辦事處',
  },
  {
    bankCode: '816',
    code: '0016',
    name: '安泰商業銀行長安東路分行',
  },
  {
    bankCode: '816',
    code: '0027',
    name: '安泰商業銀行信義分行',
  },
  {
    bankCode: '816',
    code: '0038',
    name: '安泰商業銀行營業部',
  },
  {
    bankCode: '816',
    code: '0049',
    name: '安泰商業銀行新生分行',
  },
  {
    bankCode: '816',
    code: '0050',
    name: '安泰商業銀行桃園分行',
  },
  {
    bankCode: '816',
    code: '0061',
    name: '安泰商業銀行新莊分行',
  },
  {
    bankCode: '816',
    code: '0072',
    name: '安泰商業銀行台中分行',
  },
  {
    bankCode: '816',
    code: '0083',
    name: '安泰商業銀行高雄分行',
  },
  {
    bankCode: '816',
    code: '0094',
    name: '安泰商業銀行台南分行',
  },
  {
    bankCode: '816',
    code: '0108',
    name: '安泰商業銀行興隆分行',
  },
  {
    bankCode: '816',
    code: '0119',
    name: '安泰商業銀行延平分行',
  },
  {
    bankCode: '816',
    code: '0120',
    name: '安泰商業銀行中壢分行',
  },
  {
    bankCode: '816',
    code: '0131',
    name: '安泰商業銀行板橋分行',
  },
  {
    bankCode: '816',
    code: '0142',
    name: '安泰商業銀行豐原分行',
  },
  {
    bankCode: '816',
    code: '0153',
    name: '安泰商業銀行前金分行',
  },
  {
    bankCode: '816',
    code: '0164',
    name: '安泰商業銀行中和分行',
  },
  {
    bankCode: '816',
    code: '0175',
    name: '安泰商業銀行國外部',
  },
  {
    bankCode: '816',
    code: '0186',
    name: '安泰商業銀行鳳山分行',
  },
  {
    bankCode: '816',
    code: '0197',
    name: '安泰商業銀行松江分行',
  },
  {
    bankCode: '816',
    code: '0201',
    name: '安泰商業銀行中崙分行',
  },
  {
    bankCode: '816',
    code: '0212',
    name: '安泰商業銀行嘉義分行',
  },
  {
    bankCode: '816',
    code: '0223',
    name: '安泰商業銀行三重分行',
  },
  {
    bankCode: '816',
    code: '0234',
    name: '安泰商業銀行國際金融業務分行',
  },
  {
    bankCode: '816',
    code: '0245',
    name: '安泰商業銀行沙鹿分行',
  },
  {
    bankCode: '816',
    code: '0256',
    name: '安泰商業銀行新竹分行',
  },
  {
    bankCode: '816',
    code: '0267',
    name: '安泰商業銀行員林分行',
  },
  {
    bankCode: '816',
    code: '0278',
    name: '安泰商業銀行建國分行',
  },
  {
    bankCode: '816',
    code: '0289',
    name: '安泰商業銀行北高雄分行',
  },
  {
    bankCode: '816',
    code: '0290',
    name: '安泰商業銀行新店分行',
  },
  {
    bankCode: '816',
    code: '0304',
    name: '安泰商業銀行和平分行',
  },
  {
    bankCode: '816',
    code: '0315',
    name: '安泰商業銀行成功分行',
  },
  {
    bankCode: '816',
    code: '0326',
    name: '安泰商業銀行通化分行',
  },
  {
    bankCode: '816',
    code: '0337',
    name: '安泰商業銀行南門分行',
  },
  {
    bankCode: '816',
    code: '0348',
    name: '安泰商業銀行汀州分行',
  },
  {
    bankCode: '816',
    code: '0359',
    name: '安泰商業銀行農安分行',
  },
  {
    bankCode: '816',
    code: '0360',
    name: '安泰商業銀行景美分行',
  },
  {
    bankCode: '816',
    code: '0371',
    name: '安泰商業銀行民權分行',
  },
  {
    bankCode: '816',
    code: '0382',
    name: '安泰商業銀行松山分行',
  },
  {
    bankCode: '816',
    code: '0393',
    name: '安泰商業銀行內湖分行',
  },
  {
    bankCode: '816',
    code: '0407',
    name: '安泰商業銀行台北101分行',
  },
  {
    bankCode: '816',
    code: '0418',
    name: '安泰商業銀行蘆洲分行',
  },
  {
    bankCode: '816',
    code: '0429',
    name: '安泰商業銀行永康分行',
  },
  {
    bankCode: '816',
    code: '0430',
    name: '安泰商業銀行西壢分行',
  },
  {
    bankCode: '816',
    code: '0441',
    name: '安泰商業銀行北桃園簡易型分行',
  },
  {
    bankCode: '816',
    code: '0452',
    name: '安泰商業銀行幸福分行',
  },
  {
    bankCode: '816',
    code: '0463',
    name: '安泰商業銀行天母分行',
  },
  {
    bankCode: '816',
    code: '0474',
    name: '安泰商業銀行龍潭簡易型分行',
  },
  {
    bankCode: '816',
    code: '0500',
    name: '安泰商業銀行石牌分行',
  },
  {
    bankCode: '816',
    code: '0511',
    name: '安泰商業銀行八德簡易型分行',
  },
  {
    bankCode: '816',
    code: '0522',
    name: '安泰商業銀行竹北簡易型分行',
  },
  {
    bankCode: '816',
    code: '0533',
    name: '安泰商業銀行永和分行',
  },
  {
    bankCode: '816',
    code: '0566',
    name: '安泰商業銀行大里分行',
  },
  {
    bankCode: '816',
    code: '9101',
    name: '安泰商業銀行信託部',
  },
  {
    bankCode: '822',
    code: '0015',
    name: '中國信託商業銀行敦北分行',
  },
  {
    bankCode: '822',
    code: '0026',
    name: '中國信託商業銀行台中分行',
  },
  {
    bankCode: '822',
    code: '0037',
    name: '中國信託商業銀行高雄分行',
  },
  {
    bankCode: '822',
    code: '0059',
    name: '中國信託商業銀行台南分行',
  },
  {
    bankCode: '822',
    code: '0060',
    name: '中國信託商業銀行三重分行',
  },
  {
    bankCode: '822',
    code: '0071',
    name: '中國信託商業銀行城東分行',
  },
  {
    bankCode: '822',
    code: '0082',
    name: '中國信託商業銀行嘉義分行',
  },
  {
    bankCode: '822',
    code: '0093',
    name: '中國信託商業銀行中崙分行',
  },
  {
    bankCode: '822',
    code: '0107',
    name: '中國信託商業銀行城中分行',
  },
  {
    bankCode: '822',
    code: '0118',
    name: '中國信託商業銀行三民分行',
  },
  {
    bankCode: '822',
    code: '0129',
    name: '中國信託商業銀行中壢分行',
  },
  {
    bankCode: '822',
    code: '0130',
    name: '中國信託商業銀行雙和分行',
  },
  {
    bankCode: '822',
    code: '0141',
    name: '中國信託商業銀行中山分行',
  },
  {
    bankCode: '822',
    code: '0152',
    name: '中國信託商業銀行仁愛分行',
  },
  {
    bankCode: '822',
    code: '0163',
    name: '中國信託商業銀行敦南分行',
  },
  {
    bankCode: '822',
    code: '0174',
    name: '中國信託商業銀行板橋分行',
  },
  {
    bankCode: '822',
    code: '0185',
    name: '中國信託商業銀行忠孝分行',
  },
  {
    bankCode: '822',
    code: '0196',
    name: '中國信託商業銀行新興分行',
  },
  {
    bankCode: '822',
    code: '0200',
    name: '中國信託商業銀行南京東路分行',
  },
  {
    bankCode: '822',
    code: '0211',
    name: '中國信託商業銀行信託部',
  },
  {
    bankCode: '822',
    code: '0222',
    name: '中國信託商業銀行西台南分行',
  },
  {
    bankCode: '822',
    code: '0244',
    name: '中國信託商業銀行國際金融業務分行',
  },
  {
    bankCode: '822',
    code: '0255',
    name: '中國信託商業銀行松山分行',
  },
  {
    bankCode: '822',
    code: '0266',
    name: '中國信託商業銀行新莊分行',
  },
  {
    bankCode: '822',
    code: '0277',
    name: '中國信託商業銀行桃園分行',
  },
  {
    bankCode: '822',
    code: '0288',
    name: '中國信託商業銀行中港分行',
  },
  {
    bankCode: '822',
    code: '0299',
    name: '中國信託商業銀行新竹分行',
  },
  {
    bankCode: '822',
    code: '0303',
    name: '中國信託商業銀行蘆洲分行',
  },
  {
    bankCode: '822',
    code: '0314',
    name: '中國信託商業銀行新店分行',
  },
  {
    bankCode: '822',
    code: '0325',
    name: '中國信託商業銀行員林分行',
  },
  {
    bankCode: '822',
    code: '0336',
    name: '中國信託商業銀行東新竹分行',
  },
  {
    bankCode: '822',
    code: '0347',
    name: '中國信託商業銀行公館分行',
  },
  {
    bankCode: '822',
    code: '0358',
    name: '中國信託商業銀行永康分行',
  },
  {
    bankCode: '822',
    code: '0369',
    name: '中國信託商業銀行土城分行',
  },
  {
    bankCode: '822',
    code: '0370',
    name: '中國信託商業銀行頭份分行',
  },
  {
    bankCode: '822',
    code: '0381',
    name: '中國信託商業銀行基隆分行',
  },
  {
    bankCode: '822',
    code: '0392',
    name: '中國信託商業銀行豐原分行',
  },
  {
    bankCode: '822',
    code: '0406',
    name: '中國信託商業銀行天母分行',
  },
  {
    bankCode: '822',
    code: '0417',
    name: '中國信託商業銀行板新分行',
  },
  {
    bankCode: '822',
    code: '0428',
    name: '中國信託商業銀行彰化分行',
  },
  {
    bankCode: '822',
    code: '0439',
    name: '中國信託商業銀行東高雄分行',
  },
  {
    bankCode: '822',
    code: '0440',
    name: '中國信託商業銀行中華分行',
  },
  {
    bankCode: '822',
    code: '0451',
    name: '中國信託商業銀行內湖分行',
  },
  {
    bankCode: '822',
    code: '0462',
    name: '中國信託商業銀行斗六分行',
  },
  {
    bankCode: '822',
    code: '0473',
    name: '中國信託商業銀行文心分行',
  },
  {
    bankCode: '822',
    code: '0484',
    name: '中國信託商業銀行重陽分行',
  },
  {
    bankCode: '822',
    code: '0495',
    name: '中國信託商業銀行永吉分行',
  },
  {
    bankCode: '822',
    code: '0509',
    name: '中國信託商業銀行前鎮分行',
  },
  {
    bankCode: '822',
    code: '0510',
    name: '中國信託商業銀行南崁分行',
  },
  {
    bankCode: '822',
    code: '0521',
    name: '中國信託商業銀行永和分行',
  },
  {
    bankCode: '822',
    code: '0532',
    name: '中國信託商業銀行公益分行',
  },
  {
    bankCode: '822',
    code: '0543',
    name: '中國信託商業銀行市府分行',
  },
  {
    bankCode: '822',
    code: '0554',
    name: '中國信託商業銀行六家庄分行',
  },
  {
    bankCode: '822',
    code: '0565',
    name: '中國信託商業銀行右昌分行',
  },
  {
    bankCode: '822',
    code: '0576',
    name: '中國信託商業銀行江翠分行',
  },
  {
    bankCode: '822',
    code: '0587',
    name: '中國信託商業銀行東湖分行',
  },
  {
    bankCode: '822',
    code: '0598',
    name: '中國信託商業銀行中原分行',
  },
  {
    bankCode: '822',
    code: '0602',
    name: '中國信託商業銀行大安分行',
  },
  {
    bankCode: '822',
    code: '0613',
    name: '中國信託商業銀行北高雄分行',
  },
  {
    bankCode: '822',
    code: '0624',
    name: '中國信託商業銀行承德分行',
  },
  {
    bankCode: '822',
    code: '0635',
    name: '中國信託商業銀行復興分行',
  },
  {
    bankCode: '822',
    code: '0646',
    name: '中國信託商業銀行石牌分行',
  },
  {
    bankCode: '822',
    code: '0657',
    name: '中國信託商業銀行城北分行',
  },
  {
    bankCode: '822',
    code: '0668',
    name: '中國信託商業銀行萬華分行',
  },
  {
    bankCode: '822',
    code: '0679',
    name: '中國信託商業銀行西松分行',
  },
  {
    bankCode: '822',
    code: '0680',
    name: '中國信託商業銀行北投分行',
  },
  {
    bankCode: '822',
    code: '0691',
    name: '中國信託商業銀行安和分行',
  },
  {
    bankCode: '822',
    code: '0705',
    name: '中國信託商業銀行西湖分行',
  },
  {
    bankCode: '822',
    code: '0716',
    name: '中國信託商業銀行瑞光分行',
  },
  {
    bankCode: '822',
    code: '0727',
    name: '中國信託商業銀行宜蘭分行',
  },
  {
    bankCode: '822',
    code: '0738',
    name: '中國信託商業銀行民生分行',
  },
  {
    bankCode: '822',
    code: '0749',
    name: '中國信託商業銀行中和分行',
  },
  {
    bankCode: '822',
    code: '0750',
    name: '中國信託商業銀行重新分行',
  },
  {
    bankCode: '822',
    code: '0761',
    name: '中國信託商業銀行丹鳳分行',
  },
  {
    bankCode: '822',
    code: '0772',
    name: '中國信託商業銀行北新店分行',
  },
  {
    bankCode: '822',
    code: '0783',
    name: '中國信託商業銀行汐止分行',
  },
  {
    bankCode: '822',
    code: '0794',
    name: '中國信託商業銀行金城分行',
  },
  {
    bankCode: '822',
    code: '0808',
    name: '中國信託商業銀行樹林分行',
  },
  {
    bankCode: '822',
    code: '0819',
    name: '中國信託商業銀行南勢角分行',
  },
  {
    bankCode: '822',
    code: '0820',
    name: '中國信託商業銀行北新莊分行',
  },
  {
    bankCode: '822',
    code: '0853',
    name: '中國信託商業銀行南桃園分行',
  },
  {
    bankCode: '822',
    code: '0864',
    name: '中國信託商業銀行北桃園分行',
  },
  {
    bankCode: '822',
    code: '0875',
    name: '中國信託商業銀行竹科分行',
  },
  {
    bankCode: '822',
    code: '0901',
    name: '中國信託商業銀行總行營業部',
  },
  {
    bankCode: '822',
    code: '1012',
    name: '中國信託商業銀行八德分行',
  },
  {
    bankCode: '822',
    code: '1023',
    name: '中國信託商業銀行林口分行',
  },
  {
    bankCode: '822',
    code: '1034',
    name: '中國信託商業銀行竹北分行',
  },
  {
    bankCode: '822',
    code: '1045',
    name: '中國信託商業銀行南屯分行',
  },
  {
    bankCode: '822',
    code: '1056',
    name: '中國信託商業銀行大里分行',
  },
  {
    bankCode: '822',
    code: '1067',
    name: '中國信託商業銀行洲際分行',
  },
  {
    bankCode: '822',
    code: '1078',
    name: '中國信託商業銀行南投分行',
  },
  {
    bankCode: '822',
    code: '1090',
    name: '中國信託商業銀行仁德分行',
  },
  {
    bankCode: '822',
    code: '1104',
    name: '中國信託商業銀行中台南分行',
  },
  {
    bankCode: '822',
    code: '1115',
    name: '中國信託商業銀行東台南分行',
  },
  {
    bankCode: '822',
    code: '1126',
    name: '中國信託商業銀行台東分行',
  },
  {
    bankCode: '822',
    code: '1137',
    name: '中國信託商業銀行南台南分行',
  },
  {
    bankCode: '822',
    code: '1148',
    name: '中國信託商業銀行新營分行',
  },
  {
    bankCode: '822',
    code: '1159',
    name: '中國信託商業銀行科博館分行',
  },
  {
    bankCode: '822',
    code: '1160',
    name: '中國信託商業銀行西屯分行',
  },
  {
    bankCode: '822',
    code: '1171',
    name: '中國信託商業銀行民族分行',
  },
  {
    bankCode: '822',
    code: '1182',
    name: '中國信託商業銀行南高雄分行',
  },
  {
    bankCode: '822',
    code: '1193',
    name: '中國信託商業銀行九如分行',
  },
  {
    bankCode: '822',
    code: '1207',
    name: '中國信託商業銀行屏東分行',
  },
  {
    bankCode: '822',
    code: '1218',
    name: '中國信託商業銀行復北分行',
  },
  {
    bankCode: '822',
    code: '1229',
    name: '中國信託商業銀行鳳山分行',
  },
  {
    bankCode: '822',
    code: '1230',
    name: '中國信託商業銀行五甲分行',
  },
  {
    bankCode: '822',
    code: '1241',
    name: '中國信託商業銀行延吉分行',
  },
  {
    bankCode: '822',
    code: '1252',
    name: '中國信託商業銀行信義分行',
  },
  {
    bankCode: '822',
    code: '1263',
    name: '中國信託商業銀行青年分行',
  },
  {
    bankCode: '822',
    code: '1274',
    name: '中國信託商業銀行岡山分行',
  },
  {
    bankCode: '822',
    code: '1285',
    name: '中國信託商業銀行士林分行',
  },
  {
    bankCode: '822',
    code: '1296',
    name: '中國信託商業銀行東民生分行',
  },
  {
    bankCode: '822',
    code: '1300',
    name: '中國信託商業銀行文山分行',
  },
  {
    bankCode: '822',
    code: '2101',
    name: '中國信託商業銀行淡水分行',
  },
  {
    bankCode: '822',
    code: '2112',
    name: '中國信託商業銀行民安分行',
  },
  {
    bankCode: '822',
    code: '2123',
    name: '中國信託商業銀行二重埔簡易型分行',
  },
  {
    bankCode: '822',
    code: '2134',
    name: '中國信託商業銀行富錦分行',
  },
  {
    bankCode: '822',
    code: '2145',
    name: '中國信託商業銀行站前分行',
  },
  {
    bankCode: '822',
    code: '2156',
    name: '中國信託商業銀行惠中分行',
  },
  {
    bankCode: '822',
    code: '2167',
    name: '中國信託商業銀行東蘆洲分行',
  },
  {
    bankCode: '822',
    code: '2178',
    name: '中國信託商業銀行木柵分行',
  },
  {
    bankCode: '822',
    code: '2189',
    name: '中國信託商業銀行東花蓮分行',
  },
  {
    bankCode: '822',
    code: '2190',
    name: '中國信託商業銀行寶山分行',
  },
  {
    bankCode: '822',
    code: '2204',
    name: '中國信託商業銀行藝文分行',
  },
  {
    bankCode: '822',
    code: '2215',
    name: '中國信託商業銀行東門分行',
  },
  {
    bankCode: '822',
    code: '2226',
    name: '中國信託商業銀行新板特區分行',
  },
  {
    bankCode: '822',
    code: '2237',
    name: '中國信託商業銀行三和分行',
  },
  {
    bankCode: '822',
    code: '2248',
    name: '中國信託商業銀行劍潭分行',
  },
  {
    bankCode: '822',
    code: '2259',
    name: '中國信託商業銀行北蘆洲分行',
  },
  {
    bankCode: '822',
    code: '2260',
    name: '中國信託商業銀行寶強分行',
  },
  {
    bankCode: '822',
    code: '2271',
    name: '中國信託商業銀行華山分行',
  },
  {
    bankCode: '822',
    code: '2282',
    name: '中國信託商業銀行龍江分行',
  },
  {
    bankCode: '822',
    code: '2293',
    name: '中國信託商業銀行成功分行',
  },
  {
    bankCode: '822',
    code: '3108',
    name: '中國信託商業銀行市政分行',
  },
  {
    bankCode: '822',
    code: '3119',
    name: '中國信託商業銀行大直分行',
  },
  {
    bankCode: '822',
    code: '3120',
    name: '中國信託商業銀行景美分行',
  },
  {
    bankCode: '822',
    code: '3131',
    name: '中國信託商業銀行內壢分行',
  },
  {
    bankCode: '822',
    code: '3142',
    name: '中國信託商業銀行重慶分行',
  },
  {
    bankCode: '822',
    code: '3153',
    name: '中國信託商業銀行長安分行',
  },
  {
    bankCode: '822',
    code: '3164',
    name: '中國信託商業銀行羅東分行',
  },
  {
    bankCode: '822',
    code: '3175',
    name: '中國信託商業銀行南中壢分行',
  },
  {
    bankCode: '822',
    code: '3186',
    name: '中國信託商業銀行板和簡易型分行',
  },
  {
    bankCode: '822',
    code: '3197',
    name: '中國信託商業銀行花蓮分行',
  },
  {
    bankCode: '822',
    code: '3201',
    name: '中國信託商業銀行北天母分行',
  },
  {
    bankCode: '822',
    code: '3212',
    name: '中國信託商業銀行民權西路分行',
  },
  {
    bankCode: '822',
    code: '3223',
    name: '中國信託商業銀行佳里分行',
  },
  {
    bankCode: '822',
    code: '3234',
    name: '中國信託商業銀行博愛分行',
  },
  {
    bankCode: '822',
    code: '3245',
    name: '中國信託商業銀行鹽行分行',
  },
  {
    bankCode: '822',
    code: '3267',
    name: '中國信託商業銀行光復分行',
  },
  {
    bankCode: '822',
    code: '3278',
    name: '中國信託商業銀行埔墘簡易型分行',
  },
  {
    bankCode: '822',
    code: '3289',
    name: '中國信託商業銀行黎明分行',
  },
  {
    bankCode: '822',
    code: '3290',
    name: '中國信託商業銀行新富分行',
  },
  {
    bankCode: '822',
    code: '3603',
    name: '中國信託商業銀行三峽分行',
  },
  {
    bankCode: '822',
    code: '3614',
    name: '中國信託商業銀行東林口分行',
  },
  {
    bankCode: '822',
    code: '8549',
    name: '美國中信銀行亞凱迪亞分行',
  },
  {
    bankCode: '822',
    code: '8550',
    name: '東京之星銀行-川口出張所',
  },
  {
    bankCode: '822',
    code: '8561',
    name: '東京之星銀行-浜田山出張所',
  },
  {
    bankCode: '822',
    code: '8572',
    name: '東京之星銀行-三軒茶屋出張所',
  },
  {
    bankCode: '822',
    code: '8583',
    name: '美國中信銀行舊金山分行',
  },
  {
    bankCode: '822',
    code: '8608',
    name: '中國信託商業銀行深圳分行',
  },
  {
    bankCode: '822',
    code: '8619',
    name: '東京之星銀行-代代木上原出張所',
  },
  {
    bankCode: '822',
    code: '8620',
    name: '東京之星銀行-南砂町出張所',
  },
  {
    bankCode: '822',
    code: '8631',
    name: '中國信託商業銀行菲律賓子行-Iloilo',
  },
  {
    bankCode: '822',
    code: '8642',
    name: '中國信託商業銀行仰光代表人辦事處',
  },
  {
    bankCode: '822',
    code: '8653',
    name: '中國信託商業銀行雪梨代表人辦事處',
  },
  {
    bankCode: '822',
    code: '8664',
    name: '中國信託商業銀行吉隆坡代表人辦事處',
  },
  {
    bankCode: '822',
    code: '8675',
    name: '東京之星銀行-梅田分行',
  },
  {
    bankCode: '822',
    code: '8686',
    name: '中國信託商業銀行廈門分行',
  },
  {
    bankCode: '822',
    code: '8697',
    name: '中國信託商業銀行廣州分行',
  },
  {
    bankCode: '822',
    code: '8701',
    name: '中國信託商業銀行上海自貿試驗區支行',
  },
  {
    bankCode: '822',
    code: '8712',
    name: '中國信託商業銀行印尼子行-Jakarta(雅加達分行)',
  },
  {
    bankCode: '822',
    code: '8723',
    name: '中國信託商業銀行加拿大子行-Vancouver',
  },
  {
    bankCode: '822',
    code: '8734',
    name: '東京之星銀行-本店',
  },
  {
    bankCode: '822',
    code: '8745',
    name: '東京之星銀行-難波分行',
  },
  {
    bankCode: '822',
    code: '8756',
    name: '東京之星銀行-名古屋分行',
  },
  {
    bankCode: '822',
    code: '8767',
    name: '東京之星銀行-廣島分行',
  },
  {
    bankCode: '822',
    code: '8778',
    name: '東京之星銀行-福岡分行',
  },
  {
    bankCode: '822',
    code: '8789',
    name: '東京之星銀行-神戶分行',
  },
  {
    bankCode: '822',
    code: '8790',
    name: '東京之星銀行-仙台分行',
  },
  {
    bankCode: '822',
    code: '8804',
    name: '東京之星銀行-札幌分行',
  },
  {
    bankCode: '822',
    code: '8815',
    name: '東京之星銀行-大宮分行',
  },
  {
    bankCode: '822',
    code: '8826',
    name: '東京之星銀行-浦和分行',
  },
  {
    bankCode: '822',
    code: '8837',
    name: '東京之星銀行-船橋分行',
  },
  {
    bankCode: '822',
    code: '8848',
    name: '東京之星銀行-松戶分行',
  },
  {
    bankCode: '822',
    code: '8859',
    name: '東京之星銀行-千葉分行',
  },
  {
    bankCode: '822',
    code: '8871',
    name: '東京之星銀行-港南台分行',
  },
  {
    bankCode: '822',
    code: '8882',
    name: '東京之星銀行-渋谷站前分行(原溝之口分行搬遷後更名)',
  },
  {
    bankCode: '822',
    code: '8893',
    name: '東京之星銀行-藤澤分行',
  },
  {
    bankCode: '822',
    code: '8907',
    name: '東京之星銀行-橫濱分行',
  },
  {
    bankCode: '822',
    code: '8918',
    name: '東京之星銀行-調布分行',
  },
  {
    bankCode: '822',
    code: '8929',
    name: '東京之星銀行-自由之丘分行',
  },
  {
    bankCode: '822',
    code: '8930',
    name: '東京之星銀行-日比谷分行',
  },
  {
    bankCode: '822',
    code: '8941',
    name: '東京之星銀行-高島平分行',
  },
  {
    bankCode: '822',
    code: '8952',
    name: '東京之星銀行-新宿分行',
  },
  {
    bankCode: '822',
    code: '8963',
    name: '東京之星銀行-小平分行',
  },
  {
    bankCode: '822',
    code: '8974',
    name: '東京之星銀行-立川分行',
  },
  {
    bankCode: '822',
    code: '8985',
    name: '東京之星銀行-吉祥寺分行',
  },
  {
    bankCode: '822',
    code: '8996',
    name: '東京之星銀行-小岩分行',
  },
  {
    bankCode: '822',
    code: '9007',
    name: '東京之星銀行-上野分行',
  },
  {
    bankCode: '822',
    code: '9018',
    name: '東京之星銀行-渋谷分行',
  },
  {
    bankCode: '822',
    code: '9029',
    name: '中國信託商業銀行新德里分行',
  },
  {
    bankCode: '822',
    code: '9041',
    name: '中國信託商業銀行香港分行',
  },
  {
    bankCode: '822',
    code: '9052',
    name: '中國信託商業銀行紐約分行',
  },
  {
    bankCode: '822',
    code: '9063',
    name: '中國信託商業銀行東京分行',
  },
  {
    bankCode: '822',
    code: '9074',
    name: '中國信託商業銀行胡志明市分行',
  },
  {
    bankCode: '822',
    code: '9085',
    name: '中國信託商業銀行印尼子行-Karawaci',
  },
  {
    bankCode: '822',
    code: '9096',
    name: '中國信託商業銀行斯里伯魯德分行(清奈)',
  },
  {
    bankCode: '822',
    code: '9100',
    name: '中國信託商業銀行上海分行',
  },
  {
    bankCode: '822',
    code: '9111',
    name: '東京之星銀行-銀座分行',
  },
  {
    bankCode: '822',
    code: '9122',
    name: '東京之星銀行-池袋分行',
  },
  {
    bankCode: '822',
    code: '9133',
    name: '東京之星銀行-總行',
  },
  {
    bankCode: '822',
    code: '9155',
    name: '東京之星銀行-子公司 TSB Servicer, Ltd.',
  },
  {
    bankCode: '822',
    code: '9166',
    name: '東京之星銀行-子公司 Tokyo Star Business Finance, Ltd.',
  },
  {
    bankCode: '822',
    code: '9177',
    name: '中國信託商業銀行加拿大子行-Toronto',
  },
  {
    bankCode: '822',
    code: '9188',
    name: '中國信託商業銀行印尼子行-Puri Kencana',
  },
  {
    bankCode: '822',
    code: '9199',
    name: '中國信託商業銀行菲律賓子行-Bonifacio Global City',
  },
  {
    bankCode: '822',
    code: '9203',
    name: '中國信託商業銀行印尼子行-Darmo',
  },
  {
    bankCode: '822',
    code: '9225',
    name: '中國信託商業銀行印尼子行-Pluit',
  },
  {
    bankCode: '822',
    code: '9236',
    name: '中國信託商業銀行印尼子行-Dago',
  },
  {
    bankCode: '822',
    code: '9247',
    name: '中國信託商業銀行新加坡分行',
  },
  {
    bankCode: '822',
    code: '9292',
    name: '中國信託商業銀行菲律賓子行-Las Pinas',
  },
  {
    bankCode: '822',
    code: '9306',
    name: '中國信託商業銀行菲律賓子行-Magallanes',
  },
  {
    bankCode: '822',
    code: '9317',
    name: '中國信託商業銀行菲律賓子行-Cebu Mandaue',
  },
  {
    bankCode: '822',
    code: '9340',
    name: '中國信託商業銀行菲律賓子行-Davao',
  },
  {
    bankCode: '822',
    code: '9351',
    name: '中國信託商業銀行菲律賓子行-Angeles',
  },
  {
    bankCode: '822',
    code: '9362',
    name: 'CTBC Capital Corp.',
  },
  {
    bankCode: '822',
    code: '9373',
    name: '中國信託商業銀行洛杉磯代表人辦事處',
  },
  {
    bankCode: '822',
    code: '9409',
    name: '美國中信銀行-Rowland Heights',
  },
  {
    bankCode: '822',
    code: '9410',
    name: '中國信託商業銀行加拿大子行-Burnaby',
  },
  {
    bankCode: '822',
    code: '9421',
    name: '中國信託商業銀行九龍分行(支行)',
  },
  {
    bankCode: '822',
    code: '9432',
    name: '中國信託商業銀行印尼子行-Mangga Dua',
  },
  {
    bankCode: '822',
    code: '9443',
    name: '中國信託商業銀行加拿大子行-Richmond',
  },
  {
    bankCode: '822',
    code: '9454',
    name: '中國信託商業銀行印尼子行-Kelapa Gading',
  },
  {
    bankCode: '822',
    code: '9465',
    name: '中國信託商業銀行印尼子行-Cikarang',
  },
  {
    bankCode: '822',
    code: '9476',
    name: '中國信託商業銀行印尼子行-Surabaya(泗水分行)',
  },
  {
    bankCode: '822',
    code: '9487',
    name: '中國信託商業銀行印尼子行-Bandung(萬隆分行)',
  },
  {
    bankCode: '822',
    code: '9568',
    name: '中國信託商業銀行曼谷代表人辦事處',
  },
  {
    bankCode: '822',
    code: '9579',
    name: '中國信託商業銀行北京代表人辦事處',
  },
  {
    bankCode: '822',
    code: '9580',
    name: '中國信託商業銀行菲律賓子行-Del Monte',
  },
  {
    bankCode: '822',
    code: '9591',
    name: '中國信託商業銀行菲律賓子行-Cagayan de Oro',
  },
  {
    bankCode: '822',
    code: '9605',
    name: '中國信託商業銀行菲律賓子行-Sucat',
  },
  {
    bankCode: '822',
    code: '9616',
    name: '中國信託商業銀行菲律賓子行-Subic',
  },
  {
    bankCode: '822',
    code: '9627',
    name: '中國信託商業銀行菲律賓子行-Dela Costa',
  },
  {
    bankCode: '822',
    code: '9638',
    name: '中國信託商業銀行菲律賓子行-Buendia-Pasong Tamo',
  },
  {
    bankCode: '822',
    code: '9649',
    name: '中國信託商業銀行菲律賓子行-Ortigas',
  },
  {
    bankCode: '822',
    code: '9650',
    name: '中國信託商業銀行菲律賓子行-Marikina',
  },
  {
    bankCode: '822',
    code: '9661',
    name: '中國信託商業銀行菲律賓子行-Mabini',
  },
  {
    bankCode: '822',
    code: '9672',
    name: '中國信託商業銀行菲律賓子行-Taytay',
  },
  {
    bankCode: '822',
    code: '9683',
    name: '中國信託商業銀行菲律賓子行-Greenhills',
  },
  {
    bankCode: '822',
    code: '9694',
    name: '中國信託商業銀行菲律賓子行-Cebu Banilad',
  },
  {
    bankCode: '822',
    code: '9708',
    name: '中國信託商業銀行菲律賓子行-Cavite',
  },
  {
    bankCode: '822',
    code: '9719',
    name: '中國信託商業銀行菲律賓子行-Carmona',
  },
  {
    bankCode: '822',
    code: '9720',
    name: '中國信託商業銀行菲律賓子行-Binondo',
  },
  {
    bankCode: '822',
    code: '9731',
    name: '中國信託商業銀行菲律賓子行-Ayala',
  },
  {
    bankCode: '822',
    code: '9742',
    name: '中國信託商業銀行菲律賓子行-Rada',
  },
  {
    bankCode: '822',
    code: '9753',
    name: '中國信託商業銀行菲律賓子行-Alabang',
  },
  {
    bankCode: '822',
    code: '9797',
    name: '美國中信銀行-Flushing',
  },
  {
    bankCode: '822',
    code: '9823',
    name: '美國中信銀行-Brooklyn',
  },
  {
    bankCode: '822',
    code: '9834',
    name: '美國中信銀行-Edison',
  },
  {
    bankCode: '822',
    code: '9845',
    name: '美國中信銀行-Los Angeles',
  },
  {
    bankCode: '822',
    code: '9856',
    name: '美國中信銀行-City of Industry',
  },
  {
    bankCode: '822',
    code: '9867',
    name: '美國中信銀行-San Marino',
  },
  {
    bankCode: '822',
    code: '9878',
    name: '美國中信銀行-Cupertino',
  },
  {
    bankCode: '822',
    code: '9889',
    name: '美國中信銀行-Monterey Park',
  },
  {
    bankCode: '822',
    code: '9904',
    name: '美國中信銀行-Milpitas',
  },
  {
    bankCode: '822',
    code: '9915',
    name: '中國信託(菲律賓)商業銀行',
  },
  {
    bankCode: '822',
    code: '9926',
    name: '中國信託商業銀行(加拿大)',
  },
  {
    bankCode: '822',
    code: '9937',
    name: '中國信託商業銀行(印尼)',
  },
  {
    bankCode: '822',
    code: '9948',
    name: '美國中信銀行',
  },
  {
    bankCode: '822',
    code: '9959',
    name: '中國信託商業銀行河內代表人辦事處',
  },
  {
    bankCode: '822',
    code: '9971',
    name: '美國中信銀行-Irvine',
  },
  {
    bankCode: '822',
    code: '9982',
    name: '美國中信銀行-San Gabriel',
  },
]

export default groupByKey(originalList, 'bankCode')
